import React from 'react';
import { Card } from 'antd';
import { useSelector } from 'umi';
import List from '@/components/List';
import { UserAuthor } from '@/components/User';
import Loading from '@/components/Loading';

export default ({ className }) => {
    const dataSource = useSelector(state => state.explore.answerer);

    if (!dataSource) return <Loading />;

    const renderItem = item => {
        return (
            <List.Item>
                <UserAuthor info={item} size="middle" />
            </List.Item>
        );
    };

    return (
        <Card title="推荐回答者" className={className}>
            <List dataSource={dataSource.data} renderItem={renderItem} split={false} />
        </Card>
    );
};
