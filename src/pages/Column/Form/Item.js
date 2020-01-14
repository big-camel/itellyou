import React from 'react'
import ItemMap from './map';
import WrapFormItem from '@/components/Form/WrapFormItem'
import FormContext from '@/components/Form/formContext'

const Item = {};
Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];
  Item[key] = props => (
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

export default Item;