import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Table, Space } from 'antd';
import Loading from '@/components/Loading';
import Timer from '@/components/Timer';
import CardMenu from '../../components/CardMenu';
import { RouteContext } from '@/context';

const fetchList = (dispatch, offset, limit, parmas) => {
    return dispatch({
        type: 'bank/log',
        payload: {
            append: false,
            offset,
            limit,
            ...parmas,
        },
    });
};

const WalletLog = () => {
    const [page, setPage] = useState(1);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector((state) => (state.bank ? state.bank.list : null));
    const loadingEffect = useSelector((state) => state.loading);
    const loading = loadingEffect.effects['bank/log'];

    const renderPage = (_, type, originalElement) => {
        if (type === 'prev') {
            return <a>上一页</a>;
        }
        if (type === 'next') {
            return <a>下一页</a>;
        }
        return originalElement;
    };

    let columns = [
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: (text) => {
                if (text === 'credit') return '积分';
                if (text === 'cash') return '余额';
                if (text === 'score') return '等级分';
                return '未知';
            },
        },
        {
            title: '变动额度',
            dataIndex: 'amount',
            key: 'amount',
            width: 120,
        },
        {
            title: '余额',
            dataIndex: 'balance',
            key: 'balance',
            width: 120,
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '创建时间',
            dataIndex: 'created_time',
            key: 'created_time',
            width: 120,
            render: (text) => {
                return <Timer time={text} />;
            },
        },
    ];

    const { isMobile } = useContext(RouteContext);

    if (isMobile) {
        columns.splice(1, columns.length - 1);
        columns.push({
            title: '详情',
            key: 'info',
            render: (_, { created_time, remark, amount, balance }) => {
                return (
                    <Space direction="vertical">
                        <Space>
                            <span>{created_time}</span>
                            <span>{remark}</span>
                        </Space>
                        <Space>
                            <span>
                                变动：<strong>{amount}</strong>
                            </span>
                            <span>
                                余额：<strong>{balance}</strong>
                            </span>
                        </Space>
                    </Space>
                );
            },
        });
    }

    const renderTable = () => {
        if (!dataSource) return <Loading />;
        return (
            <Loading loading={loading}>
                <Table
                    rowKey={(row) => row.id}
                    columns={columns}
                    dataSource={dataSource.data}
                    pagination={{
                        position: 'bottomCenter',
                        onChange: (page) => {
                            setPage(page);
                            fetchList(dispatch, (page - 1) * limit, limit);
                        },
                        current: page,
                        itemRender: renderPage,
                        hideOnSinglePage: true,
                        pageSize: limit,
                        showSizeChanger: false,
                        showLessItems: true,
                        total: dataSource ? dataSource.total : 0,
                        style: isMobile
                            ? { float: 'none', clear: 'both', textAlign: 'center' }
                            : null,
                    }}
                />
            </Loading>
        );
    };

    return <CardMenu>{renderTable()}</CardMenu>;
};

WalletLog.getInitialProps = async ({ isServer, store, params }) => {
    const { dispatch, getState } = store;
    await fetchList(dispatch, 0, 20, params);
    if (isServer) return getState();
};

export default WalletLog;
