import React, { useState } from 'react';
import { MoreList } from '@/components/List';
import { useDispatch, useSelector } from 'umi';
import { Question } from '@/components/Content';
import Timer from '@/components/Timer';
import { Space } from 'antd';

const fetchList = (dispatch, offset, limit, id, params) => {
    return dispatch({
        type: 'question/list',
        payload: {
            append: offset !== 0,
            offset,
            limit,
            user_id: id,
            ...params,
        },
    });
};

const UserQuestion = ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector((state) => state.question.list);

    const renderItem = (item) => {
        const { created_time, answer_count, star_count } = item;
        return (
            <MoreList.Item key={item.id}>
                <div>
                    <Question data={item} tag={false} number={false} authorSize="small" />
                    <Space>
                        <Timer time={created_time} />
                        <span>
                            <strong>{answer_count}</strong> 个回答
                        </span>
                        <span>
                            <strong>{star_count}</strong> 个关注
                        </span>
                    </Space>
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
            onChange={(offset) => {
                setOffset(offset);
                fetchList(dispatch, 0, limit, id);
            }}
        />
    );
};

UserQuestion.getInitialProps = async ({ isServer, store, params: { id, ...params } }) => {
    const { dispatch, getState } = store;

    await fetchList(dispatch, 0, 20, id, params);

    if (isServer) return getState();
};

export default UserQuestion;
