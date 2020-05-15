export default function({ me }) {
    if (!me) return {};

    const isLogin = !!me;
    const accessArray = me.access || [];
    const accessList = {};
    accessArray.forEach(({ name }) => {
        const names = name.split('_');
        const key = [];
        names.forEach(char => {
            if (key.length === 0) key.push(char);
            else {
                key.push(char.charAt(0).toUpperCase() + char.slice(1));
            }
        });
        accessList[key.join('')] = true;
    });

    return {
        isLogin,
        ...accessList,
    };
}
