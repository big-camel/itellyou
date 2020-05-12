import React from 'react';
import classNames from 'classnames';
import { AlipayCircleOutlined } from '@ant-design/icons';
import styles from './index.less';

export default props => {
    return (
        <AlipayCircleOutlined
            className={classNames(styles['third-icon'], styles['alipay'])}
            {...props}
        />
    );
};
