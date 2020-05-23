import React from 'react';
import Editor from '@/components/Editor';

export default ({ content, html }) => {
    return <Editor.Viewer content={content} html={html} />;
};
