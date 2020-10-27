import React, { useState } from 'react';
import { List, Button, Modal } from 'antd';
import Timer from '@/components/Timer';
import Editor from '@/components/Editor';
import {
    SupportButton,
    OpposeButton,
    DeleteButton,
    ReplyButton,
    ReportButton,
} from '@/components/Button';
import Edit from './Edit';
import styles from './index.less';
import { UserAuthor } from '../User';

const { Item } = List;

function CommentItem({ item, onDelete, onCreate, onVote, onChild, onDetail }) {
    const [voting, setVoting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editVisible, setEditVisible] = useState(false);

    const doDelete = () => {
        Modal.confirm({
            title: '你确定要删除这条评论吗？',
            okText: '确定',
            cancelText: '取消',
            centered: true,
            onOk() {
                return new Promise((resolve) => {
                    if (onDelete) {
                        const result = onDelete(item.id);
                        if (typeof result === 'object') {
                            result.then(() => {
                                resolve();
                            });
                            return;
                        }
                    }
                    resolve();
                });
            },
            onCancel() {},
        });
    };

    const doCreate = (content, html) => {
        if (onCreate) {
            return new Promise((resolve) => {
                const parentId = item.parent_id != 0 ? item.parent_id : item.id;
                const result = onCreate(content, html, parentId, item.id);
                if (typeof result === 'object') {
                    result.then(() => {
                        resolve(() => {
                            setEditVisible(false);
                        });
                    });
                } else {
                    resolve(() => {
                        setEditVisible(false);
                    });
                }
            });
        }
    };

    const doVote = (type) => {
        if (voting) return;
        if (onVote) {
            setVoting(true);
            const result = onVote(item.id, type);
            if (typeof result === 'object') {
                result.then(() => {
                    setVoting(false);
                });
            } else {
                setVoting(false);
            }
        }
    };

    const doChild = () => {
        if (loading) return;
        if (onChild) {
            setLoading(true);
            const result = onChild(item.id);
            if (typeof result === 'object') {
                result.then(() => {
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        }
    };

    const doDetail = () => {
        if (onDetail) onDetail(item);
    };

    const renderMeta = () => {
        const { author, reply } = item;

        return (
            <Item.Meta
                className={styles['comment-meta']}
                title={
                    <div className={styles['comment-meta-title']}>
                        <UserAuthor
                            info={author}
                            extra={
                                reply && (
                                    <React.Fragment>
                                        <span className={styles['comment-meta-reply']}>回复</span>
                                        <UserAuthor info={reply.author} size="small" model="name" />
                                    </React.Fragment>
                                )
                            }
                            size="small"
                        />
                        <Timer
                            className={styles['comment-meta-time']}
                            time={
                                !item.updated_time || item.version === 1
                                    ? item.created_time
                                    : item.updated_time
                            }
                        />
                    </div>
                }
            />
        );
    };

    const renderAction = () => {
        return (
            <div className={styles['comment-action']}>
                <Button.Group>
                    <SupportButton
                        active={item.use_support}
                        disabled={!item.allow_support}
                        onClick={() => doVote('support')}
                        count={item.support_count}
                        size="small"
                    />
                    {item.allow_oppose && (
                        <OpposeButton
                            active={item.use_oppose}
                            onClick={() => doVote('oppose')}
                            size="small"
                        >
                            踩
                        </OpposeButton>
                    )}
                </Button.Group>
                {item.allow_reply && (
                    <ReplyButton onClick={() => setEditVisible(!editVisible)} size="small">
                        {editVisible && '取消'}回复
                    </ReplyButton>
                )}
                {!item.use_author && <ReportButton type="comment" size="small" />}
                {item.allow_delete && <DeleteButton onClick={doDelete} size="small" />}
            </div>
        );
    };

    const renderContent = () => {
        return (
            <div>
                <div className={styles['comment-content']}>
                    {
                        <Editor.Viewer
                            genAnchor={false}
                            content={item.deleted ? '评论已被删除' : item.content}
                            html={item.deleted ? '评论已被删除' : item.html}
                        />
                    }
                </div>
            </div>
        );
    };

    const renderChild = () => {
        const moreCount = item.child.length === 0 ? 0 : item.comment_count - item.child.length;
        if (item.child.length === 0) return;
        return (
            <ul className={styles['comment-child']}>
                {item.child.map((child) => {
                    return (
                        <CommentItem
                            key={child.id}
                            item={child}
                            onDelete={onDelete}
                            onCreate={onCreate}
                            onVote={onVote}
                            onChild={onChild}
                            onDetail={onDetail}
                        />
                    );
                })}
                {moreCount > 0 && item.comment_count <= 5 && (
                    <li className={`ant-list-item ${styles['comment-child-more']}`}>
                        <Button onClick={doChild} loading={loading} type="link">
                            展开其他{moreCount}条回复
                        </Button>
                    </li>
                )}
                {moreCount > 0 && item.comment_count > 5 && (
                    <li className={`ant-list-item ${styles['comment-child-more']}`}>
                        <Button onClick={doDetail} type="link">
                            查看全部{item.comment_count}条回复
                        </Button>
                    </li>
                )}
            </ul>
        );
    };

    return (
        <Item key={item.id} className={styles['comment-item']}>
            {renderMeta()}
            <div className={styles['comment-body']}>
                {renderContent()}
                {renderAction()}
                {editVisible && <Edit onSubmit={doCreate} />}
                {renderChild()}
            </div>
        </Item>
    );
}
export default CommentItem;
