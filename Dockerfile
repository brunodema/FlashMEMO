# Stage 0, for downloading project's npm dependencies, building and compiling the app.
# Angular 6 requires node:8.9+

FROM node:16-alpine3.11 as node-builder
WORKDIR /app
COPY ./package.json /app/
RUN npm install --force
COPY ./ /app/
RUN npm run build --prod

# Stage 1, for copying the compiled app from the previous step and making it ready for production with Nginx

FROM nginx:alpine as nginx-runner
COPY --from=node-builder /app/dist/FlashMEMO /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf

# Stage 2, for generating a private/public key-pair. Do not use self-signed certificates in production!
RUN apk update
RUN apk upgrade
RUN apk add bash
RUN apk add openssl
RUN /bin/bash -c "openssl req -x509 -out etc/ssl/localhost.crt -keyout etc/ssl/localhost.key \
    -newkey rsa:2048 -nodes -sha256 \
    -subj '/CN=localhost' -extensions EXT -config <( \
    printf '[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth')"