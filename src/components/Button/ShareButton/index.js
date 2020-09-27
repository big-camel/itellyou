import React from 'react';
import { Popover, Menu, message } from 'antd';
import { LinkOutlined, ExpandOutlined } from '@ant-design/icons';
import copyToClipboard from 'copy-to-clipboard';
import QrCode from 'qrcode.react';
import BaseButton from '../BaseButton';
import { ShareAltOutlined } from '@ant-design/icons';
import styles from './index.less';

const menus = [
    {
        key: 'copy_link',
        icon: <LinkOutlined />,
        title: '复制链接',
        onClick: () => {
            if (copyToClipboard(window.location.href)) message.success('复制成功');
            else message.success('复制失败');
        },
    },
    {
        key: 'expand_code',
        icon: <ExpandOutlined />,
        className: styles['expand-qrcode'],
        title: (
            <>
                <div className={styles['title']}>扫一扫</div>
                <QrCode
                    value={typeof window !== 'undefined' ? window.location.href : ''}
                    renderAs="svg"
                    size={94}
                    level="Q"
                />
            </>
        ),
    },
];

const ShareButton = React.forwardRef(({ icon, children, ...props }, ref) => {
    const popoveMenu = (
        <Menu>
            {menus.map(({ key, title, icon, onClick, className }) => (
                <Menu.Item key={key} onClick={onClick} icon={icon} className={className}>
                    {title}
                </Menu.Item>
            ))}
        </Menu>
    );

    return (
        <Popover
            overlayClassName="popover-menu"
            content={popoveMenu}
            arrowPointAtCenter
            placement="bottom"
        >
            <BaseButton icon={icon || <ShareAltOutlined />} ref={ref} {...props}>
                {children}
            </BaseButton>
        </Popover>
    );
});
export default ShareButton;
