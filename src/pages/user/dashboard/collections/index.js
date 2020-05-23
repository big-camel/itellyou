import React from 'react';
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

UserCollections.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;

    if (isServer) return getState();
};

export default UserCollections;
