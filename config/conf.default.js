/**
 * 统一导出环境配置
 */
const path = require('path')
const fs = require('fs')
const dotenvConfigOutput = require('dotenv').config({ path: '.env' })

const {PROXY_TARGET} = dotenvConfigOutput.parsed

const cookieFilePath = path.join(__dirname, '../COOKIE')

const COOKIE = fs.readFileSync(cookieFilePath).toString()

module.exports = {
    PROXY_TARGET,
    COOKIE
}


