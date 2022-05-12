import request from 'umi-request';
// 获取oss上传凭证

export async function ossConfig() {
  return request('/api/auth/oss/token');
}
