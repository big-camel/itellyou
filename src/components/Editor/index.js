import React from 'react'
import { connect } from 'dva'
import { message , notification, Icon, Modal } from 'antd'

import { MiniEditor } from '@itellyou/itellyou-editor'
import Viewer from './Viewer'
import History from './History'

import debounce from 'lodash/debounce'
import CollabBiz from '../../components/CollabBiz'
import EditorBiz from '../../components/EditorBiz'
const { STATUS , EVENTS , ERROR_CODE , ERROR_LEVEL , MESSAGE } = CollabBiz
const { SAVE_TYPE } = EditorBiz

class Editor extends React.Component {

    state = {
        historyView: false,
        collabGuideView: false,
        publishing: false,
        saving: false,
        savedAt: null,
        status: STATUS.initialize,
        error: null,
        collabUsers: []
    }

    componentDidMount(){
        this.init()
    }

    init(){
        const { id , dispatch , me , api , mode , onDocLoad , onPublished , onReverted } = this.props

        const collabBiz = new CollabBiz( dispatch , {
            me:{
                id:me.user_id,
                key:me.user_name,
                name:me.nickname
            },
            api:api || {},
            mode
        })

        collabBiz.on(EVENTS.docLoaded , res => {
            this.setState({
                status: STATUS.prepare
            })
            if(onDocLoad){
                onDocLoad(res)
            }
        })

        collabBiz.on(EVENTS.ready, event => {
            this.setState({
                status: STATUS.active,
                //collabGuideView: event.isEditingByOtherUser && N["a"].needDisplayGuide("doc_editor_collab")
            })
        })

        collabBiz.on(EVENTS.usersChange, collabUsers => {
            this.setState({
                collabUsers
            })
        })

        collabBiz.on(EVENTS.docDeleted, () => {
            this.setState({
                status: STATUS.deleted
            })
        })

        collabBiz.on(EVENTS.error, error => {
            const { code , level } = error
            if(code === ERROR_CODE.SAVE_FAILED){
                this.setState({
                    saving: false
                })
                message.error("保存失败，请稍后再试")
                return
            }
            if(code === ERROR_CODE.PUBLISH_FAILED){
                this.setState({
                    publishing: false
                })
                message.error("发布失败，请稍后再试")
                return
            }
            if(level !== ERROR_LEVEL.WARNING){
                this.setState({
                    status: STATUS.error,
                    error
                })
            }
        })

        collabBiz.on(EVENTS.inactive, () => {
            this.onSave(SAVE_TYPE.AUTO)
        })

        collabBiz.on(EVENTS.saving, () => {
            this.setState({
                saving: true
            })
        })

        collabBiz.on(EVENTS.saved, () => {
            this.setState({
                saving: false,
                savedAt: new Date()
            })
        })

        collabBiz.on(EVENTS.published, res => {
            if(onPublished){
                onPublished(res)
            }
        })

        collabBiz.on(EVENTS.reverted, () => {
            this.closeRollbackModal()
            if(onReverted){
                onReverted()
            }
        })

        collabBiz.on(EVENTS.broadcast, result => {
            const { type , body } = result
           
            if(type === MESSAGE.DOC_PUBLISHED){
                notification.open({
                    message: `${body.user.name} 刚刚 发布 了文档`,
                    className: "collab-published-notify"
                })
            }
            if(type === MESSAGE.DOC_DELETED){
                this.setState({
                    status: STATUS.deleted
                })
            }
        })

        this.collabBiz = collabBiz
        if(!id){
            let data = {
                id:me.id + new Date().getTime(),
                content:"",
                draft_version:0,
                updated_time:new Date().getTime()
            }
            this.collabBiz.initLocal(data)
        }else{
            this.collabBiz.init(id)
        }
        
        window.addEventListener("beforeunload", () => {
            this.onSave(SAVE_TYPE.AUTO)
        })

        return collabBiz
    }

    reset = () => {
        if(this.collabBiz){
            this.collabBiz.reset()
            this.collabBiz = null
        }
        if(this.engine){
            this.engine.setDefaultValue("")
        }
        this.init()
    }

    onEditorLoaded = engine => {
        const { onLoad } = this.props
        if(onLoad){
            if(onLoad({
                onPublish:this.onPublish,
                onSave:this.onSave,
                onDeleted:this.onDeleted,
                showHistory:this.showHistory,
                engine,
                getCollabBiz:() => {
                    return this.collabBiz
                },
                getEditorBiz:() => {
                    return this.collabBiz ? this.collabBiz.editorBiz : null
                },
                reset:this.reset
            }) === false){
                return false
            }
        }
        this.engine = engine
        this.collabBiz.start(this.engine)
    }
    
    onEditorChange = content => {
        const { onChange } = this.props
        if(onChange){
            onChange(content)
        }
        this.collabBiz.cache(content)
        this.autoSave()
    }

    autoSave = debounce(() => {
        this.onSave(SAVE_TYPE.auto)
    }, 60000)

    onRollbackBefore = () => {
        this.setState({
            historyView: false
        })
        this.hideRollback = Modal.info({
            icon:<Icon type="loading" />,
            content:"正在恢复中...请稍后",
            okButtonProps:{
                style:{display:"none"}
            }
        })
        const { id } = this.props
        this.isReset = id ? false : true
    } 

    closeRollbackModal = () => {
        if(this.hideRollback){
            this.hideRollback.destroy()
            this.hideRollback = null
        }
    }

    onRollbackAfter = res => {
        if(res.result){
            if(this.isReset){
                this.reset()
                this.closeRollbackModal()
            }else{
                this.collabBiz.onDocReverted(res.data.content)
            }
        }else{
            this.closeRollbackModal()
            message.error(res.message)
        }
    }

    onDeleted = () => {
        this.collabBiz.onDocDeleted()
    }

    onSave = (type, callback) => {
        const { status , saving } = this.state
        if(status !== STATUS.active) return

        if(saving){
            message.info("正在保存，请稍后再试")
        }else{
            const { onSaveBefore , onSaveAfter } = this.props
           
            this.engine.event.trigger("save:before")
            this.engine.asyncEvent.emitAsync("save:before").then(() => {
                const content = this.engine.getPureContent()
                const html = this.engine.getPureHtml()
                let params = null
                if(onSaveBefore){
                    params = onSaveBefore(content , html)
                }
                this.collabBiz.doSaveContent({
                    type,
                    content,
                    html,
                    ...params
                }, res => {
                    if(onSaveAfter){
                        onSaveAfter(res)
                    }
                    if(callback){
                        callback()
                    }
                })
            }).catch(error => {
                if(type === SAVE_TYPE.USER_PUBLISH) {
                    this.setState({
                        publishing: false
                    })
                    message.error(error)
                } else {
                    const content = this.engine.getPureContent()
                    const html = this.engine.getPureHtml()
                    let params = null
                    if(onSaveBefore){
                        params = onSaveBefore(content , html)
                    }
                    this.collabBiz.doSaveContent({
                        type,
                        content,
                        html,
                        ...params
                    }, res => {
                        if(onSaveAfter){
                            onSaveAfter(res)
                        }
                        if(callback){
                            callback()
                        }
                    })
                }
            })
        }
    }

    onUserSave = () => {
        this.onSave(SAVE_TYPE.USER_SAVE)
    }

    onPublish = params => {
        if(this.state.publishing) return

        this.setState({
            publishing: true
        })
        this.onSave(SAVE_TYPE.USER_PUBLISH, () => {
            this.collabBiz.doPublishDoc(params)
        })
    }

    showHistory = () => {
        this.onSave(SAVE_TYPE.AUTO)
        this.setState({
            historyView: true
        })
    }

    render(){
        const document = this.collabBiz ? this.collabBiz.getInitialDocument() : null
        const instanceId = this.collabBiz ? this.collabBiz.getCollabInstanceId() : null
        const { historyView } = this.state
        const { id } = this.props
        return (
            <div>
                {
                    document && <MiniEditor
                    key={instanceId}
                    defaultValue={document.value}
                    onSave={this.onUserSave}
                    onChange={this.onEditorChange}
                    onLoad={this.onEditorLoaded}
                    ot={true}
                    save={true}
                    />
                }
                {
                    historyView && <History 
                    doc_id={id}
                    onCancel={() => {
                        this.setState({
                            historyView: false
                        })
                    }}
                    onRollbackBefore={this.onRollbackBefore}
                    onRollbackAfter={this.onRollbackAfter}
                    />
                }
            </div>    
        )
    }
}
export {
    EditorBiz ,
    CollabBiz ,
    Viewer ,
    History
}

export default connect(({ user }) => ({
    me : user.me
}))(Editor)