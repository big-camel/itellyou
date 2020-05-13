import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import { MoreList } from '@/components/List';
import { Article, Question } from '@/components/Content';
import { GoogleHorizontal } from '@/components/AdSense';

export default () => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'explore/recommends',
            payload: {
                offset,
                limit,
            },
        });
    }, [offset, limit, dispatch]);

    const dataSource = useSelector(state => state.explore.recommends);

    if (dataSource && dataSource.data.length > 3) {
        dataSource.data.splice(2, 0, {
            type: 'AD',
        });
    }

    const renderArticle = item => {
        return <Article data={item} desc={true} authorSize="small" />;
    };

    const renderQuestion = item => {
        return <Question data={item} number={false} tag={false} authorSize="small" />;
    };

    const renderItem = ({ type, object }) => {
        if (type === 'AD')
            return (
                <MoreList.Item>
                    <GoogleHorizontal />
                </MoreList.Item>
            );
        return (
            <MoreList.Item>
                {type === 'article' && renderArticle(object)}
                {type === 'question' && renderQuestion(object)}
            </MoreList.Item>
        );
    };

    return (
        <MoreList
            offset={offset}
            limit={limit}
            dataSource={dataSource}
            onChange={offset => setOffset(offset)}
            renderItem={renderItem}
        />
    );
};
