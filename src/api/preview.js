

const preview = {}

preview.Online = (name,id) => {
    return  `http://localhost:8080/preview/${name}/${id}`;
}


preview.Html = (viewName) => {
    return  `http://localhost/${viewName}.html`;
}

export default preview