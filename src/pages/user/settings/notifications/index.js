import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'umi';
import Layout from '../components/Layout';
import { Card, Collapse, Button, Select, message } from 'antd';
import styles from './index.less';
import Loading from '@/components/Loading';

const { Panel } = Collapse;
const { Option } = Select;

const data = [
    {
        key: 'follow',
        title: '关注消息设置',
        desc: '有人关注我的内容时，我会收到消息通知',
        child: [
            {
                key: 'user',
                title: '关注了我',
                desc: '我被谁关注时，我将收到消息通知',
            },
            {
                key: 'column',
                title: '关注了我的专栏',
                desc: '我的专栏被谁关注时，我会收到消息通知',
            },
            {
                key: 'answer',
                title: '收藏了我的回答',
                desc: '我的回答被谁收藏时，我会收到消息通知',
            },
            {
                key: 'article',
                title: '收藏了我的文章',
                desc: '我的文章被谁收藏时，我会收到消息通知',
            },
        ],
    },
    {
        key: 'like',
        title: '有人赞赏我',
        desc: '有人对我点赞或打赏时，我会收到消息通知',
        child: [
            {
                key: 'answer',
                title: '赞了我的回答',
                desc: '我的回答被谁点赞时，我会收到消息通知',
            },
            {
                key: 'article',
                title: '赞了我的文章',
                desc: '我的文章被谁点赞时，我会收到消息通知',
            },
            {
                key: 'question_comment',
                title: '赞了我在问题下的评论',
                desc: '我在问题下的评论被谁点赞时，我会收到消息通知',
            },
            {
                key: 'answer_comment',
                title: '赞了我在回答下的评论',
                desc: '我在回答下的评论被谁点赞时，我会收到消息通知',
            },
            ,
            {
                key: 'article_comment',
                title: '赞了我在文章下的评论',
                desc: '我在文章下的评论被谁点赞时，我会收到消息通知',
            },
        ],
    },
    {
        key: 'comment',
        title: '评论消息设置',
        desc: '当他人评论或回复我的内容时，我会收到消息通知',
        child: [
            {
                key: 'question',
                title: '评论了我的提问',
                desc: '我的提问被谁评论时，我会收到消息通知',
            },
            {
                key: 'answer',
                title: '评论了我的回答',
                desc: '我的回答被谁评论时，我会收到消息通知',
            },
            {
                key: 'article',
                title: '评论了我的文章',
                desc: '我的文章被谁评论时，我会收到消息通知',
            },
            {
                key: 'question_comment',
                title: '回复了我在问题下的评论',
                desc: '我在问题下的评论被谁回复时，我会收到消息通知',
            },
            {
                key: 'answer_comment',
                title: '回复了我在回答下的评论',
                desc: '我在回答下的评论被谁回复时，我会收到消息通知',
            },
            {
                key: 'article_comment',
                title: '回复了我在文章下的评论',
                desc: '我的在文章下的评论被谁回复时，我会收到消息通知',
            },
        ],
    },
    {
        key: 'publish',
        title: '回答消息设置',
        desc: '当问题有新的回答时，我会收到消息通知',
        child: [
            {
                key: 'answer',
                title: '关注的问题有新回答',
                desc: '关注的问题被谁回答时，我将收到消息通知',
            },
        ],
    },
];

export default () => {
    const dispatch = useDispatch();
    const dataSource = useSelector(state => state.notificationsSettings.list);
    useEffect(() => {
        dispatch({
            type: 'notificationsSettings/list',
        });
    }, [dispatch]);
    if (!dataSource || dataSource.length === 0) return <Loading />;
    const dataMap = {};
    dataSource.forEach(({ action, type, value }) => {
        if (!dataMap[action]) dataMap[action] = {};
        dataMap[action][type] = value;
    });

    const onChange = (action, type, value) => {
        dispatch({
            type: 'notificationsSettings/set',
            payload: {
                action,
                type,
                value,
            },
        }).then(res => {
            if (res && res.result) {
                message.success('修改成功');
            }
        });
    };

    const renderChild = (action, child) => {
        return child.map(({ key, title, desc }) => {
            return (
                <div key={key} className={styles['setting-item']}>
                    <div className={styles['title']}>
                        <h4>{title}</h4>
                        <p>{desc}</p>
                    </div>
                    <Select
                        defaultValue={dataMap[action][key]}
                        onChange={value => {
                            onChange(action, key, value);
                        }}
                    >
                        <Option value="notification_only">仅消息</Option>
                        <Option value="none">不接收</Option>
                    </Select>
                </div>
            );
        });
    };

    const renderPanel = () => {
        return data.map(({ key, title, desc, child }) => {
            return (
                <Panel
                    key={key}
                    header={
                        <div className={styles['header']}>
                            <div className={styles['title']}>
                                <h2>{title}</h2>
                                <p>{desc}</p>
                            </div>
                            <Button className={styles['setting-btn']} type="link">
                                设置
                            </Button>
                        </div>
                    }
                    showArrow={false}
                >
                    {renderChild(key, child)}
                </Panel>
            );
        });
    };

    return (
        <Layout defaultKey="notifications">
            <Card title="消息通知">
                <Collapse className={styles['notifications-setting']}>{renderPanel()}</Collapse>
            </Card>
        </Layout>
    );
};
