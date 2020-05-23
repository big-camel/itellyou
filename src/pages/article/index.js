import React, { useState, useContext } from 'react';
import { Link, useDispatch, useSelector, useIntl, Helmet } from 'umi';
import classNames from 'classnames';
import { Card, Button, Space } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { GoogleHorizontal, GoogleSquare } from '@/components/AdSense';
import { RouteContext } from '@/context';
import Container, { Layout } from '@/components/Container';
import { Article } from '@/components/Content';
import { MoreList } from '@/components/List';
import HotColumn from './components/HotColumn';
import HotTag from './components/HotTag';
import styles from './index.less';

const fetchList = (dispatch, offset, limit, type, parmas) => {
    return dispatch({
        type: 'article/list',
        payload: {
            append: offset > 0,
            offset,
            limit,
            type,
            ...parmas,
        },
    });
};

function ArticleIndex({ location: { query }, match: { params } }) {
    const [offset, setOffset] = useState(parseInt(query.offset || 0));
    const limit = parseInt(query.limit || 2);
    const type = params.type || 'default';
    const dataSource = useSelector(state => (state.article ? state.article.list : null));
    const me = useSelector(state => state.user.me);
    const dispatch = useDispatch();

    const settings = useSelector(state => state.settings);

    if (dataSource && dataSource.data.length > 3) {
        if (dataSource.data[2].type !== 'AD') {
            dataSource.data.splice(2, 0, {
                type: 'AD',
            });
        }
    }

    const renderItem = item => {
        if (item.type === 'AD')
            return (
                <MoreList.Item>
                    <GoogleHorizontal />
                </MoreList.Item>
            );
        return (
            <MoreList.Item key={item.id}>
                <Article data={item} desc={true} authorSize="small" />
            </MoreList.Item>
        );
    };

    const renderList = () => {
        if (!me && type === 'star')
            return (
                <p>
                    <Link to="/login">未登录</Link>
                </p>
            );
        return (
            <MoreList
                renderItem={renderItem}
                offset={offset}
                limit={limit}
                dataSource={dataSource}
                onChange={offset => {
                    setOffset(offset);
                    fetchList(dispatch, offset, limit, type);
                }}
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
                                {!isMobile && (
                                    <Button
                                        type="primary"
                                        href="/article/new"
                                        icon={<EditOutlined />}
                                    >
                                        发文章
                                    </Button>
                                )}
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
                    <Space direction="vertical" size="large">
                        <GoogleSquare />
                        <HotColumn />
                        <HotTag />
                    </Space>
                </Layout>
            </Container>
        </>
    );
}

ArticleIndex.getInitialProps = async ({ isServer, match, store, params }) => {
    const { dispatch, getState } = store;
    await fetchList(dispatch, 0, 20, match.params.type || 'default', params);
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
