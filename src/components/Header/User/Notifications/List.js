import React, { useState, useEffect } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import getVerb from '@/utils/operational/getVerb';
import { ScrollList } from '@/components/List';
import styles from './index.less';
import { UserActors } from '@/components/User';

export default ({ action, type, force }) => {
    action = action || 'default';
    type = type || 'default';
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.notifications.list[action]);

    useEffect(() => {
        dispatch({
            type: 'notifications/list',
            payload: {
                append: !force,
                action,
                type,
                offset,
                limit,
            },
        });
    }, [action, type, force, offset, limit, dispatch]);

    const renderColumn = (verb, { path, name }) => {
        return (
            <span>
                {verb}&nbsp;&nbsp;<Link to={`/${path}`}>{name}</Link>
            </span>
        );
    };

    const renderAnswer = (verb, { id, question: { title, ...question } }) => {
        return (
            <span>
                {verb}&nbsp;&nbsp;<Link to={`/question/${question.id}/answer/${id}`}>{title}</Link>
            </span>
        );
    };

    const renderCommon = (type, verb, { id, title }) => {
        return (
            <span>
                {verb}&nbsp;&nbsp;<Link to={`/${type}/${id}`}>{title}</Link>
            </span>
        );
    };

    const renderAnswerComment = (verb, { reply }) => {
        const {
            answer: {
                id,
                question: { title, ...question },
            },
        } = reply;
        return (
            <span>
                {verb}&nbsp;&nbsp;<Link to={`/question/${question.id}/answer/${id}`}>{title}</Link>
            </span>
        );
    };

    const renderCommentCommon = (type, verb, { content, reply, ...target }) => {
        const {
            [type]: { id, title },
        } = reply ? reply : target;
        return (
            <span>
                {verb}&nbsp;&nbsp;<Link to={`/${type}/${id}`}>{title}</Link>
            </span>
        );
    };

    const renderOperational = ({ action, type, target }) => {
        const verb = getVerb(action, type, '你的');
        switch (type) {
            case 'user':
                return verb;
            case 'column':
                return renderColumn(verb, target);
            case 'answer':
                if (action === 'comment') renderAnswerComment(verb, target);
                return renderAnswer(verb, target);
            case 'question':
            case 'article':
                if (action === 'comment') return renderCommentCommon(type, verb, target);
                return renderCommon(type, verb, target);
            case 'answer_comment':
                return renderAnswerComment(verb, target);
            case 'question_comment':
            case 'article_comment':
                return renderCommentCommon(type.split('_')[0], verb, target);
        }
    };

    const renderItem = ({ actors, merge_count, ...item }) => {
        return (
            <ScrollList.Item>
                <UserActors actors={actors} count={merge_count} useBrand={false} />
                &nbsp;&nbsp;
                {renderOperational(item)}
            </ScrollList.Item>
        );
    };

    return (
        <ScrollList
            className={styles['notifications-list']}
            offset={offset}
            limit={limit}
            dataSource={dataSource}
            renderItem={renderItem}
            onChange={offset => setOffset(offset)}
        />
    );
};
