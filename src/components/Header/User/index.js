import React from 'react';
import styles from './index.less';
import { useSelector } from 'umi';
import UserMenu from './UserMenu';
import ActionMenu from './ActionMenu';
import Notifications from './Notifications';
import { Button, Space } from 'antd';

export default () => {
    const me = useSelector(state => state.user.me);
    return (
        <div className={styles['user']}>
            {me ? (
                <div className={styles['action']}>
                    <div className={styles['item']}>
                        <ActionMenu />
                    </div>
                    <div className={styles['item']}>
                        <Notifications />
                    </div>
                    <div className={styles['item']}>
                        <UserMenu {...me} />
                    </div>
                </div>
            ) : (
                <Space>
                    <Button type="ghost" href="/login">
                        立即登录
                    </Button>
                    <Button type="primary" href="/register">
                        免费注册
                    </Button>
                </Space>
            )}
        </div>
    );
};
