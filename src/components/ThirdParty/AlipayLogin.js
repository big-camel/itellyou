import React from 'react';
import { Tooltip } from 'antd';
import AlipayIcon from './AlipayIcon';
import styles from './index.less';

export default () => {
    return (
        <Tooltip title="支付宝登陆">
            <a className={styles['third-link']} href="/api/oauth/alipay?action=login">
                <AlipayIcon />
            </a>
        </Tooltip>
    );
};
