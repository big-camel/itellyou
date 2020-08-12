import React from 'react';
import { Link } from 'umi';
import classNames from 'classnames';
import styles from '../../index.less';
import { Space } from 'antd';
import Editor from '@/components/Editor';

export default ({ action, type, target }) => {
    const renderColumn = ({ name, path }) => {
        return (
            <Space className={styles['op-body']}>
                <Link className={styles['target']} to={`/${path}`}>
                    {name}
                </Link>
            </Space>
        );
    };

    const renderAnswer = (item) => {
        const {
            id,
            description,
            question: { title, ...question },
        } = item;
        return (
            <div className={classNames(styles['op-body'], styles['op-block'])}>
                <Link className={styles['target']} to={`/question/${question.id}/answer/${id}`}>
                    {title}
                </Link>
                {description && description !== '' && (
                    <div className={styles['op-block-content']}>{description}</div>
                )}
            </div>
        );
    };

    const renderCommon = (type, { id, title, description }) => {
        return (
            <div className={classNames(styles['op-body'], styles['op-block'])}>
                <Link className={styles['target']} to={`/${type}/${id}`}>
                    {title}
                </Link>
                {description && description !== '' && (
                    <div className={styles['op-block-content']}>{description}</div>
                )}
            </div>
        );
    };

    const renderAnswerComment = ({ content, reply, ...target }) => {
        const {
            answer: {
                id,
                question: { title, ...question },
            },
        } = reply ? reply : target;
        return (
            <div className={classNames(styles['op-body'], styles['op-block'])}>
                <Link className={styles['target']} to={`/question${question.id}/answer/${id}`}>
                    {title}
                </Link>
                {!Editor.Utils.isBlank(content) && (
                    <div className={styles['op-block-content']}>
                        {<Editor.Viewer content={content} />}
                    </div>
                )}
            </div>
        );
    };

    const renderCommentCommon = (type, { content, reply, ...target }) => {
        const {
            [type]: { id, title },
        } = reply ? reply : target;
        return (
            <div className={classNames(styles['op-body'], styles['op-block'])}>
                <Link className={styles['target']} to={`/${type}/${id}`}>
                    {title}
                </Link>
                {!Editor.Utils.isBlank(content) && (
                    <div className={styles['op-block-content']}>
                        {<Editor.Viewer content={content} />}
                        {reply && (
                            <div className={styles['op-block-content-inside']}>
                                {<Editor.Viewer content={reply.content} />}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderOperational = () => {
        switch (type) {
            case 'user':
                return null;
            case 'column':
                return renderColumn(target);
            case 'answer':
                if (action === 'comment') return renderAnswerComment(target);
                return renderAnswer(target);
            case 'question':
            case 'article':
            case 'software':
                if (action === 'comment') return renderCommentCommon(type, target);
                return renderCommon(type, target);
            case 'answer_comment':
                return renderAnswerComment(target);
            case 'question_comment':
            case 'article_comment':
            case 'software_comment':
                return renderCommentCommon(type.split('_')[0], target);
            default:
                return null;
        }
    };

    return renderOperational();
};
