import React from 'react'
import { ConfigProvider } from "antd"

export const dva = {
    config: {
        onError(err) {
            err.preventDefault();
            console.error(err.message);
        }
    }
}

export const rootContainer = container => {
   
    return <ConfigProvider
    autoInsertSpaceInButton={false}
    >
        {container}
    </ConfigProvider>
}
