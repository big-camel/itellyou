import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import Comment, { Detail as CommentDetail } from '@/components/Comment';
import { Modal, Button } from 'antd';
import styles from './index.less';

function QuestionComment({ question_id, visible, onVisibleChange }) {
    const [detailVisible, setDetailVisible] = useState(false);

    const dispatch = useDispatch();
    const question = useSelector((state) => state.question);
    const questionDetail = question ? question.detail : null;
    const comment = useSelector((state) => state.questionComment);

    const [offset, setOffset] = useState(0);
    const [childOffset, setChildOffset] = useState(0);
    const limit = 20;
    const load = useCallback(
        (offset, limit) => {
            if (visible) {
                dispatch({
                    type: 'questionComment/root',
                    payload: {
                        question_id,
                        offset,
                        limit,
                        append: offset !== 0,
                    },
                });
            }
            setOffset(offset);
        },
        [question_id, visible, dispatch],
    );

    useEffect(() => {
        load(0, limit);
    }, [load]);

    const create = (content, html, parentId, replyId) => {
        return dispatch({
            type: 'questionComment/create',
            payload: {
                question_id,
                content,
                html,
                parentId,
                replyId,
            },
        });
    };

    const del = (id) => {
        return dispatch({
            type: 'questionComment/delete',
            payload: {
                question_id,
                id,
            },
        });
    };

    const vote = (id, type) => {
        return dispatch({
            type: 'questionComment/vote',
            payload: {
                question_id,
                id,
                type,
            },
        });
    };

    const child = (id, offset, limit) => {
        return dispatch({
            type: 'questionComment/child',
            payload: {
                question_id,
                id,
                append: offset !== 0,
                offset,
                limit,
            },
        });
    };

    const detail = ({ id }) => {
        dispatch({
            type: 'questionComment/childDetail',
            payload: {
                question_id,
                id,
                hasDetail: true,
                offset: 0,
                limit: 20,
            },
        });
        setDetailVisible(true);
    };

    const childDetail = (offset, limit) => {
        const comment = comment['detail'];
        if (!comment) return;
        dispatch({
            type: 'questionComment/childDetail',
            payload: {
                question_id,
                id: comment.detail.id,
                append: offset !== 0,
                offset,
                limit,
            },
        });
        setChildOffset(offset);
    };
    return (
        <Modal
            title={
                <div>
                    {detailVisible ? (
                        <Button onClick={() => setDetailVisible(false)}>返回评论</Button>
                    ) : (
                        `${questionDetail.comment_count} 个评论`
                    )}
                </div>
            }
            visible={visible}
            className={styles['modal-warpper']}
            destroyOnClose={true}
            footer={null}
            centered={true}
            width={688}
            onCancel={() => {
                setDetailVisible(false);
                onVisibleChange(false);
            }}
        >
            <div className={styles['modal-content']}>
                {detailVisible ? (
                    <CommentDetail
                        dataSource={comment['detail']}
                        onChange={childDetail}
                        onCreate={create}
                        onDelete={del}
                        onVote={vote}
                        offset={childOffset}
                        limit={limit}
                    />
                ) : (
                    <Comment
                        className={styles['modal-comment-list']}
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
                )}
            </div>
        </Modal>
    );
}
export default QuestionComment;
