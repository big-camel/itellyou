import React from 'react';
import BaseButton from './BaseButton';
import { EllipsisOutlined } from '@ant-design/icons';

function EllipsisButton({ children, ...props }) {
    return (
        <BaseButton {...props} icon={<EllipsisOutlined />}>
            {children}
        </BaseButton>
    );
}
export default EllipsisButton;
