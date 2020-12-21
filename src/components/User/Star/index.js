import React, { useEffect, useState } from 'react';
import { useDispatch } from 'umi';
import { Button, message } from 'antd';

export default ({ id, use_star, text, ...props }) => {
    const [loading, setLoading] = useState(false);
    const [star, setStar] = useState(use_star);

    useEffect(() => {
        setStar(use_star);
    }, [use_star]);

    text = text || '关注';
    const dispatch = useDispatch();

    const onStar = () => {
        if (loading) return;
        setLoading(true);
        const type = star === false ? 'follow' : 'unfollow';
        dispatch({
            type: `userStar/${type}`,
            payload: {
                id,
            },
        }).then((res) => {
            setLoading(false);
            setStar(!star);
            if (!res.result && res.message) message.error(res.message);
        });
    };

    return (
        <Button
            loading={loading}
            onClick={() => onStar()}
            type={star ? 'default' : 'primary'}
            {...props}
        >
            {star ? '取消关注' : text}
        </Button>
    );
};
