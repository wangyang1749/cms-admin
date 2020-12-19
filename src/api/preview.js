import Golbal from '@/api/global_variable.js'

const preview = {}

preview.Online = (name,id) => {
    return  `http://${Golbal.baseUrl}:${Golbal.port}/preview/${name}/${id}`;
}


preview.Html = (viewName) => {
    return  `http://${Golbal.baseUrl}:${Golbal.port}/${viewName}.html`;
}

export default preview