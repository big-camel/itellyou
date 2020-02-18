import React , { useState , useEffect } from 'react'
import { useDispatch, useSelector } from 'dva'
import Link from 'umi/link'
import { Row , Col , Button , Avatar, Icon } from 'antd'
import { Viewer } from '@/components/Editor'
import Tag from '@/components/Tag'
import Timer from '@/components/Timer'
import styles from './index.less'
import DocumentTitle from 'react-document-title'
import Answer from './Answer'
import Comment from './Comment'
import { ShareButton, ReportButton, CommentButton } from '@/components/Button'
import Loading from '@/components/Loading'


function Detail({ match:{ params }}){
    const id = params.id ? parseInt(params.id) : null
    const dispatch = useDispatch()
    const question = useSelector(state => state.question)
    const { detail , user_answer } = question
    useEffect(() => {
        dispatch({
            type:'question/view',
            payload:{
                id
            }
        })
        dispatch({
            type:"question/find",
            payload:{
                id
            }
        })
        dispatch({
            type:"answer/findDraft",
            payload:{
                questionId:id
            }
        })
    },[dispatch,id])

    const answerId = params.answerId ? parseInt(params.answerId) : null
    const [ editVisible , setEditVisible ] = useState()
    const [ commentVisible , setCommentVisible ] = useState(false)

    useEffect(() => {
        if(!answerId && user_answer && user_answer.draft && !user_answer.published && !user_answer.deleted){
            setEditVisible(visible => {
                if(!visible) return true
                return visible
            })
        }
    },[answerId,user_answer])
    
    if(!detail) return <Loading />

    const onRevoke = answerId => {
        dispatch({
            type:"answer/revoke",
            payload:{
                questionId:id,
                id:answerId
            }
        })
    }

    const renderStar = () => {
        if(detail.use_star){
            return <Button className={styles.active} icon="star" type="link" size="small" >已关注({ detail.star_count })</Button>
        }
        return <Button icon="star" type="link" size="small" >加关注({ detail.star_count })</Button>
    }

    const renderStatusButton = () => {
        if(!detail) return
        if(user_answer && user_answer.published){
            if(user_answer.deleted)
                return <Button onClick={()  => onRevoke(user_answer.id) } type="primary" icon="delete" >撤销删除</Button>
            return <Link to={`/question/${id}/answer/${user_answer.id}`}><Button type="primary" icon="eye" >查看回答</Button></Link>
        }
        return <Button onClick={()  => setEditVisible(!editVisible) } type="primary" icon="edit" >{ answerId ? "编辑回答" : "写回答"}</Button>
    }
    
    return (
        <DocumentTitle title={detail ? detail.title : ""}>
            <Row gutter={50}>
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
                        { renderStatusButton() }
                        { renderStar() }
                        <CommentButton onClick={() => setCommentVisible(true)}>{detail.comments > 0 ? `${detail.comments} 条评论` : "评论"}</CommentButton>
                        <ShareButton>分享</ShareButton>
                        <ReportButton>举报</ReportButton>
                        <div className={styles.author}>
                            <Avatar size={40} shape="square" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            <div className={styles.info}>
                                <Link to="">{detail.author ? detail.author.name : null}</Link>
                                <div><Timer time={detail.created_time} />提问</div>
                            </div>
                        </div>
                    </div>
                    {
                        editVisible && 
                        <Answer.Edit 
                        hasHistory={user_answer && user_answer.draft === false ? true : false}
                        id={user_answer && user_answer.draft === true ? user_answer.id : null}
                        />
                    }
                    {
                        answerId && (
                            <React.Fragment>
                                <Link to={`/question/${detail.id}`}>查看全部 {detail.answers} 个回答</Link>
                                <Answer.View
                                questionId={id}
                                answerId={answerId}
                                />
                            </React.Fragment>
                        )
                    }
                    {
                        <Answer.List
                        title={answerId ? "更多回答" : null}
                        questionId={id}
                        exclude={[answerId]}
                        />
                    }
                    {
                        <Comment questionId={id} visible={commentVisible} onVisibleChange={setCommentVisible} />
                    }
                </Col>
                <Col xs={24} sm={6}>dfdfsdf</Col>
            </Row>
        </DocumentTitle>
    )
}

export default Detail