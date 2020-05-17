import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Select, Space, InputNumber, Slider } from 'antd';
import styles from './index.less';

export default ({ visible, onCancel, dataSource, onSubmit }) => {
    onSubmit = onSubmit || function() {};

    const [paidChecked, setPaidChecked] = useState(false);
    const [paidType, setPaidType] = useState('cash');
    const [paidValue, setPaidValue] = useState(1);
    const [starChecked, setStarChecked] = useState(false);
    const [scaleValue, setScaleValue] = useState(30);

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const { paid_to_read, paid_type, paid_amount, star_to_read, free_read_scale } =
            dataSource || {};
        if (paid_to_read) {
            setPaidChecked(true);
            if (paid_type) setPaidType(paid_type);
            if (paid_amount) setPaidValue(paid_amount);
        }
        if (star_to_read) setStarChecked(true);
        if (free_read_scale) setScaleValue(free_read_scale * 100);
    }, [dataSource]);

    const renderPaid = () => {
        const getPrefix = () => {
            return paidType === 'cash' ? '¥ ' : '';
        };

        const formatter = value => {
            return (getPrefix() + value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        };

        const parser = value => {
            return value.replace(new RegExp(`${getPrefix()}\s?|(,*)`, 'g'), '');
        };

        return (
            <div className={styles['paid-setting']}>
                <div>
                    <Space>
                        <Select
                            className={styles['paid-type']}
                            value={paidType}
                            onChange={setPaidType}
                        >
                            <Select.Option value="credit">积分</Select.Option>
                            <Select.Option value="cash">现金</Select.Option>
                        </Select>
                        <span className={styles['desc']}>选择收费方式</span>
                    </Space>
                </div>
                <div>
                    <Space>
                        <InputNumber
                            className={styles['paid-value']}
                            value={paidValue}
                            min={paidType === 'cash' ? 0.01 : 1}
                            max={100000}
                            precision={paidType === 'cash' ? 2 : 0}
                            formatter={formatter}
                            parser={parser}
                            onChange={setPaidValue}
                        />
                        <span className={styles['desc']}>输入收费金额</span>
                    </Space>
                </div>
            </div>
        );
    };

    const renderScale = () => {
        if (paidChecked || starChecked) {
            return (
                <div className={styles['scale-setting']}>
                    <p>设置可免费阅读比例（0 - 50）%</p>
                    <Slider
                        value={scaleValue}
                        onChange={setScaleValue}
                        min={0}
                        max={50}
                        step={5}
                        tipFormatter={value => <div>可免费阅读文章的前 {value}%</div>}
                        tooltipVisible={true}
                    />
                </div>
            );
        }
    };

    const onOk = () => {
        setSubmitting(true);
        onSubmit({
            paid: paidChecked
                ? {
                      type: paidType,
                      amount: paidValue,
                  }
                : null,
            star: starChecked,
            scale: paidChecked || starChecked ? scaleValue : null,
        });
        if (typeof result === 'object') {
            result.then(() => {
                setSubmitting(false);
            });
        } else {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="付费阅读设置"
            visible={visible}
            width={500}
            onCancel={onCancel}
            okText="确定"
            okButtonProps={{
                loading: submitting,
            }}
            onOk={onOk}
            cancelText="取消"
        >
            <p>
                <Checkbox checked={paidChecked} onChange={e => setPaidChecked(e.target.checked)}>
                    付费阅读，读者向您支付一定的现金或者积分可阅读
                </Checkbox>
            </p>
            {paidChecked && renderPaid()}
            <p>
                <Checkbox checked={starChecked} onChange={e => setStarChecked(e.target.checked)}>
                    关注阅读，读者只需要关注你即可阅读
                </Checkbox>
            </p>
            {renderScale()}
        </Modal>
    );
};
