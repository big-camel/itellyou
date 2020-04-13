import React, { useState } from 'react';
import { useDispatch } from 'umi';
import { StarOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';

export default ({ id, name, use_star, ...props }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const onStar = () => {
        if (loading) return;
        setLoading(true);
        const type = use_star ? 'unfollow' : 'follow';
        dispatch({
            type: `tagStar/${type}`,
            payload: {
                id,
                name,
            },
        }).then(res => {
            setLoading(false);
            if (!res.result) message.error(res.message);
        });
    };

    return (
        <Button
            icon={<StarOutlined />}
            loading={loading}
            type={use_star === true ? 'primary' : 'default'}
            onClick={onStar}
            {...props}
        >
            {use_star === true ? '已关注' : '关注'}
        </Button>
    );
};
