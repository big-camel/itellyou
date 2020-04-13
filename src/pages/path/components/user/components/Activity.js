import React, { useEffect, useState } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import { MoreList } from '@/components/List';
import getVerb from '@/utils/operational/getVerb';
import Timer from '@/components/Timer';
import { Article, Answer } from '@/components/Content';
import { Space, Avatar } from 'antd';
import styles from './Activity.less';

export default ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.userActivity.list);

    useEffect(() => {
        dispatch({
            type: 'userActivity/list',
            payload: {
                append: true,
                offset,
                limit,
                id,
            },
        });
    }, [id, offset, limit, dispatch]);

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

    const renderTag = ({ id, name }) => {
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
                <h2>
                    <Link to={`/question/${question.id}/answer/${id}`}>{title}</Link>
                </h2>
                <Answer data={{ ...target, id }} desc={true} />
            </div>
        );
    };

    const renderArticle = target => {
        return <Article data={target} desc={true} />;
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
            onChange={offset => setOffset(offset)}
        />
    );
};
