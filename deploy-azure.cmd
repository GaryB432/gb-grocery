REM docker run -it azuresdk/azure-cli-python:latest bash
call npm run build
docker build -t gb-grocery:latest .
docker tag gb-grocery:latest garyb432/gb-grocery:latest
docker push garyb432/gb-grocery:latest
az webapp restart -n gb-grocery -g gbg-rg
