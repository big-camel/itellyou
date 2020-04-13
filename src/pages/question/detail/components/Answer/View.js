import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Card } from 'antd';
import List from '@/components/List';
import styles from './Answer.less';
import Loading from '@/components/Loading';
import { Answer } from '@/components/Content';

function AnswerView({ question_id, answer_id, title }) {
    const dispatch = useDispatch();
    const detail = useSelector(state => (state.answer ? state.answer.detail : null));
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['answer/find'];

    useEffect(() => {
        if (question_id && answer_id) {
            dispatch({
                type: 'answer/find',
                payload: {
                    question_id,
                    id: answer_id,
                },
            });
        }
    }, [question_id, answer_id, dispatch]);

    const renderItem = item => {
        return (
            <List.Item key={item.id}>
                <Answer data={item} />
            </List.Item>
        );
    };
    if (loading) return <Loading />;
    const data = detail ? [detail] : [];
    return (
        <Card title={title && <h2 className={styles['answer-title']}>{title}</h2>}>
            <List dataSource={data} renderItem={renderItem} itemLayout="vertical" />
        </Card>
    );
}
export default AnswerView;
