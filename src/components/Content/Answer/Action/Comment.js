import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'umi';
import Comment, { Detail as CommentDetail } from '@/components/Comment';
import { Modal } from 'antd';

export default ({ question_id, answer_id }) => {
    const [modelVisible, setModelVisible] = useState(false);

    const dispatch = useDispatch();
    const answerComment = useSelector(state => state.answerComment);

    const [offset, setOffset] = useState(0);
    const [childOffset, setChildOffset] = useState(0);
    const limit = 20;

    const load = useCallback(
        (offset, limit) => {
            dispatch({
                type: 'answerComment/root',
                payload: {
                    question_id,
                    answer_id,
                    offset,
                    limit,
                },
            });
            setOffset(offset);
        },
        [question_id, answer_id, dispatch],
    );

    useEffect(() => {
        if(!comment || comment.offset !== 0)
            load(0, limit);
    }, [comment,load, limit]);

    const create = (content, html, parentId, replyId) => {
        return dispatch({
            type: 'answerComment/create',
            payload: {
                question_id,
                answer_id,
                content,
                html,
                parentId,
                replyId,
            },
        });
    };

    const del = id => {
        return dispatch({
            type: 'answerComment/delete',
            payload: {
                question_id,
                answer_id,
                id,
            },
        });
    };

    const vote = (id, type) => {
        return dispatch({
            type: 'answerComment/vote',
            payload: {
                question_id,
                answer_id,
                id,
                type,
            },
        });
    };

    const child = (id, offset, limit) => {
        return dispatch({
            type: 'answerComment/child',
            payload: {
                question_id,
                answer_id,
                id,
                append: offset !== 0,
                offset,
                limit,
            },
        });
    };

    const detail = ({ id }) => {
        dispatch({
            type: 'answerComment/childDetail',
            payload: {
                question_id,
                answer_id,
                id,
                hasDetail: true,
                offset: 0,
                limit: 20,
            },
        });
        setModelVisible(true);
    };

    const childDetail = (offset, limit) => {
        const comment = answerComment['detail'];
        if (!comment) return;
        dispatch({
            type: 'answerComment/childDetail',
            payload: {
                question_id,
                answer_id,
                id: comment.detail.id,
                append: offset !== 0,
                offset,
                limit,
            },
        });
        setChildOffset(offset);
    };
    return (
        <React.Fragment>
            <Comment
                dataSource={answerComment[answer_id]}
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
                bodyStyle={{ padding: 0 }}
                visible={modelVisible}
                destroyOnClose={true}
                footer={null}
                centered={true}
                width={688}
                onCancel={() => setModelVisible(false)}
            >
                <CommentDetail
                    dataSource={answerComment['detail']}
                    onChange={childDetail}
                    onCreate={create}
                    onDelete={del}
                    onVote={vote}
                    offset={childOffset}
                    limit={limit}
                />
            </Modal>
        </React.Fragment>
    );
};
