import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { VbenIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { getPopupContainer } from '@vben/utils';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'menuName',
    label: '菜单名称 ',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      // options: getDictOptions(DictEnum.SYS_NORMAL_DISABLE),
    },
    fieldName: 'status',
    label: '菜单状态 ',
  },
  {
    component: 'Select',
    componentProps: {
      getPopupContainer,
      // options: getDictOptions(DictEnum.SYS_SHOW_HIDE),
    },
    fieldName: 'visible',
    label: '显示状态',
  },
];

export const columns: VxeGridProps['columns'] = [
  {
    title: '菜单名称',
    field: 'menuName',
    treeNode: true,
    width: 200,
    slots: {
      // 需要i18n支持 否则返回原始值
      default: ({ row }) => $t(row.menuName),
    },
  },
  {
    title: '图标',
    field: 'icon',
    width: 80,
    slots: {
      default: ({ row }) => {
        if (row?.icon === '#') {
          return '';
        }
        return (
          <span class={'flex justify-center'}>
            <VbenIcon icon={row.icon} />
          </span>
        );
      },
    },
  },
  {
    title: '排序',
    field: 'orderNum',
    width: 120,
  },
  {
    title: '组件类型',
    field: 'menuType',
    width: 150,
    slots: {
      // TODO
      // default: ({ row }) => {
      //   const current = menuTypes[row.menuType as 'C' | 'F' | 'M'];
      //   if (!current) {
      //     return '未知';
      //   }
      //   return (
      //     <span class="flex items-center justify-center gap-1">
      //       {h(current.icon, { class: 'size-[18px]' })}
      //       <span>{current.value}</span>
      //     </span>
      //   );
      // },
    },
  },
  {
    title: '权限标识',
    field: 'perms',
  },
  {
    title: '组件路径',
    field: 'component',
  },
  {
    title: '状态',
    field: 'status',
    width: 100,
    slots: {
      // TODO
      // default: ({ row }) => {
      //   return renderDict(row.status, DictEnum.SYS_NORMAL_DISABLE);
      // },
    },
  },
  {
    title: '显示',
    field: 'visible',
    width: 100,
    slots: {
      // TODO
      // default: ({ row }) => {
      //   // return renderDict(row.visible, DictEnum.SYS_SHOW_HIDE);
      // },
    },
  },
  {
    title: '创建时间',
    field: 'createTime',
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    resizable: false,
    width: 'auto',
  },
];
