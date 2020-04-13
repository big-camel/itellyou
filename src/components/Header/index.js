import React from 'react';

import Container from '@/components/Container';
import Logo from './Logo';
import Navigation from './Navigation';
import User from './User';
import TopSearch from './Search';
import styles from './index.less';

function Header(props) {
    const { location } = props;
    const query = location ? location.query || {} : {};
    return (
        <header className={styles['header']}>
            <Container>
                <React.Fragment>
                    <Logo />
                    <Navigation {...props} />
                    <TopSearch defaultValue={query.q || ''} type={query.t || ''} />
                    <User {...props} />
                </React.Fragment>
            </Container>
        </header>
    );
}
export default Header;
