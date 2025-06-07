import type { DemoTest } from './model';

import type { ID, IDS, PageParam, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

enum Api {
  add = '/demo/test/add',
  testExport = '/demo/test/export',
  testList = '/demo/test/page',
  root = '/demo/test',
  update = '/demo/test/update',
}

/**
 * 测试分页列表
 * @param params 请求参数
 * @returns 列表
 */
export function testList(params?: PageParam) {
  return requestClient.get<PageResult<DemoTest>>(Api.testList, { params });
}

export function testInfo(testId: ID) {
  return requestClient.get<DemoTest>(`${Api.root}/${testId}`);
}

/**
 * 导出
 * @param data 参数
 */
export function testExport(data: Partial<DemoTest>) {
  return commonExport(Api.testExport, data);
}

/**
 * 更新系统配置
 * @param data 参数
 */
export function testUpdate(data: Partial<DemoTest>) {
  return requestClient.putWithMsg<void>(Api.update, data);
}

/**
 * 新增系统配置
 * @param data 参数
 */
export function testAdd(data: Partial<DemoTest>) {
  return requestClient.postWithMsg<void>(Api.add, data);
}

/**
 * 删除配置
 * @param testIds ids
 */
export function testRemove(testIds: IDS) {
  return requestClient.deleteWithMsg<void>(`${Api.root}/${testIds}`);
}