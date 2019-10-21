import React from 'react'
import DocumentTitle from 'react-document-title'
import { Button , Modal , message, Icon , Popover , Input , Form , Row , Col } from 'antd'
import Editor , { History, Doc } from '@/components/Editor'
import { connect } from 'dva'
import router from 'umi/router'
import styles from './Edit.less'
import logo from '@/assets/logo.svg'
import { Link } from 'umi'
import moment from 'moment'
import Timer from '@/components/Timer'

class Edit extends React.Component {

    state = {
        // 是否为查看历史状态
        versionsStatus: false,
        // 是否正在保存
        saving: false,
        // 保存时间
        saved: null,
        defaultValue:null,
        value: null,
        // 正在获取文档数据
        loading: true,
       
        publishing:false,
        modifyReason:"",
        // 所编辑的版本
        tag_version:null
    }

    componentWillMount(){
        const { match:{ params } , location:{ query } } = this.props
        this.tagName = decodeURIComponent(params.tagName)
        this.draftId = query.draft
    }

    componentDidMount(){
        this.getDetail(this.draftId).then(res => {
            if(res.result){
                this.editorBiz = new Doc(res.data)
                const document = this.editorBiz.getInitialDocument()
                this.initialDocument = document
                this.setState({
                    defaultValue:res.data.body_asl,
                    description:res.data.description,
                    loading: false,
                    tag_version: this.draftId ? res.data.source_version : res.data.tag_version,
                    value: document.value
                })
                this.initEditor()
            }else{
                message.error(res.message)
                if(this.draftId)
                    router.push('/user/draft')
                else
                    router.push('/tag')
            }
        })
    }

    getDetail = draftId => {
        const { dispatch } = this.props
        if(!draftId){
            return dispatch({
                type:'tag/query',
                payload:{
                    tag_name:this.tagName
                }
            })
        }else{
            return dispatch({
                type:'draft/getDetail',
                payload:{
                    draft_id:draftId
                }
            })
        }
    }

    onEditorLoad = instance => {
        this.editorInstance = instance
        const { detail } = this.props
        this.setState({
            title:detail ? detail.title : this.state.title,
            tags:detail ? detail.tags : [],
            loading:false
        })
    }

    onEditorChange = content => {
        this.setState({
            content
        })
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
            window.location.href = `/tag/${encodeURIComponent(this.tagName)}/edit?draft=${this.draftId}`
        })
    }

    onCancelVersionView = () => {
        this.setState({
            enabledVersionConflict:false,
            disabled:false,
            isActive:true
        })
    }

    onDescriptionChange = event => {
        this.setState({
            description:event.target.value
        })
    }

    onSaveDescription = () => {
        if(!this.draftId){
            this.onSave(Doc.SAVE_TYPE.USER_SAVE)
        }else{
            const { dispatch } = this.props
            const { description } = this.state
            dispatch({
                type:'draft/updateDesc',
                payload:{
                    draft_id:this.draftId,
                    draft_desc:description,
                }
            })
        }
        this.setState({
            metaVisible:false
        })
    }

    onMetaVisibleChange = visible => {
        this.setState({
            metaVisible:visible
        })
    }

    renderMeta = () => {
        return (
            <div className={styles['meta-warp']}>
                <Form>
                    <Form.Item
                    label="摘要"
                    colon={false}
                    >
                        <Input.TextArea 
                        value={this.state.description}
                        onChange={this.onDescriptionChange}
                        autosize={{
                            minRows: 3,
                            maxRows: 6
                        }}
                        maxLength="150"
                        />
                    </Form.Item>
                    <Button type="primary" onClick={this.onSaveDescription}>确定</Button>
                </Form>
            </div>
        )
    }

    renderSaveStatus = () => {
        const { loading , saving , saved } = this.state
        if(saving){
            return '保存中...'
        }
        const { draftDetail } = this.props
        if(saved && draftDetail){
            return <span>已保存于<Link to="/user/draft" target="_blank">草稿箱</Link> {moment(saved).format('H:mm:ss')}(<a onClick={()=>{this.onDeleteDraft(draftDetail.draft_id)}}>删除</a>)</span>
        }
       
        if(draftDetail){
            return <span>已保存于<Link to="/user/draft" target="_blank">草稿箱</Link>，最后更改于<Timer time={draftDetail.updated_time} />(<a onClick={()=>{this.onDeleteDraft(draftDetail.draft_id)}}>删除</a>)</span> 
        }
        const { tagDetail } = this.props
        if(!loading && tagDetail){
            return <span>最后更改于<Timer time={tagDetail.updated_time} /></span> 
        }
    }

    onShowPublish = () => {
        this.setState({
            publishVisible:true
        })
    }

    onHidePublish = () => {
        this.setState({
            publishVisible:false
        })
    }

    onModifyReasonChange = event => {
        this.setState({
            modifyReason:event.target.value
        })
    }

    onPublish = async () => {
        const { dispatch , tagDetail , draftDetail } = this.props
        const { modifyReason , description , saving , disabled } = this.state

        if (disabled) {
            console.log('on save, editor disabled, ignore');
            return
        }
        this.stopPollingData()
        this.setState({
            publishing:true,
            isActive:false,
            enabledSave:true // 不再启用保存草稿
        })

        // 如果还未创建草稿，
        if(!this.draftId){
            //如果正在保存中，等待保存
            if(saving){
                const savingWait = () => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            if(!this.state.saving){
                                resolve()
                            }
                        }, 10)
                    })
                }
                await savingWait()
            }
        }
        const content = this.engine.getContent()
        dispatch({
            type:"tag/addVersion",
            payload:{
                tag_id:draftDetail ? draftDetail.source_id : tagDetail.tag_id,
                tag_version:draftDetail ? draftDetail.source_version : tagDetail.tag_version,
                tag_description:description,
                content,
                modify_reason:modifyReason,
                draft_id:this.draftId
            }
        }).then(res => {
            this.setState({
                publishing:false,
                isActive:true,
                enabledSave:false,
            })
            if(res.result){
                message.success("提交成功，请耐心等待审核",5)
                router.push('/tag')
            }else{
                message.error(res.message)
            }
        })
    }

    render(){
        const { value , defaultValue , loading , publishing , enabledPublish } = this.state
        const { detail , match:{ params } } = this.props
        let doc_id = params.tag_id
        if(detail){
            doc_id = detail.tag_id
        }
        /**
         * 描述设置暂时不用
         * <div className={styles.setting}>
                                <Popover
                                trigger="click"
                                content={this.renderMeta()}
                                visible={this.state.metaVisible}
                                onVisibleChange={this.onMetaVisibleChange}
                                >
                                    <span className={classNames(styles['setting-icon'],this.state.metaVisible ? styles['setting-icon-active'] : null)}><Icon type="caret-down" /></span>
                                </Popover>
                            </div>
         */
        return (
            <DocumentTitle title='I TELL YOU'>
                <React.Fragment>
                    <header className={styles.header}>
                        <div className={styles.container}>
                            <div className={styles.logo}>
                                <a href="/"><img src={logo} alt="" /></a>
                            </div>
                            <small><span>·</span>编辑<span>·</span>{this.tagName}</small>
                            <div className={styles['save-status']}>
                                {
                                    this.renderSaveStatus()
                                }
                            </div>
                            <div className={styles.right}>
                                {
                                    this.draftId &&
                                    <Button type="ghost" onClick={this.onShowVersion}>历史</Button>
                                }
                                {
                                    enabledPublish && 
                                    <Button type="primary" onClick={this.onShowPublish}>提交</Button>
                                }
                            </div>
                        </div>
                    </header>
                    <div className={styles["tag-editor"]}>
                        <Editor 
                        doc_id={doc_id} 
                        type="mini"
                        onLoad={this.onEditorLoad}
                        onChange={this.onEditorChange}
                        />
                        { 
                            this.state.versionsStatus &&  
                            <Modal 
                            className={styles['doc-history-modal']}
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
                                doc_id={detail.question_id}
                                onRollback={this.onReverted}
                                onCancel={() => {
                                    this.setState({
                                        versionsStatus: false
                                    })
                                }}
                                />
                            </Modal>
                        }
                        {
                            this.state.publishVisible && (
                                <Modal
                                className={styles["publish-seting-modal"]}
                                title={null}
                                visible={true}
                                footer={null}
                                closable={false}
                                onCancel={this.onHidePublish}
                                >
                                    <Form>
                                        <Form.Item
                                        label="修改原因"
                                        colon={false}
                                        >
                                            <Input.TextArea 
                                            value={this.state.modifyReason}
                                            onChange={this.onModifyReasonChange}
                                            autosize={{
                                                minRows: 3,
                                                maxRows: 6
                                            }}
                                            maxLength="150"
                                            />
                                            <p className={styles['reason-tip']}>请确保您提交的内容真实有效，您将对提供的内容负有法律责任，对虚假和恶意营销，我们将保留追究法律责任的权利！</p>
                                        </Form.Item>
                                        <Row gutter={8}>
                                            <Col span={12}>
                                                <Button style={{width:'100%'}} onClick={this.onHidePublish} >取消</Button>
                                            </Col>
                                            <Col span={12}>{
                                                enabledPublish && 
                                                <Button style={{width:'100%'}} loading={publishing} type="primary" onClick={this.onPublish}>{publishing ? '提交中...' : '提交'}</Button>
                                            }
                                            </Col>
                                        </Row>
                                    </Form>
                                    
                                </Modal>
                            )
                        }
                    </div>
                </React.Fragment>
            </DocumentTitle>
        )
    }
}
export default connect(({ tag,draft ,  doc ,loading }) => ({
    tagDetail:tag.detail,
    tagLoading:loading.effects['tag/query'],
    draftDetail:draft.detail,
    detail:doc.detail,
    editStatus:doc.editStatus || {}
}))(Edit)