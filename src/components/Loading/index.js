import React from 'react';
import { Spin } from 'antd';
import LoadingButton from './Button';
import styles from './index.less';
import { LoadingOutlined } from '@ant-design/icons';

export default ({ tip, loading, children }) => (
    <Spin
        className={styles['loading']}
        indicator={<LoadingOutlined className={styles.icon} />}
        tip={tip || '加载中...'}
        spinning={loading === undefined || loading === null ? true : loading}
    >
        {children}
    </Spin>
);

export { LoadingButton };
