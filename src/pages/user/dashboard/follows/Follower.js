import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Table } from 'antd';
import Loading from '@/components/Loading';
import Timer from '@/components/Timer';
import CardTable from '../components/CardTable';
import { UserAuthor } from '@/components/User';

export default () => {
    const [page, setPage] = useState(1);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.userStar ? state.userStar.followerList : null));
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['userStar/followerList'];

    useEffect(() => {
        dispatch({
            type: 'userStar/followerList',
            payload: {
                offset: (page - 1) * limit,
                limit,
            },
        });
    }, [page, limit, dispatch]);

    const renderPage = (_, type, originalElement) => {
        if (type === 'prev') {
            return <a>上一页</a>;
        }
        if (type === 'next') {
            return <a>下一页</a>;
        }
        return originalElement;
    };

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            render: (_, { follower }) => {
                return <UserAuthor info={follower} />;
            },
        },
        {
            title: '关注时间',
            dataIndex: 'created_time',
            key: 'created_time',
            width: 120,
            render: text => {
                return <Timer time={new Date(text)} />;
            },
        },
    ];

    const renderTable = () => {
        if (!dataSource) return <Loading />;
        return (
            <Loading loading={loading}>
                <Table
                    rowKey={row => row.follower.id}
                    columns={columns}
                    dataSource={dataSource.data}
                    pagination={{
                        onChange: page => {
                            setPage(page);
                        },
                        current: page,
                        itemRender: renderPage,
                        hideOnSinglePage: true,
                        pageSize: limit,
                        total: dataSource ? dataSource.total : 0,
                    }}
                />
            </Loading>
        );
    };

    return renderTable();
};
