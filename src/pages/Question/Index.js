import React, { useState, useEffect } from 'react';
import { Link, useDispatch, useSelector, useIntl } from 'umi';
import classNames from 'classnames';
import { Button, Card, Space } from 'antd';
import Container, { Layout } from '@/components/Container';
import { MoreList } from '@/components/List';
import { Question } from '@/components/Content';
import GroupUser from './components/GroupUser';
import { EditOutlined } from '@ant-design/icons';
import styles from './index.less';
import { GoogleSquare } from '@/components/AdSense';
import DocumentMeta from 'react-document-meta';

function Index({ location: { query }, match: { params } }) {
    const [offset, setOffset] = useState(parseInt(query.offset || 0));

    const limit = parseInt(query.limit || 20);
    const type = params.type || '';

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.question ? state.question.list : null));
    const settings = useSelector(state => state.settings);

    useEffect(() => {
        dispatch({
            type: 'question/list',
            payload: {
                append: offset > 0,
                offset,
                limit,
                type,
                child: 1,
            },
        });
    }, [offset, limit, type, dispatch]);

    const renderItem = item => {
        return (
            <MoreList.Item key={item.id}>
                <Question data={item} authorSize="small" />
            </MoreList.Item>
        );
    };

    const renderList = () => {
        return (
            <MoreList
                renderItem={renderItem}
                dataSource={dataSource}
                offset={offset}
                limit={limit}
                onChange={offset => setOffset(offset)}
            />
        );
    };

    const intl = useIntl();

    return (
        <DocumentMeta
            title={`${intl.formatMessage({ id: 'question.page.index' })} - ${settings.title}`}
            meta={{
                name: {
                    keywords: `${intl.formatMessage({
                        id: 'keywords',
                    })},问答列表,热门问答,悬赏问题,付费问答`,
                    description: `itellyou问答列表${intl.formatMessage({ id: 'description' })}`,
                },
            }}
        >
            <Container>
                <Layout>
                    <Card
                        title={
                            <div className={styles['header']}>
                                <Button type="primary" href="/question/new" icon={<EditOutlined />}>
                                    提问题
                                </Button>
                                <div className={styles['type-list']}>
                                    <Link
                                        className={classNames({
                                            [styles['active']]: type === '' || type === 'default',
                                        })}
                                        to="/question"
                                    >
                                        最新
                                    </Link>
                                    <Link
                                        className={classNames({
                                            [styles['active']]: type === 'hot',
                                        })}
                                        to="/question/hot"
                                    >
                                        热门
                                    </Link>
                                    <Link
                                        className={classNames({
                                            [styles['active']]: type === 'reward',
                                        })}
                                        to="/question/reward"
                                    >
                                        悬赏
                                    </Link>
                                    <Link
                                        className={classNames({
                                            [styles['active']]: type === 'star',
                                        })}
                                        to="/question/star"
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
                        <GroupUser />
                    </Space>
                </Layout>
            </Container>
        </DocumentMeta>
    );
}
export default Index;
