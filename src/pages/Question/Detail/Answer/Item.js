import React , { useState } from 'react'
import { List , Avatar, Button , Popover, Menu , Modal } from 'antd'
import { useSelector } from 'dva'
import { Viewer } from '@/components/Editor'
import Timer from '@/components/Timer'
import { SupportButton , OpposeButton , FavoriteButton, CommentButton, ShareButton , EllipsisButton, AdoptButton} from '@/components/Button'
import styles from './Answer.less'
import { Link, router } from 'umi'
import Edit from './Edit'
import Comment from './Comment'

const { Item } = List

function AnswerItem({ dispatch , questionId , item }){

    const [ voting , setVoting ] = useState(false)
    const [ editVisible , setEditVisible ] = useState(false)
    const [ actionMoreVisible , setActionMoreVisible ] = useState(false)
    const [ commentVisible , setCommentVisible ] = useState(false)
    const [ adopting , setAdopting ] = useState(false)
    const loading = useSelector(state => state.loading)
    const followLoading = loading.effects['answerStar/follow'] || loading.effects['answerStar/unfollow']

    const onDelete = id => {
        setActionMoreVisible(false)
        Modal.confirm({
            title: '你确定要删除自己的答案吗?',
            content: '答案内容不会被永久删除，你还可以撤消本次删除操作。',
            okText: '确定',
            cancelText: '取消',
            centered:true,
            onOk() {
                return new Promise(resolve => {
                    dispatch({
                        type:"answer/delete",
                        payload:{
                            questionId,
                            id
                        }
                    }).then(() => {
                        resolve()
                        router.push(`/question/${questionId}`)
                    })
                })
            },
            onCancel() {
            },
        })
    }
    const { author , use_star } = item

    const doEdit = () => {
        setActionMoreVisible(false)
        setEditVisible(!editVisible)
    }

    const doVote = type => {
        if(voting) return
        setVoting(true)
        dispatch({
            type:"answer/vote",
            payload:{
                questionId,
                id:item.id,
                type
            }
        }).then(() => {
            setVoting(false)
        })
    }

    const doAdopt = () => {
        if(adopting || item.adopted) return
        setAdopting(true)
        dispatch({
            type:"question/adopt",
            payload:{
                id:questionId,
                answerId:item.id
            }
        }).then(() => {
            setAdopting(false)
        })
    }

    const onStar = () => {
        const type = !use_star ? "follow" : "unfollow"
        dispatch({
            type:`answerStar/${type}`,
            payload:{
                id:item.id
            }
        })
    }

    const renderAction = () => {
        return <div className={styles["answer-action"]}>
                {
                    (item.allow_adopt || item.adopted) && <AdoptButton onClick={doAdopt} loading={adopting} active={item.adopted}>{ item.adopted ? "已采纳": "采纳答案"}</AdoptButton>
                }
                <Button.Group>
                    <SupportButton 
                    active={item.use_support} 
                    disabled={!item.allow_support}
                    onClick={() => doVote('support')}
                    >
                        赞同{item.support}
                    </SupportButton>
                    {
                        item.allow_oppose && <OpposeButton active={item.use_oppose} onClick={() => doVote('oppose')} />
                    }
                    
                </Button.Group>

                <CommentButton onClick={() => setCommentVisible(!commentVisible)}>
                {
                    commentVisible === true ? "收起评论" : item.comments === 0 ? "添加评论" : `评论 ${item.comments}`
                }
                </CommentButton>
                <ShareButton >分享</ShareButton>
                <FavoriteButton loading={followLoading} onClick={onStar} >{use_star ? "取消收藏" : "收藏"}</FavoriteButton>
                <Popover
                content={
                    <Menu>
                        <Menu.Item>举报</Menu.Item>
                        { item.allow_delete ? <Menu.Item onClick={() => onDelete(item.id)}>删除</Menu.Item> : null}
                        { item.allow_edit ? <Menu.Item onClick={doEdit}>编辑</Menu.Item> : null}
                    </Menu>
                }
                trigger="click"
                visible={actionMoreVisible}
                onVisibleChange={setActionMoreVisible}
                >
                    <EllipsisButton />
                </Popover>
            </div>
    }

    const renderMeta = () => {
        return <Item.Meta
        className={styles["answer-meta"]}
        avatar={<Avatar shape="square" size={40} src={author.avatar} />}
        title={
            <div className={styles["answer-meta-title"]}>
                <div className={styles["answer-meta-author"]} ><a href={`/user/${author.id}`}>{author.name}{item.use_author && <span>(作者)</span>}</a></div>
                {
                    author.description && <div className={styles["answer-meta-desc"]}>{author.description}</div>
                }
            </div>
        }
        />
    }

    const renderContent = () => {
        return (
            <div>
                <div className={styles['answer-content']}>
                { 
                    <Viewer content={item.content} /> 
                }
                </div>
                {
                    item.allow_edit && <Button type="link" icon="edit" onClick={doEdit}>编辑{ item.draft_version > item.version ? "（有未发布的编辑草稿）" : ""}</Button>
                }
                <p>
                    <Link to={`/question/${questionId}/answer/${item.id}`}>
                    {
                        item.updated_time === null || item.version === 1 ? "发布于" : "更新于"}
                        <Timer time={item.updated_time === null || item.version === 1 ? item.created_time : item.updated_time} />
                    </Link>
                </p>
            </div>
        )
    }

    const renderComment = () => {
        return commentVisible && <Comment questionId={questionId} answerId={item.id} />
    }

    const onEditCancel = () => {
        setEditVisible(false)
    }

    const onEditSubmit = doc => {
        setEditVisible(false)
        if(doc){
            dispatch({
                type:'answer/updateDetail',
                payload:doc
            })
            dispatch({
                type:'answer/updateListItem',
                payload:doc
            })
            router.push(`/question/${questionId}/answer/${doc.id}`)
        }else{
            window.location.reload()
        }
    }

    const renderEdit = () => {
        return <Edit 
        id={item.id}
        onCancel={onEditCancel}
        onSubmit={onEditSubmit}
        />
    }

    
    return (
        <Item
        key={item.id}
        className={styles['answer-item']}
        >
            {
                renderMeta()
            }
            <div className={styles['answer-body']}>
                {
                    !editVisible && renderContent()
                }
                {
                    !editVisible && renderAction()
                }
                {
                    !editVisible && renderComment()
                }
                {
                    editVisible && renderEdit()
                }
            </div>
        </Item>
    )
}
export default AnswerItem