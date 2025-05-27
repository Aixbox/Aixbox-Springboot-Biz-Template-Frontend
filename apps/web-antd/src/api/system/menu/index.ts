import type { Menu, MenuOption, MenuQuery, MenuResp } from './model';

import type { ID, IDS } from '#/api/common';

import { requestClient } from '#/api/request';

enum Api {
  add = '/system/menu/add',
  menuList = '/system/menu/list',
  menuTreeSelect = '/system/menu/treeselect',
  roleMenuTree = '/system/menu/roleMenuTreeselect',
  root = '/system/menu',
  update = '/system/menu/update',
}

/**
 * 菜单列表
 * @param params 参数
 * @returns 列表
 */
export function menuList(params?: MenuQuery) {
  return requestClient.get<Menu[]>(Api.menuList, { params });
}

/**
 * 菜单删除
 * @param menuIds ids
 */
export function menuRemove(menuIds: IDS) {
  return requestClient.deleteWithMsg<void>(`${Api.root}/${menuIds}`);
}

/**
 * 菜单新增
 * @param data 参数
 */
export function menuAdd(data: Partial<Menu>) {
  return requestClient.postWithMsg<void>(Api.add, data);
}

/**
 * 菜单详情
 * @param menuId 菜单id
 * @returns 菜单详情
 */
export function menuInfo(menuId: ID) {
  return requestClient.get<Menu>(`${Api.root}/${menuId}`);
}

/**
 * 菜单更新
 * @param data 参数
 */
export function menuUpdate(data: Partial<Menu>) {
  return requestClient.putWithMsg<void>(Api.update, data);
}

/**
 * 返回对应角色的菜单
 * @param roleId id
 * @returns resp
 */
export function roleMenuTreeSelect(roleId: ID) {
  return requestClient.get<MenuResp>(`${Api.roleMenuTree}/${roleId}`);
}

/**
 * 下拉框使用  返回所有的菜单
 * @returns []
 */
export function menuTreeSelect() {
  return requestClient.get<MenuOption[]>(Api.menuTreeSelect);
}
