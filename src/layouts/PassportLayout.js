import React from 'react';
import { Link } from 'umi';
import classNames from 'classnames';
import Container from '@/components/Container';
import BlankLayout from '@/layouts/BlankLayout';
import logo from '@/assets/logo.svg';
import styles from './PassportLayout.less';

function PassportLayout({ route, children }) {
    const layout = (
        <div className={styles.content}>
            <div className={styles.header}>
                <div className={styles.logo}>
                    <Link to="/">
                        <img alt="logo" src={logo} />
                    </Link>
                </div>
            </div>
            {children}
        </div>
    );

    return (
        <BlankLayout route={route}>
            <div className={classNames('main-wrapper', styles.wrapper)}>
                <Container>{layout}</Container>
            </div>
        </BlankLayout>
    );
}

export default PassportLayout;
