import React, { useState } from 'react';
import { Link } from 'umi';
import classNames from 'classnames';
import Author from '@/components/User/Author';
import Editor from '@/components/Editor';
import { CommentButton, EditButton, ReportButton } from '@/components/Button';
import { Vote, Favorite, Comment, Delete } from './Action';
import styles from '../index.less';
import { Space } from 'antd';
import Timer from '@/components/Timer';
import Tag from '@/components/Tag';
import { RewardButton } from '@/components/Reward';

const Article = ({
    data: {
        id,
        title,
        description,
        custom_description,
        cover,
        content,
        author,
        column,
        comment_count,
        allow_edit,
        tags,
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
    const hasMore = description.length > 3 && description.substr(description.length - 3) === '...';
    const renderContent = () => {
        if (desc && !fullVisible) {
            return (
                <div className={styles['description']}>
                    <Link to={`/article/${id}`}>
                        <span dangerouslySetInnerHTML={{ __html: description }} />
                        {/**hasMore && (
                            <Button
                                className={styles['read-more']}
                                type="link"
                                onClick={() => setFullVisible(true)}
                            >
                                阅读全文
                            </Button>)**/}
                    </Link>
                </div>
            );
        }
        return (
            <div className={styles['content']}>
                {
                    <Editor.Viewer
                        key={id}
                        content={content}
                        genAnchor={true}
                        onLoad={onContentReady}
                    />
                }
                <p className={styles['footer']}>
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
                    {allowEdit && (
                        <EditButton
                            className={styles['edit']}
                            type="link"
                            href={`/article/${id}/edit`}
                        >
                            编辑{item.draft_version > item.version ? '（有未发布的草稿）' : ''}
                        </EditButton>
                    )}
                </p>
                <RewardButton author={author} dataType="article" dataKey={id} />
            </div>
        );
    };
    return (
        <div className={classNames(styles['item'], props.className)}>
            <div className={classNames(styles['header'], headerClass)}>
                <h2 className={classNames(styles['title'], titleClass)}>
                    <Link to={`/article/${id}`} dangerouslySetInnerHTML={{ __html: title }} />
                </h2>
                <Space className={styles['tags']}>
                    {tag &&
                        tags &&
                        tags.map(({ id, name }) => (
                            <Tag
                                className={styles['tag']}
                                key={id}
                                id={id}
                                href={`/tag/${id}`}
                                title={name}
                            />
                        ))}
                    {view && <span className={styles['view']}>{item.view}次浏览</span>}
                </Space>
                {author && <Author className={styles['author']} info={author} size={authorSize} />}
            </div>
            <div className={classNames(styles['body'], { [styles['has-cover']]: cover })}>
                {renderContent()}
                {cover && (
                    <div className={styles['cover']} style={{ backgroundImage: `url(${cover})` }} />
                )}
            </div>
            <Space size="large">
                <Vote id={id} {...item} />
                <CommentButton onClick={() => setCommentVisible(!commentVisible)}>
                    {comment_count === 0 ? '添加评论' : `${comment_count} 条评论`}
                </CommentButton>
                {item.allow_star && (
                    <Favorite id={id} use_star={item.use_star} allow_star={item.allow_star} />
                )}
                {!item.use_author && <ReportButton id={id} type="article" />}
            </Space>
            <div>{commentVisible && <Comment id={id} />}</div>
        </div>
    );
};
Article.Vote = Vote;
Article.Comment = Comment;
Article.Favorite = Favorite;
Article.Delete = Delete;
export default Article;
