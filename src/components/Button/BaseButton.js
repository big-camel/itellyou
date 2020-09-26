import React from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

const BaseButton = React.forwardRef(({ children, active, loading, icon, ...props }, ref) => {
    const getIcon = () => {
        if (loading) return;
        return icon;
    };
    return (
        <Button
            ref={ref}
            type="ghost"
            className={classnames(styles['button'], { [styles['active']]: active })}
            loading={loading}
            {...props}
        >
            {getIcon()}
            {children}
        </Button>
    );
});
export default BaseButton;
