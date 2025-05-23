import type { DictType } from './dict-type-model';

import type { IDS, PageParam, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

enum Api {
  dictOptionSelectList = '/system/dict/type/optionselect',
  dictTypeExport = '/system/dict/type/export',
  dictTypeList = '/system/dict/type/list',
  dictTypeRefreshCache = '/system/dict/type/refreshCache',
  root = '/system/dict/type',
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
 * 删除字典类型
 * @param dictIds 字典类型id数组
 * @returns void
 */
export function dictTypeRemove(dictIds: IDS) {
  return requestClient.deleteWithMsg<void>(`${Api.root}/${dictIds}`);
}
