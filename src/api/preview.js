

const preview = {}

preview.Online = (name,id) => {
    return  `http://47.93.201.74:8080/${name}/preview/${id}`;
}


preview.Html = (viewName) => {
    return  `http://47.93.201.74/${viewName}.html`;
}

export default preview