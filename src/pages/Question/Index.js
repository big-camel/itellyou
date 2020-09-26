import React, { useState, useContext } from 'react';
import { Link, useDispatch, useSelector, useIntl, Helmet } from 'umi';
import classNames from 'classnames';
import { Button, Card, Space } from 'antd';
import { GoogleHorizontal, GoogleSquare } from '@/components/AdSense';
import { RouteContext } from '@/context';
import Container, { Layout } from '@/components/Container';
import { getPageQuery } from '@/utils';
import { PageList } from '@/components/List';
import { Question } from '@/components/Content';
import GroupUser from './components/GroupUser';
import { EditOutlined } from '@ant-design/icons';
import styles from './index.less';

const fetchList = (dispatch, offset, limit, type, parmas) => {
    return dispatch({
        type: 'question/list',
        payload: {
            append: false,
            offset,
            limit,
            type,
            child: 1,
            ...parmas,
        },
    });
};

function QuestionIndex({ location: { query }, match: { params } }) {
    const limit = parseInt(query.limit || 20);
    const page = query.page ? (parseInt(query.page) - 1) * limit : undefined;
    const [offset, setOffset] = useState(parseInt(query.offset || page || 0));
    const type = params.type || '';

    const dispatch = useDispatch();
    const dataSource = useSelector((state) => (state.question ? state.question.list : null));
    const settings = useSelector((state) => state.settings);

    if (dataSource && dataSource.data.length > 3) {
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
                    <GoogleHorizontal />
                </PageList.Item>
            );
        return (
            <PageList.Item key={item.id}>
                <Question data={item} authorSize="small" />
            </PageList.Item>
        );
    };

    const renderList = () => {
        const me = useSelector((state) => state.user.me);
        if (!me && type === 'star')
            return (
                <p>
                    <Link to="/login">未登录</Link>
                </p>
            );
        const link = type ? `/question${type}` : '/question';
        return (
            <PageList
                renderItem={renderItem}
                dataSource={dataSource}
                offset={offset}
                limit={limit}
                pageLink={(current) => (current === 1 ? '/question' : `${link}?page=${current}`)}
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
                    <Space direction="vertical" size="small">
                        <GroupUser />
                        <GoogleSquare />
                    </Space>
                </Layout>
            </Container>
        </>
    );
}

QuestionIndex.getInitialProps = async ({ isServer, match, store, params, history }) => {
    const { dispatch, getState } = store;
    const limit = 20;
    const { location } = history || {};
    let query = (location || {}).query;
    if (!isServer) {
        query = getPageQuery();
    }
    const page = query.page ? (parseInt(query.page) - 1) * limit : 0;
    await fetchList(dispatch, page, limit, match.params.type || '', params);

    await GroupUser.getInitialProps({ isServer, store, match, params });

    if (isServer) return getState();
};
export default QuestionIndex;
