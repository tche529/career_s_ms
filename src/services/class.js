import request from '@/utils/request';

export async function getClasses(params) {
  return request('/admin/goods', { params });
}
//上架和下架
export async function isOn(goodid) {
  return request.patch(`/admin/goods/${goodid}/on`);
}

//推荐和不推荐
export async function isrecommend(goodid) {
  return request.patch(`/admin/goods/${goodid}/recommend`);
}

//添加课程
export async function addClass(params) {
  //console.log(params);
  return request.post('/admin/goods', { params });
}
//编辑课程
export async function updateClass(goodid, params) {
  console.log('addUser');
  return request.put(`/admin/goods/${goodid}`, { params });
}

//get CLASS BY ID
export async function getClass(goodid) {
  return request.get(`/admin/goods/${goodid}?include=category`);
}
