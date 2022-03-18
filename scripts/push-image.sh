#bin/bash
time=$(date "+%Y%m%d%H%M%S")

rm -rf ./dist/

yarn build:pro

node ./scripts/modifyJson.js

docker build -t registry.baidubce.com/gitee-poc/gitee-noah-frontend:release-$time .

docker push registry.baidubce.com/gitee-poc/gitee-noah-frontend:release-$time

#kubectl --kubeconfig=/Users/milo/Documents/20020.conf set image deployment/gitee-scan-front-new  gitee-scan-front-new=registry.baidubce.com/gitee-poc/gitee-noah-frontend:release-$time -n test

# kubectl --kubeconfig=/Users/milo/Documents/webideUI/20020.conf set image deployment/gitee-scan-front-new  gitee-scan-front-new=registry.baidubce.com/gitee-poc/gitee-noah-frontend:release-$time -n ningbo-bank

# kubectl --kubeconfig=/Users/milo/Documents/webideUI/20020.conf set image deployment/gitee-scan-front-new  gitee-scan-front-new=registry.baidubce.com/gitee-poc/gitee-noah-frontend:release-$time -n scan-dev

# kubectl --kubeconfig=/Users/milo/Documents/webideUI/20020.conf set image deployment/gitee-scan-front-new  gitee-scan-front-new=registry.baidubce.com/gitee-poc/gitee-noah-frontend:release-$time -n dev

#kubectl --kubeconfig=/Users/milo/Documents/20020.conf set image deployment/gitee-scan-front-new  gitee-scan-front-new=registry.baidubce.com/gitee-poc/gitee-noah-frontend:release-$time -n scan-test
