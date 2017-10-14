FROM nginx:alpine

COPY dist /usr/share/nginx/gb-grocery
COPY nginx.conf /etc/nginx/conf.d/default.conf
