import React from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import styles from './index.less';

function BaseButton({ children, active, loading, icon, ...props }) {
    const getIcon = () => {
        if (loading) return;
        return icon;
    };
    return (
        <Button
            type="ghost"
            className={classnames(styles['button'], { [styles['active']]: active })}
            loading={loading}
            {...props}
        >
            {getIcon()}
            {children}
        </Button>
    );
}
export default BaseButton;
