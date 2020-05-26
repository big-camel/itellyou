import React from 'react';
import Header from '@/components/Header';
import BlankLayout from '@/layouts/BlankLayout';
import Footer from '@/components/Footer';
import { RouteContext } from '@/context';

const BasicLayout = ({ route, children, ...props }) => {
    return (
        <BlankLayout route={route}>
            <RouteContext.Consumer>
                {({ isMobile }) => {
                    return (
                        <>
                            <Header {...props} isMobile={isMobile} />
                            <div className="main-wrapper">{children}</div>
                            <Footer />
                        </>
                    );
                }}
            </RouteContext.Consumer>
        </BlankLayout>
    );
};

BasicLayout.getInitialProps = ctx => {
    BlankLayout.getInitialProps(ctx);
};
export default BasicLayout;
