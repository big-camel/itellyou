import React, { useEffect, useState } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import { MoreList } from '@/components/List';
import getVerb from '@/utils/operational/getVerb';
import Timer from '@/components/Timer';
import { Article, Answer } from '@/components/Content';
import { Space, Avatar } from 'antd';
import styles from './Activity.less';

const fetchList = (dispatch, offset, limit, id, params) => {
    return dispatch({
        type: 'userActivity/list',
        payload: {
            append: offset !== 0,
            offset,
            limit,
            id,
            ...params,
        },
    });
};

const Activity = ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector((state) => state.userActivity.list);

    const renderColumn = ({ name, avatar, path, description }) => {
        return (
            <div className={styles['column']}>
                <div className={styles['avatar']}>
                    <Avatar src={avatar} size={38} shape="circle" />
                </div>
                <div className={styles['content']}>
                    <h2>
                        <Link to={`/${path}`}>{name}</Link>
                    </h2>
                    <p>{description}</p>
                </div>
            </div>
        );
    };

    const renderTag = ({ id, name, description }) => {
        return (
            <div className={styles['tag']}>
                <h2>
                    <Link to={`/tag/${id}`}>{name}</Link>
                </h2>
                <p>{description}</p>
            </div>
        );
    };

    const renderAnswer = ({ id, question: { title, ...question }, ...target }) => {
        return (
            <div>
                <h2 className={styles['question-title']}>
                    <Link to={`/question/${question.id}/answer/${id}`}>{title}</Link>
                </h2>
                <Answer data={{ ...target, id }} desc={true} authorSize="small" />
            </div>
        );
    };

    const renderArticle = (target) => {
        return <Article data={target} desc={true} authorSize="small" />;
    };

    const renderQuestion = ({ id, title }) => {
        return (
            <h2>
                <Link to={`/question/${id}`}>{title}</Link>
            </h2>
        );
    };

    const renderOperational = (type, target) => {
        switch (type) {
            case 'column':
                return renderColumn(target);
            case 'tag':
                return renderTag(target);
            case 'answer':
                return renderAnswer(target);
            case 'question':
                return renderQuestion(target);
            case 'article':
                return renderArticle(target);
        }
    };

    const renderItem = ({ id, created_time, action, type, target }) => {
        const verb = getVerb(action, type);
        return (
            <MoreList.Item key={id}>
                <div className={styles['verb']}>
                    {
                        <Space>
                            {verb}
                            <Timer time={created_time} />
                        </Space>
                    }
                </div>
                {renderOperational(type, target)}
            </MoreList.Item>
        );
    };
    return (
        <MoreList
            itemLayout="vertical"
            offset={offset}
            limit={limit}
            renderItem={renderItem}
            dataSource={dataSource}
            onChange={(offset) => {
                setOffset(offset);
                fetchList(dispatch, offset, limit, id);
            }}
        />
    );
};

Activity.getInitialProps = async ({ isServer, store, params: { id, ...params } }) => {
    const { dispatch, getState } = store;

    await fetchList(dispatch, 0, 20, id, params);

    if (isServer) return getState();
};

export default Activity;
