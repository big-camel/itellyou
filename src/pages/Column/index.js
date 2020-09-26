import React, { useState, useContext } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import { ReloadOutlined } from '@ant-design/icons';
import { Card, Avatar, Button } from 'antd';
import { getPageQuery } from '@/utils';
import Container from '@/components/Container';
import List from '@/components/List';
import { RouteContext } from '@/context';
import styles from './index.less';

const fetchList = (dispatch, offset, limit, type, parmas) => {
    return dispatch({
        type: 'column/list',
        payload: {
            type,
            offset,
            limit,
            ...parmas,
        },
    });
};
function Column({ location: { query } }) {
    const [offset, setOffset] = useState(parseInt(query.offset || 0));
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['column/list'];
    const limit = parseInt(query.limit || 8);
    const type = query.type || 'hot';

    const dispatch = useDispatch();

    const list = useSelector(state => {
        if (state.column) return state.column.list;
    });

    const renderItem = ({ id, path, name, avatar, description, star_count, article_count }) => {
        return (
            <List.Item key={id}>
                <Card className={styles['item-card']}>
                    <div>
                        <Link to={`/${path}`}>
                            <Avatar src={avatar} size={80} shape="circle" />
                        </Link>
                    </div>
                    <h4 className={styles.title}>
                        <Link to={`/${path}`}>{name}</Link>
                    </h4>
                    <div className={styles['data']}>
                        <span>{star_count} 关注</span>
                        <span>{article_count} 文章</span>
                    </div>
                    <div className={styles['description']}>{description}</div>
                    <div className={styles['to-btn']}>
                        <Button type="primary" href={`/${path}`}>
                            进入专栏
                        </Button>
                    </div>
                </Card>
            </List.Item>
        );
    };

    const { isMobile } = useContext(RouteContext);

    const renderList = () => {
        return (
            <List
                grid={isMobile ? { gutter: 16, column: 1 } : { gutter: 24, column: 4 }}
                loading={loading}
                dataSource={list ? list.data : []}
                renderItem={renderItem}
            />
        );
    };

    return (
        <Container
            metas={{
                keywords: '专栏,专栏列表,热门专栏,itellyou',
                description: 'itellyou专栏列表',
            }}
        >
            {renderList()}
            <div className={styles['column-action']}>
                <Button
                    onClick={() => {
                        setOffset(list.end ? 0 : offset + limit);
                        fetchList(dispatch, list.end ? 0 : offset + limit, limit, type);
                    }}
                    icon={<ReloadOutlined />}
                >
                    换一换
                </Button>
                <Button href="/column/apply">申请专栏</Button>
            </div>
        </Container>
    );
}

Column.getInitialProps = async ({ isServer, store, params, history }) => {
    const { location } = history || {};
    let query = (location || {}).query;
    if (!isServer) {
        query = getPageQuery();
    }
    const type = query ? query.type : null;
    const { dispatch, getState } = store;
    await fetchList(dispatch, 0, 8, type || 'hot', params);

    if (isServer) return getState();
};
export default Column;
