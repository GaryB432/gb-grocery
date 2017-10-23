call npm run build
docker build -t gb-grocery:latest .
docker tag gb-grocery:latest garyb.azurecr.io/garyb432/gb-grocery:latest
docker push garyb.azurecr.io/garyb432/gb-grocery:latest
az webapp restart -n gb-grocery -g gbg-rg
