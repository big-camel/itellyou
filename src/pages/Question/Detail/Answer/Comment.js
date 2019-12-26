import React , { useState } from 'react'
import { connect } from 'dva'
import Comment from '@/components/Comment'
import { Modal } from 'antd'
import CommentDetail from '@/components/Comment/Detail'

function AnswerComment({ dispatch , rootLoading , detailLoading , questionId , answerId , answerComment }){

    const [ modelVisible , setModelVisible ] = useState(false)

    const load = (offset,limit) => {
        dispatch({
            type:"answerComment/root",
            payload:{
                questionId,
                answerId,
                offset,
                limit
            }
        })
    }

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
        return dispatch({
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
    }
    return (
        <React.Fragment>
            <Comment 
            dataSource={answerComment[answerId]}
            loading={rootLoading}
            onLoad={load}
            onCreate={create}
            onDelete={del}
            onVote={vote}
            onChild={child}
            onDetail={detail}
            hasEdit={true}
            size={20}
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
                loading={detailLoading}
                onLoad={childDetail}
                onCreate={create}
                onDelete={del}
                onVote={vote}
                size={20}
                />
            </Modal>
        </React.Fragment>
    )
}
export default connect(({ answerComment , loading }) => ({
    answerComment ,
    rootLoading:loading.effects["answerComment/root"],
    detailLoading:loading.effects["answerComment/childDetail"]
}))(AnswerComment)