import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import { useSelector, Helmet, Redirect, useDispatch } from 'umi';
import { Space } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { LikeOutlined, LikeFilled } from '@ant-design/icons';
import { RouteContext } from '@/context';
import List from '@/components/List';
import Loading from '@/components/Loading';
import { Article } from '@/components/Content';
import Editor from '@/components/Editor';
import { GoogleHorizontal } from '@/components/AdSense';
import { EditButton, HistoryButton, RewardButton, ShareButton } from '@/components/Button';
import { HeaderContainer, HeaderLogo } from '@/components/Header';
import { getScrollTop, scrollToElement } from '@/utils';
import { ColumnDetail } from '@/components/Column';
import HistoryExtra from '../components/HistoryExtra';
import Related from './Related';
import styles from './index.less';

function Detail({ match: { params } }) {
    const id = parseInt(params.id || 0);

    const [viewMode, setViewMode] = useState('');
    const [scrollVisible, setScrollVisible] = useState(false);
    const [contentData, setContentData] = useState({});
    const [historyViewer, setHistoryViewer] = useState(false);
    const commentViewRef = useRef();
    const { detail, response_status } = useSelector((state) => state.article);
    const column = useSelector((state) =>
        detail && detail.column ? state.column.detail[detail.column.id] : null,
    );
    const settings = useSelector((state) => state.settings);
    const { isMobile } = useContext(RouteContext);
    const loadingState = useSelector((state) => state.loading);
    const loading = loadingState.effects['article/find'];

    const dispatch = useDispatch();

    const renderAction = useCallback(() => {
        if (!isMobile && detail && !detail.paid_read)
            return <HistoryButton onClick={() => setHistoryViewer(true)} />;
        return null;
    }, [isMobile, detail]);

    const handleScroll = useCallback(() => {
        const min = 80;
        const top = getScrollTop();
        setScrollVisible(top > min);
    }, []);

    useEffect(() => {
        dispatch({
            type: 'article/view',
            payload: {
                id,
            },
        });
    }, [dispatch, id]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    if (response_status && response_status.id === id && response_status.code > 200)
        return <Redirect to="/404" />;

    if (!detail || loading) return <Loading />;

    const onContentReady = (view, config) => {
        setContentData({
            view,
            config,
        });
        const hasOutline = (config || {}).outline && config.outline.length > 0;

        setViewMode(hasOutline ? 'middle' : '');

        if (window.location.hash) {
            const scrollId = window.location.hash.substr(1);
            scrollToElement(document.getElementById(scrollId));
        }
    };

    const { title, tags, author, description, support, use_support } = detail;

    const keywords = tags.map((tag) => tag.name) || [];
    keywords.push('itellyou');
    return (
        <>
            <Helmet>
                <title>{`${title} - ${settings.title}`}</title>
                <meta name="author" content={author.name} />
                <meta name="keywords" content={keywords.join(',')} />
                <meta name="description" content={description} />
            </Helmet>
            <HeaderContainer
                isMobile={isMobile}
                mode={scrollVisible ? viewMode : ''}
                className={styles['header-top']}
                after={
                    <Space size="large">
                        <EditButton type="primary" href="/article/new">
                            写文章
                        </EditButton>
                    </Space>
                }
            >
                <HeaderLogo />
            </HeaderContainer>
            <div className={styles['main-wrapper']}>
                <Space direction="vertical" size="large" className={styles['main-body']}>
                    <div className={styles['article-view']}>
                        <Article
                            tag={true}
                            className={styles['article']}
                            data={detail}
                            view={true}
                            comment={{
                                onClick: (element) =>
                                    scrollToElement(element, commentViewRef.current),
                            }}
                            headerClass={styles['header']}
                            titleClass={styles['title']}
                            onContentReady={onContentReady}
                            renderAction={renderAction}
                        />
                        {historyViewer && (
                            <Editor.History
                                id={id}
                                type="article"
                                extra={(data) => <HistoryExtra {...data} />}
                                onCancel={() => setHistoryViewer(false)}
                            />
                        )}
                    </div>
                    {column && (
                        <div className={styles['column']}>
                            <List
                                renderHeader={() => <h3>文章发表在以下专栏</h3>}
                                dataSource={[column]}
                                renderItem={(info) => {
                                    return (
                                        <List.Item key={info.id}>
                                            <ColumnDetail info={info} type="line" />
                                        </List.Item>
                                    );
                                }}
                            />
                        </div>
                    )}
                    <GoogleHorizontal />
                    <div ref={commentViewRef}>
                        <Article.Comment id={id} />
                    </div>
                    <Related id={id} />
                </Space>
                {!isMobile && (
                    <QueueAnim animConfig={[{ opacity: [1, 0] }]} className={styles['side']}>
                        {scrollVisible ? (
                            <Space key="side" size="large" direction="vertical">
                                <div className={styles['like-action']}>
                                    <Article.Vote
                                        id={id}
                                        {...detail}
                                        allow_oppose={false}
                                        text={use_support ? `已点赞 ${support}` : `点赞 ${support}`}
                                        icon={use_support ? <LikeFilled /> : <LikeOutlined />}
                                        loading={false}
                                    />
                                </div>
                                <RewardButton block simple author={detail.author}>
                                    打赏
                                </RewardButton>
                                <ShareButton block>分享</ShareButton>
                            </Space>
                        ) : null}
                    </QueueAnim>
                )}
                {!isMobile && (
                    <QueueAnim animConfig={[{ opacity: [1, 0] }]} className={styles['outline']}>
                        {scrollVisible ? (
                            <Editor.Outline
                                key="outline"
                                className={styles['outline-view']}
                                {...contentData}
                            />
                        ) : null}
                    </QueueAnim>
                )}
            </div>
        </>
    );
}

Detail.getInitialProps = async ({ isServer, match, store, params }) => {
    const { dispatch, getState } = store;
    const id = parseInt(match.params.id || 0);
    const state = getState();
    const { article } = state;
    if (
        article &&
        article.response_status &&
        article.response_status.id === id &&
        article.response_status.code > 200
    )
        return state;

    const response = await dispatch({
        type: 'article/find',
        payload: {
            id,
            ...params,
        },
    });

    if (!response || !response.result) return getState();
    if (isServer) {
        await dispatch({
            type: 'articleComment/root',
            payload: {
                articleId: id,
                offset: 0,
                limit: 20,
                ...params,
            },
        });
    }

    await dispatch({
        type: 'articleReward/list',
        payload: {
            id,
            append: false,
            limit: 99999,
            ...params,
        },
    });
    await dispatch({
        type: 'article/related',
        payload: {
            offset: 0,
            limit: 10,
            id,
            ...params,
        },
    });
    if (isServer) return getState();
};
export default Detail;
