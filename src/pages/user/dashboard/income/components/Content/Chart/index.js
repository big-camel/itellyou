import React from 'react';
import ChartLine from './Line';
import styles from './index.less';

export default ({ dataSource }) => {
    const chartData = [];
    (dataSource || []).forEach(
        ({ date, total_amount, tip_amount, reward_amount, sharing_amount, sell_amount }) => {
            chartData.unshift({
                date,
                name: '打赏小费',
                value: tip_amount,
            });
            chartData.unshift({
                date,
                name: '问题悬赏',
                value: reward_amount,
            });
            chartData.unshift({
                date,
                name: '平台分成',
                value: sharing_amount,
            });
            chartData.unshift({
                date,
                name: '知识售卖',
                value: sell_amount,
            });
            chartData.unshift({
                date,
                name: '总计收益',
                value: total_amount,
            });
        },
    );
    const renderChart = () => {
        const config = {
            loading: !dataSource,
            data: chartData,
            height: 400,
            appendPadding: 16,
            xField: 'date',
            yField: 'value',
            meta: {
                date: {
                    type: 'cat',
                    tickCount: 5,
                },
            },
            seriesField: 'name',
            smooth: true,
        };
        return <ChartLine {...config} />;
    };

    return <div className={styles['chart']}>{renderChart()}</div>;
};
