import React from 'react';
import { BackTop, Tooltip } from 'antd';
import { VerticalAlignTopOutlined } from '@ant-design/icons';
import BaseButton from './BaseButton';

export default React.forwardRef((_, ref) => {
    return (
        <BackTop className="default-back-top" ref={ref}>
            <Tooltip title="回到顶部" placement="left">
                <BaseButton
                    className="ant-back-top-content"
                    icon={<VerticalAlignTopOutlined />}
                    shape="circle"
                />
            </Tooltip>
        </BackTop>
    );
});
