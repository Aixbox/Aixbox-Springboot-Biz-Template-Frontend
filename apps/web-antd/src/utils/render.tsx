import type { DictData } from '#/api/system/dict/dict-data-model';

import { DictTag } from '#/components/dict';

import { getDictOptions } from './dict';

export function renderDictTag(value: number | string, dicts: DictData[]) {
  return <DictTag dicts={dicts} value={value}></DictTag>;
}

/**
 * 显示字典标签 一般是table使用
 * @param value 值
 * @param dictName dictName
 * @returns tag
 */
export function renderDict(value: number | string, dictName: string) {
  const dictInfo = getDictOptions(dictName);
  return renderDictTag(value, dictInfo);
}
