import Golbal from '@/api/global_variable.js'

const preview = {}

preview.Online = (name,id) => {
    return  `${Golbal.protocol}://${Golbal.baseUrl}:${Golbal.port}/preview/${name}/${id}`;
}
preview.categoryTemplatePreview = (id,templateId) => {
    return  `${Golbal.protocol}://${Golbal.baseUrl}:${Golbal.port}/preview/categoryTemplate/${id}?templateId=${templateId}`;
}

preview.Html = (viewName) => {
    return  `${Golbal.protocol}://${Golbal.baseUrl}:${Golbal.port}/${viewName}.html`;
}

preview.Url = (viewName) => {
    return  `${Golbal.protocol}://${Golbal.baseUrl}:${Golbal.port}/${viewName}`;
}


export default preview