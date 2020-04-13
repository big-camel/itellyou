import React from 'react';
import BaseButton from './BaseButton';
import { RollbackOutlined } from '@ant-design/icons';

function ReplyButton({ text, children, ...props }) {
    text = text || '回复';
    const renderContent = () => {
        if (children) return children;
        return text;
    };
    return (
        <BaseButton icon={<RollbackOutlined />} {...props}>
            {renderContent()}
        </BaseButton>
    );
}
export default ReplyButton;
