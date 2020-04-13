import React, { useState } from 'react';
import { Form, Tabs } from 'antd';
import classNames from 'classnames';
import Submit from './Submit';
import Tab from './Tab';
import FormContext from './FormContext';
import formItem from './FormItem';
import styles from './index.less';

const FormComponent = ({ defaultActiveKey, onChange, onSubmit, className, children, ...props }) => {
    const [form] = Form.useForm(props.form);
    const [tabs, setTabs] = useState([]);
    const [active, setActive] = useState({});
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

    return (
        <FormContext.Provider
            value={{
                form,
                tabUtil: {
                    addTab: id => {
                        setTabs([...tabs, id]);
                    },
                    removeTab: id => {
                        setTabs(tabs.filter(currentId => currentId !== id));
                    },
                },
                updateActive: activeItem => {
                    if (!active) return;
                    if (active[type]) {
                        active[type].push(activeItem);
                    } else {
                        active[type] = [activeItem];
                    }
                    setActive(active);
                },
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
                    {tabs.length ? (
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
