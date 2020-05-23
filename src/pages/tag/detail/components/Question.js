import React, { useState, useEffect } from 'react';
import { MoreList } from '@/components/List';
import { useDispatch, useSelector } from 'umi';
import { Question } from '@/components/Content';

const fetchList = (dispatch, offset, limit, id, parmas) => {
    return dispatch({
        type: 'question/list',
        payload: {
            append: offset !== 0,
            offset,
            limit,
            child: 1,
            tag_id: id,
            ...parmas,
        },
    });
};

const TagQuestion = ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.question.list);

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
            onChange={offset => {
                setOffset(offset);
                fetchList(dispatch, offset, limit, id);
            }}
        />
    );
};

TagQuestion.getInitialProps = async ({ isServer, store, params: { id, ...params } }) => {
    const { dispatch, getState } = store;

    await await fetchList(dispatch, 0, 20, id, params);

    if (isServer) return getState();
};

export default TagQuestion;
