FROM quay.io/keycloak/keycloak:26.0

COPY ./docker/realm.json /opt/keycloak/data/import/

EXPOSE 8080
EXPOSE 9000