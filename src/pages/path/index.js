import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'umi';
import Loading from '@/components/Loading';
import Exception from '@/components/Exception';
import User from './components/user';
import Column from './components/column';

export default ({ location: { pathname, ...location } }) => {
    pathname = pathname.indexOf('/') === 0 ? pathname.substr(1) : pathname;
    const paths = pathname.split('/');
    const path = paths[0];
    const [notFound, setNotFound] = useState(!/^[a-zA-Z0-9_.]{3,30}$/.test(path));

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'path/find',
            payload: {
                path,
            },
        }).then(res => {
            if (!res || !res.result || res.data.type === 'retain') {
                setNotFound(true);
            }
        });
    }, [path, dispatch]);

    const detail = useSelector(state => state.path.detail);

    if (notFound) return <Exception />;

    if (!detail) return <Loading />;

    if (detail.type === 'user') return <User location={location} paths={paths} id={detail.id} />;
    if (detail.type === 'column')
        return <Column location={location} paths={paths} id={detail.id} />;

    return <Exception />;
};
