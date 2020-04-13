export const setList = (
    key,
    { append, end, total, data, ...payload },
    state,
    callback,
    megerBack,
) => {
    const list = state[key];
    if (!list || !append) {
        return {
            ...state,
            [key]: { end, total, data, ...payload },
        };
    }
    const dataList = list.data.concat();
    callback =
        callback ||
        function(child, item) {
            return child.id === item.id;
        };
    total = list.total;
    data.forEach(item => {
        const index = dataList.findIndex(child => callback(child, item));
        if (index < 0) {
            total += 1;
            dataList.push(item);
        } else {
            const old = dataList[index];
            megerBack =
                megerBack ||
                function(old, item) {
                    return { ...old, ...item };
                };
            dataList.splice(index, 1, megerBack(old, item));
        }
    });
    return {
        ...state,
        [key]: { ...list, end, total, data: dataList },
    };
};

export const removeItem = (key, id, state, callback) => {
    callback =
        callback ||
        function(item) {
            return item.id === id;
        };
    const list = state[key] ? state[key] : {};
    const data = list.data || [];
    const index = data.findIndex(item => callback(item));

    if (index >= 0) {
        data.splice(index, 1);
    }
    return {
        ...state,
        [key]: { ...state[key], total: list.total - 1, data },
    };
};

export const replaceItem = (key, { ...payload }, state, callback, megerBack) => {
    const list = state[key];
    if (list) {
        callback =
            callback ||
            function(item) {
                return item.id === payload.id;
            };
        const data = list.data.concat();
        const index = data.findIndex(item => callback(item));
        if (index >= 0) {
            const item = data[index];
            megerBack =
                megerBack ||
                function(item) {
                    return { ...item, ...payload };
                };
            data.splice(index, 1, megerBack(item));
        }

        return {
            ...state,
            [key]: { ...list, data },
        };
    }
    return {
        ...state,
    };
};
