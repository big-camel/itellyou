import React, { useState } from 'react';
import { useDispatch, useSelector, Link } from 'umi';
import { Table, Tag, Space, Tooltip } from 'antd';
import Layout from '../components/Layout';
import Loading from '@/components/Loading';
import CardMenu from '../components/CardMenu';
import { Question } from '@/components/Content';
import { EditButton } from '@/components/Button';

const fetchList = (dispatch, offset, limit, parmas) => {
    return dispatch({
        type: 'userQuestion/list',
        payload: {
            append: offset > 0,
            offset,
            limit,
            ...parmas,
        },
    });
};

const UserQuestion = () => {
    const [page, setPage] = useState(1);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector((state) =>
        state.userQuestion ? state.userQuestion.list : null,
    );
    const loadingEffect = useSelector((state) => state.loading);
    const loading = loadingEffect.effects['userQuestion/list'];

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
            ellipsis: true,
            render: (text, { id, published }) => {
                let url = `/question/${id}`;
                if (!published) url += '/edit';
                return (
                    <Link className="table-column-title" to={url}>
                        {text}
                    </Link>
                );
            },
        },
        {
            title: '回答数',
            dataIndex: 'answer_count',
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
            dataIndex: 'comment_count',
            width: 80,
        },
        {
            title: '状态',
            dataIndex: 'status',
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
            render: (_, { id, title, published }) => {
                let url = `/question/${id}`;
                if (!published) url += '/edit';
                return (
                    <Space>
                        <Tooltip title="编辑">
                            <Link to={url}>
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
                    rowKey={(row) => row.id}
                    columns={columns}
                    dataSource={dataSource.data}
                    pagination={{
                        onChange: (page) => {
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
        <Layout defaultKey="question">
            <CardMenu>{renderTable()}</CardMenu>
        </Layout>
    );
};

UserQuestion.getInitialProps = async ({ isServer, store, params }) => {
    const { dispatch, getState } = store;
    await fetchList(dispatch, 0, 20, params);
    if (isServer) return getState();
};

export default UserQuestion;
