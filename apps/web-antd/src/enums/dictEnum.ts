export const DictEnum = {
    //TODO 下面的枚举手动添加到 packages\@core\base\shared\src\constants\dict-enum.ts 文件中
            SYS_DEVICE_TYPE: 'sys_device_type',
            SYS_YES_NO: 'sys_yes_no',
            SYS_USER_SEX: 'sys_user_sex',

} as const;

export type DictEnumKey = keyof typeof DictEnum;
