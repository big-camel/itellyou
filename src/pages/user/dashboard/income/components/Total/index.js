import React, { useEffect, useState } from 'react';
import { Statistic, Row, Col, Space, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { searchByTotal } from '../../service';
import styles from './index.less';

export default ({ type }) => {
    const [dataSource, setDataSource] = useState({});

    useEffect(() => {
        searchByTotal().then(({ result, data, ...res }) => {
            if (result) {
                setDataSource(data);
            } else {
                message.error(res.message);
            }
        });
    }, []);

    let { current_month, prev_month, before_month } = dataSource;
    current_month = current_month || {};
    prev_month = prev_month || {};
    before_month = before_month || {};

    const curTotal = current_month.total_amount || 0;
    const curTip = current_month.tip_amount || 0;
    const curReward = current_month.reward_amount || 0;
    const curSharing = current_month.sharing_amount || 0;
    const curSell = current_month.sell_amount || 0;

    const prevTotal = prev_month.total_amount || 0;
    const prevTip = prev_month.tip_amount || 0;
    const prevReward = prev_month.reward_amount || 0;
    const prevSharing = prev_month.sharing_amount || 0;
    const prevSell = prev_month.sell_amount || 0;

    const beforeTotal = before_month.total_amount || 0;
    const beforeTip = before_month.tip_amount || 0;
    const beforeReward = before_month.reward_amount || 0;
    const beforeSharing = before_month.sharing_amount || 0;
    const beforeSell = before_month.sell_amount || 0;

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
                <div className={styles['label']}>较前一个月</div>
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

    const ratioCurTotal = renderRatio(curTotal, prevTotal);
    const ratioCurTip = renderRatio(curTip, prevTip);
    const ratioCurReward = renderRatio(curReward, prevReward);
    const ratioCurSharing = renderRatio(curSharing, prevSharing);
    const ratioCurSell = renderRatio(curSell, prevSell);

    const ratioTotal = renderRatio(prevTotal, beforeTotal);
    const ratioTip = renderRatio(prevTip, beforeTip);
    const ratioReward = renderRatio(prevReward, beforeReward);
    const ratioSharing = renderRatio(prevSharing, beforeSharing);
    const ratioSell = renderRatio(prevSell, beforeSell);

    const renderCurrentMonth = () => {
        return (
            <Space direction="vertical">
                <Row gutter={16}>
                    <Col span={8}>
                        <Statistic title="累计收益" value={curTotal} suffix={ratioCurTotal} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="知识售卖" value={curSell} suffix={ratioCurSell} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="回答悬赏" value={curReward} suffix={ratioCurReward} />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Statistic title="打赏小费" value={curTip} suffix={ratioCurTip} />
                    </Col>
                    <Col span={8}>
                        <Statistic
                            title={
                                <Space>
                                    <div>平台分成</div>
                                    <div style={{ fontSize: 12 }}>(每月1日到账)</div>
                                </Space>
                            }
                            value={curSharing}
                            suffix={ratioCurSharing}
                        />
                    </Col>
                </Row>
            </Space>
        );
    };

    const renderPrevMonth = () => {
        return (
            <Space direction="vertical">
                <Row gutter={16}>
                    <Col span={8}>
                        <Statistic title="总计收益" value={prevTotal} suffix={ratioTotal} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="知识售卖" value={prevSell} suffix={ratioSell} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="回答悬赏" value={prevReward} suffix={ratioReward} />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Statistic title="打赏小费" value={prevTip} suffix={ratioTip} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="平台分成" value={prevSharing} suffix={ratioSharing} />
                    </Col>
                </Row>
            </Space>
        );
    };
    if (type === 'current_month') return renderCurrentMonth();
    if (type === 'prev_month') return renderPrevMonth();
};
