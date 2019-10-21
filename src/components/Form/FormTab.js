import React, { Component } from 'react';
import { Tabs } from 'antd';
import FormContext from './formContext';

const { TabPane } = Tabs;

const generateId = (() => {
  let i = 0;
  return (prefix = '') => {
    i += 1;
    return `${prefix}${i}`;
  };
})();

class FormTab extends Component {
  constructor(props) {
    super(props);
    this.uniqueId = generateId('form-tab-');
  }

  componentDidMount() {
    const { tabUtil } = this.props;
    tabUtil.addTab(this.uniqueId);
  }

  render() {
    const { children } = this.props;
    return <TabPane {...this.props}>{children}</TabPane>;
  }
}

const wrapContext = props => (
  <FormContext.Consumer>
    {value => <FormTab tabUtil={value.tabUtil} {...props} />}
  </FormContext.Consumer>
);

// 标志位 用来判断是不是自定义组件
wrapContext.typeName = 'FormTab';

export default wrapContext;
