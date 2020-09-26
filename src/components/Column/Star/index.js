import React, { useState } from 'react';
import { useDispatch } from 'umi';
import { Button, message } from 'antd';

export default ({ id, use_star, text, ...props }) => {
    const [loading, setLoading] = useState(false);
    text = text || '关注';
    const dispatch = useDispatch();

    const onStar = () => {
        if (loading) return;
        setLoading(true);
        const type = use_star === false ? 'follow' : 'unfollow';
        dispatch({
            type: `columnStar/${type}`,
            payload: {
                id,
            },
        }).then((res) => {
            setLoading(false);
            if (!res.result && res.message) message.error(res.message);
        });
    };

    return (
        <Button
            loading={loading}
            onClick={() => onStar()}
            type={use_star ? 'default' : 'primary'}
            {...props}
        >
            {use_star ? '取消关注' : text}
        </Button>
    );
};
