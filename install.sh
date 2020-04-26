npm run build
printf "建立完毕～～ \n"
rm -rf /home/wy/Documents/cms/cms-web/src/main/resources/static/admin/*
printf "删除原来文件～～ \n"
mv dist/*  /home/wy/Documents/cms/cms-web/src/main/resources/static/admin/

printf "移动完成～～ \n"