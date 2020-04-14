import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Card, Avatar } from 'antd';
import Loading from '@/components/Loading';
import { Link } from 'umi';
import List from '@/components/List';
import styles from './index.less';

export default ({ id }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'article/list',
            payload: {
                type: 'hot',
                tag_id: id,
                offset: 0,
                limit: 5,
            },
        });
    }, [dispatch]);

    const renderItem = ({ id, title }) => {
        return (
            <List.Item key={id}>
                <div className={styles['hot-item']}>
                    <div className={styles['info']}>
                        <h2 className={styles['title']}>
                            <Link to={`/article/${id}`}>{title}</Link>
                        </h2>
                    </div>
                </div>
            </List.Item>
        );
    };

    const dataSource = useSelector(state => state.column.list);
    if (!dataSource) return <Loading />;
    return (
        <Card title="推荐文章">
            {<List dataSource={dataSource.data} renderItem={renderItem} />}
        </Card>
    );
};
