import React, { useState } from 'react';
import { message } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { FavoriteButton } from '@/components/Button';

export default ({ id, use_star, allow_star, ...props }) => {
    const dispatch = useDispatch();
    const [following, setFollowing] = useState(false);
    const me = useSelector(state => state.user.me);
    const onStar = () => {
        if (!me) return message.error('未登录');
        if (following) return;
        setFollowing(true);
        const type = !use_star ? 'follow' : 'unfollow';
        dispatch({
            type: `questionStar/${type}`,
            payload: {
                id,
            },
        }).then(() => {
            setFollowing(false);
        });
    };

    return (
        <FavoriteButton disabled={!allow_star} loading={following} onClick={onStar} {...props}>
            {use_star ? '取消关注' : '关注问题'}
        </FavoriteButton>
    );
};
