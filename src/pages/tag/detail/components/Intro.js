import React from 'react';
import Editor from '@/components/Editor';

export default ({ content }) => {
    return <Editor.Viewer content={content} />;
};
