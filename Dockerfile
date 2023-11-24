FROM httpd:2.4
 
ADD ./assets /usr/local/apache2/htdocs/assets/
COPY ./cookies.html /usr/local/apache2/htdocs/
COPY ./index.html /usr/local/apache2/htdocs/
 
COPY ./script.sh /script.sh

RUN chmod 755 /script.sh
RUN chmod +x /script.sh

COPY ./entrypoint.sh /entrypoint.sh

RUN chmod 755 /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV PATH /usr/local/apache2/bin:$PATH

VOLUME /usr/local/apache2/htdocs

EXPOSE 80 443
 
ENTRYPOINT ["/entrypoint.sh"]
