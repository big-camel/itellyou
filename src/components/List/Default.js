import React from 'react';
import { List, Empty } from 'antd';

const Default = ({ loading, dataSource, renderHeader, ...props }) => {
    renderHeader = renderHeader || function() {};

    const renderList = () => {
        return (
            <List loading={loading} header={renderHeader()} dataSource={dataSource} {...props} />
        );
    };

    if (dataSource && dataSource.length === 0) return <Empty description="暂无数据" />;

    return renderList();
};

Default.Item = List.Item;
export default Default;
