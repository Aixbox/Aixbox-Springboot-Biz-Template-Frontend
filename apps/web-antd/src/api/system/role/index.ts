import type { DeptResp, Role } from './model';

import type { ID, IDS, PageParam, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

enum Api {
  add = '/system/role/add',
  roleChangeStatus = '/system/role/changeStatus',
  roleDataScope = '/system/role/dataScope',
  roleDeptTree = '/system/role/deptTree',
  roleExport = '/system/role/export',
  roleList = '/system/role/page',
  root = '/system/role',
  update = '/system/role/update',
}

/**
 * 查询角色分页列表
 * @param params 搜索条件
 * @returns 分页列表
 */
export function roleList(params?: PageParam) {
  return requestClient.get<PageResult<Role>>(Api.roleList, { params });
}

/**
 * 导出角色信息
 * @param data 查询参数
 * @returns blob
 */
export function roleExport(data: Partial<Role>) {
  return commonExport(Api.roleExport, data);
}

/**
 * 角色删除
 * @param roleIds ids
 * @returns void
 */
export function roleRemove(roleIds: IDS) {
  return requestClient.deleteWithMsg<void>(`${Api.root}/${roleIds}`);
}

/**
 * 角色新增
 * @param data 参数
 * @returns void
 */
export function roleAdd(data: Partial<Role>) {
  return requestClient.postWithMsg<void>(Api.add, data);
}

/**
 * 角色更新
 * @param data 参数
 * @returns void
 */
export function roleUpdate(data: Partial<Role>) {
  return requestClient.putWithMsg<void>(Api.update, data);
}

/**
 * 查询角色信息
 * @param roleId 角色id
 * @returns 角色信息
 */
export function roleInfo(roleId: ID) {
  return requestClient.get<Role>(`${Api.root}/${roleId}`);
}

/**
 * 修改角色状态
 * @param data 参数
 * @returns void
 */
export function roleChangeStatus(data: Partial<Role>) {
  const requestData = {
    id: data.id,
    status: data.status,
  };
  return requestClient.putWithMsg<void>(Api.roleChangeStatus, requestData);
}

/**
 * 根据角色id获取部门树
 * @param roleId 角色id
 * @returns DeptResp
 */
export function roleDeptTree(roleId: ID) {
  return requestClient.get<DeptResp>(`${Api.roleDeptTree}/${roleId}`);
}

/**
 * 更新数据权限
 * @param data
 * @returns void
 */
export function roleDataScope(data: any) {
  return requestClient.putWithMsg<void>(Api.roleDataScope, data);
}
