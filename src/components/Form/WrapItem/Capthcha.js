import React, { useState, useEffect } from 'react';
import { Button, Form } from 'antd';
import DefaultItem from './Default';
import styles from './Capthcha.less';

export default ({
    customProps: { onSend, onStep, onStop, sending, template, time, text, ...rest },
    ...props
}) => {
    onSend = onSend || function () {};
    const defaultText = text || '获取验证码';
    const [btnText, setBtnText] = useState(defaultText);
    template = template || '{s} 秒';

    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        let interval = 0;
        if (time) {
            setDisabled(true);
            setBtnText(template.replace(/{s}/g, time - Date.parse(new Date().toString()) / 1000));
            interval = window.setInterval(() => {
                const s = time - Date.parse(new Date().toString()) / 1000;
                if (s <= 0) {
                    clearInterval(interval);
                    setDisabled(false);
                    setBtnText(defaultText);
                    if (onStop) onStop();
                } else {
                    if (onStep) {
                        onStep(s);
                    }
                    setBtnText(template.replace(/{s}/g, s));
                }
            });
        }
        return () => {
            clearInterval(interval);
            if (interval && onStop) onStop();
        };
    }, [time]);
    const newProps = { ...props, customProps: rest };

    return (
        <Form.Item shouldUpdate noStyle>
            <div className={styles['capthcha-item']}>
                <div className={styles['input']}>{<DefaultItem {...newProps} />}</div>
                <Button
                    className={styles['btn']}
                    loading={sending}
                    disabled={disabled}
                    size="large"
                    onClick={onSend}
                >
                    {sending ? '发送中...' : btnText}
                </Button>
            </div>
        </Form.Item>
    );
};
