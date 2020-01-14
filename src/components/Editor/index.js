import React, { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import { useDispatch, useSelector } from 'dva'
import { message , notification, Icon, Modal } from 'antd'

import { MiniEditor } from '@itellyou/itellyou-editor'
import Viewer from './Viewer'
import History from './History'

import debounce from 'lodash/debounce'
import CollabBiz from '../../components/CollabBiz'
import EditorBiz from '../../components/EditorBiz'
import Loading from '../Loading'
const { STATUS , EVENTS , ERROR_CODE , ERROR_LEVEL , MESSAGE } = CollabBiz
const { SAVE_TYPE } = EditorBiz

function Editor({ id , api , mode , ...props },ref){
    const [ historyState , setHistoryState ] = useState(false)
    const [ publishing , setPublishing ] = useState(false)
    const [ saving , setSaving ] = useState(false)
    const [ status , setStatus ] = useState(STATUS.initialize)
    const [ collabUsers , setCollabUsers ] = useState([])

    const modalCallback = useRef()
    const collabBiz = useRef()
    const engine = useRef()

    const dispatch = useDispatch()
    const me = useSelector(state => {
        if(state.user) return state.user.me
    })

    const onPublished = useCallback(props.onPublished,[])

    const onReverted = useCallback(props.onReverted,[])

    const init = useCallback(() => {
        if(collabBiz.current) return
        if(!me) return <Loading />
        const biz = new CollabBiz(dispatch , {
            me:{
                id:me.user_id,
                key:me.user_name,
                name:me.nickname
            },
            api:api || {},
            mode
        })

        biz.on(EVENTS.docLoaded , () => {
            setStatus(STATUS.prepare)
        })

        biz.on(EVENTS.ready, event => {
            setStatus(STATUS.active)
            //collabGuideView: event.isEditingByOtherUser && N["a"].needDisplayGuide("doc_editor_collab")
        })

        biz.on(EVENTS.usersChange, users => {
            setCollabUsers(users)
        })

        biz.on(EVENTS.docDeleted, () => {
            setStatus(STATUS.deleted)
        })

        biz.on(EVENTS.error, error => {
            const { code , level } = error
            if(code === ERROR_CODE.SAVE_FAILED){
                setSaving(false)
                message.error("保存失败，请稍后再试")
                return
            }
            if(code === ERROR_CODE.PUBLISH_FAILED){
                setPublishing(false)
                message.error("发布失败，请稍后再试")
                return
            }
            if(level !== ERROR_LEVEL.WARNING){
                setStatus(STATUS.error)
            }
        })

        biz.on(EVENTS.inactive, () => {
            onSave(SAVE_TYPE.AUTO)
        })

        biz.on(EVENTS.saving, () => {
            setSaving(true)
        })

        biz.on(EVENTS.saved, () => {
            setSaving(false)
        })

        biz.on(EVENTS.published, res => {
            if(onPublished){
                onPublished(res)
            }
        })

        biz.on(EVENTS.reverted, () => {
            closeRollbackModal()
            if(onReverted){
                onReverted()
            }
        })

        biz.on(EVENTS.broadcast, result => {
            const { type , body } = result
            
            if(type === MESSAGE.DOC_PUBLISHED){
                notification.open({
                    message: `${body.user.name} 刚刚 发布 了文档`,
                    className: "collab-published-notify"
                })
            }
            if(type === MESSAGE.DOC_DELETED){
                setStatus(STATUS.deleted)
            }
        })

        collabBiz.current = biz

        if(!id){
            biz.initLocal({
                id:me.id + new Date().getTime(),
                content:"",
                draft_version:0,
                updated_time:new Date().getTime()
            })
        }else{
            biz.init(id)
        }
    },[me, dispatch, api, mode, id, onSave, onPublished, onReverted])

    useEffect(() => {
        init()
        const beforeunload = () => {
            onSave(SAVE_TYPE.AUTO)
        }

        window.addEventListener("beforeunload", beforeunload)
        return () => {
            if(collabBiz.current){
                collabBiz.current.exit()
                collabBiz.current.unbindEvents()
                const { editorBiz } = collabBiz.current
                if(editorBiz){
                    editorBiz.clearCachedContent()
                }
                collabBiz.current = null
            }
            window.removeEventListener("beforeunload", beforeunload)
        }
    },[init, onSave])

    /**const reset = () => {
        if(collabBiz.current){
            collabBiz.current.reset()
            collabBiz.current = null
        }
        if(engine.current){
            engine.current.setDefaultValue("")
        }
        init()
    }**/

    useImperativeHandle(ref,() => ({
        onPublish,
        onSave,
        showHistory,
        getEngine:() => engine.current,
        getCollabBiz:() => {
            return collabBiz.current
        },
        getEditorBiz:() => {
            return collabBiz.current ? collabBiz.current.editorBiz : null
        },
        //reset
    }))

    const onEditorLoaded = inst => {
        engine.current = inst
        if(collabBiz.current){
            collabBiz.current.start(inst)
        }
    }
    
    const onEditorChange = content => {
        const { onChange } = props
        if(onChange){
            onChange(content)
        }
        collabBiz.current.cache(content)
        autoSave.current()
    }

    const autoSave = useRef()
    autoSave.current = debounce(() => {
        onSave(SAVE_TYPE.auto)
    }, 60000)

    const isReset = useRef(false)
    const onRollbackBefore = () => {
        setHistoryState(false)
        modalCallback.current = Modal.info({
            icon:<Icon type="loading" />,
            content:"正在恢复中...请稍后",
            okButtonProps:{
                style:{display:"none"}
            }
        })
        isReset.current = id ? false : true
    } 

    const closeRollbackModal = () => {
        if(modalCallback.current){
            modalCallback.current.destroy()
            modalCallback.current = null
        }
    }

    const onRollbackAfter = res => {
        if(res.result){
            if(isReset.current){
                closeRollbackModal()
            }else{
                collabBiz.current.onDocReverted(res.data.content)
            }
        }else{
            closeRollbackModal()
            message.error(res.message)
        }
    }

    const onDeleted = () => {
        collabBiz.current.onDocDeleted()
    }

    const onSave = useCallback((type, callback) => {
        if(status !== STATUS.active) return
        if(saving){
            message.info("正在保存，请稍后再试")
        }else{
            if(!collabBiz.current) {
                return
            }
            const { onSaveBefore , onSaveAfter } = props
            engine.current.event.trigger("save:before")
            engine.current.asyncEvent.emitAsync("save:before").then(() => {
                const content = engine.current.getPureContent()
                const html = engine.current.getPureHtml()
                let params = null
                if(onSaveBefore){
                    params = onSaveBefore(content , html)
                }
                
                collabBiz.current.doSaveContent({
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
                    setPublishing(false)
                    message.error(error)
                } else {
                    const content = engine.current.getPureContent()
                    const html = engine.current.getPureHtml()
                    let params = null
                    if(onSaveBefore){
                        params = onSaveBefore(content , html)
                    }
                    collabBiz.current.doSaveContent({
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
    })

    const onUserSave = useRef()
    onUserSave.current = () => {
        onSave(SAVE_TYPE.USER_SAVE)
    }

    const onPublish = params => {
        if(publishing) return
        setPublishing(true)
        onSave(SAVE_TYPE.USER_PUBLISH, () => {
            collabBiz.current.doPublishDoc(params)
        })
    }

    const showHistory = () => {
        onSave(SAVE_TYPE.AUTO)
        setHistoryState(true)
    }

    const document = collabBiz.current ? collabBiz.current.getInitialDocument() : null
    const instanceId = collabBiz.current ? collabBiz.current.getCollabInstanceId() : null

    return (
        <div>
            {
                document && <MiniEditor
                key={instanceId}
                defaultValue={document.value}
                onSave={() => {
                    onUserSave.current()
                }}
                onChange={onEditorChange}
                onLoad={onEditorLoaded}
                ot={true}
                save={true}
                />
            }
            {
                historyState && <History 
                doc_id={id}
                onCancel={() => {
                    setHistoryState(false)
                }}
                onRollbackBefore={onRollbackBefore}
                onRollbackAfter={onRollbackAfter}
                />
            }
        </div>    
    )
    
}
export {
    EditorBiz ,
    CollabBiz ,
    Viewer ,
    History
}
Editor = forwardRef(Editor)
export default Editor