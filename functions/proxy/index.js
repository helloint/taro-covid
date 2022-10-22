// 云函数入口文件
const cloud = require('wx-server-sdk');
const got = require('got');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }); // 使用当前云环境

// 云函数入口函数
exports.main = async (event) => {
  const response = await got(event.url);
  return response.body;
};
