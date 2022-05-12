import request from '@/utils/request';

export async function query(){
  return request('/api/users');
}

export async function queryCurrent() {
  //return request('/api/currentUser');
  //console.log('queryCurrent');
  return request('/admin/user');
}

export async function getUsers(params) {
  return request('/admin/users',{params});
}
export async function lockerUser(uid){
  return request.patch(`/admin/users/${uid}/lock`)
}
// ADD USER TO API
export async function addUser(params){
  //console.log('addUser');
  return request.post('/admin/users',{params})

}

// update USER TO API
export async function updateUser(uid,params){
  //console.log('addUser');
  return request.put(`/admin/users/${uid}`,{params})

}

//get USER 
export async function getUser(uid){
  //console.log('addUser');
  return request.get(`/admin/users/${uid}`)

}