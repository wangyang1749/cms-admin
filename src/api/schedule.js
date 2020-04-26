import service from '@/utils/service'
const baseUrl = '/api/schedule'

const scheduleApi = {}


scheduleApi.list = () => {
    return service({
        url: baseUrl,
        method: 'get'
    })
}

scheduleApi.find = (id) => {
    return service({
        url: `${baseUrl}/find/${id}`,
        method: 'get'
    })
}


scheduleApi.add = (params) => {
    return service({
        url: `${baseUrl}/addJob`,
        data: params,
        method: 'post'
    })
}

scheduleApi.updateJobCron = (id,params) => {
    return service({
        url: `${baseUrl}/updateJobCron/${id}`,
        data: params,
        method: 'post'
    })
}


scheduleApi.startJob = (id) => {
    return service({
        url: `${baseUrl}/startJob/${id}`,
        method: 'get'
    })
}

scheduleApi.removeJob = (id) => {
    return service({
        url: `${baseUrl}/removeJob/${id}`,
        method: 'get'
    })
}
scheduleApi.runOnceJobNow = (id) => {
    return service({
        url: `${baseUrl}/runOnceJobNow/${id}`,
        method: 'get'
    })
}

export default scheduleApi