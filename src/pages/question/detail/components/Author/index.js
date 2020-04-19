import React from 'react';
import { Card } from 'antd';
import { UserAuthor, UserStar } from '@/components/User';
import styles from './index.less';

export default data => {
    const { id, use_star, question_count, article_count, answer_count, follower_count } = data;
    return (
        <div className={styles['author']}>
            <Card title="关于作者">
                <UserAuthor info={data} />
                <div className={styles['data']}>
                    <div className={styles['follow']}>
                        <div className={styles['item']}>
                            <div className={styles['text']}>问题</div>
                            <div className={styles['count']}>{question_count}</div>
                        </div>
                        <div className={styles['item']}>
                            <div className={styles['text']}>文章</div>
                            <div className={styles['count']}>{article_count}</div>
                        </div>
                        <div className={styles['item']}>
                            <div className={styles['text']}>回答</div>
                            <div className={styles['count']}>{answer_count}</div>
                        </div>
                        <div className={styles['item']}>
                            <div className={styles['text']}>关注者</div>
                            <div className={styles['count']}>{follower_count}</div>
                        </div>
                    </div>
                </div>
                <div className={styles['btn']}>
                    <UserStar
                        className={styles['star']}
                        id={id}
                        use_star={use_star}
                        type="primary"
                    />
                </div>
            </Card>
        </div>
    );
};
