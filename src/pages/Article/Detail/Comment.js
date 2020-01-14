import React , { useState } from 'react'
import { useDispatch , useSelector } from 'dva'
import Comment , { Detail as CommentDetail } from '@/components/Comment'
import { Modal } from 'antd'

function ArticleComment({ articleId }){

    const [ modelVisible , setModelVisible ] = useState(false)

    const dispatch = useDispatch()
    const comment = useSelector(state => state.comment)
    const loadingEffect = useSelector(state => state.loading)
    const rootLoading = loadingEffect.effects["comment/root"]
    const detailLoading = loadingEffect.effects["comment/childDetail"]

    const load = (offset,limit) => {
        dispatch({
            type:"comment/root",
            payload:{
                articleId,
                offset,
                limit
            }
        })
    }

    const create = (content,html,parentId,replyId) => {
        return dispatch({
                type:"comment/create",
                payload:{
                    articleId,
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
                articleId,
                id
            }
        })
    }

    const vote = (id,type) => {
        return dispatch({
            type:"comment/vote",
            payload:{
                articleId,
                id,
                type
            }
        })
    }

    const child = (id,offset,limit) => {
        return dispatch({
            type:"comment/child",
            payload:{
                articleId,
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
                articleId,
                id,
                hasDetail:true,
                offset:0,
                limit:20
            }
        })
        setModelVisible(true)
    }

    const childDetail = (offset,limit) => {
        const detailComment = comment["detail"]
        if(!detailComment) return
        return dispatch({
            type:"comment/childDetail",
            payload:{
                articleId,
                id:detailComment.detail.id,
                append:true,
                offset,
                limit
            }
        })
    }
    return (
        <React.Fragment>
            <Comment 
            dataSource={comment.list}
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
                dataSource={comment.detail}
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
export default ArticleComment