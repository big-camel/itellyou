import React , { useState, useEffect, useCallback } from 'react'
import { useDispatch , useSelector } from 'dva'
import Comment , { Detail as CommentDetail } from '@/components/Comment'
import { Modal } from 'antd'

function AnswerComment({ questionId , answerId }){

    const [ modelVisible , setModelVisible ] = useState(false)

    const dispatch = useDispatch()
    const answerComment = useSelector(state => state.answerComment)

    const [ offset , setOffset ] = useState(0)
    const [ childOffset , setChildOffset ] = useState(0)
    const limit = 20

    const load = useCallback((offset,limit) => {
        dispatch({
            type:"answerComment/root",
            payload:{
                questionId,
                answerId,
                offset,
                limit
            }
        })
        setOffset(offset)
    },[questionId,answerId,dispatch])

    useEffect(() => {
        load(0,20)
    },[load])

    const create = (content,html,parentId,replyId) => {
        return dispatch({
                type:"answerComment/create",
                payload:{
                    questionId,
                    answerId,
                    content,
                    html,
                    parentId,
                    replyId
                }
            })
    }

    const del = id => {
        return dispatch({
            type:"answerComment/delete",
            payload:{
                questionId,
                answerId,
                id
            }
        })
    }

    const vote = (id,type) => {
        return dispatch({
            type:"answerComment/vote",
            payload:{
                questionId,
                answerId,
                id,
                type
            }
        })
    }

    const child = (id,offset,limit) => {
        return dispatch({
            type:"answerComment/child",
            payload:{
                questionId,
                answerId,
                id,
                append:true,
                offset,
                limit
            }
        })
    }

    const detail = ({ id }) => {
        dispatch({
            type:"answerComment/childDetail",
            payload:{
                questionId,
                answerId,
                id,
                hasDetail:true,
                offset:0,
                limit:20
            }
        })
        setModelVisible(true)
    }

    const childDetail = (offset,limit) => {
        const comment = answerComment["detail"]
        if(!comment) return
        dispatch({
            type:"answerComment/childDetail",
            payload:{
                questionId,
                answerId,
                id:comment.detail.id,
                append:true,
                offset,
                limit
            }
        })
        setChildOffset(offset)
    }
    return (
        <React.Fragment>
            <Comment 
            dataSource={answerComment[answerId]}
            onChange={load}
            onCreate={create}
            onDelete={del}
            onVote={vote}
            onChild={child}
            onDetail={detail}
            hasEdit={true}
            offset={offset}
            limit={limit}
            />
            <Modal
            title="查看对话"
            bodyStyle={{padding:0}}
            visible={modelVisible}
            destroyOnClose={true}
            footer={null}
            centered={true}
            width={688}
            onCancel={() => setModelVisible(false)}
            >
                <CommentDetail 
                dataSource={answerComment["detail"]}
                onChange={childDetail}
                onCreate={create}
                onDelete={del}
                onVote={vote}
                offset={childOffset}
                limit={limit}
                />
            </Modal>
        </React.Fragment>
    )
}
export default AnswerComment