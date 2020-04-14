import React from 'react';
import { Result, Button } from 'antd';
import { history, useIntl } from 'umi';

export default ({ status = 404, title, subTitle, go }) => {
    const intl = useIntl();
    return (
        <Result
            status={status}
            title={title || status}
            subTitle={
                subTitle ||
                intl.formatMessage({
                    id: `${status}`,
                })
            }
            extra={
                <Button type="primary" onClick={() => history.push(go || '/')}>
                    Back Home
                </Button>
            }
        />
    );
};
