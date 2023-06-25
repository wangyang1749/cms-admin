<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForms" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForms.matchValue" placeholder="匹配关键词" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
                <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border type="expand" v-loading="dataListLoading"
            @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="作用范围">
                            <span>{{ props.row.appid ? '当前公众号' : '全部公众号' }}</span>
                        </el-form-item>
                        <el-form-item label="精确匹配">
                            <span>{{ props.row.exactMatch ? '是' : '否' }}</span>
                        </el-form-item>
                        <el-form-item label="是否有效">
                            <span>{{ props.row.status ? '是' : '否' }}</span>
                        </el-form-item>
                        <el-form-item label="备注说明">
                            <span>{{ props.row.desc }}</span>
                        </el-form-item>
                        <el-form-item label="生效时间">
                            <span>{{ props.row.effectTimeStart }}</span>
                        </el-form-item>
                        <el-form-item label="失效时间">
                            <span>{{ props.row.effectTimeEnd }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="ruleName" header-align="center" align="center" show-overflow-tooltip label="规则名称">
            </el-table-column>
            <el-table-column prop="matchValue" header-align="center" align="center" show-overflow-tooltip label="匹配关键词">
            </el-table-column>
            <el-table-column prop="replyType" header-align="center" align="center" :formatter="replyTypeFormat"
                label="消息类型">
            </el-table-column>
            <el-table-column prop="replyContent" header-align="center" align="center" show-overflow-tooltip label="回复内容">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="el_pagination">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalCount"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </div>

        <!-- 新增 / 修改 -->
        <el-dialog :title="!editId ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="addOrUpdateVisible">
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
                <el-form-item label="规则名称" prop="ruleName">
                    <el-input v-model="dataForm.ruleName" placeholder="规则名称"></el-input>
                </el-form-item>
                <el-form-item label="匹配词" prop="matchValue">
                    <tags-editor v-model="dataForm.matchValue"></tags-editor>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <!-- <el-form-item label="作用范围" prop="appid">
                        <el-select v-model="dataForm.appid" placeholder="作用范围">
                            <el-option label="全部公众号" value=""></el-option>
                            <el-option label="当前公众号" :value="selectedAppid"></el-option>
                            <el-option label="当前公众号" value=""></el-option>
                        </el-select>
                    </el-form-item> -->
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="精确匹配" prop="exactMatch">
                            <el-switch v-model="dataForm.exactMatch" :active-value="true"
                                :inactive-value="false"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="回复类型" prop="replyType">
                            <el-select v-model="dataForm.replyType" @change="onReplyTypeChange">
                                <el-option v-for="(name, key) in KefuMsgType" :key="key" :value="key"
                                    :label="name"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="是否启用" prop="status">
                            <el-switch v-model="dataForm.status" :active-value="true" :inactive-value="false"></el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-row>
                <el-col :span="12">
                    <el-form-item label="生效时间" prop="effectTimeStart">
                        <el-time-picker v-model="dataForm.effectTimeStart" value-format="HH:mm:ss"></el-time-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="失效时间" prop="effectTimeEnd">
                        <el-time-picker v-model="dataForm.effectTimeEnd" value-format="HH:mm:ss"></el-time-picker>
                    </el-form-item>
                </el-col>
            </el-row> -->
                <el-form-item label="回复内容" prop="replyContent">
                    <el-input v-model="dataForm.replyContent" type="textarea" :rows="5"
                        placeholder="文本、图文ID、media_id、json配置"></el-input>
                    <el-button type="text" v-show="'text' == dataForm.replyType" @click="addLink">插入链接</el-button>
                </el-form-item>
                <el-form-item label="备注说明" prop="desc">
                    <el-input v-model="dataForm.desc" placeholder="备注说明"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addOrUpdateVisible = false">取消</el-button>
                <el-button type="primary" v-if="editId == ''" @click="dataFormSubmit()">确定</el-button>
                <el-button type="primary" v-else @click="dataFormSubmitEdit()">确定</el-button>

            </span>
        </el-dialog>
    </div>
</template>

<script>
import msgReplyRule from '@/api/wxmsgReplyRule.js'
export default {
    components: {
        tagsEditor: () => import('./tags-editor'),
    },
    data() {
        return {
            dataForms: {
                matchValue: ''
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            KefuMsgType: {
                "text": "文本消息",
                "image": "图片消息",
                "voice": "语音消息",
                "video": "视频消息",
                "music": "音乐消息",
                "news": "文章链接",
                "mpnews": "公众号图文消息",
                "wxcard": "卡券消息",
                "miniprogrampage": "小程序消息",
                "msgmenu": "菜单消息"
            },
            assetsSelectorVisible: false,
            dataForm: {
                ruleId: 0,
                // appid: '',
                ruleName: "",
                exactMatch: false,
                matchValue: "",
                replyType: 'text',
                replyContent: "",
                status: true,
                desc: "",
                // effectTimeStart: "00:00:00",
                // effectTimeEnd: "23:59:59"
            },
            dataRule: {
                ruleName: [
                    { required: true, message: "规则名称不能为空", trigger: "blur" }
                ],
                matchValue: [
                    { required: true, message: "匹配的关键词、事件等不能为空", trigger: "blur" }
                ],
                replyType: [
                    { required: true, message: "回复类型（1:文本2:图文3媒体）不能为空", trigger: "blur" }
                ],
                replyContent: [
                    { required: true, message: "回复内容不能为空", trigger: "blur" }
                ],
                status: [
                    { required: true, message: "是否有效不能为空", trigger: "blur" }
                ],
                effectTimeStart: [
                    { required: true, message: "生效起始时间不能为空", trigger: "blur" }
                ],
                effectTimeEnd: [
                    { required: true, message: "生效结束时间不能为空", trigger: "blur" }
                ]
            },
            inputVisible: false,
            inputValue: '',
            dynamicTags: [],
            editId: ""
        }
    },
    created() {
        this.getDataList();
    },
    methods: {
        // 获取数据列表
        getDataList() {
            this.dataListLoading = true;
            msgReplyRule.msgReplyRuleList({
                page: this.pageIndex - 1,
                size: this.pageSize
            }).then(res => {
                if (res.data.status == 200) {
                    this.dataList = res.data.data.content;
                    this.totalPage = res.data.data.totalElements;
                } else {
                    this.dataList = [];
                    this.totalPage = 0;
                }
                this.dataListLoading = false;
            });
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val;
            this.pageIndex = 1;
            this.getDataList();
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val;
            this.getDataList();
        },
        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val;
        },
        // 新增 / 修改
        addOrUpdateHandle(row) {
            //新增
            if (row == undefined) {
                this.editId = "";
            } else {
                // 修改
                this.editId = row.id;

                this.dataForm = {
                    ruleId: 0,
                    ruleName: row.ruleName,
                    exactMatch: row.exactMatch,
                    matchValue: row.matchValue,
                    replyType: this.KefuMsgType[row.replyType],
                    replyContent: row.replyContent,
                    status: row.status,
                    desc: row.desc,
                };
            }
            this.addOrUpdateVisible = true;
           
        },
        // 删除
        deleteHandle(id) {
            var ids = id ? [id] : this.dataListSelections.map(item => item.ruleId)
            this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                msgReplyRule.delById(ids).then(res => {
                    if (res.data.status == 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => this.getDataList()
                        })
                    } else {
                        this.$message.error(res.data.message);
                    }
                });
            })
        },
        // 新增 表单提交
        dataFormSubmit() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    msgReplyRule.msgReplyRuleCreat(this.dataForm).then((res) => {
                        if (res.data.status == 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1000,
                                onClose: () => {
                                    this.addOrUpdateVisible = false;
                                    this.getDataList();
                                }
                            })
                        } else {
                            this.$message.success(res.data.message);
                        }
                    })
                }
            });
        },
        // 修改确定提交
        dataFormSubmitEdit() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    msgReplyRule.update(this.editId,this.dataForm).then((res) => {
                        if (res.data.status == 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1000,
                                onClose: () => {
                                    this.addOrUpdateVisible = false;
                                    this.getDataList();
                                }
                            })
                        } else {
                            this.$message.success(res.data.message);
                        }
                    })
                }
            });
        },
        addLink() {
            this.dataForm.replyContent += '<a href="链接地址">链接文字</a>'
        },
        onReplyTypeChange(value) {
            if ("miniprogrampage" == value) {
                let demo = { title: "标题", appid: "小程序APPID", pagepath: "页面地址", thumb_media_id: "缩略图media_id" };
                this.dataForm.replyContent = JSON.stringify(demo, null, 4)
            } else if ("music" == value) {
                let demo = { musicurl: "音乐链接", hqmusicurl: "高品质链接", title: "标题", description: "描述", thumb_media_id: "缩略图media_id" }
                this.dataForm.replyContent = JSON.stringify(demo, null, 4)
            } else if ("msgmenu" == value) {
                let demo = { head_content: "开头文字", list: [{ id: "菜单1ID", content: "菜单2内容" }, { id: "菜单2ID", content: "菜单2内容" }, { id: "菜单nID", content: "菜单n内容" }], tail_content: "结尾文字" }
                this.dataForm.replyContent = JSON.stringify(demo, null, 4)
            } else if ("news" == value) {
                let demo = { title: "文章标题", description: "文章简介", url: "链接URL", picUrl: "缩略图URL" }
                this.dataForm.replyContent = JSON.stringify(demo, null, 4)
            } else {
                this.dataForm.replyContent = '媒体素材media_id'
            }
        },
        replyTypeFormat(row, column, cellValue) {
            return this.KefuMsgType[cellValue];
        }
    }
}
</script>
<style scoped>
.el_pagination {
    margin-top: 15px;
    text-align: right;
}
</style>