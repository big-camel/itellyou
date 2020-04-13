import React, { useState, useEffect } from 'react';
import { MoreList } from '@/components/List';
import { useDispatch, useSelector } from 'umi';
import { UserAuthor } from '@/components/User';
import styles from './index.less';

export default () => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.userStar.followerList);

    useEffect(() => {
        dispatch({
            type: 'userStar/followerList',
            payload: {
                offset,
                limit,
                day: 30,
            },
        });
    }, [offset, limit, dispatch]);

    const renderItem = ({ follower }) => {
        const { id } = follower;
        return (
            <MoreList.Item key={id}>
                <UserAuthor info={follower} />
            </MoreList.Item>
        );
    };

    return (
        <div>
            <div className={styles['follower-list-title']}>这些人最近关注了你</div>
            <MoreList
                offset={offset}
                limit={limit}
                renderItem={renderItem}
                dataSource={dataSource}
                onChange={offset => setOffset(offset)}
            />
        </div>
    );
};
