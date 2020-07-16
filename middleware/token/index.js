/**
 * @author linzq
 * @date 2020/6/19
 * @description token中间件
 */

const { getToken, checkToken, decryptToken } = require('./token');

module.exports = async (ctx, next) => {
  ctx.getToken = getToken.bind(null, ctx);
  ctx.checkToken = checkToken.bind(null, ctx);
  ctx.decryptToken = decryptToken.bind(null, ctx);
  await next();
};