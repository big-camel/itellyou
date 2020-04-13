import React from 'react';
import BaseButton from './BaseButton';
import { LikeFilled } from '@ant-design/icons';

function SupportButton({ text, count, children, ...props }) {
    text = text || '赞';
    count = count || 0;
    const renderContent = () => {
        if (children) return children;
        return (
            <span>
                {count > 0 && <span>{count}</span>}
                <span>{text}</span>
            </span>
        );
    };

    return (
        <BaseButton icon={<LikeFilled />} {...props}>
            {renderContent()}
        </BaseButton>
    );
}
export default SupportButton;
