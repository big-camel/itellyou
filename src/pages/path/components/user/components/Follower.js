import React, { useState, useEffect } from 'react';
import { MoreList } from '@/components/List';
import { useDispatch, useSelector } from 'umi';
import { UserStar, UserAuthor } from '@/components/User';

export default ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.userStar.followerList);

    useEffect(() => {
        dispatch({
            type: 'userStar/followerList',
            payload: {
                append: offset !== 0,
                offset,
                limit,
                user_id: id,
            },
        });
    }, [id, offset, limit, dispatch]);

    const renderItem = ({ follower }) => {
        const { id, use_star } = follower;
        return (
            <MoreList.Item key={id}>
                <UserAuthor info={follower} />
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
