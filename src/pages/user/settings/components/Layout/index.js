import React from 'react';
import Container, { Layout, Sider } from '@/components/Container';
import siderData from './sider';

export default ({ children, defaultKey }) => {
    return (
        <Container>
            <Layout spans={7}>
                <Sider dataSource={siderData} defaultKey={defaultKey} />
                <React.Fragment>{children}</React.Fragment>
            </Layout>
        </Container>
    );
};
