import React, { useState, useEffect } from 'react';
import { MoreList } from '@/components/List';
import { useDispatch, useSelector } from 'umi';
import { Article } from '@/components/Content';

const fetchList = (dispatch, offset, limit, id, params) => {
    return dispatch({
        type: 'article/list',
        payload: {
            append: offset !== 0,
            offset,
            limit,
            user_id: id,
            ...params,
        },
    });
};

const UserArticle = ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.article.list);

    const renderItem = item => {
        return (
            <MoreList.Item key={item.id}>
                <Article data={item} desc={true} authorSize="small" />
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

UserArticle.getInitialProps = async ({ isServer, store, params: { id, ...params } }) => {
    const { dispatch, getState } = store;

    await fetchList(dispatch, 0, 20, id, params);

    if (isServer) return getState();
};

export default UserArticle;
