import React, { useState, useEffect } from 'react';
import { Form, Tabs } from 'antd';
import classNames from 'classnames';
import Submit from './Submit';
import Tab from './Tab';
import FormContext from './FormContext';
import formItem from './FormItem';
import styles from './index.less';

const FormComponent = ({
    defaultActiveKey,
    activeKey,
    onChange,
    onSubmit,
    className,
    children,
    ...props
}) => {
    const [form] = Form.useForm(props.form);
    const [type, setType] = useState(defaultActiveKey);

    const TabChildren = [];
    const otherChildren = [];
    React.Children.forEach(children, item => {
        if (!item) {
            return;
        }
        // eslint-disable-next-line
        if (item.type.typeName === 'FormTab') {
            TabChildren.push(item);
        } else {
            otherChildren.push(item);
        }
    });

    useEffect(() => {
        setType(activeKey);
    }, [activeKey]);

    return (
        <FormContext.Provider
            value={{
                form,
            }}
        >
            <div className={classNames(styles.formWarp, className)}>
                <Form
                    scrollToFirstError
                    form={form}
                    onFinish={values => {
                        if (onSubmit) {
                            onSubmit(values);
                        }
                    }}
                    {...props}
                >
                    {TabChildren.length ? (
                        <React.Fragment>
                            <Tabs
                                activeKey={type}
                                onChange={activeKey => {
                                    setType(activeKey);
                                    if (onChange) onChange(activeKey);
                                }}
                            >
                                {TabChildren}
                            </Tabs>
                            {otherChildren}
                        </React.Fragment>
                    ) : (
                        children
                    )}
                </Form>
            </div>
        </FormContext.Provider>
    );
};
FormComponent.useForm = Form.useForm;
FormComponent.Item = Form.Item;
FormComponent.createItem = formItem;
export default FormComponent;
export { Submit, Tab };
