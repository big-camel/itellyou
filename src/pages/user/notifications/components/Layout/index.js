import React from 'react';
import { Layout, Sider } from '@/components/Container';
import siderData from './sider';

export default ({ children, defaultKey }) => {
    return (
        <Layout spans={7}>
            <Sider dataSource={siderData} defaultKey={defaultKey} />
            <React.Fragment>{children}</React.Fragment>
        </Layout>
    );
};
