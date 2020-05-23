import React from 'react';
import { useEditor } from './Hook';

export default ({ content, html, onLoad, genAnchor, ...props }) => {
    const { ContentView } = useEditor() || {};

    const renderContent = () => {
        // 内容为空时，不执行渲染
        if (!content) return <span></span>;
        if (!ContentView) return <div dangerouslySetInnerHTML={{ __html: html }} />;
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
