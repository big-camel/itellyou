import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { Space, message } from 'antd';
import { history, Link, useDispatch, useSelector } from 'umi';
import Editor from '@/components/Editor';
import Timer from '@/components/Timer';
import { RouteContext } from '@/context';
import { RewardButton } from '@/components/Button';
import { PaidReadPurchase } from '@/components/PaidRead';
import Author from '@/components/User/Author';
import { CommentButton, EditButton, ReportButton, HistoryButton } from '@/components/Button';
import { Vote, Favorite, Comment, Adopt, Delete, Edit } from './Action';
import styles from '../index.less';

const Answer = React.forwardRef(
    (
        {
            data: {
                id,
                cover,
                question_id,
                description,
                author,
                column,
                comment_count,
                use_author,
                allow_adopt,
                adopted,
                allow_delete,
                allow_edit,
                paid_read,
                ...item
            },
            authorSize,
            desc,
            action = true,
            readFull = true,
        },
        ref,
    ) => {
        const [commentVisible, setCommentVisible] = useState(false);
        const [editVisible, setEditVisible] = useState(false);
        const [fullVisible, setFullVisible] = useState(false);
        const [historyViewer, setHistoryViewer] = useState(false);
        const dispatch = useDispatch();
        const rewardList = useSelector((state) => state.answerReward.list);
        const rewardData = (rewardList ? rewardList.data : []).filter(
            ({ data_key }) => data_key === id,
        );

        const doPaidReadPay = () => {
            return dispatch({
                type: 'answer/paidread',
                payload: {
                    question_id,
                    id,
                },
            }).then((res) => {
                if (res.result) {
                    message.success('支付成功', 1, () => {
                        window.location.reload();
                    });
                } else {
                    message.error(res.message);
                }
            });
        };

        const onEditCancel = () => {
            setEditVisible(false);
        };

        const onEditSubmit = async (doc) => {
            setEditVisible(false);
            if (doc) {
                await dispatch({
                    type: 'answer/updateDetail',
                    payload: doc,
                });
                await dispatch({
                    type: 'answer/updateListItem',
                    payload: doc,
                });
                history.push(`/question/${question_id}/answer/${doc.id}`);
                //window.location.href = `/question/${question_id}/answer/${doc.id}`;
            } else {
                window.location.reload();
            }
        };

        const renderEdit = () => {
            return (
                <div style={{ marginTop: 10 }}>
                    <Edit id={id} onCancel={onEditCancel} onSubmit={onEditSubmit} />
                </div>
            );
        };

        const allowEdit = !desc && allow_edit;

        const renderContent = () => {
            if (desc && !fullVisible) {
                description = description.trim();
                const paidReadHtml = paid_read
                    ? `<span class='${styles['paid-read-link']}'>有付费内容，点击查看</span>`
                    : '';
                return (
                    <div className={styles['description']}>
                        <Link to={`/question/${question_id}/answer/${id}`}>
                            <div dangerouslySetInnerHTML={{ __html: description + paidReadHtml }} />
                        </Link>
                    </div>
                );
            }
            return (
                <div className={styles['content']}>
                    <div>
                        {
                            <Editor.Viewer
                                key={id}
                                content={item.content}
                                html={item.html}
                                genAnchor={false}
                            />
                        }
                    </div>

                    <p className={styles['footer']}>
                        {!paid_read && (
                            <Link
                                className={styles['time']}
                                to={`/question/${question_id}/answer/${id}`}
                            >
                                {item.updated_time === null || item.version === 1
                                    ? '发布于'
                                    : '更新于'}
                                <Timer
                                    time={
                                        item.updated_time === null || item.version === 1
                                            ? item.created_time
                                            : item.updated_time
                                    }
                                />
                            </Link>
                        )}
                        {allowEdit && !paid_read && (
                            <EditButton
                                className={styles['edit']}
                                type="link"
                                onClick={() => setEditVisible(!editVisible)}
                            >
                                编辑{item.draft_version > item.version ? '（有未发布的草稿）' : ''}
                            </EditButton>
                        )}
                    </p>
                    <PaidReadPurchase data={paid_read} author={author} doPay={doPaidReadPay} />
                    {!paid_read && (
                        <RewardButton
                            author={author}
                            dataType="answer"
                            dataKey={id}
                            dataSource={{ data: rewardData }}
                        />
                    )}
                </div>
            );
        };
        const { isMobile } = useContext(RouteContext);
        const renderAction = () => {
            return (
                <Space size="middle">
                    {(allow_adopt || adopted) && (
                        <Adopt
                            id={id}
                            question_id={question_id}
                            allow_adopt={allow_adopt}
                            adopted={adopted}
                            size="small"
                        />
                    )}
                    <Vote id={id} question_id={question_id} {...item} size="small" />
                    <CommentButton onClick={() => setCommentVisible(!commentVisible)} size="small">
                        {commentVisible
                            ? '收起评论'
                            : comment_count === 0
                            ? '添加评论'
                            : `${comment_count} 条评论`}
                    </CommentButton>
                    {!isMobile && item.allow_star && (
                        <Favorite
                            id={id}
                            use_star={item.use_star}
                            allow_star={item.allow_star}
                            size="small"
                        />
                    )}
                    {!isMobile && !allowEdit && <ReportButton id={id} type="answer" size="small" />}
                    {!isMobile && allow_delete && (
                        <Delete
                            id={id}
                            question_id={question_id}
                            allow_delete={allow_delete}
                            callback={() => history.push(`/question/${question_id}`)}
                            size="small"
                        />
                    )}
                    {!isMobile && allowEdit && (
                        <EditButton onClick={() => setEditVisible(!editVisible)} size="small" />
                    )}
                    {!isMobile && !desc && !paid_read && (
                        <HistoryButton onClick={() => setHistoryViewer(true)} size="small" />
                    )}
                </Space>
            );
        };

        const renderBody = () => {
            return (
                <div>
                    <div
                        className={classNames(styles['body'], {
                            [styles['has-cover']]: cover && desc,
                        })}
                    >
                        {renderContent()}
                        {cover && desc && (
                            <div
                                className={styles['cover']}
                                style={{ backgroundImage: `url(${cover})` }}
                            />
                        )}
                    </div>
                    {action && renderAction()}
                    {commentVisible && <Comment question_id={question_id} answer_id={id} />}
                </div>
            );
        };

        return (
            <div className={styles['item']} ref={ref}>
                {author && (
                    <div className={styles['header']}>
                        <Author
                            className={styles['author']}
                            info={{ ...author, use_author }}
                            size={authorSize}
                        />
                    </div>
                )}

                {editVisible && renderEdit()}
                {!editVisible && renderBody()}
                {historyViewer && (
                    <Editor.History
                        id={id}
                        type={`question/${question_id}/answer`}
                        onCancel={() => setHistoryViewer(false)}
                    />
                )}
            </div>
        );
    },
);
Answer.Vote = Vote;
Answer.Favorite = Favorite;
Answer.Comment = Comment;
Answer.Adopt = Adopt;
Answer.Delete = Delete;
Answer.Edit = Edit;
export default Answer;
