const {PROXY_TARGET, COOKIE: Cookie, PROXY_TARGET_FOR_THIRD_PARTY} = require('./conf.default');

const commonHeadersConfig = {
    Cookie,
};
module.exports = {
    '/api': {
        target: PROXY_TARGET,
        changeOrigin: true,
        pathRewrite: {'^/api': ''},
        headers: {
            ...commonHeadersConfig,
            'HEADER-USERINFO': 'eyJ1U05DcmVhdGVkIjoiMSIsInNBTUFjY291bnROYW1lIjoiemhhbmdzYW4ifQ==',
        },
    },
    // one、pipe 相关代理
    '/global': {
        target: PROXY_TARGET_FOR_THIRD_PARTY,
        changeOrigin: true,
        pathRewrite: {'^/global': ''},
        headers: {
            ...commonHeadersConfig,
            'HEADER-USERINFO': 'eyJyZWFsbVV1aWQiOiJvc2MiLCJjbGllbnRJZCI6Im9uZS1zc28ifQ==',
        },
    },
};
