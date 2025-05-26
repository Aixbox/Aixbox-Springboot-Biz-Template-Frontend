import type { DictType } from './dict-type-model';

import type { ID, IDS, PageParam, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

enum Api {
  add = '/system/dict/type/add',
  dictTypeExport = '/system/dict/type/export',
  dictTypeList = '/system/dict/type/list',
  dictTypeRefreshCache = '/system/dict/type/refreshCache',
  root = '/system/dict/type',
  update = '/system/dict/type/update',
}
export function dictTypeList(params?: PageParam) {
  return requestClient.get<PageResult<DictType>>(Api.dictTypeList, { params });
}

/**
 * 刷新字典缓存
 * @returns void
 */
export function refreshDictTypeCache() {
  return requestClient.deleteWithMsg<void>(Api.dictTypeRefreshCache);
}

/**
 * 导出字典类型列表
 * @param data 表单参数
 * @returns blob
 */
export function dictTypeExport(data: Partial<DictType>) {
  return commonExport(Api.dictTypeExport, data);
}

/**
 * 新增
 * @param data 表单参数
 * @returns void
 */
export function dictTypeAdd(data: Partial<DictType>) {
  return requestClient.postWithMsg<void>(Api.add, data);
}

/**
 * 修改
 * @param data 表单参数
 * @returns void
 */
export function dictTypeUpdate(data: Partial<DictType>) {
  return requestClient.putWithMsg<void>(Api.update, data);
}

/**
 * 删除字典类型
 * @param dictIds 字典类型id数组
 * @returns void
 */
export function dictTypeRemove(dictIds: IDS) {
  return requestClient.deleteWithMsg<void>(`${Api.root}/${dictIds}`);
}

/**
 * 查询详情
 * @param dictId 字典类型id
 * @returns 信息
 */
export function dictTypeInfo(dictId: ID) {
  return requestClient.get<DictType>(`${Api.root}/${dictId}`);
}
