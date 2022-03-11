const {PROXY_TARGET, COOKIE: Cookie} = require('./conf.default');

module.exports = {
    '/api': {
        target: PROXY_TARGET,
        changeOrigin: true,
        pathRewrite: {'^/api': ''},
        headers: {
            // Cookie,
            'HEADER-USERINFO': 'eyJ1U05DcmVhdGVkIjoiMSIsInNBTUFjY291bnROYW1lIjoiemhhbmdzYW4ifQ==',
            // 生产环境需要去掉
            'Company-Uuid': 'osc',
            'Group-Name': 'osc',
            'Group-Type': 1,
        },
    },
};
