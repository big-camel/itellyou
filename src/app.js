import React from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/es/locale/zh_CN';

export const rootContainer = (container) => {
    return (
        <ConfigProvider locale={locale} autoInsertSpaceInButton={false}>
            {container}
        </ConfigProvider>
    );
};
