const {PROXY_TARGET, COOKIE: Cookie, PROXY_TARGET_FOR_SA} = require('./conf.default');

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
    // one
    '/one': {
        target: PROXY_TARGET_FOR_SA,
        changeOrigin: true,
        pathRewrite: {'^/one': ''},
        headers: {
            // eslint-disable-next-line max-len
            Cookie: 'ai_user=6NyO9vxxTxCVdimsKANvcg|2022-01-10T08:11:56.755Z; USER_REALM_KEY="eyJyZWFsbVV1aWQiOiJvc2MiLCJjbGllbnRJZCI6Im9uZS1zc28ifQ=="; PRE-GW-LOAD=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJ1U05DcmVhdGVkIjoiMSIsImRpc3BsYXlOYW1lIjoi6Zi_55qE6K-05rOVIiwic0FNQWNjb3VudE5hbWUiOiJvc2MtYWRtaW4iLCJjb21wYW55Ijoib3NjIiwiY29tcGFueUlkZW50aXR5IjoiQ09NUEFOWV9PV05FUiIsInVzZXJQcmluY2lwYWxOYW1lIjoib3NjLWFkbWluQHFxLmNvbSIsImp0aSI6Ijg4ZmNkM2I5N2JjNjQ2NmJhMTMzNTI5YzI0YjFiODE4IiwiaWF0IjoxNjQ4MDE5MTQ0LCJzdWIiOiIxIiwiZXhwIjoxNjQ4NTg3NjAwfQ.u9O_6ItHzqW30ow2n9vbrEwGWnMlrkDsfeZ489KIh-g; PRE-GW-SESSION=88fcd3b97bc6466ba133529c24b1b818',
        },
    },
    // sa
    '/sa': {
        target: PROXY_TARGET_FOR_SA,
        changeOrigin: true,
        pathRewrite: {'^/sa': ''},
    },
};
