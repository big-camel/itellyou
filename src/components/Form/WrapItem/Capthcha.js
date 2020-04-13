import React, { useState, useEffect } from 'react';
import { Button, Form } from 'antd';
import DefaultItem from './Default';
import styles from './Capthcha.less';

export default ({ label, onSend, onStep, onStop, sending, template, time, ...props }) => {
    onSend = onSend || function() {};
    const defaultText = props.text || '获取验证码';
    const [text, setText] = useState(defaultText);
    template = template || '{s} 秒';

    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        let interval = 0;
        if (time) {
            setDisabled(true);
            setText(template.replace(/{s}/g, time - Date.parse(new Date().toString()) / 1000));
            interval = window.setInterval(() => {
                const s = time - Date.parse(new Date().toString()) / 1000;
                if (s <= 0) {
                    clearInterval(interval);
                    setDisabled(false);
                    setText(defaultText);
                    if (onStop) onStop();
                } else {
                    if (onStep) {
                        onStep(s);
                    }
                    setText(template.replace(/{s}/g, s));
                }
            });
        }
        return () => {
            clearInterval(interval);
            if (interval && onStop) onStop();
        };
    }, [time]);

    return (
        <Form.Item shouldUpdate noStyle>
            <div className={styles['capthcha-item']}>
                <div className={styles['input']}>{<DefaultItem {...props} />}</div>
                <Button
                    className={styles['btn']}
                    loading={sending}
                    disabled={disabled}
                    size="large"
                    onClick={onSend}
                >
                    {sending ? '发送中...' : text}
                </Button>
            </div>
        </Form.Item>
    );
};
