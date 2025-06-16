FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/log/nginx && \
    mkdir -p /etc/nginx/ssl && \
    chown -R nginx:nginx /var/log/nginx

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]