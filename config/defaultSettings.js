const { UMI_ENV } = process.env;
export default {
    primaryColor: '#347EFF',
    title: 'ITELLYOU',
    ws: UMI_ENV === 'prod' ? 'ws://api-web.itellyou.com' : 'ws://localhost:8082',
};
