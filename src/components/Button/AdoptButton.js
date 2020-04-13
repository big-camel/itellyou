import React from 'react';
import BaseButton from './BaseButton';
import { CheckCircleOutlined } from '@ant-design/icons';

function AdoptButton({ children, active, ...props }) {
    return (
        <BaseButton type={active ? 'primary' : 'default'} icon={<CheckCircleOutlined />} {...props}>
            {children}
        </BaseButton>
    );
}
export default AdoptButton;
