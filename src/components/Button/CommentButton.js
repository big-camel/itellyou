import React from 'react';
import BaseButton from './BaseButton';
import { MessageOutlined } from '@ant-design/icons';

const CommentButton = React.forwardRef(({ count, children, ...props }, ref) => {
    const getContent = () => {
        if (children) return children;
        return count === 0 || !count ? '添加评论' : `${count}条评论`;
    };

    return (
        <BaseButton icon={<MessageOutlined />} {...props} ref={ref}>
            {getContent()}
        </BaseButton>
    );
});
export default CommentButton;
