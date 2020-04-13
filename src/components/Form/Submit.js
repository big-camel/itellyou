import React from 'react';
import { Button, Form } from 'antd';

const SubmitButton = ({ className, noStyle, ...rest }) => {
    return (
        <Form.Item noStyle>
            <Button block size="large" type="primary" htmlType="submit" {...rest} />
        </Form.Item>
    );
};

export default SubmitButton;
