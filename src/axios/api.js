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
export async function addOrUpdatePermissionsForRole(data) {
  return request({
    url: `/api/AddOrUpdatePermissionsForRole/${data.roleId}`,
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
export async function getPermissionsApi() {
  return request({
    url: "/api/GetPermissions",
    method: "get",
  });
}
//新增权限
export async function addPermissionApi(data) {
  return request({
    url: "/api/AddPermission",
    method: "post",
    data,
  });
}
//删除权限
export async function deletePermissionApi(permissionId) {
  return request({
    url: `/api/DeletePermission/${permissionId}`,
    method: "delete",
  });
}
//修改权限
export async function updatePermissionApi(data) {
  return request({
    url: `/api/UpdatePermission/${data.id}`,
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
