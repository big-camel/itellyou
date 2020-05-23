import React from 'react';
import { Card } from 'antd';
import List from '@/components/List';
import Loading from '@/components/Loading';
import { useSelector, Link } from 'umi';
import styles from './index.less';

const QuestionRelated = () => {
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

QuestionRelated.getInitialProps = async ({ isServer, id, store, params }) => {
    const { dispatch, getState } = store;

    if (id) {
        await dispatch({
            type: 'question/related',
            payload: {
                id,
                offset: 0,
                limit: 5,
                ...params,
            },
        });
    }

    if (isServer) return getState();
};

export default QuestionRelated;
