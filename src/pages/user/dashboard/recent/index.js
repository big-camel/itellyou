import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useDispatch, useSelector, Link } from 'umi';
import { Tooltip, message, Card, Space } from 'antd';
import styles from './index.less';
import Timer from '@/components/Timer';
import {
    EditOutlined,
    DeleteOutlined,
    FileTextOutlined,
    BugOutlined,
    FormOutlined,
    TagOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import { ScrollList } from '@/components/List';

const fetchList = (dispatch, offset, limit, parmas) => {
    return dispatch({
        type: 'draft/list',
        payload: {
            append: offset > 0,
            offset,
            limit,
            ...parmas,
        },
    });
};

function Dashboard() {
    const [offset, setOffset] = useState(0);
    const limit = 20;

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.draft ? state.draft.list : null));

    const onDelete = (type, key) => {
        dispatch({
            type: 'draft/delete',
            payload: {
                type,
                key,
            },
        }).then(res => {
            if (res.result) {
                message.success('删除成功');
            } else {
                message.error(res.message);
            }
        });
    };

    const renderText = type => {
        switch (type) {
            case 'article':
                return '文章';
            case 'question':
                return '问题';
            case 'question_answer':
            case 'answer':
                return '回答';
            case 'tag':
                return '标签';
        }
        return '未知';
    };

    const renderIcon = type => {
        switch (type) {
            case 'article':
                return <FileTextOutlined />;
            case 'question':
                return <BugOutlined />;
            case 'question_answer':
            case 'answer':
                return <FormOutlined />;
            case 'tag':
                return <TagOutlined />;
        }
        return <WarningOutlined />;
    };

    const getEditUrl = ({ data_key, type, url, target }) => {
        if (type === 'answer' || type === 'question_answer') {
            if (!target) return url.replace(`/answer/${data_key}`, '');
            url = `/question/${target.question_id}`;
            if (target.published) {
                url += `/answer/${target.id}`;
            }
            return url;
        }
        return (url += '/edit');
    };

    const renderItem = item => {
        const { url, title, author, created_time, data_type, data_key, target } = item;
        let newUrl = url;
        if (!target || !target.published) newUrl += '/edit';
        if (data_type === 'answer' || data_type === 'question_answer') {
            if (!target) newUrl = url.replace(`/answer/${data_key}`, '');
            else if (!target.published) newUrl = `/question/${target.question_id}`;
        }
        return (
            <ScrollList.Item>
                <Card hoverable>
                    <div className={styles['item']}>
                        <div className={styles['icon']}>{renderIcon(data_type)}</div>
                        <div className={styles['title']}>
                            <div className={styles['body']}>
                                <Link className={styles['link']} to={newUrl}>
                                    {title}
                                </Link>
                            </div>
                            <span className={styles['meta']}>
                                <Link className={styles['author']} to={`/${author.path}`}>
                                    {author.name}
                                </Link>
                                <span className={styles['time']}>
                                    <Timer time={created_time} />
                                </span>
                                <span className={styles['text']}>
                                    编辑了{renderText(data_type)}
                                </span>
                            </span>
                        </div>
                        <Space className={styles['action']}>
                            <Tooltip title="编辑">
                                <a href={getEditUrl(item)}>
                                    <EditOutlined />
                                </a>
                            </Tooltip>
                            <Tooltip title="移除记录">
                                <a onClick={() => onDelete(data_type, data_key)}>
                                    <DeleteOutlined />
                                </a>
                            </Tooltip>
                        </Space>
                    </div>
                </Card>
            </ScrollList.Item>
        );
    };

    const renderList = () => {
        return (
            <ScrollList
                className={styles['recent-list']}
                itemLayout="vertical"
                useWindow={true}
                split={false}
                dataSource={dataSource}
                offset={offset}
                limit={limit}
                onChange={offset => {
                    setOffset(offset);
                    fetchList(dispatch, offset, limit);
                }}
                renderItem={renderItem}
            />
        );
    };

    const render = () => {
        if (dataSource && dataSource.total === 0) {
            return <Card>{renderList()}</Card>;
        }
        return renderList();
    };

    return <Layout defaultKey="recent">{render()}</Layout>;
}

Dashboard.getInitialProps = async ({ isServer, store, params }) => {
    const { dispatch, getState } = store;
    await fetchList(dispatch, 0, 20, params);
    if (isServer) return getState();
};

export default Dashboard;
