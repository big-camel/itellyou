import React, { useEffect } from 'react';
import { useDispatch } from 'umi';

export default () => {
    const dispatch = useDispatch();

    useEffect(() => {}, [dispatch]);

    const render = () => {};

    return render();
};
