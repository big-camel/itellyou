import React, { useEffect, useState } from 'react';
import { Link, useDispatch, useSelector } from 'umi';
import { Card, Avatar, Button } from 'antd';
import Container from '@/components/Container';
import List from '@/components/List';
import styles from './index.less';
import { ReloadOutlined } from '@ant-design/icons';

function Column({ location: { query } }) {
    const [offset, setOffset] = useState(parseInt(query.offset || 0));
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['column/list'];
    const limit = parseInt(query.limit || 8);
    const type = query.type || 'hot';

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'column/list',
            payload: {
                type: 'hot',
                offset,
                limit,
            },
        });
    }, [offset, limit, type, dispatch]);

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

    const renderList = () => {
        return (
            <List
                grid={{ gutter: 24, column: 4 }}
                loading={loading}
                dataSource={list ? list.data : []}
                renderItem={renderItem}
            />
        );
    };

    return (
        <Container>
            {renderList()}
            <div className={styles['column-action']}>
                <Button
                    onClick={() => {
                        setOffset(list.end ? 0 : offset + limit);
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
export default Column;
