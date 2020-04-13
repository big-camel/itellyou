import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, Link } from 'umi';
import { Table, Button, Avatar } from 'antd';
import Loading from '@/components/Loading';
import Timer from '@/components/Timer';
import styles from './index.less';

export default () => {
    const [page, setPage] = useState(1);
    const limit = 20;
    const [followLoading, setFollowLoading] = useState({});

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.columnStar ? state.columnStar.list : null));
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['columnStar/list'];

    useEffect(() => {
        dispatch({
            type: 'columnStar/list',
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

    const onStar = (id, use_star) => {
        setFollowLoading(loading => {
            return {
                ...loading,
                [id]: true,
            };
        });

        const type = use_star === false ? 'follow' : 'unfollow';
        dispatch({
            type: `columnStar/${type}`,
            payload: {
                id,
            },
        }).then(() => {
            setFollowLoading(loading => {
                return {
                    ...loading,
                    [id]: false,
                };
            });
        });
    };

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            render: (_, { column: { id, name, path, avatar, description } }) => {
                return (
                    <div className={styles['column-title']}>
                        <div className={styles['avatar']}>
                            <Avatar shape="circle" size={38} src={avatar} />
                        </div>
                        <div className={styles['content']}>
                            <Link to={`/${path}`}>{name}</Link>
                            <p>{description}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            title: '关注时间',
            dataIndex: 'created_time',
            key: 'created_time',
            width: 120,
            render: (text, { column: { use_star } }) => {
                if (use_star === false) return;
                return <Timer time={new Date(text)} />;
            },
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            render: (_, { column: { id, use_star } }) => {
                if (use_star === false) {
                    return (
                        <Button loading={followLoading[id]} onClick={() => onStar(id, use_star)}>
                            关注
                        </Button>
                    );
                }
                return (
                    <Button loading={followLoading[id]} onClick={() => onStar(id, use_star)}>
                        取消关注
                    </Button>
                );
            },
        },
    ];

    const renderTable = () => {
        if (!dataSource) return <Loading />;
        return (
            <Loading loading={loading}>
                <Table
                    rowKey={row => row.column.id}
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
