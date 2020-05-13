import React from 'react';
import Header from '@/components/Header';
import BlankLayout from '@/layouts/BlankLayout';
import Footer from '@/components/Footer';
import useAntdMediaQuery from 'use-media-antd-query';

function BasicLayout({ route, children, ...props }) {
    const colSize = useAntdMediaQuery();
    const isMobile = colSize === 'sm' || colSize === 'xs';

    return (
        <BlankLayout route={route}>
            <Header {...props} isMobile={isMobile} />
            <div className="main-wrapper">{children}</div>
            <Footer />
        </BlankLayout>
    );
}

export default BasicLayout;
