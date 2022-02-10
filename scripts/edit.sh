#!/bin/bash
registry1='registry.baidubce.com'
registry2='192.168.16.153:5000'
image1='gitee-poc/gitee-scan-fe2:release-20210729113406'

docker login --username=112c6b0ac67e42fe97beb3f15a9be562 $registry1 --password=OSCccr2021
docker  pull registry.baidubce.com/$image1

docker login --username=112c6b0ac67e42fe97beb3f15a9be562 $registry2 --password=OSCccr2021
docker tag $registry1/$image1 $registry2/$image1
docker push $registry2/$image1

