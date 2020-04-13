import React from 'react';
import BaseButton from './BaseButton';
import { DeleteOutlined } from '@ant-design/icons';

function DeleteButton({ text, children, ...props }) {
    text = text || '删除';
    const renderContent = () => {
        if (children) return children;
        return text;
    };
    return (
        <BaseButton icon={<DeleteOutlined />} {...props}>
            {renderContent()}
        </BaseButton>
    );
}
export default DeleteButton;
