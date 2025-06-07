export interface DemoTest {
    /**
     * id
     */
      id: string | number;

    /**
     * 名字
     */
      inputType: string;

    /**
     * 性别
     */
      sex: number;

    /**
     * 创建时间
     */
      createTime: string;

    /**
     * int类型
     */
      integerType: string;

    /**
     * 文本域类型
     */
      textareaType: string;

    /**
     * 选择类型
     */
      selectType: string;

        /**
         * 选择类型Url
         */
          selectTypeUrl: string;
    /**
     * 是否
     */
      radioIsOrNot: boolean;

    /**
     * 复选框类型
     */
      checkboxType: string;

}
