import React from 'react';
import BaseButton from './BaseButton';
import { StarOutlined } from '@ant-design/icons';

function FavoriteButton({ children, ...props }) {
    return (
        <BaseButton icon={<StarOutlined />} {...props}>
            {children}
        </BaseButton>
    );
}
export default FavoriteButton;
