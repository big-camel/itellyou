import { useState, useEffect, useRef } from 'react';

function useEditor() {
    const Editor = useRef();
    const [loading, setLoading] = useState(false);

    // 异步加载编辑器，以便服务器渲染时获取不到window/document对象报错
    useEffect(() => {
        let isUn = false;
        if (!Editor.current) {
            import(
                /* webpackChunkName: "async-itellyou-editor" */ '@itellyou/itellyou-editor'
            ).then(module => {
                if (!isUn) {
                    Editor.current = module;
                    setLoading(true);
                }
            });
        }
        return () => {
            isUn = true;
        };
    }, []);

    return loading || Editor.current ? Editor.current : null;
}

export { useEditor };
