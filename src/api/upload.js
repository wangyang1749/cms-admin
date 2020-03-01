import service from '@/utils/service'
const baseUrl = '/api/attachment'

const uploadApi = {}
uploadApi.upload = (formData) => {
    return service({  // 设置axios的参数
        url: `${baseUrl}/upload`,
        data: formData,
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export default uploadApi



