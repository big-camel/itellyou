import React from 'react';
import { useSelector } from 'umi';
import { Card } from 'antd';
import Loading from '@/components/Loading';
import { Link } from 'umi';
import List from '@/components/List';
import styles from './index.less';

const RelatedArticle = () => {
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

RelatedArticle.getInitialProps = async ({ isServer, store, params: { id, ...params } }) => {
    const { dispatch, getState } = store;

    await dispatch({
        type: 'article/list',
        payload: {
            type: 'hot',
            tag_id: id,
            offset: 0,
            limit: 5,
            ...params,
        },
    });

    if (isServer) return getState();
};

export default RelatedArticle;
