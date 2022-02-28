const {PROXY_TARGET, COOKIE: Cookie} = require('./conf.default');

module.exports = {
    '/api': {
        target: PROXY_TARGET,
        changeOrigin: true,
        pathRewrite: {'^/api': ''},
        headers: {
            Cookie,
            'HEADER-USERINFO': 'eyJ1U05DcmVhdGVkIjoiMSIsInNBTUFjY291bnROYW1lIjoiemhhbmdzYW4ifQ==',
            'Company-Uuid': 'default',
        },
    },
};
