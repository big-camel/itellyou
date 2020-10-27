import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { message, Space, Table } from 'antd';
import Loading from '@/components/Loading';
import DateSelect from './DateSelect';
import Chart from './Chart';
import { searchByDate } from '../../service';

const columns = [
    {
        title: '日期',
        dataIndex: 'date',
        showSorterTooltip: false,
        sorter: (prev, next) => moment(prev.date).valueOf() - moment(next.date).valueOf(),
    },
    {
        title: '阅读数',
        dataIndex: 'view_count',
        showSorterTooltip: false,
        sorter: (prev, next) => prev.view_count - next.view_count,
    },
    {
        title: '评论数',
        dataIndex: 'comment_count',
        showSorterTooltip: false,
        sorter: (prev, next) => prev.comment_count - next.comment_count,
    },
    {
        title: '点赞数',
        dataIndex: 'support_count',
        showSorterTooltip: false,
        sorter: (prev, next) => prev.support_count - next.support_count,
    },
    {
        title: '收藏数',
        dataIndex: 'star_count',
        showSorterTooltip: false,
        sorter: (prev, next) => prev.star_count - next.star_count,
    },
];

const fetchList = (parmas) => {
    return searchByDate(parmas);
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

const Group = ({ type, id, showDetail = true }) => {
    const [dateRange, setDateRange] = useState();
    const [page, setPage] = useState(1);
    const [dataSource, setDataSource] = useState();
    const limit = 10;

    useEffect(() => {
        if (!dateRange) return;
        const { begin, end, day } = dateRange;
        fetchList({ type, begin, end, id }).then(({ result, data, ...res }) => {
            if (result) {
                const newDataSource = [];
                for (let d = 0; d < day; d++) {
                    const date = moment(end).subtract(d, 'days').format('YYYY-MM-DD');
                    const dataItem = data.find((item) => item.date === date);
                    if (dataItem === undefined) {
                        newDataSource.push({
                            date,
                            view_count: 0,
                            comment_count: 0,
                            support_count: 0,
                            star_count: 0,
                        });
                    } else {
                        newDataSource.push(dataItem);
                    }
                }
                setPage(1);
                setDataSource(newDataSource);
            } else {
                message.error(res.message);
            }
        });
    }, [dateRange, type, id]);

    const onDateChange = (begin, end, day) => {
        setDateRange({
            begin,
            end,
            day,
        });
    };

    const renderTable = () => {
        return (
            <Loading loading={!dataSource}>
                <Table
                    rowKey={(row) => row.date}
                    columns={columns}
                    dataSource={dataSource}
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
                    }}
                />
            </Loading>
        );
    };

    return (
        <>
            <Space direction="vertical">
                <DateSelect onChange={onDateChange} defaultValue="7" />
                <Chart dataSource={dataSource} />
                {showDetail && renderTable()}
            </Space>
        </>
    );
};

Group.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;
    if (isServer) return getState();
};

export default Group;
