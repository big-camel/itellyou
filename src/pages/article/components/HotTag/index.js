import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Card } from 'antd';
import Loading from '@/components/Loading';
import Tag from '@/components/Tag';
import List from '@/components/List';

export default props => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'tag/list',
            payload: {
                type: 'hot',
                offset: 0,
                limit: 10,
            },
        });
    }, [dispatch]);

    const renderItem = ({ id, name }) => {
        return (
            <List.Item key={id}>
                <Tag id={id} title={name} />
            </List.Item>
        );
    };

    const dataSource = useSelector(state => state.tag.list);
    if (!dataSource) return <Loading />;
    return (
        <Card title="热门标签" {...props}>
            <List
                dataSource={dataSource.data}
                renderItem={renderItem}
                split={false}
                grid={{
                    gutter: 16,
                }}
            />
        </Card>
    );
};
