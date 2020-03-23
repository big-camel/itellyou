import React , { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'dva'
import Comment , { Detail as CommentDetail } from '@/components/Comment'
import { Modal, Button } from 'antd'
import styles from './index.less'

function QuestionComment({ question_id , visible , onVisibleChange }){

    const [ detailVisible , setDetailVisible ] = useState(false)

    const dispatch = useDispatch()
    const question = useSelector(state => state.question)
    const questionDetail = question ? question.detail : null
    const comment = useSelector(state => state.comment)

    const [ offset , setOffset ] = useState(0)
    const [ childOffset , setChildOffset ] = useState(0)
    const limit = 20
    const load = useCallback((offset,limit) => {
        if(visible){
            dispatch({
                type:"comment/root",
                payload:{
                    question_id,
                    offset,
                    limit,
                    append:true
                }
            })
        }
        setOffset(offset)
    },[question_id,visible,dispatch])

    useEffect(() => {
        load(0,limit)
    },[load])

    const create = (content,html,parentId,replyId) => {
        return dispatch({
                type:"comment/create",
                payload:{
                    question_id,
                    content,
                    html,
                    parentId,
                    replyId
                }
            })
    }

    const del = id => {
        return dispatch({
            type:"comment/delete",
            payload:{
                question_id,
                id
            }
        })
    }

    const vote = (id,type) => {
        return dispatch({
            type:"comment/vote",
            payload:{
                question_id,
                id,
                type
            }
        })
    }

    const child = (id,offset,limit) => {
        return dispatch({
            type:"comment/child",
            payload:{
                question_id,
                id,
                append:true,
                offset,
                limit
            }
        })
    }

    const detail = ({ id }) => {
        dispatch({
            type:"comment/childDetail",
            payload:{
                question_id,
                id,
                hasDetail:true,
                offset:0,
                limit:20
            }
        })
        setDetailVisible(true)
    }

    const childDetail = (offset,limit) => {
        const comment = comment["detail"]
        if(!comment) return
        dispatch({
            type:"comment/childDetail",
            payload:{
                question_id,
                id:comment.detail.id,
                append:true,
                offset,
                limit
            }
        })
        setChildOffset(offset)
    }
    return (
        <Modal
        title={<div>{ detailVisible ? <Button onClick={() => setDetailVisible(false)} >返回评论</Button> : `${questionDetail.comments} 个评论`}</div>}
        visible={visible}
        className={styles["modal-warpper"]}
        destroyOnClose={true}
        footer={null}
        centered={true}
        width={688}
        onCancel={() => {
            setDetailVisible(false)
            onVisibleChange(false)
        }}
        >
            <div className={styles["modal-content"]}>
                {
                    detailVisible ? 
                    <CommentDetail 
                    dataSource={comment["detail"]}
                    onChange={childDetail}
                    onCreate={create}
                    onDelete={del}
                    onVote={vote}
                    offset={childOffset}
                    limit={limit}
                    />
                    : 
                    <Comment 
                    className={styles["modal-comment-list"]}
                    title={false}
                    dataSource={comment[question_id]}
                    onChange={load}
                    onCreate={create}
                    onDelete={del}
                    onVote={vote}
                    onChild={child}
                    onDetail={detail}
                    hasEdit={true}
                    scroll={true}
                    offset={offset}
                    limit={limit}
                    />
                }
            </div>
        </Modal>
    )
}
export default QuestionComment