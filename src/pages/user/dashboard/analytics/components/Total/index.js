import React, { useEffect, useState } from 'react';
import { Statistic, Row, Col, Space, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { searchByTotal } from '../../service';
import styles from './index.less';

export default ({ type }) => {
    const typeText = type === 'answer' ? '回答' : '文章';

    const [dataSource, setDataSource] = useState({});

    useEffect(() => {
        searchByTotal({ type }).then(({ result, data, ...res }) => {
            if (result) {
                setDataSource(data);
            } else {
                message.error(res.message);
            }
        });
    }, [type]);

    let { total, yesterday, before_yesterday } = dataSource;
    total = total || {};
    yesterday = yesterday || {};
    before_yesterday = before_yesterday || {};
    const ytdView = yesterday.view_count || 0;
    const ytdSupport = yesterday.support_count || 0;
    const ytdComment = yesterday.comment_count || 0;
    const bfyView = before_yesterday.view_count || 0;
    const bfySupport = before_yesterday.support_count || 0;
    const bfyComment = before_yesterday.comment_count || 0;

    const getRatio = (number1, number2) => {
        if (number1 === number2) return 0;
        if (number2 === 0) return 100;
        return ((number1 - number2) / number2) * 100;
    };
    const renderRatio = (number1, number2) => {
        const ratio = getRatio(number1, number2);
        let color = undefined;
        let icon = <ArrowDownOutlined />;
        if (ratio < 0) color = '#3f8600';
        else if (ratio > 0) {
            color = '#cf1322';
            icon = <ArrowUpOutlined />;
        }

        return (
            <Space className={styles['ratio']}>
                <div className={styles['label']}>较前日</div>
                <Statistic
                    value={getRatio(number1, number2)}
                    precision={2}
                    valueStyle={{ color }}
                    prefix={ratio !== 0 ? icon : null}
                    suffix="%"
                />
            </Space>
        );
    };
    const ratioView = renderRatio(ytdView, bfyView);
    const ratioSupport = renderRatio(ytdSupport, bfySupport);
    const ratioComment = renderRatio(ytdComment, bfyComment);
    return (
        <Space direction="vertical">
            <Row gutter={16}>
                <Col span={8}>
                    <Statistic title={`${typeText}总数`} value={total.total_count || 0} />
                </Col>
                <Col span={8}>
                    <Statistic title="阅读总数" value={total.view_count || 0} />
                </Col>
                <Col span={8}>
                    <Statistic title="点赞总数" value={total.support_count || 0} />
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={8}>
                    <Statistic title="昨日阅读总数" value={ytdView} suffix={ratioView} />
                </Col>
                <Col span={8}>
                    <Statistic title="昨日点赞数" value={ytdSupport} suffix={ratioSupport} />
                </Col>
                <Col span={8}>
                    <Statistic title="昨日评论数" value={ytdComment} suffix={ratioComment} />
                </Col>
            </Row>
        </Space>
    );
};
