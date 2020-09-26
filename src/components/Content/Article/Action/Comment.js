import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import Comment, { Detail as CommentDetail } from '@/components/Comment';
import { Modal } from 'antd';

function ArticleComment({ id }) {
    const articleId = id;
    const [modelVisible, setModelVisible] = useState(false);

    const dispatch = useDispatch();
    const comment = useSelector((state) => state.articleComment[id]) || {};
    const [offset, setOffset] = useState(0);
    const [childOffset, setChildOffset] = useState(0);
    const limit = 20;

    const loadingState = useSelector((state) => state.loading);
    const loading = loadingState.effects['articleComment/root'];

    const load = useCallback(
        (offset, limit) => {
            dispatch({
                type: 'articleComment/root',
                payload: {
                    articleId,
                    offset,
                    limit,
                },
            });
            setOffset(offset);
        },
        [articleId, dispatch],
    );

    useEffect(() => {
        if (!comment.list && !loading) {
            load(0, limit);
        }
    }, [comment, loading, load, limit]);

    const create = (content, html, parentId, replyId) => {
        return dispatch({
            type: 'articleComment/create',
            payload: {
                articleId,
                content,
                html,
                parentId,
                replyId,
            },
        });
    };

    const del = (id) => {
        return dispatch({
            type: 'articleComment/delete',
            payload: {
                articleId,
                id,
            },
        });
    };

    const vote = (id, type) => {
        return dispatch({
            type: 'articleComment/vote',
            payload: {
                articleId,
                id,
                type,
            },
        });
    };

    const child = (id, offset, limit) => {
        return dispatch({
            type: 'articleComment/child',
            payload: {
                articleId,
                id,
                append: offset !== 0,
                offset,
                limit,
            },
        });
    };

    const detail = ({ id }) => {
        dispatch({
            type: 'articleComment/childDetail',
            payload: {
                articleId,
                id,
                hasDetail: true,
                offset: 0,
                limit: 20,
            },
        });
        setModelVisible(true);
    };

    const childDetail = (offset, limit) => {
        const detailComment = comment['detail'];
        if (!detailComment) return;
        dispatch({
            type: 'articleComment/childDetail',
            payload: {
                articleId,
                id: detailComment.detail.id,
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
                dataSource={comment.list}
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
                    dataSource={comment.detail}
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
}
export default ArticleComment;
