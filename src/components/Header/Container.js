import React from 'react';
import classNames from 'classnames';
import Container from '@/components/Container';
import styles from './index.less';

export default ({ className, mode, isMobile, children, before, after }) => {
    return (
        <div className={classNames(isMobile ? styles['m-header'] : styles['header'], className)}>
            <Container mode={mode}>
                {before}
                {children}
                {after && <div className={styles['last']}>{after}</div>}
            </Container>
        </div>
    );
};
