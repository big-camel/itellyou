import React , { useState } from 'react'
import Author from '@/components/User/Author'
import { CommentButton, EllipsisButton, ReportButton } from '@/components/Button'
import { Vote , Favorite , Comment , Adopt, Delete, Edit } from './Action'
import styles from './index.less'
import { Popover, Menu, Button } from 'antd'
import { router, Link } from 'umi'
import { useDispatch } from 'dva'
import { Viewer } from '@/components/Editor'
import Timer from '../Timer'

export default ({ data : { id , question_id , description , author , column , comments , use_author , allow_adopt , adopted , allow_delete , allow_edit ,...item } , authorSize , desc }) => {
    const [ commentVisible , setCommentVisible ] = useState(false)
    const [ menuVisible , setMenuVisible ] = useState(false)
    const [ editVisible , setEditVisible ] = useState(false)
    const [ fullVisible , setFullVisible ] = useState(false)

    const dispatch = useDispatch()

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
            router.push(`/question/${question_id}/answer/${doc.id}`)
        }else{
            window.location.reload()
        }
    }

    const renderEdit = () => {
        return <Edit 
        id={id}
        onCancel={onEditCancel}
        onSubmit={onEditSubmit}
        />
    }

    const allowEdit = !desc && allow_edit

    const renderContent = () => {
        if(desc && !fullVisible) return <div>
            {
                description
            }
            {
                <Button type="link" onClick={() => setFullVisible(true)}>阅读全文</Button>
            }
        </div>
        return (
            <div>
                <div>
                { 
                    <Viewer content={item.content} /> 
                }
                </div>
                {
                    allowEdit && <Button type="link" icon="edit" onClick={() => setEditVisible(!editVisible)}>编辑{ item.draft_version > item.version ? "（有未发布的编辑草稿）" : ""}</Button>
                }
                <p>
                    <Link to={`/question/${question_id}/answer/${id}`}>
                    {
                        item.updated_time === null || item.version === 1 ? "发布于" : "更新于"}
                        <Timer time={item.updated_time === null || item.version === 1 ? item.created_time : item.updated_time} />
                    </Link>
                </p>
            </div>
        )
    }

    const renderBody = () => {
        return (
            <div>
                {
                    renderContent()
                }
                <div>
                    <Adopt id={id} question_id={question_id} allow_adopt={allow_adopt} adopted={adopted} />
                    <Vote id={id} {...item} />
                    <CommentButton type="link" onClick={() => setCommentVisible(!commentVisible)}>{comments === 0 ? "添加评论" : `${comments} 条评论`}</CommentButton>
                    <Favorite id={id} use_star={item.use_star} allow_star={item.allow_star} />
                    <Popover
                    content={
                        <Menu onClick={() => setMenuVisible(false)}>
                            <Menu.Item>
                                <ReportButton id={id} type="answer" />
                            </Menu.Item>
                            { allow_delete ? <Menu.Item><Delete id={id} question_id={question_id} allow_delete={allow_delete} callback={() => router.push(`/question/${question_id}`)} /></Menu.Item> : null}
                            { allowEdit ? <Menu.Item onClick={() => setEditVisible(!editVisible)}>编辑</Menu.Item> : null}
                        </Menu>
                    }
                    trigger="click"
                    visible={menuVisible}
                    onVisibleChange={setMenuVisible}
                    >
                        <EllipsisButton />
                    </Popover>
                </div>
                <div>
                    {
                        commentVisible && <Comment question_id={question_id} answer_id={id} />
                    }
                </div>
            </div>
        )
    }

    return (
        <div>
            <Author 
            className={styles['author']}
            info={{...author,use_author}} 
            size={authorSize} 
            />
            {
                editVisible && renderEdit()
            }
            {
                !editVisible && renderBody()
            }
        </div>
    )
}