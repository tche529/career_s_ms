import request from '@/utils/request';

export async function getClasses(params) {
  return request('/admin/goods', { params });
}

//get category list
export async function getCategory() {
  //console.log('addUser');
  return request.get('/admin/category');
}
