import service from '@/utils/service'
const baseUrl = '/api/authRedirect'

const authRedirect = {}



authRedirect.listAll=(questionId)=>{
    return service({
        url:`${baseUrl}/listAll/${questionId}`,
        method:"get"
    })
}


authRedirect.list=(param)=>{
    return service({
        url:baseUrl,
        params: param,
        method:"get"
    })
}
authRedirect.add = data => {
    return service({
        url: baseUrl,
        method: 'post',
        data: data
    })
}

authRedirect.delById = (id) => {
    return service({
        url: `${baseUrl}/delById/${id}`,
        method: 'get',
    })
}
authRedirect.findById = (id) => {
    return service({
        url: `${baseUrl}/findById/${id}`,
        method: 'get',
    })
}
authRedirect.update = (id,data) => {
    return service({
        url: `${baseUrl}/update/${id}`,
        method: 'post',
        data: data
    })
}


export default authRedirect