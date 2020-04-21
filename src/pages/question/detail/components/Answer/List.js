import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { List, Card } from 'antd';
import { MoreList } from '@/components/List';
import { Answer } from '@/components/Content';
import styles from './Answer.less';
import { StarTwoTone } from '@ant-design/icons';
import Loading from '@/components/Loading';

function AnswerList({ question_id, exclude, title, ...props }) {
    const page = parseInt(props.page || 1);
    const limit = parseInt(props.size || 20);
    const [offset, setOffset] = useState((page - 1) * limit);
    const dispatch = useDispatch();
    const list = useSelector(state => (state.answer ? state.answer.list : null));
    const loadingState = useSelector(state => state.loading);
    const loading = loadingState.effects['answer/list'];

    useEffect(() => {
        if (question_id) {
            dispatch({
                type: 'answer/list',
                payload: {
                    question_id,
                    offset,
                    limit,
                    append: offset > 0,
                },
            });
        }
    }, [offset, limit, question_id, dispatch]);

    if (loading) return <Loading />;

    let data = list ? list.data || [] : [];

    const adopts = [];
    const answers = [];
    data.forEach(item => {
        if (!item || item.deleted) return;
        if (
            exclude &&
            ((Array.isArray(exclude) && exclude.indexOf(item.id) >= 0) || exclude === item.id)
        )
            return;
        if (item.adopted === true) {
            adopts.push(item);
        } else {
            answers.push(item);
        }
    });

    const renderHeader = () => {
        if (title) return <h2 className={styles['answer-title']}>{title}</h2>;
        return (
            <h2 className={styles['answer-title']}>
                {adopts.length > 0 ? '其它 ' : ''}
                {list ? list.total : 0} 个回答
            </h2>
        );
    };

    const renderItem = item => {
        return (
            <MoreList.Item key={item.id}>
                <Answer data={item} />
            </MoreList.Item>
        );
    };

    return (
        <div className={props.className}>
            {adopts.length > 0 && (
                <div className={styles['adopted-card']}>
                    <Card
                        title={
                            <h2 className={styles['answer-title']}>
                                <StarTwoTone /> 已采纳答案
                            </h2>
                        }
                    >
                        <List dataSource={adopts} renderItem={renderItem} />
                    </Card>
                </div>
            )}
            <Card title={renderHeader()}>
                <MoreList
                    dataSource={{ ...list, data: answers }}
                    renderItem={renderItem}
                    offset={offset}
                    limit={limit}
                    onChange={offset => setOffset(offset)}
                    itemLayout="vertical"
                />
            </Card>
        </div>
    );
}
export default AnswerList;
