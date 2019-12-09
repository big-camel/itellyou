import React from 'react'
import { connect } from 'dva'
import Link from 'umi/link'
import { Tooltip , Row , Col , Button , List, Avatar, Icon , message, Divider} from 'antd'
import { Viewer } from '@/components/Editor'
import Tag from '@/components/Tag'
import Timer from '@/components/Timer'
import Editor , { EditorBiz } from '@/components/Editor'
import styles from './Detail.less'
import Loading from '@/components/Loading'
import Comment from '@/components/Comment'

const { SAVE_TYPE } = EditorBiz

class Detail extends React.Component {

    state = {
        answer_visible:false,
        saving:false,
        content:"",
        editorInstanceId:"comment_main",
        replyId:null
    }

    componentDidMount(){
        const { dispatch,match:{ params } } = this.props
        dispatch({
            type:'question/find',
            payload:{
                id:params.id
            }
        }).then(res => {
            if(res.result && res.data.answers === 0){
                this.setState({
                    answer_visible:true
                })
            }
        })
        dispatch({
            type:'view/view',
            payload:{
                id:params.id
            }
        })
        
    }

    onEditorLoad = editor => {
        this.editor = editor
    }

    onEditorChange = content => {
        this.setState({
            content
        })
    }

    onCommentPublish = () => {
        const { saving  } = this.state
        const { dispatch } = this.props
        if(saving)
            return

        this.engine.event.trigger('save:before')
        this.engine.asyncEvent.emitAsync('save:before').then(() => {
            const content = this.engine.getContent()
            this.setState({
                saving:true
            })
            const { detail } = this.props
            const { replyId } = this.state
            const parent_id = replyId || 0
            dispatch({
                type:'comment/create',
                payload:{
                    question_id:detail.question_id,
                    comment_id:parent_id,
                    content
                }
            }).then(res => {
                this.setState({
                    saving:false
                })
                if(res.result){
                    this.cancelReply()
                    this.setState({
                        content:"",
                        editorInstanceId:"comment_update_".concat(res.data.id)
                    })
                }else{
                    message.error(res.message)
                }
            })
        }).catch(res => {
            message.error(res)
        })
    }

    renderCommentList = () => {
        const { detail , detailLoading , commentRootList , commentRootLoading} = this.props
        /*if(detail === null || detailLoading || commentRootList === null || commentRootLoading)
            return <Loading />
        let hotComments = []
        commentRootList.data.forEach((comment , index) => {
            if(comment.is_hot){
                hotComments.push(comment)
                commentRootList.data.splice(index,1)
            }
        })
        if(hotComments.length > 0){
            hotComments = {
                page:1,
                size:hotComments.length,
                total:hotComments.length,
                data:hotComments
            }
        }*/
        return (
            <div className={styles['comment-list']}>
                { 
                    //hotComments.data && <Comment header={<span>热门回答({hotComments.length})</span>} comments={hotComments} /> 
                } 
                { //commentRootList.data && <Comment doc_id={detail.question_id} header={<Divider orientation="left">{detail.answer_count}个回答</Divider>} comments={commentRootList} /> 
                }
                <Comment doc_id={detail.question_id} empty={null} header={<Divider orientation="left">{detail.answer_count}个回答</Divider>} /> 
            </div>
        )
    }

    renderReplyTo = () => {
        const { replyId } = this.state
        const commentList = this.props.commentList || []
        const comment = commentList.find(comment => comment.id == replyId)
        if(!comment)
            return
        return (
            <div className={styles['reply-tip']}>
                Reply to <a href={`#comment-${comment.id}`}>@{comment.user.nickname}</a>
                <Tooltip title="取消回复">
                    <span className={styles['remove-reply']} onClick={this.cancelReply}><Icon type="close" /></span>
                </Tooltip>
                
            </div>
        )
    }

    cancelReply = () => {
        this.setState({
            replyId:null
        })
    }

    setStar = () => {
        const { detail , dispatch } = this.props
        if(detail){
            dispatch({
                type:"star/set",
                payload:{
                    question_id:detail.question_id
                }
            }).then(res => {
                if(res.result){
                    dispatch({
                        type:"question/updateDetail",
                        payload:Object.assign( {} , detail , { is_star:true , star_count:detail.star_count + 1})
                    })
                }
            })
        }
    }

    delStar = () => {
        const { detail , dispatch } = this.props
        if(detail){
            dispatch({
                type:"star/del",
                payload:{
                    question_id:detail.question_id
                }
            }).then(res => {
                if(res.result){
                    dispatch({
                        type:"question/updateDetail",
                        payload:Object.assign( {} , detail , { is_star:false , star_count:detail.star_count - 1})
                    })
                }
            })
        }
    }

    onAnswerVisible = () => {
        const { answer_visible } = this.state
        this.setState({
            answer_visible:!answer_visible
        })
    }

    renderStar = () => {
        const { detail } = this.props
        if(detail.is_star){
            return <Button className={styles.active} icon="star" type="link" size="small" onClick={this.delStar}>已关注({ detail.star })</Button>
        }
        return <Button icon="star" type="link" size="small" onClick={this.setStar}>加关注({ detail.star })</Button>
    }

    render(){
        const { detail } = this.props
        if(!detail){
            return <Loading />
        }
        const { content , answer_visible , editorInstanceId } = this.state
        let disabled = true
        const editorBiz = this.editor ? this.editor.getEditorBiz() : null
        if(editorBiz && !editorBiz.isEmpty(content)){
            disabled = false
        }
        return (
            <Row gutter={50} className="box-section">
                <Col xs={24} sm={18}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            {detail.title}
                            {
                                detail.reward_type > 0 && <span className={styles.reward}>{ detail.reward_type === 1 ? <Icon type="pound" /> : <Icon type="pay-circle" />}{detail.reward_value}</span>
                            }
                        </h2>
                        <div className={styles.tags}>
                            {
                                detail.tags && (
                                    detail.tags.map(tag => (
                                        <span  key={tag.id} className={styles.tag}><Tag href={`/tag/${encodeURIComponent(tag.name)}`} title={tag.name} /></span>
                                    ))
                                )
                            }
                            <span className={styles['view']}>{detail.view}次浏览</span>
                        </div>
                    </div>
                    <article>
                        <Viewer content={detail.content} />
                    </article>
                    <div className={styles.actions}>
                        <Button onClick={this.onAnswerVisible} type="primary" icon="edit" >我来答</Button>
                        { this.renderStar() }
                        <Button type="link" icon="share-alt">分享</Button>
                        <Button type="link" icon="exclamation-circle">举报</Button>
                        <div className={styles.author}>
                            <Avatar size={40} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            <div className={styles.info}>
                                <Link to="">{detail.creator ? detail.creator.name : null}</Link>
                                <div><Timer time={detail.created_time} />提问</div>
                            </div>
                        </div>
                    </div>
                    {
                        answer_visible && 
                        <div className={styles['comment-editor']}>
                            <div className={styles['editor-wrapper']}>
                                <Editor
                                api={{
                                    create:"answer/create",
                                    update:"answer/update",
                                    publish:"answer/publish",
                                    find:"answer/draft"
                                }}
                                key={editorInstanceId}
                                local={!this.question_id}
                                onLoad={this.onEditorLoad}
                                onDocLoad={this.onDocLoad}
                                onChange={this.onEditorChange}
                                onSaveBefore={this.onSaveBefore}
                                onSaveAfter={this.onSaveAfter}
                                onReverted={this.onReverted}
                                onPublished={this.onPublished}
                                />
                            </div>
                            <Button className={styles['comment-publish']} disabled={disabled} type="primary" onClick={this.onCommentPublish}>提交回答</Button>
                        </div>
                    }
                    {
                        this.renderCommentList()
                    }
                </Col>
                <Col xs={24} sm={6}>dfdfsdf</Col>
            </Row>
        )
    }
}

export default connect(({ question , comment ,loading }) => ({
    detail:question.detail,
    detailLoading:loading.effects['question/getList'],
}))(Detail)