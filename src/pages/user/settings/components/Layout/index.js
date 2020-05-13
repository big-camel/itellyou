import React, { useContext } from 'react';
import Container, { Layout, Sider } from '@/components/Container';
import { RouteContext } from '@/context';
import siderData from './sider';

export default ({ children, defaultKey }) => {
    const { isMobile } = useContext(RouteContext);

    return (
        <Container>
            <Layout spans={7}>
                {!isMobile && <Sider dataSource={siderData} defaultKey={defaultKey} />}
                <React.Fragment>{children}</React.Fragment>
            </Layout>
        </Container>
    );
};
