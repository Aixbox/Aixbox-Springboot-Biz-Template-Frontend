import type { DictData } from '#/api/system/dict/dict-data-model';

import { DictTag } from '#/components/dict';

import { getDictOptions } from './dict';

export function renderDictTag(
  value: boolean | number | string,
  dicts: DictData[],
) {
  return <DictTag dicts={dicts} value={value}></DictTag>;
}

/**
 * 显示字典标签 一般是table使用
 * @param value 值
 * @param dictName dictName
 * @param formatBoolean 是否格式化字典value为boolean类型
 * @returns tag
 */
export function renderDict(
  value: boolean | number | string,
  dictName: string,
  formatNumber = false,
  formatBoolean = false,
) {
  const dictInfo = getDictOptions(dictName, formatNumber, formatBoolean);
  return renderDictTag(value, dictInfo);
}

/**
 * render多个dictTag
 * @param value key数组 string[]类型
 * @param dicts 字典数组
 * @param wrap 是否需要换行显示
 * @param [gap] 间隔
 * @returns render
 */
export function renderDictTags(
  value: string[],
  dicts: DictData[],
  wrap = true,
  gap = 1,
) {
  if (!Array.isArray(value)) {
    return <div>{value}</div>;
  }
  return (
    <div
      class={['flex', wrap ? 'flex-col' : 'flex-row']}
      style={{ gap: `${gap}px` }}
    >
      {value.map((item, index) => {
        return <div key={index}>{renderDictTag(item, dicts)}</div>;
      })}
    </div>
  );
}
