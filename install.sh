npm run build
printf "建立完毕～～ \n"
rm -rf /home/wangyang/workspace/cms-dev/src/main/resources/static/admin/*
printf "删除原来文件～～ \n"
mv dist/*  /home/wangyang/workspace/cms-dev/src/main/resources/static/admin/

printf "移动完成～～ \n"