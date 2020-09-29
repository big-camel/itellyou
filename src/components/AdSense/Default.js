import React, { useContext } from 'react';
import classNames from 'classnames';
import { RouteContext } from '@/context';
import Google from './Google';
import styles from './index.less';

export default ({ className, type = 'auto', ...props }) => {
    const { isMobile } = useContext(RouteContext);

    return (
        <div
            className={classNames(
                { [styles[type]]: !!type },
                { [styles['mobile']]: isMobile },
                className,
            )}
            {...props}
        >
            <Google
                client="ca-pub-3706417744839656"
                slot="1432657820"
                format="auto"
                responsive={true}
                style={{ display: 'block' }}
            />
        </div>
    );
};
