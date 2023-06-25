

import service from '@/utils/service'
const baseUrl = '/api/msgReplyRule'

const msgReplyRule = {}

// 自动回复规则
msgReplyRule.msgReplyRuleCreat = (data) => {
    return service({
        url: baseUrl,
        method: 'post',
        data: data
    })
}

msgReplyRule.msgReplyRuleList = (param) => {
    return service({
        url:baseUrl,
        params: param,
        method:"get"
    })
}

msgReplyRule.delById = (id) => {
    return service({
        url: `${baseUrl}/delById/${id}`,
        method: 'get'
    })
}

msgReplyRule.update = (id,params) => {
    return service({
        url: `${baseUrl}/update/${id}`,
        data: params,
        method: 'post'
    })
}
// /api/msgReplyRule/update/{id}

export default msgReplyRule