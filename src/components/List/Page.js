import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { Link } from 'umi';
import List from './Default';
import Loading from '../Loading';

const Page = ({ dataSource, offset, limit, onChange, pageLink, ...props }) => {
    offset = offset || 0;
    limit = limit || 20;

    const [loading, setLoading] = useState(false);

    onChange =
        onChange ||
        function () {
            setLoading(false);
        };
    const [page, setPage] = useState(offset < limit ? 1 : Math.ceil(offset / limit) + 1);

    useEffect(() => {
        setLoading(false);
    }, [dataSource]);

    if (!dataSource || !dataSource.data) return <Loading />;

    const renderPage = (current, type, originalElement) => {
        const link = pageLink ? pageLink(current, type, offset, limit) : undefined;
        if (type === 'prev') {
            if (link) return <Link to={link}>上一页</Link>;
            return <a>上一页</a>;
        }
        if (type === 'next') {
            if (link) return <Link to={link}>下一页</Link>;
            return <a>下一页</a>;
        }
        if (link && (type === 'jump-next' || type === 'jump-prev')) {
            const item = (
                <Link className="ant-pagination-item-link" to={link}>
                    {originalElement.props.children}
                </Link>
            );
            return item;
        }
        if (link) return <Link to={link}>{current}</Link>;
        return originalElement;
    };

    const renderPageList = () => {
        return (
            <React.Fragment>
                <List loading={loading} dataSource={dataSource.data} {...props} />
                <div style={{ padding: '16px 0', textAlign: 'center' }}>
                    <Pagination
                        onChange={(page) => {
                            if (!loading) {
                                if(!pageLink) {
                                    setLoading(true);
                                    onChange((page - 1) * limit, limit);
                                }
                                setPage(page);
                            }
                        }}
                        current={page}
                        itemRender={renderPage}
                        hideOnSinglePage={true}
                        defaultPageSize={limit}
                        showSizeChanger={false}
                        showLessItems={true}
                        total={dataSource ? dataSource.total : 0}
                    />
                </div>
            </React.Fragment>
        );
    };
    return renderPageList();
};
Page.Item = List.Item;
export default Page;
