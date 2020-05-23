import React from 'react';
import { useSelector } from 'umi';
import List from '@/components/List';
import Loading from '@/components/Loading';
import { Article } from '@/components/Content';
import { Card } from 'antd';

export default () => {
    const renderItem = item => {
        return (
            <List.Item key={item.id}>
                <Article data={item} desc={true} />
            </List.Item>
        );
    };

    const dataSource = useSelector(state => state.article.related);
    if (!dataSource) return <Loading />;

    return (
        <Card title="相关阅读">
            <List dataSource={dataSource.data} renderItem={renderItem} />
        </Card>
    );
};
