import React from 'react';
import { Redirect } from 'umi';
import { Space } from 'antd';
import Layout from '../components/Layout';
import CardMenu from '../components/CardMenu';
import Total from './components/Total';
import Content from './components/Content';

const menus = [
    {
        key: 'answer',
        title: '回答',
        to: '/dashboard/analytics/answer',
    },
    {
        key: 'article',
        title: '文章',
        to: '/dashboard/analytics/article',
    },
];

const Analytics = ({ match: { params } }) => {
    const { type } = params;
    if (!menus.find((menu) => menu.key === type)) return <Redirect to={menus[0].to} />;

    return (
        <Layout defaultKey="analytics">
            <Space direction="vertical" size="middle">
                <CardMenu dataSource={menus} defaultKey={type}>
                    <Total type={type} />
                </CardMenu>
                <Content type={type} />
            </Space>
        </Layout>
    );
};

Analytics.getInitialProps = async ({ isServer, store, match, params }) => {
    const { getState } = store;
    const { type } = match.params;
    await Content.getInitialProps({ isServer, store, params: { ...params, type } });
    if (isServer) return getState();
};

export default Analytics;
