# Builder
FROM quay.io/keycloak/keycloak:26.0 as builder
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_DB=postgres
WORKDIR /opt/keycloak
COPY ./docker/realm.json /opt/keycloak/data/import/
RUN /opt/keycloak/bin/kc.sh build

# Runner
FROM quay.io/keycloak/keycloak:26.0
COPY --from=builder /opt/keycloak/ /opt/keycloak/
# ENV KC_DB=postgres
# ENV KC_DB_URL=jdbc:postgresql://db:5432/${POSTGRES_DB}
# ENV KC_DB_SCHEMA=keycloak
# ENV KC_DB_USERNAME=${POSTGRES_USER}
# ENV KC_DB_PASSWORD=${POSTGRES_PASSWORD}
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]