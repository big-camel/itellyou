import React from 'react';
import Layout from '../components/Layout';
import User from './User';
import Follower from './Follower';
import Column from './Column';
import Question from './Question';
import Tag from './Tag';
import CardMenu from '../components/CardMenu';

const menus = [
    {
        key: 'user',
        title: '关注的人',
        to: 'follows?type=user',
        component: <User />,
    },
    {
        key: 'follower',
        title: '关注我的人',
        to: 'follows?type=follower',
        component: <Follower />,
    },
    {
        key: 'column',
        title: '关注的专栏',
        to: 'follows?type=column',
        component: <Column />,
    },
    {
        key: 'question',
        title: '关注的问题',
        to: 'follows?type=question',
        component: <Question />,
    },
    {
        key: 'tag',
        title: '关注的标签',
        to: 'follows?type=tag',
        component: <Tag />,
    },
];
export default ({ location: { query } }) => {
    const type = query.type || 'user';

    return (
        <Layout defaultKey="follows">
            <CardMenu dataSource={menus} defaultKey={type} />
        </Layout>
    );
};
