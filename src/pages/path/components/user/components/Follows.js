import React, { useState, useEffect } from 'react';
import { MoreList } from '@/components/List';
import { useDispatch, useSelector } from 'umi';
import { UserAuthor, UserStar } from '@/components/User';

const fetchList = (dispatch, offset, limit, id, params) => {
    return dispatch({
        type: 'userStar/starList',
        payload: {
            append: offset !== 0,
            offset,
            limit,
            user_id: id,
            ...params,
        },
    });
};

const UserFollows = ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.userStar.starList);

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
            onChange={offset => {
                setOffset(offset);
                fetchList(dispatch, 0, limit, id);
            }}
        />
    );
};

UserFollows.getInitialProps = async ({ isServer, store, params: { id, ...params } }) => {
    const { dispatch, getState } = store;

    await fetchList(dispatch, 0, 20, id, params);

    if (isServer) return getState();
};

export default UserFollows;
