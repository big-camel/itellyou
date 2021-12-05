const { NODE_ENV } = process.env;
export default {
    primaryColor: '#347EFF',
    title: 'ITELLYOU,我告诉你',
    defaultAvatar: 'https://cdn-object.aomao.com/avatar/default.png',
    ws:
        NODE_ENV === 'production'
            ? 'wss://www.aomao.com/api/websocket'
            : 'ws://localhost:8082/websocket',
};
