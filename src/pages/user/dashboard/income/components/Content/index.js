import React from 'react';
import { Card } from 'antd';
import List from './List';
import styles from './index.less';

const Content = () => {
    return (
        <Card className={styles['card-content']}>
            <List />
        </Card>
    );
};
Content.getInitialProps = async ({ isServer, store, params }) => {
    const { getState } = store;
    await List.getInitialProps({ isServer, store, params });
    if (isServer) return getState();
};

export default Content;
