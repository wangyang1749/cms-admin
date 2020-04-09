import service from '@/utils/service'
const baseUrl = '/api/comment'

const CommentApi = {}

CommentApi.listByArticleId = articleId => {
    return service({
        url: `${baseUrl}/listByArticleId/${articleId}`,
        params:{size:100},
        method: 'get'
    })
}

CommentApi.add = data_ => {
    return service({
        url: `${baseUrl}`,
        method: 'post',
        data:data_
    })
}

CommentApi.deleteById = commentId => {
    return service({
        url: `${baseUrl}/deleteById/${commentId}`,
        method: 'delete'
    })
}
export default CommentApi