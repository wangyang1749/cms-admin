<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="users"
      :pagination="false"
      :rowKey="users => users.id"
      size="small"
      class="table"
    >
      <template slot="title">
        <a-button @click="addInput()">添加用户</a-button>
      </template>
      <div slot="avatar" slot-scope="avatar">
        <img :src="avatar" alt width="50px" />
      </div>
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="updateInput(record)">更新</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="delUser(record.id)">删除</a>
      </span>
      <template slot="footer">
        <div class="page-wrapper" :style="{ textAlign: 'right'}">
          <a-pagination
            class="pagination"
            :current="pagination.page"
            :total="pagination.total"
            :defaultPageSize="pagination.size"
            :pageSizeOptions="['1', '2', '5', '10', '20', '50', '100']"
            showSizeChanger
            @showSizeChange="handlePaginationChange"
            @change="handlePaginationChange"
          />
        </div>
      </template>
    </a-table>

    <a-modal :title="userOperateTitle" v-model="visible" @ok="addOrUpdate">
      <a-form>
        <a-form-item label="用户头像">
          <a-input type="file" v-model="user.file"></a-input>
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model="user.username"></a-input>
        </a-form-item>
        <a-form-item label="用户密码">
          <a-input v-model="user.password"></a-input>
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-model="user.phone"></a-input>
        </a-form-item>
        <a-form-item label="权限">
          <span>
            <a-tag v-for="role in user.roles" :color="'green'" :key="role.id">{{role.name}}</a-tag>
          </span>
        </a-form-item>
        <a-form-item label="电子邮件">
          <a-input v-model="user.email"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import userApi from "@/api/user.js";
const columns = [
  {
    title: "用户名",
    dataIndex: "avatar",
    key: "avatar",
    scopedSlots: { customRender: "avatar" }
  },
  {
    title: "用户名",
    dataIndex: "username",
    key: "username"
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    key: "createDate"
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];
export default {
  data() {
    return {
      pagination: {
        page: 1,
        size: 5
      },
      queryParam: {
        page: 0,
        size: 10
      },
      users: [],
      columns: columns,
      visible: false,
      userOperateTitle: "",
      isUpdate: false,
      userId: null,
      user: {
        username: "",
        password: "",
        phone: "",
        email: ""
      }
    };
  },
  created() {
    this.loadUsers();
  },
  methods: {
    loadUsers() {
      this.queryParam.page = this.pagination.page - 1;
      this.queryParam.size = this.pagination.size;
      this.queryParam.sort = this.pagination.sort;
      userApi.page(this.queryParam).then(resp => {
        this.users = resp.data.data.content;
        this.pagination.total = resp.data.data.totalElements;
        // console.log(resp);
      });
    },
    handlePaginationChange(page, pageSize) {
      // console.log("111")
      // this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
      this.pagination.page = page;
      this.pagination.size = pageSize;
      this.loadUsers();
    },
    addInput() {
      this.userOperateTitle = "添加用户";
      this.visible = true;
      this.isUpdate = false;
    },
    updateInput(user) {
      this.userOperateTitle = "更新用户" + user.username;
      userApi.find(user.id).then(resp => {
        this.user = resp.data.data;
        // console.log(resp);
      });
      this.visible = true;

      this.isUpdate = true;
      this.userId = user.id;
    },
    delUser(id) {
      userApi.delete(id).then(resp => {
        this.$notification["success"]({
          message: "操作" + resp.data.message
        });
        this.loadUsers();
      });
    },
    addOrUpdate() {
      let userData = new FormData();
      userData.append(
        "file",
        document.querySelector("input[type=file]").files[0]
      );
      userData.append("username", this.user.username);
      userData.append("password", this.user.password);
      userData.append("phone", this.user.phone);
      userData.append("email", this.user.email);
      if (this.isUpdate) {
        userApi.update(this.userId, userData).then(resp => {
          this.$notification["success"]({
            message: "更新成功"+resp.data.message
          });
          this.loadUsers();
        });
        this.visible = false;
      } else {
        userApi.add(userData).then(resp => {
         this.$notification["success"]({
            message: "添加成功"+resp.data.message
          });
          this.loadUsers();
        });
        this.visible = false;
      }
    }
  }
};
</script>

<style>
</style>