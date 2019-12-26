import React , { useState } from 'react'
import { connect } from 'dva'
import Comment , { Detail as CommentDetail } from '@/components/Comment'
import { Modal, Button } from 'antd'
import styles from './index.less'

function QuestionComment({ dispatch , rootLoading , questionDetail , detailLoading , questionId , comment , visible , onVisibleChange }){

    const [ detailVisible , setDetailVisible ] = useState(false)

    const load = (offset,limit) => {
        dispatch({
            type:"comment/root",
            payload:{
                questionId,
                offset,
                limit
            }
        })
    }

    const create = (content,html,parentId,replyId) => {
        return dispatch({
                type:"comment/create",
                payload:{
                    questionId,
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
                questionId,
                id
            }
        })
    }

    const vote = (id,type) => {
        return dispatch({
            type:"comment/vote",
            payload:{
                questionId,
                id,
                type
            }
        })
    }

    const child = (id,offset,limit) => {
        return dispatch({
            type:"comment/child",
            payload:{
                questionId,
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
                questionId,
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
        return dispatch({
            type:"comment/childDetail",
            payload:{
                questionId,
                id:comment.detail.id,
                append:true,
                offset,
                limit
            }
        })
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
                    loading={detailLoading}
                    onLoad={childDetail}
                    onCreate={create}
                    onDelete={del}
                    onVote={vote}
                    size={20}
                    />
                    : 
                    <Comment 
                    className={styles["modal-comment-list"]}
                    title={false}
                    dataSource={comment[questionId]}
                    loading={rootLoading}
                    onLoad={load}
                    onCreate={create}
                    onDelete={del}
                    onVote={vote}
                    onChild={child}
                    onDetail={detail}
                    hasEdit={true}
                    hasScroll={true}
                    size={20}
                    />
                }
            </div>
        </Modal>
    )
}
export default connect(({ question , comment , loading }) => ({
    comment ,
    questionDetail:question.detail,
    rootLoading:loading.effects["comment/root"],
    detailLoading:loading.effects["comment/childDetail"]
}))(QuestionComment)