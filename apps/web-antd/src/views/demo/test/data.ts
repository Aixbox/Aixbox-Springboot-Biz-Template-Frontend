import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { DictEnum } from '@vben/constants';
import { getPopupContainer } from '@vben/utils';

import { getDictOptions } from '#/utils/dict';
import { renderDict } from '#/utils/render';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'name',
    label: '名字',
  },
  {
    component: 'RangePicker',
    fieldName: 'createTime',
    label: '创建时间',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_USER_SEX),
    },
    fieldName: 'sex',
    label: '性别',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_YES_NO, false, true),
    },
    fieldName: 'isOrNot',
    label: '是否',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    title: 'id',
    field: 'id',
  },
  {
    title: '名字',
    field: 'name',
  },
  {
    title: '创建时间',
    field: 'createTime',
  },
  {
    title: '性别',
    field: 'sex',
    width: 120,
    slots: {
      default: ({ row }) => {
        return renderDict(row.sex, DictEnum.SYS_USER_SEX);
      },
    },
  },

  {
    title: '是否',
    field: 'isOrNot',
    width: 120,
    slots: {
      default: ({ row }) => {
        return renderDict(row.isOrNot, DictEnum.SYS_YES_NO, true);
      },
    },
  },
];

export const modalSchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'name',
    label: '名字',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_USER_SEX),
    },
    fieldName: 'sex',
    label: '性别',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      options: getDictOptions(DictEnum.SYS_YES_NO, false, true),
    },
    fieldName: 'isOrNot',
    label: '是否',
  },
];
