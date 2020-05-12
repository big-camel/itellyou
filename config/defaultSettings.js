const { UMI_ENV } = process.env;
export default {
    primaryColor: '#347EFF',
    title: 'ITELLYOU',
    defaultAvatar: 'https://cdn-object.itellyou.com/avatar/default.png',
    ws:
        UMI_ENV === 'prod'
            ? 'wss://www.itellyou.com/api/websocket'
            : 'ws://localhost:8082/websocket',
};
