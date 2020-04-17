import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Radio, InputNumber } from 'antd';
import styles from './index.less';

export default ({ current, data, onChange }) => {
    onChange = onChange || function() {};

    const dispatch = useDispatch();
    const config = useSelector(state => (state.reward ? state.reward.config : null));
    const bank = useSelector(state => state.bank.detail);

    useEffect(() => {
        dispatch({
            type: 'reward/findConfig',
        });

        dispatch({
            type: 'bank/info',
        });
    }, [dispatch]);

    if (!config || !bank) return null;

    const getText = type => {
        return type === 1 ? '积分' : '现金';
    };

    const getUnit = type => {
        const { credit, cash } = config;
        return type === 1 ? credit.unit : cash.unit;
    };

    const getKey = type => {
        return type === 1 ? 'credit' : 'cash';
    };

    const renderCurrent = () => {
        if (!current) return;
        const { type, value } = current;
        if (value === 0) return;
        return (
            <div className={styles['current']}>
                当前已悬赏
                <span>
                    <strong>{value}</strong>
                    {getUnit(type)}
                </span>
                ，还可以继续增加悬赏
            </div>
        );
    };

    const onValueChange = (type, value) => {
        onChange({
            type,
            value,
        });
    };

    const onTypeChange = event => {
        const type = parseInt(event.target.value);
        const key = getKey(type);
        const { min } = config[key];
        onChange({
            type,
            value: min,
        });
    };

    const getDisabled = type => {
        if (!current) return false;
        if (current.type !== 0 && current.type !== type) {
            return true;
        }
        return false;
    };

    const { type, value } = data;

    const renderInput = () => {
        if (type === 0) return null;
        const key = getKey(type);
        let formatter = '';
        let precision = 0;

        if (type === 2) {
            precision = 2;
            formatter = '￥ ';
        }
        const { min, max } = config[key];
        const balance = bank[key];
        return (
            <div className={styles['value']}>
                <InputNumber
                    min={min}
                    max={balance > max ? max : balance}
                    precision={precision}
                    value={value}
                    onChange={value => onValueChange(type, value)}
                    formatter={value =>
                        `${formatter}${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={value => value.replace(`/${formatter}\s?|(,*)/g`, '')}
                />
                &nbsp;&nbsp;，{getText(type)}余额:{formatter}
                {balance} {getUnit(type)}
            </div>
        );
    };
    return (
        <div className={styles['reward']}>
            {renderCurrent()}
            <Radio.Group value={type} onChange={onTypeChange} className={styles['type']}>
                <Radio.Button value={0}>不设置</Radio.Button>
                <Radio.Button disabled={getDisabled(1)} value={1}>
                    {getText(1)}
                </Radio.Button>
                <Radio.Button disabled={getDisabled(2)} value={2}>
                    {getText(2)}
                </Radio.Button>
            </Radio.Group>
            {renderInput()}
        </div>
    );
};
