import React from 'react';
import BaseButton from './BaseButton';
import { HistoryOutlined } from '@ant-design/icons';

export default ({ children, onlyIcon, text, ...props }) => {
    text = text || '历史版本';
    const renderContent = () => {
        if (children) return children;
        return text;
    };

    return (
        <BaseButton icon={<HistoryOutlined />} {...props}>
            {!onlyIcon && renderContent()}
        </BaseButton>
    );
};
