import React from 'react';
import ChartLine from './Line';
import styles from './index.less';

export default ({ dataSource }) => {
    const chartData = [];
    (dataSource || []).forEach(({ date, view_count, comment_count, support_count, star_count }) => {
        chartData.unshift({
            date,
            name: '收藏数',
            value: star_count,
        });
        chartData.unshift({
            date,
            name: '点赞数',
            value: support_count,
        });
        chartData.unshift({
            date,
            name: '评论数',
            value: comment_count,
        });
        chartData.unshift({
            date,
            name: '阅读数',
            value: view_count,
        });
    });
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
