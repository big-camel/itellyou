import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { message, Space, Table } from 'antd';
import Loading from '@/components/Loading';
import DateSelect from './DateSelect';
import Chart from './Chart';
import { searchByList } from '../../service';

const columns = [
    {
        title: '日期',
        dataIndex: 'date',
        showSorterTooltip: false,
        sorter: (prev, next) => moment(prev.date).valueOf() - moment(next.date).valueOf(),
    },
    {
        title: '打赏',
        dataIndex: 'tip_amount',
        showSorterTooltip: false,
        sorter: (prev, next) => prev.tip_amount - next.tip_amount,
    },
    {
        title: '悬赏',
        dataIndex: 'reward_amount',
        showSorterTooltip: false,
        sorter: (prev, next) => prev.reward_amount - next.reward_amount,
    },
    {
        title: '分成',
        dataIndex: 'sharing_amount',
        showSorterTooltip: false,
        sorter: (prev, next) => prev.sharing_amount - next.sharing_amount,
    },
    {
        title: '售卖',
        dataIndex: 'sell_amount',
        showSorterTooltip: false,
        sorter: (prev, next) => prev.sell_amount - next.sell_amount,
    },
    {
        title: '总计',
        dataIndex: 'total_amount',
        showSorterTooltip: false,
        sorter: (prev, next) => prev.total_amount - next.total_amount,
    },
];

const fetchList = (parmas) => {
    return searchByList(parmas);
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

const List = () => {
    const [dateRange, setDateRange] = useState();
    const [page, setPage] = useState(1);
    const [dataSource, setDataSource] = useState();
    const limit = 10;

    useEffect(() => {
        if (!dateRange) return;
        const { begin, end, day } = dateRange;
        fetchList({ begin, end }).then(({ result, data, ...res }) => {
            if (result) {
                const newDataSource = [];
                for (let d = 0; d < day; d++) {
                    const date = moment(end).subtract(d, 'days').format('YYYY-MM-DD');
                    const dataItem = data.find((item) => item.date === date);
                    if (dataItem === undefined) {
                        newDataSource.push({
                            date,
                            total_amount: 0,
                            tip_amount: 0,
                            reward_amount: 0,
                            sharing_amount: 0,
                            sell_amount: 0,
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
    }, [dateRange]);

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
                {renderTable()}
            </Space>
        </>
    );
};

List.getInitialProps = async ({ isServer, store }) => {
    const { getState } = store;
    if (isServer) return getState();
};

export default List;
