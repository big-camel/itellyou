import React from 'react';
import { InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import styles from './map.less';
import { Input } from 'antd';

const NAME_LENGTH_MIN = 2;
const NAME_LENGTH_MAX = 60;

const PASSWORD_LENGTH_MIN = 6;
const PASSWORD_LENGTH_MAX = 20;
const PASSWORD_REGEX = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[~`!@#$%^&*()\\_+\-={}\[\]|'";:,./<>?])+$)([^(0-9a-zA-Z)]|[~`!@#$%^&*()\\_+\-={}\[\]|'";:,./<>?]|[a-z]|[A-Z]|[0-9])+$/;

export default {
    Name: {
        props: {
            size: 'large',
            placeholder: '昵称',
        },
        rules: [
            {
                required: true,
                message: '请输入昵称',
            },
            {
                min: NAME_LENGTH_MIN,
                max: NAME_LENGTH_MAX,
                message: `昵称长度为${NAME_LENGTH_MIN}-${NAME_LENGTH_MAX}个字符`,
            },
        ],
    },
    Password: {
        component: Input.Password,
        props: {
            size: 'large',
            type: 'password',
            placeholder: '密码',
        },
        help: {
            content: value => {
                let spaceError = false;
                if (value && value.match(/\s+/)) {
                    spaceError = true;
                }

                let lengthError = true;
                if (
                    value &&
                    value.length >= PASSWORD_LENGTH_MIN &&
                    value.length <= PASSWORD_LENGTH_MAX
                ) {
                    lengthError = false;
                }

                let typeError = true;
                if (value && value.match(PASSWORD_REGEX)) {
                    typeError = false;
                }

                const getMessage = (error, message) => {
                    const className = classNames(styles.icon, { [styles.correct]: !error });
                    return (
                        <p>
                            <span className="">
                                {error ? (
                                    <InfoCircleOutlined className={className} />
                                ) : (
                                    <CheckCircleOutlined className={className} />
                                )}
                            </span>
                            {message}
                        </p>
                    );
                };
                return (
                    <div className={styles['help-body']}>
                        {getMessage(spaceError, '不能包括空格')}
                        {getMessage(
                            lengthError,
                            `长度为${PASSWORD_LENGTH_MIN}-${PASSWORD_LENGTH_MAX}个字符`,
                        )}
                        {getMessage(typeError, '必须包含字母、数字、符号中至少2种')}
                    </div>
                );
            },
        },
        rules: [
            {
                required: true,
                message: '请输入登录密码',
            },
            {
                validator: (rule, value) => {
                    if (value && value.match(/\s+/)) {
                        return Promise.reject('不能包含空格');
                    }
                    return Promise.resolve();
                },
            },
            {
                min: PASSWORD_LENGTH_MIN,
                max: PASSWORD_LENGTH_MAX,
                message: `长度为${PASSWORD_LENGTH_MIN}-${PASSWORD_LENGTH_MAX}个字符`,
            },
            {
                pattern: PASSWORD_REGEX,
                message: '必须包含字母、数字、符号中至少2种',
            },
        ],
    },
    Mobile: {
        props: {
            size: 'large',
            placeholder: '手机号码',
        },
        rules: [
            {
                required: true,
                message: '请输入手机号',
            },
            {
                pattern: /^1\d{10}$/,
                message: '手机号码格式不正确',
            },
        ],
    },
    Email: {
        props: {
            size: 'large',
            placeholder: '邮箱',
        },
        rules: [
            {
                required: true,
                message: '请输入邮箱',
            },
            {
                pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
                message: '邮箱格式不正确',
            },
        ],
    },
    Captcha: {
        props: {
            size: 'large',
            placeholder: '验证码',
        },
        rules: [
            {
                required: true,
                message: '请输入验证码',
            },
        ],
    },
    Path: {
        props: {
            addonBefore: 'https://www.itellyou.com/',
        },
        rules: [
            {
                required: true,
                message: '路径不能为空',
            },
            {
                pattern: /^[a-zA-Z0-9_.]{4,50}$/,
                message: '仅支持字母，数字，下划线，点，且不少于4位',
            },
        ],
    },
};
