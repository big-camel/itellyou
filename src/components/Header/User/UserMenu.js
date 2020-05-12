import React from 'react';
import { Popover, Avatar, Menu, Space } from 'antd';
import { Link, useDispatch } from 'umi';
import styles from './index.less';
import {
    UserOutlined,
    SettingOutlined,
    LoginOutlined,
    PropertySafetyOutlined,
} from '@ant-design/icons';

export default ({ avatar, name, path, rank, bank }) => {
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch({
            type: 'user/logout',
        });
    };

    const menu = (
        <div className={styles['user-menu']}>
            <div className={styles['info']}>
                <Space>
                    <span className={styles['name']}>{name}</span>
                    <span className={styles['rank']}>{(rank || {}).name}</span>
                </Space>
            </div>
            <Menu>
                <Menu.Divider />
                <Menu.Item key="userCenter">
                    <Link to={`/${path}`}>
                        <UserOutlined />
                        个人主页
                    </Link>
                </Menu.Item>
                <Menu.Item key="userSetting">
                    <Link to="/settings/profile">
                        <SettingOutlined />
                        账户设置
                    </Link>
                </Menu.Item>
                <Menu.Item key="userWallet">
                    <Link to="/dashboard/wallet">
                        <PropertySafetyOutlined />
                        我的钱包
                    </Link>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout" onClick={onLogout}>
                    <LoginOutlined />
                    退出
                </Menu.Item>
            </Menu>
        </div>
    );
    return (
        <Popover
            overlayClassName={'popover-menu'}
            content={menu}
            arrowPointAtCenter
            placement="bottomRight"
        >
            <Link to="/dashboard">
                <Avatar src={avatar} size={24} />
            </Link>
        </Popover>
    );
};
