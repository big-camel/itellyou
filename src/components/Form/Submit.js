import React from 'react'
import { Button } from 'antd'

const SubmitButton = ({ className, ...rest }) => {
  return (
      <Button block size="large" type="primary" htmlType="submit" {...rest} />
  );
};

export default SubmitButton;
