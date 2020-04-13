import React from 'react';
import { Result, Button } from 'antd';
import { history } from 'umi';

export default ({ status, title, subTitle, go }) => (
    <Result
        status={status || 404}
        title={title || '404'}
        subTitle={subTitle || 'Sorry, the page you visited does not exist.'}
        extra={
            <Button type="primary" onClick={() => history.push(go || '/')}>
                Back Home
            </Button>
        }
    />
);
