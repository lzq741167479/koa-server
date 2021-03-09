/*
 * @Author: linzq
 * @Date: 2021-03-01 19:36:54
 * @LastEditors: linzq
 * @LastEditTime: 2021-03-06 18:12:03
 * @Description: 大屏接口
 */
const mysql = require('../../mysql');
const Table = require('../../class/tableList'); // 列表返回格式
const router = require('koa-router')();
const sql = require('./sql');
const Joi = require('joi'); // 参数校验

router.prefix('/bigScreen');

// 热力图数据
// #region
/**
 * @swagger
 * /bigScreen/list:
 *   post:
 *     summary: 数据列表
 *     description: 数据列表
 *     tags: [可视化模块]
 *     parameters:
 *       - name: pageNum
 *         description: 页码
 *         in: formData
 *         type: number
 *       - name: pageSize
 *         description: 条数
 *         in: formData
 *         type: number
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *     security:
 *       - token: {}
 */
// #endregion
router.post('/list', async ctx => {
  const data = ctx.request.body;
  const list = await mysql.query(sql.list(1000));
  const table = new Table();
  ctx.success(table.tableTotal(list.length, list));
});

// #region
/**
 * @swagger
 * /bigScreen/gradeDistribution:
 *   post:
 *     summary: 等级情况 类型分布
 *     description: 等级情况 类型分布
 *     tags: [可视化模块]
 *     parameters:
 *       - name: year
 *         description: 年份
 *         in: formData
 *         type: number
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *     security:
 *       - token: {}
 */
// #endregion
router.post('/gradeDistribution', async ctx => {
  const data = ctx.request.body;
  const returnData = {
    grade: [], // 景区等级
    type: [] // 景点类型
  };
  const year = data.year ? data.year : 2020;

  const yearList = await mysql.query(sql.numList(`grade_${year}`)); // 等级
  const type = await mysql.query(sql.numList('type')); // 种类
  for (const ele of type) {
    returnData.type[ele.type] = ele.total;
  }
  for (const ele of yearList) {
    returnData.grade[ele.type - 1] = ele.total;
  }
  ctx.success(returnData);
});

// #region
/**
 * @swagger
 * /bigScreen/yearTrend:
 *   post:
 *     summary: 年趋势
 *     description: 年趋势
 *     tags: [可视化模块]
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *     security:
 *       - token: {}
 */
// #endregion
router.post('/yearTrend', async ctx => {
  const data = ctx.request.body;
  const returnData = {
    touristTotal: [],
    scenicTotal: []
  };
  const touristTotal = await mysql.query(sql.touristTotal);
  const scenicTotal = await mysql.query(sql.scenicTotal);

  console.log(scenicTotal);
  for (const key in touristTotal) {
    const ele = touristTotal[key][0];
    returnData.touristTotal.push(Number(Object.values(ele)[0] / 10000).toFixed(2));
  }
  for (const key in scenicTotal) {
    const ele = scenicTotal[key][0];
    returnData.scenicTotal.push(Object.values(ele)[0]);
  }
  ctx.success(returnData);
});

// #region
/**
 * @swagger
 * /bigScreen/realtimeData:
 *   post:
 *     summary: 实时数据
 *     description: 实时数据
 *     tags: [可视化模块]
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *     security:
 *       - token: {}
 */
// #endregion
router.post('/realtimeData', async ctx => {
  const data = ctx.request.body;
  let returnData = {};
  const realData = await mysql.query(sql.realData);
  for (const iterator of realData) {
    returnData = { ...returnData, ...iterator[0] };
  }
  ctx.success(returnData);
});
// #region
/**
 * @swagger
 * /bigScreen/topTen:
 *   post:
 *     summary: 前十
 *     description: 前十
 *     tags: [可视化模块]
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *     security:
 *       - token: {}
 */
// #endregion
router.post('/topTen', async ctx => {
  const data = ctx.request.body;
  const returnData = {};
  const topTen = await mysql.query(sql.topTen);
  const typeNumList = await mysql.query(sql.typeNumList);
  const dict = await mysql.query(sql.dict);
  // console.log(topTen);

  for (const key in typeNumList) {
    for (const dictEle of dict) {
      if (typeNumList[key].typeId == dictEle.typeId) {
        typeNumList[key].typeName = dictEle.typeName;
      }
    }
  }
  returnData.typeNum = typeNumList;
  for (const key in topTen) {
    topTen[key].value = Number(topTen[key].value);
  }
  returnData.topTen = topTen;
  ctx.success(returnData);
});

// #region
/**
 * @swagger
 * /bigScreen/allData:
 *   post:
 *     summary: 所有数据
 *     description: 所有数据
 *     tags: [可视化模块]
 *     parameters:
 *       - name: year
 *         description: 年份
 *         in: formData
 *         type: number
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *     security:
 *       - token: {}
 */
// #endregion
router.post('/allData', async ctx => {
  const data = ctx.request.body;
  const list = await mysql.query(sql.grade(data.year));
  let returnData = {
    grade: [], // 景区等级
    type: [] // 景点类型
    // typeNum: [] // 类型-游客数
  };
  const year = data.year ? data.year : 2020;

  const yearList = await mysql.query(sql.numList(`grade_${year}`)); // 等级
  const type = await mysql.query(sql.numList('type')); // 种类
  const touristTotal = await mysql.query(sql.touristTotal);
  const topTen = await mysql.query(sql.topTen);
  const typeNumList = await mysql.query(sql.typeNumList);
  const dict = await mysql.query(sql.dict);
  // console.log(topTen);

  for (const key in typeNumList) {
    for (const dictEle of dict) {
      if (typeNumList[key].typeId == dictEle.typeId) {
        console.log(dictEle);
        typeNumList[key].typeName = dictEle.typeName;
      }
    }
  }
  returnData.typeNum = typeNumList;
  for (const ele of type) {
    returnData.type[ele.type] = ele.total;
  }
  for (const ele of yearList) {
    returnData.grade[ele.type - 1] = ele.total;
  }
  for (const key in touristTotal) {
    const ele = touristTotal[key][0];
    returnData = { ...returnData, ...ele };
  }
  returnData.topTen = topTen;
  ctx.success(returnData);
});

// #region
/**
 * @swagger
 * /bigScreen/detail:
 *   post:
 *     summary: 景点详情
 *     description: 景点详情
 *     tags: [可视化模块]
 *     parameters:
 *       - name: lng
 *         description: 精度
 *         in: formData
 *         type: number
 *       - name: lat
 *         description: 纬度
 *         in: formData
 *         type: number
 *     responses:
 *       '200':
 *         description: Ok
 *         schema:
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             data:
 *               type: 'object'
 *               description: 返回数据
 *             message:
 *               type: 'string'
 *               description: 消息提示
 *       '400':
 *         description: 请求参数错误
 *       '404':
 *         description: not found
 *     security:
 *       - token: {}
 */
// #endregion
router.post('/detail', async ctx => {
  const data = ctx.request.body;
  console.log(data);
  const schema = Joi.object({
    lng: Joi.required().error(new Error('lng参数不得为空！')),
    lat: Joi.required().error(new Error('lat参数不得为空！'))
  });
  const value = schema.validate(data);
  if (value.error) return ctx.error([400, value.error.message]);
  const list = await mysql.query(sql.detail(data.lng, data.lat));
  ctx.success(list);
});

// 导出
module.exports = router;
