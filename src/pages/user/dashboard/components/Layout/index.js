import React from 'react';
import Container, { Layout } from '@/components/Container';
import Nav from './Nav';
import siderData from './sider';

export default ({ children, defaultKey }) => {
    return (
        <Container>
            <Layout spans={4}>
                <Nav dataSource={siderData} defaultKey={defaultKey} />
                <React.Fragment>{children}</React.Fragment>
            </Layout>
        </Container>
    );
};
