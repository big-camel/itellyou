import React from 'react';
import { BackTop, Tooltip } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import BaseButton from './BaseButton';

export default React.forwardRef((_, ref) => {
    return (
        <Tooltip title="回到顶部" placement="left">
            <BackTop className="default-back-top" ref={ref}>
                <BaseButton
                    className="ant-back-top-content"
                    icon={<VerticalAlignTopOutlined />}
                    shape="circle"
                />
            </BackTop>
        </Tooltip>
    );
});
