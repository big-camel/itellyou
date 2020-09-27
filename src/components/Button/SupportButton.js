import React from 'react';
import { LikeFilled } from '@ant-design/icons';
import BaseButton from './BaseButton';

const SupportButton = React.forwardRef(({ text, count, icon, children, ...props }, ref) => {
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
        <BaseButton icon={icon || <LikeFilled />} ref={ref} {...props}>
            {renderContent()}
        </BaseButton>
    );
});
export default SupportButton;
