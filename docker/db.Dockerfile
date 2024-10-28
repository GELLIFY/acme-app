FROM postgres:16.3-alpine

COPY ./docker/init.sql /docker-entrypoint-initdb.d/