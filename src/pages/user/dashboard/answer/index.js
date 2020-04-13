import React, { useEffect, useState } from 'react';
import { Table, Popover, Tag } from 'antd';
import Layout from '../components/Layout';
import Loading from '@/components/Loading';
import { Link, useDispatch, useSelector } from 'umi';
import CardTable from '../components/CardTable';

export default () => {
    const [page, setPage] = useState(1);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.userAnswer ? state.userAnswer.list : null));
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['userAnswer/list'];

    useEffect(() => {
        dispatch({
            type: 'userAnswer/list',
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
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (_, { question: { title, description }, question_id, id }) => {
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
            title: '是否采纳',
            dataIndex: 'answers',
            key: 'answers',
            width: 120,
            render: (_, { adopted }) => {
                return adopted ? <Tag color="success">已采纳</Tag> : '';
            },
        },
        {
            title: '评论',
            dataIndex: 'comments',
            key: 'comments',
            width: 80,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (_, { published, draft_version, version }) => {
                return (
                    <Tag>
                        {draft_version > version ? '未更新' : published ? '已发布' : '未发布'}{' '}
                    </Tag>
                );
            },
        },
        {
            dataIndex: 'action',
            key: 'action',
            width: 80,
            render: (_, { question_id, id }) => {
                return <Link to={`/question/${question_id}/answer/${id}`}>编辑</Link>;
            },
        },
    ];

    const renderTable = () => {
        if (!dataSource) return <Loading />;
        return (
            <Loading loading={loading}>
                <Table
                    rowKey={row => row.id}
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

    return (
        <Layout defaultKey="answer">
            <CardTable>{renderTable()}</CardTable>
        </Layout>
    );
};
