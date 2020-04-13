import React, { useState, useEffect } from 'react';
import { MoreList } from '@/components/List';
import { useDispatch, useSelector } from 'umi';
import { Article } from '@/components/Content';

export default ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.article.list);

    useEffect(() => {
        dispatch({
            type: 'article/list',
            payload: {
                append: true,
                offset,
                limit,
                user_id: id,
            },
        });
    }, [id, offset, limit, dispatch]);

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
            onChange={offset => setOffset(offset)}
        />
    );
};
