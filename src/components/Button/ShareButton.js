import React from 'react';
import BaseButton from './BaseButton';
import { ShareAltOutlined } from '@ant-design/icons';

function ShareButton({ children, ...props }) {
    return (
        <BaseButton {...props} icon={<ShareAltOutlined />}>
            {children}
        </BaseButton>
    );
}
export default ShareButton;
