import React, { useState, useContext } from 'react';
import { Card } from 'antd';
import { Link, useDispatch, useSelector, useIntl, Helmet } from 'umi';
import { PageList } from '@/components/List';
import Tag from '@/components/Tag';
import { getPageQuery } from '@/utils/utils';
import Container from '@/components/Container';
import styles from './index.less';
import { RouteContext } from '@/context';

const fetchList = (dispatch, offset, limit, parmas) => {
    return dispatch({
        type: 'tag/list',
        payload: {
            append: false,
            offset,
            limit,
            ...parmas,
        },
    });
};

function TagList({ location: { query } }) {
    const limit = parseInt(query.limit || 20);
    const page = query.page ? (query.page - 1) * limit : undefined;
    const [offset, setOffset] = useState(parseInt(query.offset || page || 0));
    const dispatch = useDispatch();
    const list = useSelector((state) => (state.tag ? state.tag.list : null));
    const settings = useSelector((state) => state.settings);

    const renderItem = ({
        id,
        icon,
        name,
        star_count,
        use_star,
        question_count,
        article_count,
        description,
    }) => {
        return (
            <PageList.Item key={id}>
                <Card bordered={false} className={styles['tag-card']} hoverable={true}>
                    <Card.Meta
                        className={styles['description']}
                        title={<Link to={`/tag/${id}`}>{name}</Link>}
                        description={description || '目前还没有关于这个标签的解释'}
                    />
                    <div className={styles['footer']}>
                        <div className={styles['follow']}>
                            <div className={styles['item']}>
                                问题<span className={styles['count']}>{question_count}</span>
                            </div>
                            <div className={styles['item']}>
                                文章<span className={styles['count']}>{article_count}</span>
                            </div>
                            <div className={styles['item']}>
                                关注者<span className={styles['count']}>{star_count}</span>
                            </div>
                        </div>
                        <Tag.Star id={id} name={name} use_star={use_star} />
                    </div>
                </Card>
            </PageList.Item>
        );
    };

    const { isMobile } = useContext(RouteContext);

    const renderList = () => {
        return (
            <PageList
                grid={{
                    gutter: 16,
                    column: isMobile ? 1 : 3,
                }}
                dataSource={list}
                renderItem={renderItem}
                offset={offset}
                limit={limit}
                pageLink={(current) => `/tag/list?page=${current}`}
            />
        );
    };
    const intl = useIntl();
    return (
        <>
            <Helmet>
                <title>{`${intl.formatMessage({ id: 'tag.page.list' })} - ${
                    settings.title
                }`}</title>
                <meta
                    name="keywords"
                    content={`${intl.formatMessage({ id: 'keywords' })},标签,标签列表`}
                />
                <meta
                    name="description"
                    content={`itellyou的标签列表页${intl.formatMessage({ id: 'description' })}`}
                />
            </Helmet>
            <Container>
                <Card className={styles['tag-list']}>
                    <Card.Meta
                        className={styles['tag-list-meta']}
                        title="标签"
                        description={
                            <React.Fragment>
                                标签不仅能组织和归类你的内容，还能关联相似的内容。
                                <Link to="/tag">查看常用</Link>
                            </React.Fragment>
                        }
                    />
                    {renderList()}
                </Card>
            </Container>
        </>
    );
}

TagList.getInitialProps = async ({ isServer, store, params, history }) => {
    const { dispatch, getState } = store;
    const limit = 18;
    const { location } = history || {};
    let query = (location || {}).query;
    if (!isServer) {
        query = getPageQuery();
    }
    const page = query.page ? (query.page - 1) * limit : 0;
    await fetchList(dispatch, page, limit, params);

    if (isServer) return getState();
};
export default TagList;
