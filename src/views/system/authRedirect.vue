<template>
    <div>
        <a-button @click="addOrUpdateDrawer(false)">创建选项</a-button>
        <a-drawer title="Basic Drawer" placement="right" width="800" :closable="false" :visible="visible"
            @close="() => { this.visible = false }">

            <!-- <a-form-item label="questionId">
                <a-input v-model="param.questionId"></a-input>
            </a-form-item> -->
            <a-form-item label="title">
                <a-input v-model="param.title"></a-input>
            </a-form-item>
        
            <a-form-item label="description">
                <a-textarea v-model="param.description"></a-textarea>
            </a-form-item>
            <a-form-item label="viewName">
                <a-input v-model="param.viewName"></a-input>
            </a-form-item>
            <a-form-item label="path">
                <a-input v-model="param.path"></a-input>
            </a-form-item>



            <a-form-item label="currentUrl">
                <a-input v-model="param.currentUrl"></a-input>
            </a-form-item>
        
<!-- 
            <a-form-item label="currentUrl">
                <a-input v-model="param.currentUrl"></a-input>
            </a-form-item> -->
        
            <a-form-item label="authUrl">
                <a-select allowClear style="width: 100%" v-model="param.authUrl">
                    <a-select-option value="/wx/auth/login">/wx/auth/login</a-select-option>
                    <a-select-option value="/wx/auth/subscribeMsg">/wx/auth/subscribeMsg</a-select-option>

                </a-select>
            </a-form-item>
            <a-form-item label="loginRedirect">
                <a-select allowClear style="width: 100%" v-model="param.loginRedirect">
                    <a-select-option value="/wx/auth/submit">/wx/auth/submit</a-select-option>
                    <a-select-option value="/wx/auth/callLogin">/wx/auth/callLogin</a-select-option>
                    <a-select-option value="/wx/auth/callLoginPage">/wx/auth/callLoginPage</a-select-option>
                    <a-select-option value="/wx/auth/subscribeMsgAddCookie">/wx/auth/subscribeMsgAddCookie</a-select-option>
                    <a-select-option value="/wx/auth/subscribeMsg">/wx/auth/subscribeMsg</a-select-option>

                </a-select>
            </a-form-item>

            <a-form-item label="subscribeRedirect">
                <a-select allowClear style="width: 100%" v-model="param.subscribeRedirect">
                    <a-select-option value="/wx/auth/submit">/wx/auth/submit</a-select-option>
                    <a-select-option value="/wx/auth/page">/wx/auth/page</a-select-option>
                    <a-select-option value="/wx/auth/login">/wx/auth/login</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="loginAuthRedirect">
                <a-select allowClear style="width: 100%" v-model="param.loginAuthRedirect">
                    <a-select-option value="/wx/auth/subscribeMsg">/wx/auth/subscribeMsg</a-select-option>
                    <a-select-option value="/wx/auth/page">/wx/auth/page</a-select-option>

                </a-select>
            </a-form-item>
            <a-form-item label="loginPage">
                <a-input v-model="param.loginPage"></a-input>
            </a-form-item>
            <a-button @click="addOrUpdate">确认</a-button>
        </a-drawer>



        <a-table :pagination="false" :columns="columns" :dataSource="data" :rowKey="data => data.id">
            <!-- <div slot="existNav" slot-scope="existNav,record">
          <a-switch defaultChecked @change="onChangeNav(record.id)" v-model="record.existNav" />
        </div> -->
            <!-- <div slot="categoryId" slot-scope="categoryId, record">
            <a-select style="width: 100%" v-model="record.categoryId" @change="selectCategory(record.id, $event)">
              <a-select-option  :key="0">没有分类</a-select-option>
              <a-select-option :value="item.id" v-for="item in categorys" :key="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </div> -->
            <span slot="action" slot-scope="text, record">

                <a href="javascript:;" @click="addOrUpdateDrawer(true, record.id)">编辑</a>
                <!-- <a-divider type="vertical" />
                <a href="javascript:;" @click="createSheetLanguage(record.id)">复制英文</a>
                <a-divider type="vertical" />
                <a href="javascript:;" @click="generateHtml(record.id)">生成HTML</a> -->
                <a-divider type="vertical" />
                <a href="javascript:;" @click="delById(record.id)">删除</a>
                <!-- <a href="javascript:;" @click="showQuestion(record.id)">查看题目</a> -->
                <!-- <a-divider type="vertical" />
                <a href="javascript:;" @click="preview(record.id)">预览</a>
                <a-divider type="vertical" />
                <a href="javascript:;" @click="openHtml(record)">查看HTML</a> -->
            </span>

            <template slot="footer">
                <div class="page-wrapper" :style="{ textAlign: 'right' }">
                    <a-pagination class="pagination" :current="pagination.page" :total="pagination.total"
                        :defaultPageSize="pagination.size" :pageSizeOptions="['1', '2', '5', '10', '20', '50', '100']"
                        showSizeChanger @showSizeChange="handlePaginationChange" @change="handlePaginationChange" />
                </div>
            </template>
        </a-table>
    </div>
</template>
  
<script>
import authRedirect from "@/api/authRedirect.js";
// import preview from "@/api/preview.js";
// import categoryApi from "@/api/category.js";
// import contentAPI from "@/api/content.js";

const columns = [
    { title: "id", dataIndex: "id", key: "id" },
    { title: "currentUrl", dataIndex: "currentUrl", key: "currentUrl" },
    {
        title: "authUrl",
        dataIndex: "authUrl",
        key: "authUrl"
    }, {
        title: "loginRedirect",
        dataIndex: "loginRedirect",
        key: "loginRedirect"
    }, {
        title: "subscribeRedirect",
        dataIndex: "subscribeRedirect",
        key: "subscribeRedirect"
    }, {
        title: "loginAuthRedirect",
        dataIndex: "loginAuthRedirect",
        key: "loginAuthRedirect"
    }, {
        title: "loginPage",
        dataIndex: "loginPage",
        key: "loginPage"
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
                page: 0,
                size: 5,
                sort: null
            },
            queryParam: {
                page: 0,
                size: 5,
                sort: null,
                keyword: null,
                categoryId: null,
                status: null,

            },
            categorys: [],
            data: [],
            columns,
            visible: false,
            param: {
                name: ""
            },
            isUpdate: false,
        };
    },
    created() {
        this.loadData();
        // this.loadcategory()
    },
    methods: {
        loadData() {
            this.queryParam.page = this.pagination.page - 1;
            this.queryParam.size = this.pagination.size;
            this.queryParam.sort = this.pagination.sort;
            authRedirect.list(this.queryParam).then(response => {
                // console.log(this.queryParam);
                this.data = response.data.data.content;
                this.pagination.total = response.data.data.totalElements;
                // console.log(response);
            });
        }, addOrUpdateDrawer(isUpdate, dataId) {
            if (isUpdate) {
                authRedirect.findById(dataId).then(resp => {
                    this.param = resp.data.data
                    // console.log(resp)
                    this.isUpdate = true
                })
            }
            this.visible = true;
        }, addOrUpdate() {
            if (this.isUpdate) {

                authRedirect.update(this.param.id, this.param).then(resp => {

                    this.loadData();
                    this.$notification["success"]({
                        message: '更新' + resp.data.message
                    });

                })
            } else {
                authRedirect.add(this.param).then(resp => {
                    // console.log(resp)
                    this.loadData();
                    this.$notification["success"]({
                        message: '添加' + resp.data.message
                    });
                    this.visible = false
                })
            }

        },
        createSheetLanguage(id) {
            authRedirect.createSheetLanguage(id).then(resp => {
                // console.log(resp)
                this.$notification["success"]({
                    message: resp.message
                });
                this.loadData()
            })
        },

        handlePaginationChange(page, pageSize) {
            // console.log("111")
            // this.$log.debug(`Current: ${page}, PageSize: ${pageSize}`)
            this.pagination.page = page;
            this.pagination.size = pageSize;
            this.loadData();
        }, delById(id) {
            authRedirect.delById(id).then(response => {
                //  console.log(response);
                this.$notification["success"]({
                    message: '删除' + response.data.message
                });
                this.loadData();
            });
        },





    }
};
</script>
  
<style></style>