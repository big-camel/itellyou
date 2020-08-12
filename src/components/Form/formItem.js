import React from 'react';
import WrapItem from '@/components/Form/WrapItem';
import FormContext from '@/components/Form/FormContext';

export default map => {
    const Items = {};
    Object.keys(map).forEach(key => {
        const item = map[key];
        Items[key] = ({ rules, ...props }) => {
            const newRules = (item.rules || []).concat();
            if (rules) {
                rules.forEach(rule => {
                    newRules.push(rule);
                });
            }
            return (
                <FormContext.Consumer>
                    {context => (
                        <WrapItem
                            component={item.component}
                            customProps={item.props}
                            rules={newRules}
                            help={item.help}
                            label={item.label}
                            validateFirst={item.validateFirst}
                            validateTrigger={item.validateTrigger}
                            {...props}
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
