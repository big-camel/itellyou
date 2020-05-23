import React from 'react';
import { useSelector, Redirect } from 'umi';
import Loading from '@/components/Loading';
import Exception from '@/components/Exception';
import User from './components/user';
import Column from './components/column';

function Path({ location: { pathname, ...location }, match }) {
    const paths = match.params.path.split('/');
    const path = paths[0];

    const loadingState = useSelector(state => state.loading);
    const loading = loadingState.effects['path/find'];
    const detail = useSelector(state => state.path.detail);

    if (!detail || loading) return <Loading />;

    if (!detail.path || !/^[a-zA-Z0-9_.]{3,30}$/.test(path)) return <Redirect to="/404" />;

    if (detail.type === 'user') return <User location={location} paths={paths} id={detail.id} />;
    if (detail.type === 'column')
        return <Column location={location} paths={paths} id={detail.id} />;

    return <Exception />;
}

Path.getInitialProps = async ({ isServer, store, params, match }) => {
    const paths = match.params.path.split('/');
    const path = paths[0];

    const { dispatch, getState } = store;
    const state = getState();
    const { detail } = state.path || {};

    if (detail && !detail.path) {
        await dispatch({
            type: 'path/clearDetail',
        });
        return { ...state, path: null };
    }

    const { result, data } = await dispatch({
        type: 'path/find',
        payload: {
            path,
            ...params,
        },
    });
    if (result) {
        const { type, id } = data;
        if (type === 'column') {
            await Column.getInitialProps({ isServer, store, params: { ...params, id }, paths });
        } else if (type === 'user') {
            await User.getInitialProps({ isServer, store, params: { ...params, id }, paths });
        }
    } else {
        await dispatch({
            type: 'path/setDetail',
            payload: {
                path: null,
            },
        });
    }

    if (isServer) return getState();
};

export default Path;
