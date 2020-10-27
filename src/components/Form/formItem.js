import React from 'react';
import omit from 'omit.js';
import WrapItem from '@/components/Form/WrapItem';
import FormContext from '@/components/Form/FormContext';

export default (map) => {
    const Items = {};
    Object.keys(map).forEach((key) => {
        const item = map[key];
        Items[key] = (componentProps) => {
            const newRules = (item.rules || []).concat();
            //为了避免项目太多改动，这里手动排除 Form.Item 的属性作为Element的属性，Form.Item 属性：https://ant.design/components/form-cn/#Form.Item
            const itemKeys = [
                'colon',
                ' dependencies',
                ' extra',
                'getValueFromEvent',
                'getValueProps',
                'hasFeedback',
                'help',
                'htmlFor',
                'initialValue',
                'noStyle',
                'label',
                'labelAlign',
                'labelCol',
                'messageVariables',
                'name',
                'preserve',
                'normalize',
                'required',
                'shouldUpdate',
                'tooltip',
                'trigger',
                'validateFirst',
                'validateStatus',
                'validateTrigger',
                'valuePropName',
                'wrapperCol',
                'hidden',
                //自定义属性
                'asyncValidator',
                'errors',
            ];
            const itemProps = {};
            const customProps = { ...componentProps };
            for (const index in itemKeys) {
                const itemKey = itemKeys[index];
                if (customProps.hasOwnProperty(itemKey)) {
                    itemProps[itemKey] = customProps[itemKey];
                    delete customProps[itemKey];
                }
            }
            const { rules, ...customRest } = customProps;

            if (rules) {
                rules.forEach((rule) => {
                    newRules.push(rule);
                });
            }
            const { props, ...rest } = item;

            return (
                <FormContext.Consumer>
                    {(context) => (
                        <WrapItem
                            customProps={{ ...props, ...customRest }}
                            {...rest}
                            rules={newRules}
                            {...itemProps}
                            type={key}
                            {...context}
                        />
                    )}
                </FormContext.Consumer>
            );
        };
    });
    return Items;
};
