import type { OssConfig } from './model';

import type { ID, IDS, PageParam } from '#/api/common';

import { requestClient } from '#/api/request';

enum Api {
  add = '/resource/oss/config/add',
  ossConfigChangeStatus = '/resource/oss/config/changeStatus',
  ossConfigList = '/resource/oss/config/page',
  root = '/resource/oss/config',
  update = '/resource/oss/config/update',
}

// 获取OSS配置列表
export function ossConfigList(params?: PageParam) {
  return requestClient.get<OssConfig[]>(Api.ossConfigList, { params });
}

// 获取OSS配置的信息
export function ossConfigInfo(ossConfigId: ID) {
  return requestClient.get<OssConfig>(`${Api.root}/${ossConfigId}`);
}

// 添加新的OSS配置
export function ossConfigAdd(data: Partial<OssConfig>) {
  return requestClient.postWithMsg<void>(Api.add, data);
}

// 更新现有的OSS配置
export function ossConfigUpdate(data: Partial<OssConfig>) {
  return requestClient.putWithMsg<void>(Api.update, data);
}

// 删除OSS配置
export function ossConfigRemove(ossConfigIds: IDS) {
  return requestClient.deleteWithMsg<void>(`${Api.root}/${ossConfigIds}`);
}

// 更改OSS配置的状态
export function ossConfigChangeStatus(data: any) {
  const requestData = {
    id: data.id,
    status: data.status,
    configKey: data.configKey,
  };
  return requestClient.putWithMsg(Api.ossConfigChangeStatus, requestData);
}
