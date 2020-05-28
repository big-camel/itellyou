import React from 'react';
import { getPageQuery } from '@/utils/utils';
import Layout from '../components/Layout';
import Article from './Article';
import Answer from './Answer';
import CardMenu from '../components/CardMenu';

const menus = [
    {
        key: 'article',
        title: '收藏的文章',
        to: 'collections?type=article',
        component: <Article />,
    },
    {
        key: 'answer',
        title: '收藏的回答',
        to: 'collections?type=answer',
        component: <Answer />,
    },
];

const UserCollections = ({ location: { query } }) => {
    const type = query.type || 'article';

    return (
        <Layout defaultKey="collections">
            <CardMenu dataSource={menus} defaultKey={type} />
        </Layout>
    );
};

UserCollections.getInitialProps = async ({ isServer, store, history, params }) => {
    const { getState } = store;
    const { location } = history || {};
    let query = (location || {}).query;
    if (!isServer) {
        query = getPageQuery();
    }

    const type = query.type || 'article';
    if (type === 'article') {
        await Article.getInitialProps({ isServer, store, params });
    }
    if (type === 'answer') {
        await Answer.getInitialProps({ isServer, store, params });
    }

    if (isServer) return getState();
};

export default UserCollections;
