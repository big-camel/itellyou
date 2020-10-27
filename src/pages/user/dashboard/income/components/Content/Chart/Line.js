import React from 'react';
import { dynamic } from 'umi';
import Loading from '@/components/Loading';

export default dynamic({
    loader: async () => {
        const { Line } = await import(
            /* webpackChunkName: "@ant-design-charts" */ '@ant-design/charts'
        );
        return Line;
    },
    loading: () => <Loading />,
});
