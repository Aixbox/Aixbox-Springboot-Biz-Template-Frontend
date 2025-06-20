import type { DictData } from './dict-data-model';

import type { ID, IDS, PageParam } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

enum Api {
  add = '/system/dict/data/add',
  dictDataExport = '/system/dict/data/export',
  dictDataList = '/system/dict/data/page',
  root = '/system/dict/data',
  update = '/system/dict/data/update',
}

/**
 * 主要是DictTag组件使用
 * @param dictType 字典类型
 * @returns 字典数据
 */
export function dictDataInfo(dictType: string) {
  return requestClient.get<DictData[]>(`${Api.root}/type/${dictType}`);
}

/**
 * 字典数据
 * @param params 查询参数
 * @returns 字典数据列表
 */
export function dictDataList(params?: PageParam) {
  return requestClient.get<DictData[]>(Api.dictDataList, { params });
}

/**
 * 导出字典数据
 * @param data 表单参数
 * @returns blob
 */
export function dictDataExport(data: Partial<DictData>) {
  return commonExport(Api.dictDataExport, data);
}

/**
 * 删除
 * @param dictIds 字典ID Array
 * @returns void
 */
export function dictDataRemove(dictIds: IDS) {
  return requestClient.deleteWithMsg<void>(`${Api.root}/${dictIds}`);
}

/**
 * 新增
 * @param data 表单参数
 * @returns void
 */
export function dictDataAdd(data: Partial<DictData>) {
  return requestClient.postWithMsg<void>(Api.add, data);
}

/**
 * 修改
 * @param data 表单参数
 * @returns void
 */
export function dictDataUpdate(data: Partial<DictData>) {
  return requestClient.putWithMsg<void>(Api.update, data);
}

/**
 * 查询字典数据详细
 * @param id 字典编码
 * @returns 字典数据
 */
export function dictDetailInfo(id: ID) {
  return requestClient.get<DictData>(`${Api.root}/${id}`);
}
