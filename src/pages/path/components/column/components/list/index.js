import React, { useEffect, useState } from 'react';
import { MoreList } from '@/components/List';
import { Article } from '@/components/Content';
import { useDispatch, useSelector } from 'umi';

const fetchList = (dispatch, offset, limit, id, params) => {
    return dispatch({
        type: 'article/list',
        payload: {
            offset,
            limit,
            column_id: id,
            ...params,
        },
    });
};

const ArticleList = ({ id, ...props }) => {
    const [offset, setOffset] = useState(parseInt(props.offset || 0));
    const limit = parseInt(props.limit || 20);

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.article.list);

    const renderItem = item => {
        return (
            <MoreList.Item key={item.id}>
                <Article data={item} authorSize="small" desc={true} />
            </MoreList.Item>
        );
    };

    return (
        <MoreList
            renderItem={renderItem}
            offset={offset}
            limit={limit}
            dataSource={dataSource}
            onChange={offset => {
                setOffset(offset);
                fetchList(dispatch, offset, limit, id);
            }}
        />
    );
};

ArticleList.getInitialProps = async ({ isServer, store, params: { id, ...params } }) => {
    const { dispatch, getState } = store;

    await fetchList(dispatch, 0, 20, id, params);

    if (isServer) return getState();
};

export default ArticleList;
