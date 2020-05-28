import React, { useState } from 'react';
import { Table, Popover, Tag, Space, Tooltip } from 'antd';
import Layout from '../components/Layout';
import Loading from '@/components/Loading';
import { Link, useDispatch, useSelector } from 'umi';
import CardTable from '../components/CardTable';
import { EditButton } from '@/components/Button';
import { Answer } from '@/components/Content';

const fetchList = (dispatch, offset, limit, parmas) => {
    return dispatch({
        type: 'userAnswer/list',
        payload: {
            append: offset > 0,
            offset,
            limit,
            ...parmas,
        },
    });
};

const UserAnswer = () => {
    const [page, setPage] = useState(1);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.userAnswer ? state.userAnswer.list : null));
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['userAnswer/list'];

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
            render: (_, { question: { title }, question_id, description, id, published }) => {
                let url = `/question/${question_id}`;
                if (published) url += `/answer/${id}`;
                return (
                    <Popover
                        placement="bottomLeft"
                        content={
                            <div style={{ maxWidth: 380, wordBreak: 'break-word' }}>
                                {description || '无摘要'}
                            </div>
                        }
                    >
                        <Link className="table-column-title" to={url}>
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
                        {draft_version > version && version !== 0
                            ? '未更新'
                            : published
                            ? '已发布'
                            : '未发布'}{' '}
                    </Tag>
                );
            },
        },
        {
            dataIndex: 'action',
            key: 'action',
            width: 80,
            render: (_, { question_id, id, published }) => {
                let url = `/question/${question_id}`;
                if (published) url += `/answer/${id}`;
                return (
                    <Space>
                        <Tooltip title="编辑">
                            <Link to={url}>
                                <EditButton onlyIcon={true} />
                            </Link>
                        </Tooltip>
                        <Tooltip title="删除">
                            <a>
                                <Answer.Delete
                                    id={id}
                                    question_id={question_id}
                                    onlyIcon={true}
                                    allow_delete={true}
                                />
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
                            fetchList(dispatch, (page - 1) * limit, limit);
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

UserAnswer.getInitialProps = async ({ isServer, store, params }) => {
    const { dispatch, getState } = store;
    await fetchList(dispatch, 0, 20, params);
    if (isServer) return getState();
};

export default UserAnswer;
