import React from 'react'
import ItemMap from './map';
import WrapFormItem from '../WrapFormItem'
import FormContext from '../formContext';

const LoginItem = {};
Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];
  LoginItem[key] = props => (
    <FormContext.Consumer>
      {context => (
        <WrapFormItem
          customprops={item.props}
          rules={item.rules}
          tips={item.tips}
          {...props}
          type={key}
          updateActive={context.updateActive}
          form={context.form}
        />
      )}
    </FormContext.Consumer>
  );
});

export default LoginItem;