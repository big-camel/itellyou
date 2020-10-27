import React, { useEffect } from 'react';
import moment from 'moment';
import { Radio } from 'antd';
import styles from './index.less';

export default ({ onChange = function () {}, defaultValue }) => {
    useEffect(() => {
        if (defaultValue) {
            onRadioChange({
                target: {
                    value: defaultValue,
                },
            });
        }
    }, [defaultValue]);

    const onRadioChange = (e) => {
        const now = moment();
        const day = e.target.value;
        //最后结束时间为昨天
        const end = now.clone().subtract(1, 'days');
        const begin = now.clone().subtract(day, 'days');
        onChange(begin.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'), day);
    };

    return (
        <div className={styles['radio-date']}>
            <Radio.Group defaultValue={defaultValue} optionType="button" onChange={onRadioChange}>
                <Radio.Button value="7">最近7天</Radio.Button>
                <Radio.Button value="14">最近14天</Radio.Button>
                <Radio.Button value="30">最近30天</Radio.Button>
                <Radio.Button value="90">最近90天</Radio.Button>
            </Radio.Group>
        </div>
    );
};
