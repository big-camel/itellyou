import React, { useState, useContext } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import { Space, message } from 'antd';
import classNames from 'classnames';
import Author from '@/components/User/Author';
import Editor from '@/components/Editor';
import { CommentButton, EditButton, ReportButton } from '@/components/Button';
import Timer from '@/components/Timer';
import Tag from '@/components/Tag';
import { RouteContext } from '@/context';
import { RewardButton } from '@/components/Reward';
import { PaidReadPurchase } from '@/components/PaidRead';
import { Vote, Favorite, Comment, Delete } from './Action';
import styles from '../index.less';

const Article = ({
    data: {
        id,
        title,
        description,
        custom_description,
        cover,
        content,
        html,
        author,
        column,
        comment_count,
        allow_edit,
        tags,
        paid_read,
        ...item
    },
    tag = false,
    view = false,
    authorSize,
    defaultComment = false,
    desc,
    headerClass,
    titleClass,
    onContentReady,
    ...props
}) => {
    const [fullVisible, setFullVisible] = useState(false);
    const [commentVisible, setCommentVisible] = useState(defaultComment);
    const allowEdit = !desc && allow_edit;

    description = (custom_description || description).trim();

    const dispatch = useDispatch();
    const rewardData = useSelector((state) => state.articleReward.list);

    const doPaidReadPay = () => {
        return dispatch({
            type: 'article/paidread',
            payload: {
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

    const renderContent = () => {
        if (desc && !fullVisible) {
            const paidReadHtml = paid_read
                ? `<span class='${styles['paid-read-link']}'>有付费内容，点击查看</span>`
                : '';
            return (
                <div className={styles['description']}>
                    <a target="_blank" href={`/article/${id}`}>
                        <div dangerouslySetInnerHTML={{ __html: description + paidReadHtml }} />
                    </a>
                </div>
            );
        }
        return (
            <div className={styles['content']}>
                {
                    <Editor.Viewer
                        key={id}
                        content={content}
                        html={html}
                        genAnchor={true}
                        onLoad={onContentReady}
                    />
                }
                <p className={styles['footer']}>
                    {!paid_read && (
                        <Link className={styles['time']} to={`/article/${id}`}>
                            {item.updated_time === null || item.version === 1 ? '发布于' : '更新于'}
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
                            href={`/article/${id}/edit`}
                        >
                            编辑{item.draft_version > item.version ? '（有未发布的草稿）' : ''}
                        </EditButton>
                    )}
                </p>
                <PaidReadPurchase data={paid_read} author={author} doPay={doPaidReadPay} />
                {!paid_read && (
                    <RewardButton
                        author={author}
                        dataType="article"
                        dataKey={id}
                        dataSource={rewardData}
                    />
                )}
            </div>
        );
    };

    const { isMobile } = useContext(RouteContext);
    return (
        <article
            className={classNames(styles['item'], { [styles['item-desc']]: desc }, props.className)}
        >
            <div className={classNames(styles['header'], headerClass)}>
                <h2 className={classNames(styles['title'], titleClass)}>
                    <a
                        target="_blank"
                        href={`/article/${id}`}
                        dangerouslySetInnerHTML={{ __html: title }}
                    />
                </h2>
                {(tag || view) && (
                    <Space className={styles['tags']}>
                        {tag &&
                            tags &&
                            tags.map(({ id, name }) => (
                                <Tag key={id} id={id} href={`/tag/${id}`} title={name} />
                            ))}
                        {view && <span className={styles['view']}>{item.view}次浏览</span>}
                    </Space>
                )}
                {author && (
                    <Space size="middle">
                        <Author className={styles['author']} info={author} size={authorSize} />
                        {desc && (
                            <Timer className={styles['item-desc-time']} time={item.created_time} />
                        )}
                    </Space>
                )}
            </div>
            <div className={classNames(styles['body'], { [styles['has-cover']]: cover && desc })}>
                {renderContent()}
                {cover && desc && (
                    <div className={styles['cover']} style={{ backgroundImage: `url(${cover})` }} />
                )}
            </div>
            <Space size="middle">
                <Vote id={id} {...item} size="small" />
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
                {!isMobile && !item.use_author && (
                    <ReportButton id={id} type="article" size="small" />
                )}
                {props.renderAction && props.renderAction()}
            </Space>
            {commentVisible && <Comment id={id} />}
        </article>
    );
};
Article.Vote = Vote;
Article.Comment = Comment;
Article.Favorite = Favorite;
Article.Delete = Delete;
export default Article;
