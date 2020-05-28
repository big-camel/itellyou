import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Card } from 'antd';
import { MoreList } from '@/components/List';
import Container from '@/components/Container';
import Layout from './components/Layout';
import timeUtils from '@/utils/time';
import Follow from './components/Follow';
import styles from './index.less';
import Like from './components/Like';
import Comment from './components/Comment';
import Publish from './components/Publish';
import Adopt from './components/Adopt';
import Reward from './components/Reward';
import Payment from './components/Payment';

const fetchList = (dispatch, offset, limit, action, parmas) => {
    return dispatch({
        type: 'notifications/list',
        payload: {
            append: offset > 0,
            action,
            offset,
            limit,
            ...parmas,
        },
    });
};

const Notifications = ({ match: { params } }) => {
    const path = params.path || '/default';
    const menuKey = path.substr(1);
    const prevMenuKey = useRef(menuKey);
    const prevTime = useRef();
    const [offset, setOffset] = useState(0);
    const limit = 20;
    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.notifications.list[menuKey]);

    const renderItem = item => {
        const { created_time, action, type } = item;
        const time = timeUtils.format(created_time, { tpl: 'YYYY-MM-DD' });
        const getTime = () => {
            if (time !== prevTime.current) {
                prevTime.current = time;
                return <time className={styles['time']}>{time}</time>;
            }
            return null;
        };

        const getChild = () => {
            switch (action) {
                case 'follow':
                    return (
                        <Follow
                            {...item}
                            text={['article', 'answer'].includes(type) ? '新增收藏' : '新增关注'}
                        />
                    );
                case 'like':
                    return <Like {...item} />;
                case 'comment':
                    return <Comment {...item} />;
                case 'publish':
                    return <Publish {...item} />;
                case 'adopt':
                    return <Adopt {...item} />;
                case 'reward':
                    return <Reward {...item} />;
                case 'payment':
                    return <Payment {...item} />;
                default:
                    return null;
            }
        };
        return (
            <MoreList.Item className={styles['notifications-item']}>
                {getTime()}
                {getChild()}
            </MoreList.Item>
        );
    };

    return (
        <Container>
            <Layout defaultKey={menuKey}>
                <Card title="通知中心">
                    <MoreList
                        className={styles['notifications-list']}
                        itemLayout="vertical"
                        offset={offset}
                        limit={limit}
                        renderItem={renderItem}
                        dataSource={dataSource}
                        onChange={offset => {
                            setOffset(offset);
                            fetchList(
                                dispatch,
                                prevMenuKey.current !== menuKey ? 0 : offset,
                                limit,
                                menuKey,
                            );
                            if (prevMenuKey.current !== menuKey) {
                                prevTime.current = '';
                            }
                            prevMenuKey.current = menuKey;
                        }}
                    />
                </Card>
            </Layout>
        </Container>
    );
};

Notifications.getInitialProps = async ({ isServer, store, match, params }) => {
    const { dispatch, getState } = store;
    const path = match.params.path || '/default';
    const menuKey = path.substr(1);
    await fetchList(dispatch, 0, 20, menuKey, params);
    if (isServer) return getState();
};

export default Notifications;
