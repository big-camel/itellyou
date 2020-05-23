import React, { useState } from 'react';
import { MoreList } from '@/components/List';
import { useDispatch, useSelector } from 'umi';
import { UserStar, UserAuthor } from '@/components/User';

const fetchList = (dispatch, offset, limit, id, params) => {
    return dispatch({
        type: 'userStar/followerList',
        payload: {
            append: offset !== 0,
            offset,
            limit,
            user_id: id,
            ...params,
        },
    });
};

const UserFollower = ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.userStar.followerList);

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
            onChange={offset => {
                setOffset(offset);
                fetchList(dispatch, 0, limit, id);
            }}
        />
    );
};

UserFollower.getInitialProps = async ({ isServer, store, params: { id, ...params } }) => {
    const { dispatch, getState } = store;

    await fetchList(dispatch, 0, 20, id, params);

    if (isServer) return getState();
};

export default UserFollower;
