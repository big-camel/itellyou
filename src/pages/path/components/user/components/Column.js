import React, { useState } from 'react';
import { Avatar, Space } from 'antd';
import { useDispatch, useSelector } from 'umi';
import { MoreList } from '@/components/List';
import { ColumnDetail } from '@/components/Column';
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
    const dataSource = useSelector((state) => state.column.list);

    const renderItem = (item) => {
        const { name, description, avatar, path, article_count, star_count } = item;
        return (
            <MoreList.Item key={item.id}>
                <div className={styles['column']}>
                    <ColumnDetail info={item} />
                    <div className={styles['info']}>
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
            onChange={(offset) => {
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
