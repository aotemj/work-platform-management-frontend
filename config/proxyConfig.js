const { PROXY_TARGET, COOKIE: Cookie } = require('./conf.default')

module.exports =  {
    "/api": {
        target: PROXY_TARGET,
        changeOrigin: true,
        headers:{
            Cookie,
        },
    },
}
