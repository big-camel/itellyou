import React, { useState, useContext } from 'react';
import { Link, useSelector, useIntl, Helmet } from 'umi';
import classNames from 'classnames';
import { Card, Space, Empty } from 'antd';
import { GoogleDefault } from '@/components/AdSense';
import { RouteContext } from '@/context';
import { getPageQuery } from '@/utils';
import Container, { Layout } from '@/components/Container';
import { Article } from '@/components/Content';
import { PageList } from '@/components/List';
import HotColumn from './components/HotColumn';
import HotTag from './components/HotTag';
import styles from './index.less';

const fetchList = (dispatch, offset, limit, type, parmas) => {
    return dispatch({
        type: 'article/list',
        payload: {
            append: false,
            offset,
            limit,
            type,
            ...parmas,
        },
    });
};

function ArticleIndex({ location: { query }, match: { params } }) {
    const limit = parseInt(query.limit || 20);
    const page = query.page ? (parseInt(query.page) - 1) * limit : undefined;

    const [offset, setOffset] = useState(parseInt(query.offset || page || 0));
    const type = params.type || 'default';
    const dataSource = useSelector((state) => (state.article ? state.article.list : null));
    const me = useSelector((state) => state.user.me);

    const settings = useSelector((state) => state.settings);

    if (dataSource && dataSource.data && dataSource.data.length > 3) {
        if (dataSource.data[2].type !== 'AD') {
            dataSource.data.splice(2, 0, {
                type: 'AD',
            });
        }
    }

    const renderItem = (item) => {
        if (item.type === 'AD')
            return (
                <PageList.Item>
                    <GoogleDefault type="rectangle" />
                </PageList.Item>
            );
        return (
            <PageList.Item key={item.id}>
                <Article data={item} desc={true} authorSize="small" />
            </PageList.Item>
        );
    };

    const renderList = () => {
        if (!me && type === 'star')
            return (
                <Empty
                    description={
                        <p>
                            请先<Link to="/login">登录</Link>
                        </p>
                    }
                />
            );
        return (
            <PageList
                renderItem={renderItem}
                offset={offset}
                limit={limit}
                dataSource={dataSource}
                pageLink={(current) =>
                    current === 1 ? '/article' : `/article?page=${current}&type=${type}`
                }
            />
        );
    };
    const intl = useIntl();
    const { isMobile } = useContext(RouteContext);
    return (
        <>
            <Helmet>
                <title>{`${intl.formatMessage({ id: 'article.page.index' })} - ${
                    settings.title
                }`}</title>
                <meta
                    name="keywords"
                    content={`${intl.formatMessage({ id: 'keywords' })},文章列表,热门文章`}
                />
                <meta
                    name="description"
                    content={`itellyou文章列表${intl.formatMessage({ id: 'description' })}`}
                />
            </Helmet>
            <Container>
                <Layout>
                    <Card
                        title={
                            <div className={styles['header']}>
                                <div className={styles['type-list']}>
                                    <Link
                                        className={classNames({
                                            [styles['active']]: type === '' || type === 'default',
                                        })}
                                        to="/article"
                                    >
                                        最新
                                    </Link>
                                    <Link
                                        className={classNames({
                                            [styles['active']]: type === 'hot',
                                        })}
                                        to="/article/hot"
                                    >
                                        热门
                                    </Link>
                                    <Link
                                        className={classNames({
                                            [styles['active']]: type === 'star',
                                        })}
                                        to="/article/star"
                                    >
                                        我的关注
                                    </Link>
                                </div>
                            </div>
                        }
                    >
                        {renderList()}
                    </Card>
                    <Space direction="vertical">
                        <HotColumn />
                        <GoogleDefault type="square" />
                        <HotTag />
                        <GoogleDefault type="square" />
                    </Space>
                </Layout>
            </Container>
        </>
    );
}

ArticleIndex.getInitialProps = async ({ isServer, match, store, params, history }) => {
    const { dispatch, getState } = store;
    const limit = 20;
    const { location } = history || {};
    let query = (location || {}).query;
    if (!isServer) {
        query = getPageQuery();
    }
    const page = query.page ? (parseInt(query.page) - 1) * limit : 0;
    await fetchList(dispatch, page, limit, match.params.type || 'default', params);
    await dispatch({
        type: 'column/list',
        payload: {
            type: 'hot',
            offset: 0,
            limit: 5,
            ...params,
        },
    });
    await dispatch({
        type: 'tag/list',
        payload: {
            type: 'hot',
            offset: 0,
            limit: 10,
            ...params,
        },
    });

    if (isServer) return getState();
};
export default ArticleIndex;
