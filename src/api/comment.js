import service from '@/utils/service'
const baseUrl = '/api/comment'

const CommentApi = {}

CommentApi.listArticle = articleId => {
    return service({
        url: `${baseUrl}/listArticle/${articleId}`,
        method: 'get'
    })
}

CommentApi.add = data_ => {
    return service({
        url: baseUrl,
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