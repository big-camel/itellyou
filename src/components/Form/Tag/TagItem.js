import React from 'react'
import ItemMap from './map';
import WrapFormItem from '../WrapFormItem'
import FormContext from '../formContext';

const TagItem = {};
Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];
  TagItem[key] = props => (
    <FormContext.Consumer>
      {context => (
        <WrapFormItem
          customprops={item.props}
          rules={item.rules}
          tips={item.tips}
          elementType={item.elementType}
          {...props}
          type={key}
          form={context.form}
        />
      )}
    </FormContext.Consumer>
  );
});

export default TagItem;