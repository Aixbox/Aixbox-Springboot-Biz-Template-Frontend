import type { Client } from './model';

import type { ID, IDS, PageParam, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

enum Api {
  add = '/system/client/add',
  clientChangeStatus = '/system/client/changeStatus',
  clientExport = '/system/client/export',
  clientList = '/system/client/page',
  root = '/system/client',
  update = '/system/client/update',
}

/**
 * 查询客户端分页列表
 * @param params 请求参数
 * @returns 列表
 */
export function clientList(params?: PageParam) {
  return requestClient.get<PageResult<Client>>(Api.clientList, { params });
}

/**
 * 导出客户端excel
 * @param data 请求参数
 */
export function clientExport(data: Partial<Client>) {
  return commonExport(Api.clientExport, data);
}

/**
 * 客户端详情
 * @param id id
 * @returns 详情
 */
export function clientInfo(id: ID) {
  return requestClient.get<Client>(`${Api.root}/${id}`);
}

/**
 * 客户端新增
 * @param data 参数
 */
export function clientAdd(data: Partial<Client>) {
  return requestClient.postWithMsg<void>(Api.add, data);
}

/**
 * 客户端修改
 * @param data 参数
 */
export function clientUpdate(data: Partial<Client>) {
  return requestClient.putWithMsg<void>(Api.update, data);
}

/**
 * 客户端状态修改
 * @param data 状态
 */
export function clientChangeStatus(data: any) {
  const requestData = {
    clientId: data.clientId,
    status: data.status,
  };
  return requestClient.putWithMsg<void>(Api.clientChangeStatus, requestData);
}

/**
 * 客户端删除
 * @param ids id集合
 */
export function clientRemove(ids: IDS) {
  return requestClient.deleteWithMsg<void>(`${Api.root}/${ids}`);
}
