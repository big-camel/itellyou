import React, { useState, useContext } from 'react';
import { Link, useDispatch, useSelector, useIntl, Helmet } from 'umi';
import classNames from 'classnames';
import { Button, Card, Space } from 'antd';
import { GoogleHorizontal, GoogleSquare } from '@/components/AdSense';
import { RouteContext } from '@/context';
import Container, { Layout } from '@/components/Container';
import { MoreList } from '@/components/List';
import { Question } from '@/components/Content';
import GroupUser from './components/GroupUser';
import { EditOutlined } from '@ant-design/icons';
import styles from './index.less';

const fetchList = (dispatch, offset, limit, type, parmas) => {
    return dispatch({
        type: 'question/list',
        payload: {
            append: offset > 0,
            offset,
            limit,
            type,
            child: 1,
            ...parmas,
        },
    });
};

function QuestionIndex({ location: { query }, match: { params } }) {
    const [offset, setOffset] = useState(parseInt(query.offset || 0));

    const limit = parseInt(query.limit || 20);
    const type = params.type || '';

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.question ? state.question.list : null));
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
                <Question data={item} authorSize="small" />
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
                dataSource={dataSource}
                offset={offset}
                limit={limit}
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
                <title>{`${intl.formatMessage({ id: 'question.page.index' })} - ${
                    settings.title
                }`}</title>
                <meta
                    name="keywords"
                    content={`${intl.formatMessage({
                        id: 'keywords',
                    })},问答列表,热门问答,悬赏问题,付费问答`}
                />
                <meta
                    name="description"
                    content={`itellyou问答列表${intl.formatMessage({ id: 'description' })}`}
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
                                        href="/question/new"
                                        icon={<EditOutlined />}
                                    >
                                        提问题
                                    </Button>
                                )}
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
        </>
    );
}

QuestionIndex.getInitialProps = async ({ isServer, match, store, params }) => {
    const { dispatch, getState } = store;
    await fetchList(dispatch, 0, 20, match.params.type || '', params);

    await GroupUser.getInitialProps({ isServer, store, match, params });

    if (isServer) return getState();
};
export default QuestionIndex;
