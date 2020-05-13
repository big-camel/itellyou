import React, { useContext } from 'react';
import Container, { Layout } from '@/components/Container';
import { RouteContext } from '@/context';
import Nav from './Nav';
import siderData from './sider';

export default ({ children, defaultKey }) => {
    const { isMobile } = useContext(RouteContext);
    return (
        <Container>
            <Layout spans={4}>
                {!isMobile && <Nav dataSource={siderData} defaultKey={defaultKey} />}
                <React.Fragment>{children}</React.Fragment>
            </Layout>
        </Container>
    );
};
