import React from 'react';
import { ContentView } from '@itellyou/itellyou-editor';

export default ({ content, onLoad, genAnchor, ...props }) => {
    const renderContent = () => {
        // 内容为空时，不执行渲染
        if (!content) return <span></span>;
        return (
            <ContentView
                content={content}
                genAnchor={genAnchor}
                onLoad={onLoad}
                image={{
                    display: 'block',
                    align: 'center',
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
