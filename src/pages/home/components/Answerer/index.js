import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { MoreList } from '@/components/List';
import { UserAuthor } from '@/components/User';

export default ({ className }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'explore/answerer',
            payload: {
                offset,
                limit,
            },
        });
    }, [offset, limit, dispatch]);

    const dataSource = useSelector(state => state.explore.answerer);

    const renderItem = item => {
        return (
            <MoreList.Item>
                <UserAuthor info={item} size="middle" />
            </MoreList.Item>
        );
    };

    return (
        <Card title="优秀回答者" className={className}>
            <MoreList
                offset={offset}
                limit={limit}
                dataSource={dataSource}
                onChange={offset => setOffset(offset)}
                renderItem={renderItem}
                split={false}
            />
        </Card>
    );
};
