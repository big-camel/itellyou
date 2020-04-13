import React, { useEffect } from 'react';
import { useDispatch, useSelector, useHistory, useLocation } from 'umi';
import Loading from '@/components/Loading';
import styles from './index.less';
export default () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const { key } = location.query;
    if (!key) history.push('/404');
    useEffect(() => {
        dispatch({
            type: 'preview/getURL',
            payload: {
                key,
            },
        });
    }, [key, dispatch]);

    const fileInfo = useSelector(state => state.preview[key]);
    if (!fileInfo) return <Loading />;
    const { config, preview } = fileInfo;
    let url = preview;
    if (!config.doc) url = fileInfo.url;
    return (
        <div className={styles['preview-container']}>
            <iframe src={url} />
        </div>
    );
};
