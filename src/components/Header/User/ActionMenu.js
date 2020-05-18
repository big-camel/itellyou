import React from 'react';
import { Menu, Popover } from 'antd';
import { Link } from 'umi';
import { EditTwoTone, QuestionCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';

export default () => {
    const menu = (
        <Menu>
            <Menu.Item key="question">
                <Link to="/question/new">
                    <QuestionCircleTwoTone />
                    提问题
                </Link>
            </Menu.Item>
            <Menu.Item key="article">
                <Link to="/article/new">
                    <EditTwoTone />
                    写文章
                </Link>
            </Menu.Item>
        </Menu>
    );

    return (
        <Popover
            overlayClassName={'popover-menu'}
            content={menu}
            arrowPointAtCenter
            placement="bottomRight"
        >
            <div className={styles['action-menu']}>
                <PlusOutlined />
            </div>
        </Popover>
    );
};
