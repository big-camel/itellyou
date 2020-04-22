import React, { useState, useEffect } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import { Button, Card, Space } from 'antd';
import classNames from 'classnames';
import Container, { Layout } from '@/components/Container';
import Editor from '@/components/Editor';
import UserTag from '@/components/Tag';
import Timer from '@/components/Timer';
import styles from './index.less';
import Answer from './components/Answer';
import { Question } from '@/components/Content';
import Comment from './components/Comment';
import { ReportButton, CommentButton } from '@/components/Button';
import Loading from '@/components/Loading';
import Related from './components/Related';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Author from './components/Author';

function Detail({ match: { params } }) {
    const id = params.id ? parseInt(params.id) : null;
    const dispatch = useDispatch();
    const question = useSelector(state => state.question);
    const settings = useSelector(state => state.settings);
    const { detail, user_answer } = question;
    useEffect(() => {
        dispatch({
            type: 'question/view',
            payload: {
                id,
            },
        });
        dispatch({
            type: 'question/find',
            payload: {
                id,
            },
        });
        dispatch({
            type: 'answer/findDraft',
            payload: {
                question_id: id,
            },
        });
    }, [dispatch, id]);
    const answer_id = params.answer_id ? parseInt(params.answer_id) : null;
    const [editVisible, setEditVisible] = useState();
    const [commentVisible, setCommentVisible] = useState(false);

    useEffect(() => {
        if (
            !answer_id &&
            user_answer &&
            user_answer.draft &&
            !user_answer.published &&
            !user_answer.deleted
        ) {
            setEditVisible(visible => {
                if (!visible) return true;
                return visible;
            });
        }
    }, [answer_id, user_answer]);

    if (!detail) return <Loading />;
    const { author, title, description, content, tags, use_star } = detail;
    const onRevoke = answer_id => {
        dispatch({
            type: 'answer/revoke',
            payload: {
                question_id: id,
                id: answer_id,
            },
        });
    };

    const renderStatusButton = () => {
        if (!detail) return;
        if (user_answer && user_answer.published) {
            if (user_answer.deleted)
                return (
                    <Button
                        onClick={() => onRevoke(user_answer.id)}
                        type="primary"
                        icon={<DeleteOutlined />}
                    >
                        撤销删除
                    </Button>
                );
            return (
                <Button type="primary" href={`/question/${id}/answer/${user_answer.id}`}>
                    查看回答
                </Button>
            );
        }
        return (
            <Button
                onClick={() => setEditVisible(!editVisible)}
                type="primary"
                icon={<EditOutlined />}
            >
                {answer_id ? '编辑回答' : '写回答'}
            </Button>
        );
    };

    const renderReward = () => {
        const { reward_type, reward_value, adopted } = detail;
        if (reward_type === 0) return null;
        let text = '积分';
        if (reward_type === 2) text = '元';
        return (
            <div className={styles['reward-view']}>
                <Card hoverable={true}>
                    {adopted && (
                        <span>
                            已采纳，回答者已获得<strong>{reward_value}</strong>
                            {text}
                        </span>
                    )}
                    {!adopted && (
                        <span>
                            已悬赏<strong>{reward_value}</strong>
                            {text}，回答被采纳即可获得！
                        </span>
                    )}
                </Card>
            </div>
        );
    };

    const isEmpty = Editor.Utils.isBlank(content);
    const keywords = tags.map(tag => tag.name) || [];
    keywords.push('itellyou');
    return (
        <Container
            title={`${title} - ${settings.title}`}
            metas={{
                author: author.name,
                keywords: keywords.join(','),
                description,
            }}
        >
            <Layout>
                <React.Fragment>
                    <Card>
                        <div
                            className={classNames(styles.header, {
                                [styles['no-border']]: isEmpty,
                            })}
                        >
                            <h1 className={styles.title}>{title}</h1>
                            <Space>
                                {tags &&
                                    tags.map(({ id, name }) => (
                                        <UserTag key={id} id={id} title={name} />
                                    ))}
                            </Space>
                        </div>
                        {!isEmpty && (
                            <article>
                                <Editor.Viewer content={content} />
                            </article>
                        )}
                        <div className={styles['footer']}>
                            <div className={styles['actions']}>
                                <Question.Favorite
                                    id={id}
                                    use_star={use_star}
                                    allow_star={true}
                                    type="primary"
                                    icon={null}
                                />
                                {renderStatusButton()}
                                <CommentButton onClick={() => setCommentVisible(true)}>
                                    {detail.comments > 0 ? `${detail.comments} 条评论` : '评论'}
                                </CommentButton>
                                <ReportButton />
                            </div>
                            <div className={styles['other-info']}>
                                <span className={styles['view']}>{detail.view}次浏览</span>
                                <Timer time={detail.created_time} />
                            </div>
                        </div>
                    </Card>
                    {renderReward()}
                    {editVisible && (
                        <Answer.Edit
                            hasHistory={user_answer && user_answer.draft === false ? true : false}
                            id={user_answer && user_answer.draft === true ? user_answer.id : null}
                            onCancel={() => setEditVisible(false)}
                        />
                    )}
                    {answer_id && (
                        <React.Fragment>
                            <div className={styles['view-all']}>
                                <Card>
                                    <Link to={`/question/${detail.id}`}>
                                        查看全部 {detail.answers} 个回答
                                    </Link>
                                </Card>
                            </div>
                            <Answer.View question_id={id} answer_id={answer_id} />
                        </React.Fragment>
                    )}
                    {
                        <Answer.List
                            className={styles['answer-list']}
                            title={answer_id ? '更多回答' : null}
                            question_id={id}
                            exclude={[answer_id]}
                        />
                    }
                    {
                        <Comment
                            question_id={id}
                            visible={commentVisible}
                            onVisibleChange={setCommentVisible}
                        />
                    }
                </React.Fragment>
                <>
                    {detail && <Author {...detail.author} />}
                    <Related id={id} />
                </>
            </Layout>
        </Container>
    );
}

export default Detail;
