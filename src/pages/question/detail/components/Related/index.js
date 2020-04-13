import React, { useEffect } from 'react';
import { Card } from 'antd';
import List from '@/components/List';
import Loading from '@/components/Loading';
import { useDispatch, useSelector, Link } from 'umi';
import styles from './index.less';

export default ({ id }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'question/related',
            payload: {
                id,
                offset: 0,
                limit: 5,
            },
        });
    }, [id, dispatch]);

    const renderItem = ({ id, title }) => {
        return (
            <List.Item key={id}>
                <Link className={styles['related-link']} to={`/question/${id}`}>
                    {title}
                </Link>
            </List.Item>
        );
    };

    const dataSource = useSelector(state => state.question.related);
    if (!dataSource) return <Loading />;
    return (
        <Card title="相似问题">
            <List
                className={styles['related-list']}
                dataSource={dataSource.data}
                renderItem={renderItem}
            />
        </Card>
    );
};
