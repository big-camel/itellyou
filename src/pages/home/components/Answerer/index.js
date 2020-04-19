import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { useDispatch, useSelector } from 'umi';
import List from '@/components/List';
import { UserAuthor } from '@/components/User';
import Loading from '@/components/Loading';

export default ({ className }) => {
    const [offset, setOffset] = useState(0);
    const limit = 10;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'explore/answerer',
            payload: {
                append: false,
                offset,
                limit,
            },
        });
    }, [offset, limit, dispatch]);

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
        <Card title="优秀回答者" className={className}>
            <List dataSource={dataSource.data} renderItem={renderItem} split={false} />
        </Card>
    );
};
