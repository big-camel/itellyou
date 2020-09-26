import { dynamic } from 'umi';
import { Skeleton } from 'antd';
import { PaidPlugin } from './Plugin';
import Loading from '../Loading';

export default dynamic({
    loader: async () => {
        const { default: Editor } = await import(
            /* webpackChunkName: "async-itellyou-editor" */ '@itellyou/itellyou-editor'
        );
        return Editor;
    },
    loading: () => <Loading />,
});

const initPlugin = async (Engine) => {
    const { PaidSection } = await import(
        /* webpackChunkName: "async-itellyou-editor-section" */ './Section'
    );

    Engine.section.add('paid', PaidSection);
    Engine.plugin.add('paid', PaidPlugin);
};

const LineEditor = dynamic({
    loader: async () => {
        const { LineEditor } = await import(
            /* webpackChunkName: "async-itellyou-editor" */ '@itellyou/itellyou-editor'
        );
        return LineEditor;
    },
    loading: () => <Loading />,
});

const FullEditor = dynamic({
    loader: async () => {
        const { FullEditor, Engine } = await import(
            /* webpackChunkName: "async-itellyou-editor" */ '@itellyou/itellyou-editor'
        );
        await initPlugin(Engine);
        return FullEditor;
    },
    loading: () => <Loading />,
});
const MiniEditor = dynamic({
    loader: async () => {
        const { MiniEditor, Engine } = await import(
            /* webpackChunkName: "async-itellyou-editor" */ '@itellyou/itellyou-editor'
        );
        await initPlugin(Engine);
        return MiniEditor;
    },
    loading: () => <Loading />,
});
const Outline = dynamic({
    loader: async () => {
        const { Outline } = await import(
            /* webpackChunkName: "async-itellyou-editor" */ '@itellyou/itellyou-editor'
        );
        return Outline;
    },
    loading: () => <Loading />,
});
const ContentView = dynamic({
    loader: async () => {
        const { ContentView, Engine } = await import(
            /* webpackChunkName: "async-itellyou-editor" */ '@itellyou/itellyou-editor'
        );
        await initPlugin(Engine);
        return ContentView;
    },
    loading: () => <Skeleton active />,
});
export { FullEditor, LineEditor, MiniEditor, Outline, ContentView };
