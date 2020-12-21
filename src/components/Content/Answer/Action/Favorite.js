import React from 'react';
import { useDispatch } from 'umi';
import { FavoriteButton } from '@/components/Button';
import { useState } from 'react';

export default ({ id, use_star, allow_star, size }) => {
    const dispatch = useDispatch();
    const [following, setFollowing] = useState(false);
    const [useStar, setUseStar] = useState(use_star);

    const onStar = () => {
        if (following) return;
        setFollowing(true);
        const type = !use_star ? 'follow' : 'unfollow';
        dispatch({
            type: `answerStar/${type}`,
            payload: {
                id,
            },
        }).then(() => {
            setUseStar(!useStar);
            setFollowing(false);
        });
    };

    return (
        <FavoriteButton disabled={!allow_star} loading={following} onClick={onStar} size={size}>
            {useStar ? '取消收藏' : '收藏'}
        </FavoriteButton>
    );
};
