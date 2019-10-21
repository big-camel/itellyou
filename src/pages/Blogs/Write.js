import React from 'react'
import { mapValues } from 'lodash'
import { connect } from 'dva'
import DocumentTitle from 'react-document-title'
import { TextEditor,Doc,editorUid,IdleChecker,History } from '@/components/Editor'
import { message , Modal , Button } from 'antd'

const MAX_POLLING_INTERVAL = 60

class Write extends React.Component{

    state = {
        // 是否为查看历史状态
        versionsStatus: false,
        // 是否正在编辑，onChange 时触发，防呆检查时重置
        editing: false,
        // 提交数据的状态
        publishing: false,
        // 是否正在保存
        saving: false,
        // 保存时间
        saved: null,
        value: null,
        // 正在获取文档数据
        loading: true,
        // 是否活跃状态，由 IdleChecker 组件控制
        isActive: true,
        // 是否已禁用，用与编辑冲突时控制展示及业务逻辑
        disabled: false,
        // 是否内容编辑冲突，
        contentConflict: false,
        pollingInterval: 10
    }

    constructor(){
        super()
        this.pollingTimer = null
        this.cacheTimer = null
        this.editingTimer = null
        this.saveCallback = null
        this.lockCallback = null
        this.areaLocking = null
        this.areaWaitToLock = null
        this.areaLocked = null
        this.diffUnCached = null
        // 编辑器业务逻辑，目前仅 Lake 用到
        this.editorBiz = null
        /**
         * 编辑器使用的文档对象，以可视化编辑器编辑器 markdown 文档时 format 和 doc 的有所不同
         * @type {LakeDocument}
         */
        this.initialDocument = null
        // 编辑器根节点引用
        this.editorRootRef = React.createRef()
        // Lake 编辑器实例
        this.engine = null
    }

    componentDidMount(){
        this.getDetail()
    }

    reset() {
        this.setState({
            publishing: false,
            changeStatus: false,
            saving: false,
            loading: true
        })
    }

    onEditorLoaded = instance => {
        this.engine = instance.engine
        // 编辑区域聚焦时，额外进行一次所操作，保证一个人开多个 TAB 编辑时始终能用最新的内容编辑
        this.engine.editArea.on('focus', () => {
            this.pollingData()
        })
    }

    getDetail = () => {
        const { doc , dispatch } = this.props
        dispatch({
            type: 'doc/getDetail',
            payload: {
                slug: doc.slug
            }
        }).then(res => {
            this.editorBiz = new Doc(res)
            const document = this.editorBiz.getInitialDocument()
            this.initialDocument = document
            this.setState({
                loading: false,
                value: document.value
            })
            this.initEditor()
        })
    }

    initEditor = () => {
        // 锁定文档
        this.lockArea('doc')
        // 同步编辑状态
        this.pollingData()
        // 获取成员信息，在 @ 人时使用
        //this.getMemberData()
        // 绑定事件
        this.bindEvents()
    }

    bindEvents = () => {
        // 页面关闭、隐藏、可见状态相关事件： https://developer.mozilla.org/en-US/docs/Web/Events/unload
        // ref https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
        // ref https://developer.mozilla.org/en-US/docs/Web/Events/pagehide
        window.addEventListener('beforeunload', this.onPageClose)
        window.addEventListener('visibilitychange', this.onVisibilityChange)
        window.addEventListener('pagehide', this.onPageClose)
    }

    unbindEvents = () => {
        window.removeEventListener('beforeunload', this.onPageClose)
        window.removeEventListener('visibilitychange', this.onVisibilityChange)
        window.removeEventListener('pagehide', this.onPageClose)
    }

    onPageClose = e => {
        this.onSave(Doc.SAVE_TYPE.FORCE)
        this.stopPollingData()
        this.unbindEvents()
        this.unLock()
        return null
    }

    onVisibilityChange = e => {
        if (document.visibilityState === 'hidden') {
            // TAB 隐藏时，主动保存文档内容并设置为非激活状态
            this.onSave(Doc.SAVE_TYPE.FORCE, () => {
                this.setState({
                    isActive: false
                })
            })
            return
        } 
        // TAB 展示时，设置为激活态并同步锁
        if (document.visibilityState === 'visible') {
            this.setState({
                isActive: true
            })
            this.pollingData()
        }
    }

    lockArea = (area, callback) => {
        if (this.areaLocking) {
            if (this.areaLocking !== area) {
                this.areaWaitToLock = area
                this.lockCallback = callback
            }
            return
        }
        const { dispatch , } = this.props
        this.areaLocking = area
        this.areaWaitToLock = null
        this.lockCallback = null
        dispatch({
            type: 'doc/lockArea',
            payload: {
                area: area,
                uuid: editorUid
            }
        }).then(res => {
            this.areaLocking = null
            const { locker } = res
            const { currentUser } = this.props
            if (locker && locker.userId !== currentUser.userId || this.editorBiz.hasNewVersion(res)) {
                this.areaLocked = null
            } else {
                this.areaLocked = area
                if (!this.areaWaitToLock) {
                    if (callback) {
                        callback()
                    }
                }
            }
            this.checkWaitLock()
        }).catch(e => {
            this.areaLocking = null
            this.checkWaitLock()
        })
    }

    unLock = callback => {
        const { doc , dispatch } = this.props
        if (this.areaLocked) {
            dispatch({
                type: 'doc/unLock',
                payload: {
                    doc_id: doc.id,
                    uuid: editorUid
                }
            }).then(() => {
                if (callback) {
                    callback()
                }
            })
        } else if (callback) {
            callback()
        }
    }

    checkWaitLock = () => {
        if (this.areaWaitToLock) {
            this.lockArea(this.areaWaitToLock, this.lockCallback);
        }
    }

    checkOtherEditer = () => {
        const { currentUser , doc:{ editStatus } } = this.props
        let pollingInterval = this.state.pollingInterval
        let hasOtherEditer = false
        mapValues(editStatus,area => {
            if (area.locker && area.locker.userId !== currentUser.userId) {
                hasOtherEditer = true
            }
        })
  
        if (hasOtherEditer) {
            pollingInterval = 10
        } else {
            pollingInterval += 10
            pollingInterval = Math.min(pollingInterval, MAX_POLLING_INTERVAL)
        }
  
        this.setState({
            pollingInterval: pollingInterval
        })
    }

    keepLock = () => {
        if (this.areaLocked) {
            this.lockArea(this.areaLocked)
        }
    }

    pollingData = () => {
        const { isActive , contentConflict } = this.state
        if (!isActive || contentConflict) {
            return
        }
  
        this.stopPollingData()
        this.getEditStatus(result => {
            // 触发自动保存
            this.onSave(Doc.SAVE_TYPE.AUTO)
            // Lake 文档在获取锁后即检查是否有冲突
            this.checkLakeEditConflict(result.doc)
            this.keepLock()
        })
  
        this.pollingTimer = setTimeout(() => {
            this.pollingData()
        }, this.state.pollingInterval * 1000)
    }

    stopPollingData() {
        if (this.pollingTimer) {
            clearTimeout(this.pollingTimer)
        }
    }

    getEditStatus(callback) {
        // 正在保存时，不执行
        if (this.state.saving) return
        this.props.dispatch({
            type: 'doc/getEditStatus',
            payload: {
                uuid: editorUid
            }
        }).then(res => {
            if (callback) {
                callback(res)
            }
            this.checkOtherEditer()
        })
    }

    handleChange = value => {
        const doc = this.props.doc
        // 更新编辑中的取值
        this.setState({
            value: value,
            editing: true
        })
        // 存到缓存
        this.editorBiz.saveToCache({
            draft_version: doc.editStatus.doc.draft_version,
            value: value
        })
        // 检查是否在编辑中
        this.checkEditing()
      }
  
    checkEditing = () => {
        if (this.editingTimer) {
            clearTimeout(this.editingTimer)
        }
        //5秒没操作改变编辑状态
        this.editingTimer = setTimeout(() => {
            this.setState({
                editing: false
            })
        }, 5000)
    }

    checkLakeEditConflict = lock => {
        const { currentUser } = this.props
        const { locker } = lock
        // 其它人锁定页面时
        if (locker && locker.userId !== currentUser.userId) {
            this.setState({
                disabled: true,
                // 将编辑态设置为非激活状态
                isActive: false
            })
            return
        } 
        // 有新内容时，禁止编辑
        if (this.editorBiz.hasNewVersion(lock)) {
            this.setState({
                // 设置为 disable 状态
                disabled: true,
                // 设置为内容冲突
                contentConflict: true,
                // 将编辑态设置为非激活状态
                isActive: false
            })
            return
        }
  
        this.setState({
            disabled: false
        })
    }

    waitToAutoSave = () => {
        setTimeout(() => {
            this.onSave(Doc.SAVE_TYPE.AUTO)
        }, 30000)
    }

    onLeave = () => {
        this.setState({
            isActive: false
        })
        this.onSave(Doc.SAVE_TYPE.FORCE)
        this.unLock()
    }

    onActive = () => {
        if (this.state.isActive) {
            return
        }
  
        this.setState({
            isActive: true
        }, () => {
            this.pollingData()
        })
    }

    onForceLeaveEditor = () => {
        this.unbindEvents()
        // 解除锁
        this.unLock()
    }

    onReverted = () => {
        // 清空本地存储
        this.editorBiz.clearCachedContent()
        // 强制退出编辑
        this.onForceLeaveEditor()
        message.success('文档恢复成功', 1.5, () => {
            // 关闭浮层
            this.setState({
                versionsStatus: false
            })
            // 重新加载页面
            window.location.reload()
        })
    }

    onSave = (type, callback) => {
        const { saving , editing , disabled } = this.state

        if (disabled) {
            console.log('on save, editor disabled, ignore');
            return
        }
  
        if (type === Doc.SAVE_TYPE.AUTO && editing) {
            // 正在输入中，自动保存延迟，editing状态会在停止输入5s后清除
            this.waitToAutoSave()
            return
        }
  
        if (saving) {
            if (callback) {
                this.saveCallback = callback
            }
            return
        }
  
        this.engine.event.trigger('save:before')

        this.engine.asyncEvent.emitAsync('save:before').then(() => {
            this.doSaveLakeDoc(type, callback)
        }).catch(res => {
            if (type === Doc.SAVE_TYPE.USER_PUBLISH) {
                this.setState({
                    publishing: false
                })
                message.error(res)
            } else {
                // 仍然执行保存，避免内容本应保存的内容丢失
                this.doSaveLakeDoc(type, callback)
            }
        })
    }

    saveTitle = title => {
        const { doc , dispatch } = this.props
        title = title ? title.trim() : "无标题"
        if (title === doc.title) return
        // 先更新 UI 界面中的文档标题
        dispatch({
            type: 'doc/update',
            payload: {
                title: title
            }
        })
        // 发送请求保存标题
        dispatch({
            type: 'doc/updateMeta',
            payload: {
                doc_id: doc.id,
                title: title
            }
        }).then(res => {
          
        }).catch(e => {
            message.warn('save title failed')
        })
    }

    doSaveLakeDoc = (type, callback) => {
        if (typeof callback !== 'function') {
            callback = function callback() {}
        }
        const { doc, dispatch } = this.props
        const content = this.engine.getContent()
  
        if (!this.editorBiz.isContentChanged(content)) {
            callback()
            return
        }

        this.setState({
            saving: true
        })

        dispatch({
            type: 'doc/updateContent',
            payload: {
                doc_id: doc.id,
                body_asl: content,
                draft_version: doc.editStatus.doc.draft_version,
                save_type: type === Doc.SAVE_TYPE.AUTO ? 'auto' : 'user'
            }
        }).then(res => {
            this.editorBiz.onSaved(res)
            this.editorBiz.clearCachedContent()
            this.setState({
                saving: false,
                saved: new Date()
            })
            callback()
            if (this.saveCallback) {
                this.saveCallback()
                this.saveCallback = null
            }
    
            const editStatus = {
                doc: {
                    draft_version: res.draft_version,
                    content_updated_at: res.content_updated_at
                }
            }
    
            this.props.dispatch({
                type: 'doc/updateEditStatus',
                payload: {
                    data: editStatus,
                    cover: true
                }
            })
        }).catch(e => {
            // 确保下次可以继续保持
            this.setState({
                saving: false
            })
            console.log(e)
            message.warn('save doc failed')
        })
    }

    renderDisableView = () => {
        const { doc , currentUser } = this.props
        const docEditStatus = doc.editStatus.doc
        var locker = docEditStatus.locker
        let title = null
        let tip = null
        const lockerByOther = locker && locker.userId !== currentUser.userId
  
        if (lockerByOther) {
            title = `${locker.name} 正在编辑该文档`
            tip = '请等待对方完成编辑后，再进行编辑'
        } else {
            title = '文档内容有更新'
            tip = '请基于最新内容重新编辑'
        }

        return <Modal
        visible={true}
        title={null}
        closable={false}
        footer={null}
        width={360}
        >
            <div className="lark-conflict-view">
                <div className="conflict-title">{title}</div>
                <div className="conflict-tip">{tip}</div>
                <div className="conflict-action">
                    {
                        lockerByOther ? 
                        <Button href="/" type="primary">退出编辑</Button> :
                        <Button href="/write" type="primary">重新编辑</Button>
                    }
                </div>
            </div>
        </Modal>
    }
    
    render(){
        const { loading , value } = this.state
        const { doc } = this.props
        return ( 
            <DocumentTitle title={`Editing \xB7 ${doc.title} \xB7 ITELLYOU`}>
                <div className="lark">
                    <div className="lark-editor lark-editor-lake">
                        <IdleChecker 
                        onIdle={this.onLeave}
                        onActive={this.onActive}
                        interval={60}
                        />
                        <div id="lark-doc-edit-root" ref={this.editorRootRef}>
                            { 
                                loading === false && 
                                <TextEditor 
                                title={doc.title}
                                defaultValue={this.initialDocument.value}
                                value={value}
                                onSave={() => {
                                    this.onSave(Doc.SAVE_TYPE.USER_SAVE)
                                }}
                                onSaveTitle={this.saveTitle}
                                onLoad={this.onEditorLoaded}
                                onChange={this.handleChange}
                                />
                            }
                            {
                                this.state.disabled && this.renderDisableView()
                            }
                        </div>
                    </div>
                    { 
                        this.state.versionsStatus &&  
                        <Modal 
                        className={"doc-history-modal"}
                        width={1080}
                        style={{
                            top: 56
                        }}
                        title={null}
                        footer={null}
                        visible={true}
                        closable={false}
                        onCancel={() => {
                            this.setState({
                                versionsStatus: false
                            })
                        }}
                        >
                            <History 
                            docId={doc.id}
                            onCancel={() => {
                                this.setState({
                                    versionsStatus: false
                                })
                            }}
                            onReverted={this.onReverted}
                            />
                        </Modal>
                    }
                </div>
            </DocumentTitle>
        )
    }
}

export default connect(({ doc,user:{ current } ,loading }) => ({
    doc,
    currentUser:current
}))(Write)