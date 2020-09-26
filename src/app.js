import React from 'react';
import { ConfigProvider } from 'antd';

export const rootContainer = (container) => {
    return <ConfigProvider autoInsertSpaceInButton={false}>{container}</ConfigProvider>;
};
