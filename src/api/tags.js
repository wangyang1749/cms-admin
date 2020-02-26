import service from '@/utils/service'
const baseUrl = '/api/tags'

const tagsApi = {}

tagsApi.list = () => {
    return service({
        url: baseUrl,
        method: 'get'
    })
}

tagsApi.createWithName = name => {
    return service({
        url: baseUrl,
        data: {
            name: name
        },
        method: 'post'
    })
}

export default tagsApi