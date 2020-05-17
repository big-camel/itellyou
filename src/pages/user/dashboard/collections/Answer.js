import React, { useEffect, useState } from 'react';
import { Table, Button, Popover } from 'antd';
import Loading from '@/components/Loading';
import { Link, useDispatch, useSelector } from 'umi';
import Timer from '@/components/Timer';

export default () => {
    const [page, setPage] = useState(1);
    const limit = 20;
    const [followLoading, setFollowLoading] = useState({});

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.answerStar ? state.answerStar.list : null));
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['answerStar/list'];

    useEffect(() => {
        dispatch({
            type: 'answerStar/list',
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
            type: `answerStar/${type}`,
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
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (
                _,
                {
                    answer: {
                        question_id,
                        question: { title },
                        id,
                        description,
                    },
                },
            ) => {
                return (
                    <Popover placement="bottomLeft" content={description}>
                        <Link
                            className="table-column-title"
                            to={`/question/${question_id}/answer/${id}`}
                        >
                            {title}
                        </Link>
                    </Popover>
                );
            },
        },
        {
            title: '收藏时间',
            dataIndex: 'created_time',
            key: 'created_time',
            width: 120,
            render: (text, { answer: { use_star } }) => {
                if (use_star === false) return;
                return <Timer time={text} />;
            },
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            render: (_, { answer: { id, use_star } }) => {
                if (use_star === false) {
                    return (
                        <Button loading={followLoading[id]} onClick={() => onStar(id, use_star)}>
                            收藏
                        </Button>
                    );
                }
                return (
                    <Button loading={followLoading[id]} onClick={() => onStar(id, use_star)}>
                        取消收藏
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
                    rowKey={row => row.answer.id}
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
