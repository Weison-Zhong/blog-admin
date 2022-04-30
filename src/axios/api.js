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
export async function deleteRoleApi(id) {
  return request({
    url: `/api/DeleteRole/${id}`,
    method: "delete",
  });
}
//修改角色
export async function updateRoleApi(data) {
  const { id } = data || {};
  return request({
    url: `/api/UpdateRole/${id}`,
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
//更新角色的菜单数组
export async function updateMenuForRoleApi(data) {
  const { roleId } = data || {};
  return request({
    url: `/api/updateMenuForRole/${roleId}`,
    method: "post",
    data,
  });
}
//查询管理员列表
export async function getUsersApi() {
  return request({
    url: "/api/getAdministrators",
    method: "get",
  });
}
//新增管理员
export async function addUserApi(data) {
  return request({
    url: "/api/AddAdministrator",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
//删除管理员
export async function deleteUserApi(id) {
  return request({
    url: `/api/DeleteAdministrator/${id}`,
    method: "delete",
  });
}
//修改管理员信息
export async function updateUserApi(userId, data) {
  return request({
    url: `/api/UpdateAdministrator/${userId}`,
    method: "put",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
//重新查询用户菜单列表
export async function getUserMenusApi() {
  return request({
    url: "/api/GetUserMenus",
    method: "get",
  });
}
//查询api列表
export async function getApisApi() {
  return request({
    url: "/api/GetApis",
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
//查询文章详情
export async function getArticleApi(articleId) {
  return request({
    url: `/api/GetArticle/${articleId}`,
    method: "get",
    params: { origin: "admin" },
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
//查询文章列表
export async function getArticlesApi(params) {
  return request({
    url: "/api/GetArticles",
    method: "get",
    params,
  });
}
//修改文章展示状态
export async function toggleArticleStatusApi(id) {
  return request({
    url: `/api/toggleArticleStatus/${id}`,
    method: "put",
  });
}
//修改文章排序权重
export async function updateArticleWeightApi(id, data) {
  return request({
    url: `/api/UpdateArticleWeight/${id}`,
    method: "put",
    data,
  });
}
//删除文章
export async function deleteArticleApi(id) {
  return request({
    url: `/api/DeleteArticle/${id}`,
    method: "delete",
  });
}
//修改文章
export async function updateArticleApi(articleId, data) {
  return request({
    url: `/api/UpdateArticle/${articleId}`,
    method: "put",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
//获取菜单列表
export async function getMenusApi() {
  return request({
    url: "/api/GetMenus",
    method: "get",
  });
}
//新增二级菜单
export async function addMenuApi(data) {
  return request({
    url: "/api/AddMenu",
    method: "post",
    data,
  });
}
//修改菜单
export async function updateMenuApi(id, data) {
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
//获取访客列表
export async function getGuestsApi(params) {
  return request({
    url: "/api/GetGuests",
    method: "get",
    params,
  });
}
//查询项目类型列表
export async function getProjectTypesApi() {
  return request({
    url: "/api/GetProjectTypes",
    method: "get",
  });
}
//查询项目详情
export async function getProjectApi(projectId) {
  return request({
    url: `/api/GetProject/${projectId}`,
    method: "get",
    params: { origin: "admin" },
  });
}
//新增项目
export async function addProjectApi(data) {
  return request({
    url: "/api/AddProject",
    method: "post",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
//查询项目列表
export async function getProjectsApi(parmas) {
  return request({
    url: "/api/GetProjects",
    method: "get",
    parmas,
  });
}
//修改项目展示状态
export async function toggleProjectStatusApi(id) {
  return request({
    url: `/api/toggleProjectStatus/${id}`,
    method: "put",
  });
}
//删除项目
export async function deleteProjectApi(id) {
  return request({
    url: `/api/DeleteProject/${id}`,
    method: "delete",
  });
}
//修改项目
export async function updateProjectApi(projectId, data) {
  return request({
    url: `/api/UpdateProject/${projectId}`,
    method: "put",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
//查询Icon列表
export async function getIconsApi() {
  return request({
    url: "/api/GetIcons",
    method: "get",
  });
}
//删除Icon
export async function deleteIconApi(id) {
  return request({
    url: `/api/DeleteIcon/${id}`,
    method: "delete",
  });
}
//修改Icon信息
export async function updateIconApi(id, data) {
  return request({
    url: `/api/updateIcon/${id}`,
    method: "put",
    data,
  });
}
//新增Icon
export async function addIconApi(data) {
  return request({
    url: "/api/addIcon",
    method: "post",
    data,
  });
}
//查询博客配置信息
export async function getBlogConfigApi() {
  return request({
    url: "/api/GetBlogConfig",
    method: "get",
  });
}
//修改博客配置信息
export async function updateBlogConfigApi(data) {
  return request({
    url: "/api/updateBlogConfig",
    method: "put",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
//删除简历，删除后web端将隐藏下载入口
export async function deleteResumeApi() {
  return request({
    url: "/api/deleteResume",
    method: "delete",
  });
}
//新增Icon
export async function addDemoApi(data) {
  return request({
    url: "/api/addDemo",
    method: "post",
    data,
  });
}
//删除单个菜单
export async function deleteDemoApi(id) {
  return request({
    url: `/api/DeleteDemo/${id}`,
    method: "delete",
  });
}
//修改Demo信息
export async function updateDemoApi(id, data) {
  return request({
    url: `/api/updateDemo/${id}`,
    method: "put",
    data,
  });
}
//查询Demo列表
export async function getDemosApi() {
  return request({
    url: "/api/GetDemos",
    method: "get",
  });
}
//修改Demo展示状态
export async function toggleDemoStatusApi(id) {
  return request({
    url: `/api/toggleDemoStatus/${id}`,
    method: "put",
  });
}
