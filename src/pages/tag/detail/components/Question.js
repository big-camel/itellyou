import React, { useState, useEffect } from 'react';
import { MoreList } from '@/components/List';
import { useDispatch, useSelector } from 'umi';
import { Question } from '@/components/Content';
import Timer from '@/components/Timer';

export default ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.question.list);

    useEffect(() => {
        dispatch({
            type: 'question/list',
            payload: {
                append: offset !== 0,
                offset,
                limit,
                child: 1,
                tag_id: id,
            },
        });
    }, [id, offset, limit, dispatch]);

    const renderItem = item => {
        return (
            <MoreList.Item key={item.id}>
                <div>
                    <Question data={item} number={false} authorSize="small" />
                </div>
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
