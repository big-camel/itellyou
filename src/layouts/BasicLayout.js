import React from 'react';
import Header from '@/components/Header';
import BlankLayout from '@/layouts/BlankLayout';
import Footer from '@/components/Footer';

function BasicLayout({ route, children, ...props }) {
    return (
        <BlankLayout route={route}>
            <Header {...props} />
            <div className="main-wrapper">{children}</div>
            <Footer />
        </BlankLayout>
    );
}

export default BasicLayout;
