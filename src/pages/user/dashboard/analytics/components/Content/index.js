import React, { useState } from 'react';
import { Card } from 'antd';
import Group from './Group';
import Single from './Single';
import styles from './index.less';

const Content = ({ type }) => {
    const [key, setKey] = useState('all');

    const typeText = type === 'answer' ? '回答' : '文章';

    const tabList = [
        {
            key: 'all',
            tab: `所有${typeText}`,
        },
        {
            key: 'single',
            tab: `单篇${typeText}`,
        },
    ];

    const contentList = {
        all: <Group type={type} />,
        single: <Single type={type} />,
    };

    return (
        <Card
            tabList={tabList}
            onTabChange={(key) => setKey(key)}
            className={styles['card-content']}
        >
            {contentList[key]}
        </Card>
    );
};
Content.getInitialProps = async ({ isServer, store, params }) => {
    const { getState } = store;
    await Group.getInitialProps({ isServer, store, params });
    if (isServer) return getState();
};

export default Content;
