import React from 'react';
import { Button, Form } from 'antd';

const FormItem = Form.Item;

const SubmitButton = ({ className, ...rest }) => {
  return (
    <FormItem>
      <Button block size="large" type="primary" htmlType="submit" {...rest} />
    </FormItem>
  );
};

export default SubmitButton;
