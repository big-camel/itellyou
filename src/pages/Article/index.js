import React, { useState, useEffect } from 'react';
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
import { GoogleSquare } from '@/components/AdSense';
import DocumentMeta from 'react-document-meta';

function ArticleIndex({ location: { query }, match: { params } }) {
    const [offset, setOffset] = useState(parseInt(query.offset || 0));
    const limit = parseInt(query.limit || 20);
    const type = params.type || 'default';

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.article ? state.article.list : null));
    const settings = useSelector(state => state.settings);
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
        return (
            <MoreList.Item key={item.id}>
                <Article data={item} desc={true} authorSize="small" />
            </MoreList.Item>
        );
    };
    const intl = useIntl();
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
                                <Button type="primary" href="/article/new" icon={<EditOutlined />}>
                                    发文章
                                </Button>
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
                        <MoreList
                            renderItem={renderItem}
                            offset={offset}
                            limit={limit}
                            dataSource={dataSource}
                            onChange={offset => setOffset(offset)}
                        />
                    </Card>
                    <Space direction="vertical" size="large">
                        <GoogleSquare />
                        <HotColumn />
                        <HotTag />
                    </Space>
                </Layout>
            </Container>
        </DocumentMeta>
    );
}
export default ArticleIndex;
