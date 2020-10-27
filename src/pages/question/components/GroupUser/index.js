import React from 'react';
import { useSelector } from 'umi';
import { Card } from 'antd';
import List from '@/components/List';
import { UserAuthor } from '@/components/User';
import styles from './index.less';

const GroupUser = () => {
    const loadingState = useSelector((state) => state.loading);
    const loading = loadingState.effects['answerGroupUser/list'];
    const dataSource = useSelector((state) => state.answerGroupUser.list);

    const renderItem = ({ user, total_count }) => {
        return (
            <List.Item>
                <div className={styles['group-item']}>
                    <UserAuthor info={user} size="small" />
                    <div>{total_count} 个回答</div>
                </div>
            </List.Item>
        );
    };

    return (
        <Card title="本月活跃用户">
            <List dataSource={dataSource} loading={loading} renderItem={renderItem} />
        </Card>
    );
};

GroupUser.getInitialProps = async ({ isServer, store, params }) => {
    const { dispatch, getState } = store;

    await dispatch({
        type: 'answerGroupUser/list',
        payload: {
            offset: 0,
            limit: 10,
            day: 30,
            ...params,
        },
    });

    if (isServer) return getState();
};

export default GroupUser;
