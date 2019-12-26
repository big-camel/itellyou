import React from 'react'
import Loading from '../Loading'
import Item from './Item'
import Comment from './index'
import styles from './index.less'

function CommentDetail({ dataSource , loading , onDelete , onCreate , onVote , onLoad , ...props}){

    if(!dataSource) return <Loading />
    const { detail , ...data } = dataSource
    return (
        <div className={styles["comment-detail-layout"]}>
            <Comment
            extra={
                <div>
                    <ul className={styles["comment-detail-header"]}>
                        <Item onDelete={onDelete} onVote={onVote} item={detail} />
                    </ul>
                    <div className={styles["comment-detail-divider"]}></div>
                </div>
            }
            title={detail.comments + "个评论"} 
            dataSource={data}
            loading={loading}
            onLoad={onLoad}
            onDelete={onDelete}
            onCreate={onCreate}
            onVote={onVote}
            hasScroll={true}
            {...props}
            />
        </div>
    )
}
export default CommentDetail