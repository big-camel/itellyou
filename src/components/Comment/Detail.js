import React from 'react';
import Loading from '../Loading';
import Item from './Item';
import Comment from './index';
import styles from './index.less';

function CommentDetail({ dataSource, onDelete, onCreate, onVote, onChange, ...props }) {
    if (!dataSource) return <Loading />;
    const { detail, ...data } = dataSource;
    return (
        <div className={styles['comment-detail-layout']}>
            <Comment
                extra={
                    <div>
                        <ul className={styles['comment-detail-header']}>
                            <Item onDelete={onDelete} onVote={onVote} item={detail} />
                        </ul>
                        <div className={styles['comment-detail-divider']}></div>
                    </div>
                }
                title={detail.comment_count + '条评论'}
                dataSource={data}
                onChange={onChange}
                onDelete={onDelete}
                onCreate={onCreate}
                onVote={onVote}
                scroll={true}
                {...props}
            />
        </div>
    );
}
export default CommentDetail;
