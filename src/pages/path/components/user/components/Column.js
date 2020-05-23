import React, { useState, useEffect } from 'react';
import { MoreList } from '@/components/List';
import { Avatar, Space } from 'antd';
import { Link, useDispatch, useSelector } from 'umi';
import styles from './Column.less';

const fetchList = (dispatch, offset, limit, id, params) => {
    return dispatch({
        type: 'column/list',
        payload: {
            append: offset !== 0,
            offset,
            limit,
            member_id: id,
            ...params,
        },
    });
};

const UserColumn = ({ id }) => {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.column.list);

    const renderItem = item => {
        const { name, description, avatar, path, article_count, star_count } = item;
        return (
            <MoreList.Item key={item.id}>
                <div className={styles['column']}>
                    <div className={styles['avatar']}>
                        <Avatar size={42} shape="circle" src={avatar} />
                    </div>
                    <div className={styles['info']}>
                        <h2 className={styles['title']}>
                            <Link to={`/${path}`}>{name}</Link>
                        </h2>
                        <div className={styles['desc']}>{description}</div>
                        <Space className={styles['status']}>
                            <Space>
                                <strong>{article_count}</strong> 篇文章
                            </Space>
                            <Space>
                                <strong>{star_count}</strong> 人关注
                            </Space>
                        </Space>
                    </div>
                </div>
            </MoreList.Item>
        );
    };

    return (
        <MoreList
            offset={offset}
            limit={limit}
            renderItem={renderItem}
            dataSource={dataSource}
            onChange={offset => {
                setOffset(offset);
                fetchList(dispatch, 0, limit, id);
            }}
        />
    );
};

UserColumn.getInitialProps = async ({ isServer, store, params: { id, ...params } }) => {
    const { dispatch, getState } = store;

    await fetchList(dispatch, 0, 20, id, params);

    if (isServer) return getState();
};

export default UserColumn;
