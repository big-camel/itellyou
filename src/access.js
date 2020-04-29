export default function({ me }) {
    const { role } = me || {};
    const isLogin = !!me;
    return {
        isLogin,
        isAdmin: isLogin && role && role.indexOf('admin') >= 0,
    };
}
