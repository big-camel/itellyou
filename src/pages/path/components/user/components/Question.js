import React, { useState, useEffect } from 'react';
import { MoreList } from '@/components/List';
import { useDispatch, useSelector } from 'umi';
import { Question } from '@/components/Content';
import Timer from '@/components/Timer';
import { Space } from 'antd';

export default ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.question.list);

    useEffect(() => {
        dispatch({
            type: 'question/list',
            payload: {
                append: true,
                offset,
                limit,
                user_id: id,
            },
        });
    }, [id, offset, limit, dispatch]);

    const renderItem = item => {
        const { created_time, answers, star_count } = item;
        return (
            <MoreList.Item key={item.id}>
                <div>
                    <Question data={item} tag={false} number={false} authorSize="small" />
                    <Space>
                        <Timer time={created_time} />
                        <span>
                            <strong>{answers}</strong> 个回答
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
            onChange={offset => setOffset(offset)}
        />
    );
};
