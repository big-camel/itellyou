import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector, Link } from 'umi';
import { Card } from 'antd';
import timeUtils from '@/utils/time';
import Layout from '../components/Layout';
import { MoreList } from '@/components/List';
import styles from './index.less';

const UserHistory = () => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const prevTime = useRef();
    const dataSource = useSelector(state => (state.history ? state.history.list : null));

    useEffect(() => {
        dispatch({
            type: 'history/list',
            payload: {
                append: offset !== 0,
                offset,
                limit,
            },
        });
    }, [offset, limit, dispatch]);

    const renderUrl = (type, key) => {
        switch (type) {
            case 'article':
                return `/article/${key}`;
            case 'question':
                return `/question/${key}`;
            case 'tag':
                return `/tag/${key}`;
            default:
                return `/${type}/${key}`;
        }
    };

    const renderItem = ({ data_type, data_key, title, updated_time }) => {
        const time = timeUtils.format(updated_time, { tpl: 'YYYY-MM-DD' });
        const getTime = () => {
            if (time !== prevTime.current) {
                prevTime.current = time;
                return <time className={styles['time']}>{time}</time>;
            }
            return null;
        };

        return (
            <MoreList.Item className={styles['history-item']}>
                {getTime()}
                <div className={styles['content']}>
                    <h2>
                        <Link to={renderUrl(data_type, data_key)}>{title}</Link>
                    </h2>
                    <time>{timeUtils.format(updated_time, { tpl: 'HH:mm' })}</time>
                </div>
            </MoreList.Item>
        );
    };

    return (
        <Layout defaultKey="history">
            <Card>
                <MoreList
                    className={styles['history-list']}
                    itemLayout="vertical"
                    split={false}
                    offset={offset}
                    limit={limit}
                    onChange={offset => setOffset(offset)}
                    dataSource={dataSource}
                    renderItem={renderItem}
                />
            </Card>
        </Layout>
    );
};

UserHistory.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;

    if (isServer) return getState();
};

export default UserHistory;
