import React from 'react';
import { Link } from 'umi';
import styles from './index.less';

export default ({ dataSource, defaultKey }) => {
    return (
        <div className={styles['nav']}>
            {dataSource.map(({ key, type, title, icon, to }, index) => {
                if (type === 'divider') return <span key={index} className={styles['divider']} />;
                return (
                    <Link
                        key={index}
                        className={defaultKey === key ? styles['active'] : null}
                        to={to}
                    >
                        {icon}
                        {title}
                    </Link>
                );
            })}
        </div>
    );
};
