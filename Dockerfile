FROM httpd:2.4
 
ADD ./assets /usr/local/apache2/htdocs/assets/
COPY ./cookies.html /usr/local/apache2/htdocs/
COPY ./index.html /usr/local/apache2/htdocs/
 
ENV PATH /usr/local/apache2/bin:$PATH

VOLUME /usr/local/apache2/htdocs

EXPOSE 80 443

WORKDIR /app
 
COPY ./script.sh /app/script.sh

RUN chmod 755 /app/script.sh
RUN chmod +x /app/script.sh

COPY ./entrypoint.sh /app/entrypoint.sh

RUN chmod 755 /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
