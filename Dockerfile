FROM registry.baidubce.com/gitee-public/nginx-skywalking-base:v1.0.1
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
ENV SKYWALKING_SERVER_URL "http://skywalking-oap.skywalking.svc.cluster.local:12800"
ENV DNS_SERVER kube-dns.kube-system.svc.cluster.local

COPY ./dist/assets/static /usr/share/nginx/html





