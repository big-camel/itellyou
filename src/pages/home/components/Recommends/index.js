import React, { useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { MoreList } from '@/components/List';
import { Article, Question } from '@/components/Content';
import Ad from '@/components/Ad';

const Recommends = () => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector((state) => state.explore.recommends);
    const ad = useSelector((state) => state.ad.detail);

    const loadData = (offset, limit) => {
        dispatch({
            type: 'explore/recommends',
            payload: {
                append: true,
                offset,
                limit,
            },
        });
    };
    if (dataSource && dataSource.data && dataSource.data.length > 3) {
        if (dataSource.data[2].type !== 'AD' && ad && Object.keys(ad).length > 0) {
            dataSource.data.splice(2, 0, {
                type: 'AD',
            });
        }
    }

    const renderArticle = (item) => {
        return <Article data={item} desc={true} authorSize="small" />;
    };

    const renderQuestion = (item) => {
        return <Question data={item} number={false} tag={false} authorSize="small" />;
    };

    const renderItem = ({ type, object }) => {
        if (type === 'AD')
            return (
                <MoreList.Item>
                    <Ad />
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
            onChange={(offset) => {
                setOffset(offset);
                loadData(offset, limit);
            }}
            renderItem={renderItem}
        />
    );
};
export default Recommends;
