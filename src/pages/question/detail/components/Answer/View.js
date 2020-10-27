import React from 'react';
import { Redirect, useSelector } from 'umi';
import { Card } from 'antd';
import List from '@/components/List';
import Loading from '@/components/Loading';
import { Answer } from '@/components/Content';
import styles from './index.less';

function AnswerView({ title, answer_id }) {
    const answer = useSelector((state) => (state.answer ? state.answer : {}));
    const { detail, response_status } = answer;

    const loadingEffect = useSelector((state) => state.loading);
    const loading = loadingEffect.effects['answer/find'];

    const renderItem = (item) => {
        return (
            <List.Item key={item.id}>
                <Answer data={item} />
            </List.Item>
        );
    };

    if (response_status && response_status.id === answer_id && response_status > 200)
        return <Redirect to="/404" />;
    if (loading) return <Loading />;

    const data = detail ? [detail] : [];
    return (
        <Card title={title && <h2 className={styles['answer-title']}>{title}</h2>}>
            <List dataSource={data} renderItem={renderItem} itemLayout="vertical" />
        </Card>
    );
}

AnswerView.getInitialProps = async ({ isServer, question_id, answer_id, store, params }) => {
    const { dispatch, getState } = store;

    if (question_id && answer_id) {
        const state = getState();
        const { answer } = state;
        if (
            answer &&
            answer.response_status &&
            answer.response_status.id === answer_id &&
            answer.response_status.code > 200
        )
            return state;

        const response = await dispatch({
            type: 'answer/find',
            payload: {
                question_id,
                id: answer_id,
                ...params,
            },
        });
        if (!response || !response.result) return getState();
    }
    if (isServer) return getState();
};

export default AnswerView;
