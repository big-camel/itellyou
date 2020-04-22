import React, { useState, useEffect } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import classNames from 'classnames';
import { Card, Button } from 'antd';
import Container, { Layout } from '@/components/Container';
import { Article } from '@/components/Content';
import { MoreList } from '@/components/List';
import styles from './index.less';
import HotColumn from './components/HotColumn';
import HotTag from './components/HotTag';
import { EditOutlined } from '@ant-design/icons';

function ArticleIndex({ location: { query }, match: { params } }) {
    const [offset, setOffset] = useState(parseInt(query.offset || 0));
    const limit = parseInt(query.limit || 20);
    const type = params.type || 'default';

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.article ? state.article.list : null));

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

    return (
        <Container
            metas={{
                keywords: '文章,文章列表,热门文章,itellyou',
                description: 'itellyou文章列表',
            }}
        >
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
                                    className={classNames({ [styles['active']]: type === 'hot' })}
                                    to="/article/hot"
                                >
                                    热门
                                </Link>
                                <Link
                                    className={classNames({ [styles['active']]: type === 'star' })}
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
                <React.Fragment>
                    <HotColumn />
                    <div className={styles['hot-tag']}>
                        <HotTag />
                    </div>
                </React.Fragment>
            </Layout>
        </Container>
    );
}
export default ArticleIndex;
