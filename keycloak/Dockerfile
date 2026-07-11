FROM quay.io/keycloak/keycloak:24.0
COPY realm-export.json /opt/keycloak/data/import/realm-export.json
ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin
ENV KC_DB=dev-file
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--import-realm"]
