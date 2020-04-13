import React from 'react';
import BaseButton from './BaseButton';
import { DislikeOutlined } from '@ant-design/icons';

function OpposeButton({ children, ...props }) {
    return (
        <BaseButton {...props} icon={<DislikeOutlined />}>
            {children}
        </BaseButton>
    );
}
export default OpposeButton;
