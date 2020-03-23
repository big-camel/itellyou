import React , { useState , useEffect } from 'react'
import { useDispatch, useSelector } from 'dva'
import Link from 'umi/link'
import { Row , Col , Button , Avatar, Icon } from 'antd'
import classNames from 'classnames'
import { Viewer } from '@/components/Editor'
import Tag from '@/components/Tag'
import Timer from '@/components/Timer'
import styles from './index.less'
import DocumentTitle from 'react-document-title'
import Answer from './components/Answer'
import AnswerAction from '@/components/Answer/Action'
import Comment from './components/Comment'
import { ShareButton, ReportButton, CommentButton } from '@/components/Button'
import Loading from '@/components/Loading'
import { UserAuthor } from '@/components/User'
import Related from './components/Related'


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
                question_id:id
            }
        })
    },[dispatch,id])

    const answer_id = params.answer_id ? parseInt(params.answer_id) : null
    const [ editVisible , setEditVisible ] = useState()
    const [ commentVisible , setCommentVisible ] = useState(false)
    const loading = useSelector(state => state.loading)
    const followLoading = loading.effects['questionStar/follow'] || loading.effects['questionStar/unfollow']

    useEffect(() => {
        if(!answer_id && user_answer && user_answer.draft && !user_answer.published && !user_answer.deleted){
            setEditVisible(visible => {
                if(!visible) return true
                return visible
            })
        }
    },[answer_id,user_answer])
    
    if(!detail) return <Loading />
    const { title , use_star , star_count , use_author } = detail
    const onRevoke = answer_id => {
        dispatch({
            type:"answer/revoke",
            payload:{
                question_id:id,
                id:answer_id
            }
        })
    }

    const onStar = () => {
        const type = !use_star ? "follow" : "unfollow"
        dispatch({
            type:`questionStar/${type}`,
            payload:{
                id
            }
        })
    }

    const renderStar = () => {
        return <Button 
        icon="star" 
        type="link" 
        size="small" 
        onClick={onStar}
        className={classNames({[styles.active]:use_star})}
        loading={followLoading}
        >
        {
            use_star ? "已关注" : "加关注"
        }({ star_count })</Button>
    }

    const renderStatusButton = () => {
        if(!detail) return
        if(user_answer && user_answer.published){
            if(user_answer.deleted)
                return <Button onClick={()  => onRevoke(user_answer.id) } type="primary" icon="delete" >撤销删除</Button>
            return <Link to={`/question/${id}/answer/${user_answer.id}`}><Button type="primary" icon="eye" >查看回答</Button></Link>
        }
        return <Button onClick={()  => setEditVisible(!editVisible) } type="primary" icon="edit" >{ answer_id ? "编辑回答" : "写回答"}</Button>
    }
    
    return (
        <DocumentTitle title={title}>
            <Row gutter={50}>
                <Col xs={24} sm={18}>
                    <div className={styles.header}>
                        <h2 className={styles.title}>
                            {
                                title
                            }
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
                        <ReportButton />
                        <UserAuthor 
                        info={detail.author}
                        extra={
                            <div><Timer time={detail.created_time} />提问</div>
                        }
                        />
                    </div>
                    {
                        editVisible && 
                        <AnswerAction.Edit 
                        hasHistory={user_answer && user_answer.draft === false ? true : false}
                        id={user_answer && user_answer.draft === true ? user_answer.id : null}
                        />
                    }
                    {
                        answer_id && (
                            <React.Fragment>
                                <Link to={`/question/${detail.id}`}>查看全部 {detail.answers} 个回答</Link>
                                <Answer.View
                                question_id={id}
                                answer_id={answer_id}
                                />
                            </React.Fragment>
                        )
                    }
                    {
                        <Answer.List
                        title={answer_id ? "更多回答" : null}
                        question_id={id}
                        exclude={[answer_id]}
                        />
                    }
                    {
                        <Comment question_id={id} visible={commentVisible} onVisibleChange={setCommentVisible} />
                    }
                </Col>
                <Col xs={24} sm={6}>
                    <Related id={id} />
                </Col>
            </Row>
        </DocumentTitle>
    )
}

export default Detail