import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Select } from 'antd';
import omit from 'omit.js';
import classNames from 'classnames';
import styles from './Default.less';

export default ({
    form,
    name,
    label,
    extra,
    customProps = {},
    component,
    errors,
    dependencies,
    asyncValidator,
    noStyle,
    normalize,
    ...props
}) => {
    const [focus, setFocus] = useState(false);
    const [help, setHelp] = useState({
        visible: false,
        content: null,
        ...props.help,
    });

    const rules = useRef((props.rules || []).concat());
    const prevValue = useRef();
    const validatorErrors = useRef();
    const fieldErrors = useRef();
    const valueIsChange = useRef(false);

    useEffect(() => {
        const value = form.getFieldValue(name);
        if (value && value !== '') {
            prevValue.current = value;
            form.setFields([
                {
                    name,
                    touched: true,
                },
            ]);
        }
    }, []);

    useEffect(() => {
        fieldErrors.current = errors;
        if (Array.isArray(errors) ? errors.length > 0 : errors) {
            form.validateFields([name]);
        }
    }, [errors]);

    useEffect(() => {
        setHelp({ ...help, ...props.help });
    }, [props.help]);

    const getValue = e => {
        return form.getFieldValue(name);
        //return e.target ? e.target.value : e
    };

    const renderHelp = () => {
        const { visible } = help;
        let { content } = help;
        if (!visible) return null;
        const errors = form.getFieldError(name);
        content = typeof content === 'function' ? content(form.getFieldValue(name)) : content;

        return content || (errors && errors.length > 0 ? errors : null);
    };

    const hasFeedback = () => {
        let { hasFeedback } = props;
        hasFeedback = hasFeedback === undefined || hasFeedback;
        return form.isFieldValidating(name) || !focus ? hasFeedback : false;
    };

    const onValueIsChange = value => {
        if (prevValue.current === value) valueIsChange.current = false;
        else {
            valueIsChange.current = true;
        }
    };

    const handleFocus = e => {
        const value = getValue(e);
        const error = form.getFieldError(name);
        if (error && error.length > 0) {
            form.setFields([
                {
                    name: [name],
                    value,
                    errors: null,
                },
            ]);
        }
        const { help, onFocus } = props;
        const { trigger = 'focus' } = help || {};
        setFocus(true);
        if (trigger === 'focus') setHelp({ ...help, visible: true });
        if (trigger === 'blur') setHelp({ ...help, visible: false, content: null });
        onValueIsChange(value);
        if (onFocus) onFocus(e);
    };

    const handleBlur = e => {
        const value = getValue(e);
        const { help, onBlur } = props;
        const { trigger = 'focus' } = help || {};
        setFocus(false);
        if (trigger === 'focus') setHelp({ ...help, visible: false, content: null });
        if (trigger === 'blur') setHelp({ ...help, visible: true });
        prevValue.current = value;
        e.change = valueIsChange.current;
        valueIsChange.current = false;
        if (onBlur) onBlur(e);
    };

    const handleChange = e => {
        const { onChange } = props;
        const { content } = props.help || {};
        const { visible } = help;
        if (visible) setHelp({ ...help, content });
        const value = getValue(e);
        onValueIsChange(value);
        if (onChange) onChange(e);
    };

    const doAsyncValidator = (rule, value, cb, source, options) => {
        let hasError = false;
        for (const r of rules.current) {
            if (!r.asyncValidator) {
                rule.validator(
                    {
                        ...r,
                        fullField: rule.fullField,
                        field: rule.field,
                        type: rule.type,
                        validator: rule.validator,
                    },
                    value,
                    error => {
                        if (error && error.length > 0) {
                            hasError = true;
                        }
                    },
                    source,
                    options,
                );
            }
            if (hasError) break;
        }
        if (!hasError) {
            if (!valueIsChange.current)
                return validatorErrors.current
                    ? Promise.reject(validatorErrors.current)
                    : Promise.resolve();

            return new Promise((resolve, reject) => {
                asyncValidator(rule, value)
                    .then(() => {
                        validatorErrors.current = null;
                        resolve();
                    })
                    .catch(message => {
                        validatorErrors.current = message;
                        reject(message);
                    });
            });
        }
    };

    const doErrorValidator = () => {
        if (fieldErrors.current && !valueIsChange.current)
            return Promise.reject(fieldErrors.current);
        fieldErrors.current = null;
        return Promise.resolve();
    };

    const { validateFirst, validateTrigger, onBlur, onChange, onFocus, ...restProps } = omit(
        props,
        ['help', 'rules', 'hasFeedback'],
    );

    const otherProps = restProps || {};
    if (asyncValidator && !rules.current.find(rule => rule._type === 'asyncValidator')) {
        rules.current.push({
            _type: 'asyncValidator',
            asyncValidator: doAsyncValidator,
        });
    }

    if (!rules.current.find(rule => rule._type === 'errorValidator')) {
        rules.current.push({
            _type: 'errorValidator',
            validator: doErrorValidator,
        });
    }

    let canFeedback = true;
    let isHidden = false;
    const renderComponent = () => {
        if (!component) component = Input;
        if (typeof component !== 'object') {
            const Componet = component;
            component = <Componet />;
        }
        canFeedback = component.type === Input || component.type === Select;

        component = React.cloneElement(component, {
            onFocus: handleFocus,
            onBlur: handleBlur,
            onChange: handleChange,
            ...customProps,
            ...otherProps,
        });

        const { type } = component.props;
        isHidden = type === 'hidden';
        canFeedback = isHidden ? false : canFeedback;

        return component;
    };

    const children = renderComponent();
    return (
        <Form.Item
            className={classNames({
                [styles['hidden']]: isHidden,
            })}
            name={name}
            label={label}
            help={renderHelp()}
            hasFeedback={canFeedback ? hasFeedback() : false}
            extra={extra}
            rules={rules.current}
            validateFirst={validateFirst || true}
            validateTrigger={validateTrigger || 'onBlur'}
            dependencies={dependencies}
            noStyle={noStyle}
            normalize={normalize}
        >
            {children}
        </Form.Item>
    );
};
