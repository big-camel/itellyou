import React, { useEffect, useState } from 'react';
import { List, Pagination } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import classnames from 'classnames';
import Edit from './Edit';
import Loading from '../Loading';
import Item from './Item';
import Detail from './Detail';
import styles from './index.less';

function Comment({
    dataSource,
    className,
    extra,
    offset,
    limit,
    title,
    exclude,
    scroll,
    hasEdit,
    onChild,
    onCreate,
    onDelete,
    onVote,
    onDetail,
    ...props
}) {
    const [loading, setLoading] = useState(false);
    const onChange = props.onChange || function () {};

    const [page, setPage] = useState(props.page || 1);
    offset = offset || 0;
    limit = limit || 20;
    useEffect(() => {
        setLoading(false);
    }, [dataSource]);

    const renderHeader = () => {
        if (title === false) return;
        if (title) return <h2 className={styles['comment-title']}>{title}</h2>;
        return (
            <h2 className={styles['comment-title']}>
                {dataSource ? dataSource.comments : 0} 条评论
            </h2>
        );
    };

    const renderItem = (item) => {
        return (
            <Item
                onDelete={onDelete}
                onCreate={onCreate}
                onVote={onVote}
                onChild={onChild}
                onDetail={onDetail}
                item={item}
            />
        );
    };

    const renderPage = (current, type, originalElement) => {
        if (type === 'prev') {
            return <a>上一页</a>;
        }
        if (type === 'next') {
            return <a>下一页</a>;
        }
        return originalElement;
    };

    if (!dataSource) return <Loading />;
    let data = dataSource ? dataSource.data || [] : [];
    const hots = [];
    const comments = [];
    data.forEach((item) => {
        if (
            exclude &&
            ((Array.isArray(exclude) && exclude.indexOf(item.id) >= 0) || exclude === item.id)
        )
            return;
        if (item.hot === true) {
            hots.push(item);
        } else {
            comments.push(item);
        }
    });

    const renderList = () => {
        return (
            <List
                locale={{
                    emptyText: <></>,
                }}
                loading={loading && !scroll}
                header={renderHeader()}
                dataSource={comments}
                renderItem={renderItem}
                itemLayout="vertical"
            />
        );
    };

    const renderScrollList = () => {
        return (
            <div className={styles['comment-scroll']}>
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={() => {
                        if (!loading) {
                            setLoading(true);
                            onChange(offset + limit, limit);
                        }
                    }}
                    hasMore={!loading && !dataSource.end}
                    useWindow={false}
                >
                    {extra}
                    {renderList()}
                </InfiniteScroll>
            </div>
        );
    };

    const renderPageList = () => {
        return (
            <React.Fragment>
                {renderList()}
                <Pagination
                    className={styles['comment-page']}
                    onChange={(page) => {
                        if (!loading) {
                            setLoading(true);
                            onChange((page - 1) * limit, limit);
                            setPage(page);
                        }
                    }}
                    current={page}
                    itemRender={renderPage}
                    hideOnSinglePage={true}
                    pageSize={limit}
                    total={dataSource ? dataSource.total : 0}
                />
            </React.Fragment>
        );
    };

    const renderFooter = () => {
        if (hasEdit) {
            return (
                <div className={styles['comment-footer']}>
                    <Edit onSubmit={onCreate} />
                </div>
            );
        }
    };

    return (
        <div
            className={classnames(
                styles['comment-list'],
                { [styles['comment-empty']]: data.length === 0 },
                className,
            )}
        >
            {hots.length > 0 && (
                <List
                    header={
                        <h2 className={styles['comment-title']}>
                            热门评论 ({dataSource ? dataSource.hots || 0 : 0})
                        </h2>
                    }
                    dataSource={hots}
                    renderItem={renderItem}
                    itemLayout="vertical"
                />
            )}
            {scroll ? renderScrollList() : renderPageList()}
            {scroll && loading && <Loading />}
            {renderFooter()}
        </div>
    );
}
export default Comment;
export { Item, Detail };
