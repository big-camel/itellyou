import React, { useState, useEffect, useContext } from 'react';
import { Link, useDispatch, useSelector, useAccess, Helmet, Redirect } from 'umi';
import { Button, Card, Space, message } from 'antd';
import classNames from 'classnames';
import { RouteContext } from '@/context';
import Container, { Layout } from '@/components/Container';
import Editor from '@/components/Editor';
import Tag from '@/components/Tag';
import Timer from '@/components/Timer';
import Answer from './components/Answer';
import { Question } from '@/components/Content';
import Comment from './components/Comment';
import { ReportButton, CommentButton, EditButton, HistoryButton } from '@/components/Button';
import Loading from '@/components/Loading';
import Related from './components/Related';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Author from './components/Author';
import { GoogleDefault } from '@/components/AdSense';
import HistoryExtra from '../components/HistoryExtra';
import styles from './index.less';

function Detail({ match: { params } }) {
    const id = params.id ? parseInt(params.id) : null;
    const dispatch = useDispatch();
    const [historyViewer, setHistoryViewer] = useState(false);
    const question = useSelector((state) => state.question);
    const settings = useSelector((state) => state.settings);
    const me = useSelector((state) => state.user.me);
    const { detail, user_answer, response_status } = question;
    const { isMobile } = useContext(RouteContext);

    const answer_id = params.answer_id ? parseInt(params.answer_id) : null;
    const [editVisible, setEditVisible] = useState();
    const [commentVisible, setCommentVisible] = useState(false);

    const loadingState = useSelector((state) => state.loading);
    const loading = loadingState.effects['question/find'];

    const access = useAccess();

    useEffect(() => {
        const { draft, published, deleted } = user_answer || {};
        if (!answer_id && draft && !published && !deleted) {
            setEditVisible(true);
        }
    }, [answer_id, user_answer]);

    if (response_status && response_status.id === id && response_status > 200)
        return <Redirect to="/404" />;
    if (!detail || loading) return <Loading />;

    const { author, title, description, content, html, tags, use_star } = detail;
    const onRevoke = (answer_id) => {
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
                onClick={() => {
                    if (!me) return message.error('请登录后回答');
                    setEditVisible(!editVisible);
                }}
                type="primary"
                icon={<EditOutlined />}
            >
                {answer_id ? '编辑回答' : '写回答'}
            </Button>
        );
    };

    const renderReward = () => {
        const { reward_type, reward_value, adopted } = detail;
        if (reward_type === 'default') return null;
        let text = '积分';
        if (reward_type === 'cash') text = '元';
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
    const keywords = tags.map((tag) => tag.name) || [];
    keywords.push('itellyou');

    const renderOther = () => {
        return (
            <Space>
                <span className={styles['view']}>{detail.view}次浏览</span>
                <Timer time={detail.created_time} />
            </Space>
        );
    };
    return (
        <>
            <Helmet>
                <title>{`${title} - ${settings.title}`}</title>
                <meta name="author" content={author.name} />
                <meta name="keywords" content={keywords.join(',')} />
                <meta name="description" content={description} />
            </Helmet>
            <Container>
                <Layout>
                    <Space direction="vertical">
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
                                            <Tag
                                                key={id}
                                                id={id}
                                                href={`/tag/${id}`}
                                                title={name}
                                            />
                                        ))}
                                    {isMobile && renderOther()}
                                </Space>
                            </div>
                            {!isEmpty && (
                                <article>
                                    <Editor.Viewer
                                        genAnchor={false}
                                        content={content}
                                        html={html}
                                    />
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
                                    {!isMobile &&
                                        ((me && me.id === author.id) ||
                                            access.webQuestionPublicEdit) && (
                                            <EditButton type="link" href={`/question/${id}/edit`} />
                                        )}
                                    {!isMobile && (
                                        <HistoryButton onClick={() => setHistoryViewer(true)} />
                                    )}
                                </div>
                                {!isMobile && renderOther()}
                            </div>
                        </Card>
                        {renderReward()}
                        {editVisible && me && (
                            <Answer.Edit
                                hasHistory={
                                    user_answer && user_answer.draft === false ? true : false
                                }
                                id={
                                    user_answer && user_answer.draft === true
                                        ? user_answer.id
                                        : null
                                }
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
                    </Space>
                    <Space direction="vertical">
                        {detail && <Author {...detail.author} />}
                        <GoogleDefault />
                        <Related id={id} />
                    </Space>
                </Layout>
                {
                    <Comment
                        question_id={id}
                        visible={commentVisible}
                        onVisibleChange={setCommentVisible}
                    />
                }
                {historyViewer && (
                    <Editor.History
                        id={id}
                        type="question"
                        extra={(data) => <HistoryExtra {...data} />}
                        onCancel={() => setHistoryViewer(false)}
                    />
                )}
            </Container>
        </>
    );
}

Detail.getInitialProps = async ({ isServer, match, store, params }) => {
    const { dispatch, getState } = store;

    const state = getState();
    const { question, user } = state;
    if (
        question &&
        question.response_status &&
        question.response_status.id === id &&
        question.response_status.code > 200
    )
        return state;

    const id = parseInt(match.params.id || 0);
    const answer_id = match.params.answer_id ? parseInt(match.params.answer_id) : null;

    const response = await dispatch({
        type: 'question/find',
        payload: {
            id,
            ...params,
        },
    });

    if (!response || !response.result) return getState();

    if (user && user.me) {
        await dispatch({
            type: 'answer/findDraft',
            payload: {
                question_id: id,
                ...params,
            },
        });
    }

    await dispatch({
        type: 'question/view',
        payload: {
            id,
            ...params,
        },
    });

    await dispatch({
        type: 'answerReward/list',
        payload: {
            question_id: id,
            limit: 99999,
            ...params,
        },
    });
    await Answer.List.getInitialProps({ isServer, store, params, id });
    await Related.getInitialProps({ isServer, store, params, id });
    if (answer_id) {
        await Answer.View.getInitialProps({ isServer, store, params, question_id: id, answer_id });
    }

    if (isServer) return getState();
};
export default Detail;
