const storageFactory = storage => {
    return {
        get: value => {
            try {
                return storage.getItem(value) || null;
            } catch (e) {
                return storage.getItem(value);
            }
        },
        getObject: value => {
            try {
                return JSON.parse(storage.getItem(value) || null);
            } catch (e) {
                return storage.getItem(value);
            }
        },
        set: (key, value) => {
            let currentValue = value;
            if (typeof value !== 'string') {
                currentValue = JSON.stringify(value);
            }

            try {
                // localStorage quota 不足会导致报错，进而影响编辑器光标等行为
                storage.setItem(key, currentValue);
            } catch (e) {
                console.error(e);
            }
        },
        remove: key => {
            return storage.removeItem(key);
        },
        keys: () => {
            const ks = [];

            for (var i = 0; i < storage.length; i += 1) {
                ks.push(storage.key(i));
            }

            return ks;
        },
    };
};

const localStorageService = storageFactory(window.localStorage);
export default {
    set: localStorageService.set,
    get: localStorageService.get,
    getObject: localStorageService.getObject,
    remove: localStorageService.remove,
    keys: localStorageService.keys,
    session: storageFactory(window.sessionStorage),
};
