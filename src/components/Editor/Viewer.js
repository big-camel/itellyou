import React from 'react';
import { isBrowser, useSelector } from 'umi';
import { Skeleton } from 'antd';
import { ContentView } from './Async';

export default ({ content, html, onLoad, genAnchor, ...props }) => {
    const settings = useSelector((state) => state.settings);

    const renderContent = () => {
        // 内容为空时，不执行渲染
        if (!content) return <span></span>;

        if (!isBrowser() && settings.isSpider)
            return <div dangerouslySetInnerHTML={{ __html: html }} />;
        if (!isBrowser()) return <Skeleton active />;
        return (
            <ContentView
                content={content}
                genAnchor={genAnchor}
                onLoad={onLoad}
                image={{
                    display: 'block',
                    align: 'center',
                }}
                lockedtext={{
                    action: '/api/crypto',
                }}
                video={{
                    action: {
                        query: '/api/upload/video/query',
                    },
                    user_id: '1049903053975201',
                }}
                {...props}
            />
        );
    };

    return renderContent();
};
