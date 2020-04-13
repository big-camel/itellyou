import React from 'react';
import { Link } from 'umi';
//import { CommentButton } from '@/components/Button'
//import { Vote , Favorite } from './Action'
import TagComponent from '@/components/Tag';
import styles from './index.less';
import Answer from '../Answer';
import { TagOutlined } from '@ant-design/icons';
import { Favorite } from './Action';
import { Tag, Space } from 'antd';

const Question = ({
    data: {
        id,
        title,
        description,
        answers,
        answer_list,
        tags,
        author,
        comment_count,
        reward_type,
        reward_value,
    },
    tag = true,
    number = true,
    authorSize,
}) => {
    const renderReward = () => {
        if (reward_type === 0) return null;
        let text = '积分';
        if (reward_type === 2) text = '元';
        return (
            <Tag color="orange" style={{ fontWeight: 'normal' }}>
                {reward_value}
                {text}
            </Tag>
        );
    };

    return (
        <div className={styles['item']}>
            <div className={styles['header']}>
                {number && (
                    <div className={styles['data']}>
                        <Link to={`/question/${id}`}>
                            <span className={styles['count']}>{answers}</span>
                            <span className={styles['name']}>回答</span>
                        </Link>
                    </div>
                )}

                <div className={styles['info']}>
                    <h2 className={styles['title']}>
                        <Link to={`/question/${id}`} dangerouslySetInnerHTML={{ __html: title }} />{' '}
                        {renderReward()}
                    </h2>
                    {tag && tags && tags.length > 0 && (
                        <Space className={styles['tags']}>
                            <TagOutlined />
                            {tags.map(({ id, name }) => (
                                <TagComponent
                                    className={styles['tag']}
                                    key={id}
                                    href={`/tag/${id}`}
                                    id={id}
                                    title={name}
                                />
                            ))}
                        </Space>
                    )}
                </div>
            </div>
            {answer_list.map(answer => (
                <Answer key={answer.id} data={answer} desc={true} authorSize={authorSize} />
            ))}
        </div>
    );
};
Question.Favorite = Favorite;
export default Question;
