import service from '@/utils/service'
const baseUrl = '/api/templatePage'

const templatePageApi = {}

// templatePageApi.findByType = (type) => {
//     return service({
//         url: `${baseUrl}/find/${type}`,
//         method: 'get'
//     })
// }
templatePageApi.list =(param)=>{
    return service({
        url:baseUrl,
        param:param,
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