import React from 'react';
import { Tooltip } from 'antd';
import timeUtils from '@/utils/time';
export default ({ placement, className, useTip, time }) => {
    placement = placement || 'bottom';

    const formattedTime = timeUtils.format(time);

    const getFormattedTime = () => {
        return <span className={className}>{formattedTime}</span>;
    };

    if (!useTip) {
        return getFormattedTime();
    }

    return (
        <Tooltip
            title={timeUtils.format(time, {
                full: true,
            })}
            placement={placement}
        >
            {getFormattedTime()}
        </Tooltip>
    );
};
