import request from "./index";
export async function loginApi(data) {
  return request({
    url: "/api/login",
    method: "post",
    data,
  });
}
//查询角色列表
export async function getRolesApi() {
  return request({
    url: "/api/GetRoles",
    method: "get",
  });
}
//新增角色
export async function addRoleApi(data) {
  return request({
    url: "/api/AddRole",
    method: "post",
    data,
  });
}
//删除角色
export async function deleteRoleApi(roleId) {
  return request({
    url: `/api/DeleteRole/${roleId}`,
    method: "delete",
  });
}
//修改角色
export async function updateRoleApi(data) {
  return request({
    url: `/api/UpdateRole/${data.id}`,
    method: "put",
    data,
  });
}
//更新角色的权限数组
export async function updatePermissionForRoleApi(data) {
  const { roleId } = data || {};
  return request({
    url: `/api/updatePermissionForRole/${roleId}`,
    method: "post",
    data,
  });
}
//查询管理员列表
export async function getAdministratorsApi() {
  return request({
    url: "/api/getAdministrators",
    method: "get",
  });
}
//新增管理员
export async function addAdministratorApi(data) {
  return request({
    url: "/api/AddAdministrator",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
//查询api列表
export async function getApisApi() {
  return request({
    url: "/api/GetApis",
    method: "get",
  });
}
//查询所有菜单下所有api及菜单列表
export async function getMenuPermissionListApi() {
  return request({
    url: "/api/getMenuPermissionList",
    method: "get",
  });
}
//新增Api
export async function addApiApi(data) {
  return request({
    url: "/api/AddApi",
    method: "post",
    data,
  });
}
//删除Api
export async function deleteApiApi(apiId) {
  return request({
    url: `/api/DeleteApi/${apiId}`,
    method: "delete",
  });
}
//修改Api
export async function updateApiApi(data) {
  return request({
    url: `/api/UpdateApi/${data.id}`,
    method: "put",
    data,
  });
}
//查询文章类型列表
export async function getArticleTypesApi() {
  return request({
    url: "/api/GetArticleTypes",
    method: "get",
  });
}
//新增文章
export async function addArticleApi(data) {
  return request({
    url: "/api/AddArticle",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
//获取菜单列表
//查询文章类型列表
export async function getMenusApi() {
  return request({
    url: "/api/GetMenus",
    method: "get",
  });
}
//新增菜单
export async function addMenuApi(data) {
  return request({
    url: "/api/AddMenu",
    method: "post",
    data,
  });
}
//修改菜单
export async function updateMenuApi(data) {
  const { id } = data || {};
  return request({
    url: `/api/UpdateMenu/${id}`,
    method: "put",
    data,
  });
}
//删除单个菜单
export async function deleteMenuApi(id) {
  return request({
    url: `/api/DeleteMenu/${id}`,
    method: "delete",
  });
}
