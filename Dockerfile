FROM nginx:alpine

RUN echo "daemon off;" >> /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY dist/gb-grocery/ /app

CMD ["nginx"]