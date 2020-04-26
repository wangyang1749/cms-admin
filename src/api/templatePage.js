import service from '@/utils/service'
const baseUrl = '/api/templatePage'

const templatePageApi = {}

// templatePageApi.findByType = (type) => {
//     return service({
//         url: `${baseUrl}/find/${type}`,
//         method: 'get'
//     })
// }
templatePageApi.list =(params)=>{
    return service({
        url:baseUrl,
        params:params,
        method:'get'
    })
}
templatePageApi.generateHtml = (id) => {
    return service({
        url: `${baseUrl}/generate/${id}`,
        method: 'get'
    })
}


export default templatePageApi