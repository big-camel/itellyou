import React from 'react';
import { ConfigProvider } from 'antd';
import { fetchMe } from './services/user/index';

export const dva = {
    config: {
        onError(err) {
            err.preventDefault();
            console.error(err.message);
        },
    },
};

export const rootContainer = container => {
    return <ConfigProvider autoInsertSpaceInButton={false}>{container}</ConfigProvider>;
};

export async function getInitialState() {
    const result = await fetchMe();
    const me = result && result.result ? result.data : null;
    return {
        me,
    };
}
