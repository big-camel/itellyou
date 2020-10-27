import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { message, Space, Table } from 'antd';
import Loading from '@/components/Loading';
import DateSelect from './DateSelect';
import Group from './Group';
import { searchByContent } from '../../service';

const fetchList = (parmas) => {
    return searchByContent(parmas);
};

const renderPage = (_, type, originalElement) => {
    if (type === 'prev') {
        return <a>上一页</a>;
    }
    if (type === 'next') {
        return <a>下一页</a>;
    }
    return originalElement;
};

const Single = ({ type }) => {
    const columns = [
        {
            title: type === 'article' ? '文章标题' : '回答内容',
            dataIndex: type === 'article' ? 'title' : 'description',
            ellipsis: true,
            render: (text, { id, ...record }) => {
                let link;
                if (type === 'article') link = `/article/${id}`;
                else link = `/question/${record.question_id}/answer/${id}`;
                return (
                    <a target="_blank" href={link}>
                        {text}
                    </a>
                );
            },
        },
        {
            title: '发布时间',
            dataIndex: 'created_time',
            showSorterTooltip: false,
            sorter: true,
            render: (text) => moment(text).format('YYYY月MM日DD Ah:mm'),
        },
        {
            title: '阅读数',
            dataIndex: 'view_count',
            showSorterTooltip: false,
            width: 100,
            sorter: true,
        },
        {
            title: '评论数',
            dataIndex: 'comment_count',
            showSorterTooltip: false,
            width: 100,
            sorter: true,
        },
        {
            title: '点赞数',
            dataIndex: 'support_count',
            showSorterTooltip: false,
            width: 100,
            sorter: true,
        },
        {
            title: '收藏数',
            dataIndex: 'star_count',
            showSorterTooltip: false,
            width: 100,
            sorter: true,
        },
    ];
    const [dateRange, setDateRange] = useState();
    const [order, setOrder] = useState({});
    const [page, setPage] = useState(1);
    const [dataSource, setDataSource] = useState({});
    const limit = 10;

    useEffect(() => {
        fetchList({
            type,
            ...dateRange,
            offset: (page - 1) * limit,
            limit,
            ...order,
        }).then(({ result, data, ...res }) => {
            if (result) {
                setDataSource(data);
            } else {
                message.error(res.message);
            }
        });
    }, [dateRange, page, order, type]);

    const onDateChange = (begin, end) => {
        setDateRange({
            begin,
            end,
        });
    };

    const renderTable = () => {
        return (
            <Loading loading={!dataSource.data}>
                <Table
                    rowKey={(row) => row.id}
                    columns={columns}
                    dataSource={dataSource.data}
                    expandable={{
                        expandRowByClick: true,
                        expandedRowRender: ({ id }) => (
                            <Group type={type} id={id} showDetail={false} />
                        ),
                    }}
                    onChange={(pagination, _, sorter, { action }) => {
                        switch (action) {
                            case 'paginate':
                                setPage(pagination.current);
                                break;
                            case 'sort':
                                if (sorter.column) {
                                    setOrder({
                                        order_field: sorter.field,
                                        order_sort: sorter.order,
                                    });
                                } else {
                                    setOrder({});
                                }
                                break;
                        }
                    }}
                    pagination={{
                        onChange: (page) => {
                            setPage(page);
                        },
                        itemRender: renderPage,
                        hideOnSinglePage: true,
                        showSizeChanger: false,
                        showLessItems: true,
                        position: ['bottomCenter'],
                        current: page,
                        pageSize: limit,
                        total: dataSource.total,
                    }}
                />
            </Loading>
        );
    };

    return (
        <>
            <Space direction="vertical">
                <DateSelect onChange={onDateChange} />
                {renderTable()}
            </Space>
        </>
    );
};

Single.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;
    if (isServer) return getState();
};

export default Single;
