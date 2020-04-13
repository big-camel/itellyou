import React, { useState, useEffect } from 'react';
import { MoreList } from '@/components/List';
import { useDispatch, useSelector } from 'umi';
import { UserAuthor, UserStar } from '@/components/User';

export default ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.userStar.starList);

    useEffect(() => {
        dispatch({
            type: 'userStar/starList',
            payload: {
                append: true,
                offset,
                limit,
                user_id: id,
            },
        });
    }, [id, offset, limit, dispatch]);

    const renderItem = ({ star }) => {
        const { id, use_star } = star;
        return (
            <MoreList.Item key={id}>
                <UserAuthor info={star} />
                <UserStar id={id} use_star={use_star} />
            </MoreList.Item>
        );
    };

    return (
        <MoreList
            offset={offset}
            limit={limit}
            renderItem={renderItem}
            dataSource={dataSource}
            onChange={offset => setOffset(offset)}
        />
    );
};
