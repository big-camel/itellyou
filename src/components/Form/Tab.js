import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import FormContext from './FormContext';

const { TabPane } = Tabs;

/**const generateId = (() => {
    let i = 0;
    return (prefix = '') => {
        i += 1;
        return `${prefix}${i}`;
    };
})();**/

const FormTab = props => {
    useEffect(() => {
        //const uniqueId = generateId('form-tab-');
        const { tabUtil } = props;
        if (tabUtil) {
            //tabUtil.addTab(uniqueId);
        }
    }, []);
    const { children } = props;
    return <TabPane {...props}>{props.active && children}</TabPane>;
};

const WrapContext = props => (
    <FormContext.Consumer>
        {value => <FormTab tabUtil={value.tabUtil} {...props} />}
    </FormContext.Consumer>
);

// 标志位 用来判断是不是自定义组件
WrapContext.typeName = 'FormTab';

export default WrapContext;
