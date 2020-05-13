import React, { useState, useEffect, useContext } from 'react';
import { Link, useDispatch, useSelector, useIntl } from 'umi';
import classNames from 'classnames';
import { Card, Button, Space } from 'antd';
import Container, { Layout } from '@/components/Container';
import { Article } from '@/components/Content';
import { MoreList } from '@/components/List';
import styles from './index.less';
import HotColumn from './components/HotColumn';
import HotTag from './components/HotTag';
import { EditOutlined } from '@ant-design/icons';
import { GoogleDefault } from '@/components/AdSense';
import DocumentMeta from 'react-document-meta';
import { RouteContext } from '@/context';

function ArticleIndex({ location: { query }, match: { params } }) {
    const [offset, setOffset] = useState(parseInt(query.offset || 0));
    const limit = parseInt(query.limit || 20);
    const type = params.type || 'default';

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.article ? state.article.list : null));
    const settings = useSelector(state => state.settings);
    if (dataSource && dataSource.data.length > 3) {
        if (dataSource.data[2].type !== 'AD') {
            dataSource.data.splice(2, 0, {
                type: 'AD',
            });
        }
    }
    useEffect(() => {
        dispatch({
            type: 'article/list',
            payload: {
                offset,
                limit,
                type,
            },
        });
    }, [offset, limit, type, dispatch]);

    const renderItem = item => {
        if (item.type === 'AD')
            return (
                <MoreList.Item>
                    <GoogleDefault />
                </MoreList.Item>
            );
        return (
            <MoreList.Item key={item.id}>
                <Article data={item} desc={true} authorSize="small" />
            </MoreList.Item>
        );
    };

    const renderList = () => {
        const me = useSelector(state => state.user.me);
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
                onChange={offset => setOffset(offset)}
            />
        );
    };
    const intl = useIntl();
    const { isMobile } = useContext(RouteContext);
    return (
        <DocumentMeta
            title={`${intl.formatMessage({ id: 'article.page.index' })} - ${settings.title}`}
            meta={{
                name: {
                    keywords: `${intl.formatMessage({ id: 'keywords' })},文章列表,热门文章`,
                    description: `itellyou文章列表${intl.formatMessage({ id: 'description' })}`,
                },
            }}
        >
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
                        <GoogleDefault />
                        <HotColumn />
                        <HotTag />
                    </Space>
                </Layout>
            </Container>
        </DocumentMeta>
    );
}
export default ArticleIndex;
