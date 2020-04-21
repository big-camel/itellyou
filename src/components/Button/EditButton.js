import React from 'react';
import BaseButton from './BaseButton';
import { EditOutlined } from '@ant-design/icons';

function EditButton({ children, onlyIcon, text, ...props }) {
    text = text || '编辑';
    const renderContent = () => {
        if (children) return children;
        return text;
    };

    return (
        <BaseButton icon={<EditOutlined />} {...props}>
            {!onlyIcon && renderContent()}
        </BaseButton>
    );
}
export default EditButton;
