import React from 'react';
import { useSelector } from 'umi';
import Author from '@/components/User/Author';

const Member = () => {
    const dataSource = useSelector(state => state.columnMember.list);
    if (!dataSource) return null;
    return (
        <div>
            {dataSource.data.map(({ user }) => {
                return <Author key={user.id} info={user} model="avatar" size="small" />;
            })}
        </div>
    );
};

Member.getInitialProps = async ({ isServer, store, params }) => {
    const { dispatch, getState } = store;

    await dispatch({
        type: 'columnMember/list',
        payload: {
            ...params,
        },
    });

    if (isServer) return getState();
};

export default Member;
