import React from 'react'
import { Tooltip } from 'antd'
import timeUtils from '@/utils/time'
export default props => {
    const placement = props.placement || 'bottom'
    const { className,useTip,time } = props

    const formattedTime = timeUtils.format(time)

    if (!useTip) {
        return <span className={className}>
          {formattedTime}
        </span>
    }

    return <Tooltip
    title={timeUtils.format(time,{
      full: true
    })}
    placement={placement}
    >
        <span className={className}>
            {formattedTime}
        </span>
    </Tooltip>
}