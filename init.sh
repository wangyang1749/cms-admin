CMS_PATH=~/cms/html/admin
# export NODE_OPTIONS=--openssl-legacy-provider

# echo $CMS_PATH
npm run build

if [ ! -d $CMS_PATH ];then
    mkdir -p $CMS_PATH
    echo "创建：$CMS_PATH"
else
    echo "删除：$CMS_PATH"
    rm -rf ${CMS_PATH}/*
fi

if [ "$(ls -A dist)" ];then
    mv dist/* $CMS_PATH
    echo "移动到：$CMS_PATH"
else
    echo "dist为空"
fi

