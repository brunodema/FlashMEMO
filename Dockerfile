# FlashMEMO-frontend
# If overloading the default 'environment' files is desired, then this must be done while publishing the image, since Angular doesn't consume the 'environment' files at runtime. PS: it's possible to make it so, but too much stuff would have to change - and the implementation for it seems a bit wonky too.

# Certificates for the website must be mounted in the '/usr/share/nginx/cert/' folder:
# - /usr/share/nginx/cert/flashmemo.edu.pem
# - /usr/share/nginx/cert/flashmemo.edu-key.pem

# Template taken from here: https://betterprogramming.pub/how-to-create-an-angular-dockerfile-75c059e7f8e8
FROM node:alpine AS angular-builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:stable
COPY --from=angular-builder /app/dist/FlashMEMO /usr/share/nginx/html
EXPOSE 80
EXPOSE 443
