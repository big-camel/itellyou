import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, Link } from 'umi';
import { Table, Tag, Space, Tooltip } from 'antd';
import Layout from '../components/Layout';
import Loading from '@/components/Loading';
import CardTable from '../components/CardTable';
import { Question } from '@/components/Content';
import { EditButton } from '@/components/Button';

export default () => {
    const [page, setPage] = useState(1);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.userQuestion ? state.userQuestion.list : null));
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['userQuestion/list'];

    useEffect(() => {
        dispatch({
            type: 'userQuestion/list',
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
            render: (text, { id }) => {
                return (
                    <Link className="table-column-title" to={`/question/${id}`}>
                        {text}
                    </Link>
                );
            },
        },
        {
            title: '回答数',
            dataIndex: 'answers',
            key: 'answers',
            width: 120,
            render: (text, { adopted }) => {
                return (
                    <Space>
                        {text}
                        {adopted && <Tag color="success">已解决</Tag>}
                    </Space>
                );
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
            render: (_, { id, title }) => {
                return (
                    <Space>
                        <Tooltip title="编辑">
                            <Link to={`/question/${id}/edit`}>
                                <EditButton onlyIcon={true} />
                            </Link>
                        </Tooltip>
                        <Tooltip title="删除">
                            <a>
                                <Question.Delete onlyIcon={true} id={id} title={title} />
                            </a>
                        </Tooltip>
                    </Space>
                );
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
        <Layout defaultKey="question">
            <CardTable>{renderTable()}</CardTable>
        </Layout>
    );
};
