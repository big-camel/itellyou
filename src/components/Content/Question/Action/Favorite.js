import React from 'react';
import { useDispatch } from 'umi';
import { FavoriteButton } from '@/components/Button';
import { useState } from 'react';

export default ({ id, use_star, allow_star, ...props }) => {
    const dispatch = useDispatch();
    const [following, setFollowing] = useState(false);

    const onStar = () => {
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
