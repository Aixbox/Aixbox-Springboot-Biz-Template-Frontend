import type { DictData } from '#/api/system/dict/dict-data-model';

import { DictTag } from '#/components/dict';

export function renderDictTag(value: number | string, dicts: DictData[]) {
  return <DictTag dicts={dicts} value={value}></DictTag>;
}
