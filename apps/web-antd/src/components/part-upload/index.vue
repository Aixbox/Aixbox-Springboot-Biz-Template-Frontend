<script setup lang="ts">
import type { PartUploadList } from '#/api/system/oss/model';

import { computed, ref } from 'vue';

import { message, Progress } from 'ant-design-vue';
import { md5 } from 'hash-wasm';

import { multipartUpload, uploadChunk } from '#/api/system/oss';

/**
 * 直接运行项目需要放行multipart接口 否则需要token
 * // @SaCheckPermission("system:oss:multipart")
 @PostMapping(value = "/multipart")
 @SaIgnore
 public R<?> multipart(@RequestBody MultipartBo multipartBo) {
 */
const uploadDone = ref(false);
const uploadStatus = computed(() => (uploadDone.value ? 'success' : 'active'));
const percent = ref(0);

// 切片
const CHUNK_SIZE = 1024 * 1024 * 1; // 5MB
async function handleFileChange(e: any) {
  // 拿到上传的文件
  const file = e.target.files[0]! as File;

  const fileSize = file.size;
  if (fileSize <= CHUNK_SIZE) {
    message.error('文件大小不能小于5MB'); // 使用 element-plus 的 ElMessage 显示错误
    return;
  }

  const chunks: Blob[] = [];
  for (let i = 0; i < file.size; i += CHUNK_SIZE) {
    const chunk = file.slice(i, i + CHUNK_SIZE);
    chunks.push(chunk);
  }
  // chunk0转uint8array
  const chunk0 = await chunks[0]?.arrayBuffer();
  if (!chunk0) {
    message.error('文件切片失败');
    return;
  }
  const uint8array0 = new Uint8Array(chunk0);
  // 第一片的md5
  const firstChunkMd5 = await md5(uint8array0);

  /**
   * 初始化分片请求 拿到uploadId
   */
  const resp = await multipartUpload({
    ossStatus: 'initiate',
    originalName: file.name,
    md5Digest: firstChunkMd5,
  });
  console.log(resp);
  const uploadId = resp.uploadId;

  const partUploadList: PartUploadList[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const uploadResp = await multipartUpload({
      ossStatus: 'upload',
      uploadId,
      partNumber: i + 1,
    });

    // 拿到上传地址 privateUrl
    const privateUrl = uploadResp.privateUrl;
    const minioResp = await uploadChunk(privateUrl, chunk);

    // 从headers拿到etag
    const eTag = minioResp.headers.etag;
    partUploadList.push({
      partNumber: i + 1,
      entryTag: eTag,
    });

    // 上传进度
    percent.value = Math.round(((i + 1) / chunks.length) * 100);
    console.log(`上传进度: ${percent.value}%`);
  }

  // 合并
  await multipartUpload({
    ossStatus: 'complete',
    uploadId,
    partUploadList,
  });

  message.success('上传成功'); // 使用 element-plus 的 ElMessage 显示成功信息
}
</script>

<template>
  <div>
    <a href="https://gitee.com/dromara/RuoYi-Vue-Plus/pulls/522">分支地址</a>
    <!-- 使用 element-plus 的 Progress 组件 -->
    <Progress :percent="percent" :status="uploadStatus" />
    <input type="file" @change="handleFileChange" />
  </div>
</template>

<style scoped>
/* 你可以在这里添加一些样式 */
</style>
