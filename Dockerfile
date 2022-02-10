# FROM registry.baidubce.com/gitee-poc/nginx-upstream-dynamic:1.16.1

# COPY ./scan /app

# # ENV DNS_SERVER   kube-dns.kube-system.svc.cluster.local
# ENV ISCAN_SERVER localhost:8001
# ENV API_GATEWAY  localhost:8080

# COPY ./nginx/default.conf /etc/nginx/conf.d/default.template

# WORKDIR /app

# CMD nginx -g 'daemon off;'

# CMD envsubst '${ISCAN_SERVER} ${API_GATEWAY}' < /etc/nginx/conf.d/default.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'



FROM registry.baidubce.com/gitee-public/nginx-skywalking-base:v1.0.1
COPY ./dist /app
WORKDIR /dist

