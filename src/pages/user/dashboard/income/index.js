import React, { useState } from 'react';
import { Space } from 'antd';
import Layout from '../components/Layout';
import CardMenu from '../components/CardMenu';
import Total from './components/Total';
import Content from './components/Content';

const Income = () => {
    const [totalType, setTotalType] = useState('current_month');

    const menus = [
        {
            key: 'current_month',
            title: '本月收益',
        },
        {
            key: 'prev_month',
            title: '上月收益',
        },
    ];

    return (
        <Layout defaultKey="Income">
            <Space direction="vertical" size="middle">
                <CardMenu
                    extra={
                        totalType === 'current_month' ? (
                            <div style={{ color: 'rgba(0, 0, 0, 0.45)', marginRight: 16 }}>
                                数据截止到昨日
                            </div>
                        ) : null
                    }
                    dataSource={menus}
                    defaultKey={totalType}
                    itemClick={setTotalType}
                >
                    <Total type={totalType} />
                </CardMenu>
                <Content />
            </Space>
        </Layout>
    );
};

Income.getInitialProps = async ({ isServer, store, match, params }) => {
    const { getState } = store;
    const { type } = match.params;
    await Content.getInitialProps({ isServer, store, params: { ...params, type } });
    if (isServer) return getState();
};

export default Income;
