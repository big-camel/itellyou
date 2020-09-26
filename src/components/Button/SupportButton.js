import React from 'react';
import { LikeFilled } from '@ant-design/icons';
import BaseButton from './BaseButton';

function SupportButton({ text, count, icon, children, ...props }) {
    count = count || 0;
    const renderContent = () => {
        if (children) return children;
        return (
            <span>
                {!text && count > 0 && count}
                {text || '赞'}
            </span>
        );
    };

    return (
        <BaseButton icon={icon || <LikeFilled />} {...props}>
            {renderContent()}
        </BaseButton>
    );
}
export default SupportButton;
