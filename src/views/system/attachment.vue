<template>
  <div class="gutter-example">
    <a-row :gutter="16" align="middle" type="flex">
      <a-col :span="24" style="padding-bottom: 12px;">
        <!-- 顶部操作 -->
        <a-card :bordered="false" :bodyStyle="{ padding: '16px' }">
          <a-form layout="inline" >
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="关键词">
                  <a-input />
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item label="存储位置">
                  <a-select style="width: 120px">
                    <a-select-option key="1">111</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item label="文件类型">
                  <a-select style="width: 120px">
                    <a-select-option key="2">222</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :md="4" :sm="24">
                <a-form-item>
                  <a-button>查询</a-button>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <div  style="margin-top: 10px;">
            <!-- 第二行操作 -->
            <a-button type="primary" icon="cloud-upload" @click="() => (uploadVisible = true)">上传</a-button>
            <a-button
              icon="select"
              v-show="!supportMultipleSelection"
              @click="handleMultipleSelection"
            >批量操作</a-button>
            <a-button
              type="danger"
              icon="delete"
              v-show="supportMultipleSelection"
              @click="handleDeleteAttachmentInBatch"
            >删除</a-button>
            <a-button
              icon="close"
              v-show="supportMultipleSelection"
              @click="handleCancelMultipleSelection"
            >取消</a-button>
          </div>
        </a-card>
      </a-col>

      <a-col :span="24">
        <a-list
          :grid="{ gutter: 12, xs: 2, sm: 2, md: 4, lg: 6, xl: 6, xxl: 6 }"
          :dataSource="attachments"
        >
          <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
            <a-card :bodyStyle="{ padding: 0 }" hoverable @click="handleShowDetailDrawer(item)">
              <div class="attach-thumb">
                <span v-show="!handleJudgeMediaType(item)">当前格式不支持预览</span>
                <img
                  :src="item.thumbPath"
                  v-show="handleJudgeMediaType(item)"
                  loading="lazy"
                  style="width:100%;height:100px"
                />
              </div>
              <a-card-meta style="padding: 0.8rem;">
                <!-- <span>{{item.fileKey}}</span> -->
                <!-- <ellipsis :length="isMobile() ? 12 : 16" tooltip slot="description">{{ item.name }}</ellipsis> -->
              </a-card-meta>
              <a-checkbox
                class="select-attachment-checkbox"
                :style="getCheckStatus(item.id) ? selectedAttachmentStyle : ''"
                :checked="getCheckStatus(item.id)"
                @click="handleAttachmentSelectionChanged($event, item)"
                v-show="supportMultipleSelection"
              ></a-checkbox>
            </a-card>
          </a-list-item>
        </a-list>
      </a-col>
    </a-row>

    <div class="page-wrapper">
      <a-pagination
        class="pagination"
        :current="pagination.page"
        :total="pagination.total"
        :defaultPageSize="pagination.size"
        :pageSizeOptions="['18', '36', '54', '72', '90', '108']"
        showSizeChanger
        @change="handlePaginationChange"
        @showSizeChange="handlePaginationChange"
      />
    </div>
    <a-modal
      title="上传附件"
      v-model="uploadVisible"
      :footer="null"
      :afterClose="onUploadClose"
      destroyOnClose
    >
      <FilePondUpload ref="upload" :uploadHandler="uploadHandler"></FilePondUpload>
    </a-modal>
    <!-- <AttachmentDetailDrawer
      v-model="drawerVisible"
      v-if="selectAttachment"
      :attachment="selectAttachment"
      :addToPhoto="true"
      @delete="() => this.loadAttachment()"
    />-->
  </div>
</template>

<script>
import attachmentApi from "@/api/attachment.js";
export default {
  data() {
    return {
      uploadVisible: false,
      selectAttachment: {},
      supportMultipleSelection: false,
      attachments: "",
      pagination: {
        page: 1,
        size: 18,
        sort: null
      },
      queryParam: {
        page: 0,
        size: 18,
        sort: null,
        keyword: null,
        mediaType: null,
        attachmentType: null
      },
      drawerVisible: false,
      uploadHandler: attachmentApi.upload
    };
  },
  created() {
    this.loadAttachment();
  },
  methods: {
    loadAttachment() {
      attachmentApi.list().then(resp => {
        console.log(resp);
        this.attachments = resp.data.data.content;
      });
    },
    handleMultipleSelection() {
      this.supportMultipleSelection = true;
    },
    handleDeleteAttachmentInBatch() {},
    handleCancelMultipleSelection() {
      this.supportMultipleSelection = false;
    },
    handleShowDetailDrawer() {},
    handleJudgeMediaType(attachment) {
      var mediaType = attachment.mediaType;
      // 判断文件类型
      if (mediaType) {
        var prefix = mediaType.split("/")[0];

        if (prefix === "image") {
          // 是图片
          return true;
        } else {
          // 非图片
          return false;
        }
      }
      // 没有获取到文件返回false
      return false;
    },
    getCheckStatus() {},
    handlePaginationChange() {},
    onUploadClose() {}
  }
};
</script>

<style>
</style>