import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import { Radio, InputNumber } from 'antd';
import styles from './index.less';

export default ({ current, data, onChange, adopted }) => {
    onChange = onChange || function () {};

    const dispatch = useDispatch();
    const config = useSelector((state) => (state.reward ? state.reward.config : null));
    const bank = useSelector((state) => state.bank.detail);

    useEffect(() => {
        dispatch({
            type: 'reward/findConfig',
        });

        dispatch({
            type: 'bank/info',
        });
    }, [dispatch]);

    if (!config || !bank) return null;

    const getText = (type) => {
        return type === 'credit' ? '积分' : '现金';
    };

    const getUnit = (type) => {
        const { credit, cash } = config;
        return type === 'credit' ? credit.unit : cash.unit;
    };

    const getKey = (type) => {
        return type === 'credit' ? 'credit' : 'cash';
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
                {adopted ? '，问题已采纳，不能增加悬赏了' : '，还可以继续增加悬赏'}
            </div>
        );
    };

    const onValueChange = (type, value) => {
        onChange({
            type,
            value,
        });
    };

    const onTypeChange = (event) => {
        const type = event.target.value;
        const key = getKey(type);
        const { min } = config[key];
        onChange({
            type,
            value: min,
        });
    };

    const getDisabled = (type) => {
        if (adopted) return true;
        if (!current) return false;
        if (current.type !== 'default' && current.type !== type) {
            return true;
        }
        return false;
    };

    const { type, value } = data;

    const renderInput = () => {
        if (type === 'default') return null;
        const key = getKey(type);
        let formatter = '';
        let precision = 0;

        if (type === 'cash') {
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
                    onChange={(value) => onValueChange(type, value)}
                    formatter={(value) =>
                        `${formatter}${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={(value) => value.replace(new RegExp(`${formatter}\s?|(,*)`, 'g'), '')}
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
                <Radio.Button value="default">不设置</Radio.Button>
                <Radio.Button disabled={getDisabled('credit')} value="credit">
                    {getText('credit')}
                </Radio.Button>
                <Radio.Button disabled={getDisabled('cash')} value="cash">
                    {getText('cash')}
                </Radio.Button>
            </Radio.Group>
            {renderInput()}
        </div>
    );
};
