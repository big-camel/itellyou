import React, { useState, useContext } from 'react';
import { Card } from 'antd';
import { Link, useDispatch, useSelector, useIntl, Helmet } from 'umi';
import { MoreList } from '@/components/List';
import Tag from '@/components/Tag';
import Container from '@/components/Container';
import styles from './index.less';
import { RouteContext } from '@/context';

const fetchList = (dispatch, offset, limit, parmas) => {
    return dispatch({
        type: 'tag/list',
        payload: {
            append: offset !== 0,
            offset,
            limit,
            ...parmas,
        },
    });
};

function TagList({ location: { query } }) {
    const [page, setPage] = useState(query.page || 1);
    const [limit, setLimit] = useState(query.size || 18);
    const [offset, setOffset] = useState((page - 1) * limit);
    const dispatch = useDispatch();
    const list = useSelector(state => (state.tag ? state.tag.list : null));
    const settings = useSelector(state => state.settings);

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
            <MoreList.Item key={id}>
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
            </MoreList.Item>
        );
    };

    const { isMobile } = useContext(RouteContext);

    const renderList = () => {
        return (
            <MoreList
                grid={{
                    gutter: 16,
                    column: isMobile ? 1 : 3,
                }}
                dataSource={list}
                renderItem={renderItem}
                offset={offset}
                limit={limit}
                onChange={offset => {
                    setOffset(offset);
                    fetchList(dispatch, offset, limit);
                }}
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

TagList.getInitialProps = async ({ isServer, store, params }) => {
    const { dispatch, getState } = store;

    await fetchList(dispatch, 0, 18, params);

    if (isServer) return getState();
};
export default TagList;
