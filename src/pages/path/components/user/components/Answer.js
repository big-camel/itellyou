import React, { useState } from 'react';
import { MoreList } from '@/components/List';
import { useDispatch, useSelector } from 'umi';
import { Question } from '@/components/Content';

const fetchList = (dispatch, offset, limit, id, params) => {
    return dispatch({
        type: 'answer/list',
        payload: {
            append: offset !== 0,
            offset,
            limit,
            user_id: id,
            ...params,
        },
    });
};

const Answer = ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector((state) => state.answer.list);

    const renderItem = ({ question, ...item }) => {
        return (
            <MoreList.Item key={item.id}>
                <Question
                    data={{ ...question, answer_list: [item] }}
                    tag={false}
                    number={false}
                    authorSize="small"
                />
            </MoreList.Item>
        );
    };

    return (
        <MoreList
            offset={offset}
            limit={limit}
            renderItem={renderItem}
            dataSource={dataSource}
            onChange={(offset) => {
                setOffset(offset);
                fetchList(dispatch, 0, limit, id);
            }}
        />
    );
};

Answer.getInitialProps = async ({ isServer, store, params: { id, ...params } }) => {
    const { dispatch, getState } = store;

    await fetchList(dispatch, 0, 20, id, params);

    if (isServer) return getState();
};

export default Answer;
