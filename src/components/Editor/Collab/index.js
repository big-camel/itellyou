import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'umi';
import Biz from './Biz';
import { EVENT, STATUS, ERROR_LEVEL, ERROR_CODE, MESSAGE } from './constant';
import { message, notification, Button } from 'antd';
import Loading from '@/components/Loading';

export default ({ id, type, ot, engine, onReady }) => {
    onReady = onReady || function() {};
    const [status, setStatus] = useState(STATUS.initialize);
    const [users, setUsers] = useState([]);
    const [guideView, setGuideView] = useState(false);
    const [error, setError] = useState();
    const collabBiz = useRef();

    const dispatch = useDispatch();
    const me = useSelector(state => state.user.me);

    if (!me) return <Loading />;

    useEffect(() => {
        if (collabBiz.current) return;
        const biz = new Biz(id, type, dispatch, {
            ot,
            me,
            engine,
        });
        biz.on(EVENT.statusChange, ({ to }) => {
            setStatus(to);
            if (to === STATUS.active) {
                setGuideView(users.length > 0);
                setError(null);
            }
        });
        biz.on(EVENT.usersChange, users => {
            setUsers(users);
        });
        biz.on(EVENT.error, error => {
            const { level } = error;
            if (level === ERROR_LEVEL.FATAL) {
                setError(error);
            } else {
                message.error(error.message || '未知异常');
            }
        });
        biz.on(EVENT.published, () => {
            collabBiz.current.exit();
            /**message.success("内容发布成功",1 , () => {
                window.location.href = `/${model}/${id}`
            })**/
        });
        biz.on(EVENT.broadcast, ({ type, body }) => {
            if (type === MESSAGE.DOC_PUBLISHED) {
                notification.open({
                    message: `${body.user.name} 刚刚 发布 了文档`,
                    className: 'collab-published-notify',
                });
            }
        });
        collabBiz.current = biz;
        collabBiz.current.init();
        onReady(collabBiz.current);
    }, [onReady]);
    return (
        <div data-testid="collab-keeper">
            {status === STATUS.error && (
                <div>
                    <p>status:{status}</p>
                    <p>error:{error ? error.message : '未知错误'}</p>
                    <Button onClick={() => collabBiz.current.reload()}>Reload</Button>
                </div>
            )}
        </div>
    );
};

export { EVENT, STATUS, ERROR_LEVEL, ERROR_CODE, MESSAGE };
