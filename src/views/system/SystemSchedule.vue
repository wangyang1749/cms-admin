<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="shedules"
      size="small"
      class="table"
      :pagination="false"
      :rowKey="article => article.id"
    >
      <template slot="title">
        <a-button @click="()=>{visible=true;isUpdate=false}">添加任务</a-button>
      </template>

      <span slot="action" slot-scope="text, record">
        <a-divider type="vertical" />
        <a href="javascript:;" @click="runOnceJobNow(record.id)">运行一次</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="removeJob(record.id)">移除</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="startJob(record.id)">启动</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="updateJobInput(record.id)">更新</a>
      </span>
    </a-table>

    <a-modal title="添加任务" v-model="visible" @ok="handleOk">
      <a-form>
        <a-form-item label="任务名称">
          <a-input v-model="shcedule.jobName"></a-input>
        </a-form-item>
        <a-form-item label="任务描述">
          <a-input v-model="shcedule.description"></a-input>
        </a-form-item>
        <a-form-item label="任务表达式">
          <a-input v-model="shcedule.cornExpression"></a-input>
        </a-form-item>
        <a-form-item label="任务类名">
          <a-input v-model="shcedule.beanClass"></a-input>
        </a-form-item>
        <a-form-item label="任务分组">
          <a-input v-model="shcedule.jobGroup"></a-input>
        </a-form-item>
        <a-form-item label="任务状态">
          <a-input v-model="shcedule.jobStatus"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "jobName",
    dataIndex: "jobName",
    key: "jobName"
  },
  {
    title: "jobGroup",
    dataIndex: "jobGroup",
    key: "jobGroup"
  },
  {
    title: "beanClass",
    dataIndex: "beanClass",
    key: "beanClass"
  },
  {
    title: "cornExpression",
    dataIndex: "cornExpression",
    key: "cornExpression"
  },

  {
    title: "scheduleStatus",
    dataIndex: "scheduleStatus",
    key: "scheduleStatus"
  },
  {
    title: "Action",
    key: "action",

    //   width: 200,
    scopedSlots: { customRender: "action" }
  }
];

import scheduleApi from "@/api/schedule.js";
export default {
  data() {
    return {
      columns,
      shedules: null,
      visible: false,
      shcedule: {
        jobName: "",
        description: "",
        cornExpression: "",
        beanClass: "",
        jobGroup: "",
        jobStatus: "",
        userId: ""
      },
      isUpdate: false,
      selectShceduleId: null
    };
  },
  created() {
    this.loadSchedules();
  },
  methods: {
    loadSchedules() {
      scheduleApi.list().then(resp => {
        this.shedules = resp.data.data;
      });
    },
    handleOk() {
      if (this.isUpdate) {
         scheduleApi.updateJobCron(this.selectShceduleId,this.shcedule).then(resp => {
             this.$notification["success"]({
                message: "操作" + resp.data.message
            });
          this.loadSchedules();
          this.visible = false;
        });
      } else {
        scheduleApi.add(this.shcedule).then(resp => {
         this.$notification["success"]({
                message: "操作" + resp.data.message
            });
          this.loadSchedules();
          this.visible = false;
        });
      }
    },
    startJob(id) {
      scheduleApi.startJob(id).then(resp => {
       this.$notification["success"]({
                message: "操作" + resp.data.message
            });
        this.loadSchedules();
      });
    },
    removeJob(id) {
      scheduleApi.removeJob(id).then(resp => {
        this.$notification["success"]({
                message: "操作" + resp.data.message
            });
        this.loadSchedules();
      });
    },
    runOnceJobNow(id) {
      scheduleApi.runOnceJobNow(id).then(resp => {
        this.$notification["success"]({
                message: "操作" + resp.data.message
            });
        this.loadSchedules();
      });
    },
    updateJobInput(id) {
      this.selectShceduleId = id;
      this.isUpdate = true;
      scheduleApi.find(id).then(resp => {
        this.visible = true;
        // console.log(resp);
        this.shcedule = resp.data.data;
      });
    }
  }
};
</script>

<style>
</style>