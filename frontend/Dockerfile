FROM node:lts-alpine AS build

WORKDIR /build

COPY package.json /build/package.json
COPY pnpm-lock.yaml /build/pnpm-lock.yaml

RUN npm i -g pnpm

RUN pnpm i

COPY . /build/

RUN pnpm build

FROM busybox AS runtime

RUN adduser -D buhtig
USER buhtig

WORKDIR /app

COPY --from=build /build/dist /app

EXPOSE 3000

RUN echo "E404:index.html" > httpd.conf

ENTRYPOINT ["busybox", "httpd"]

CMD ["-c", "httpd.conf", "-f", "-v", "-p", "3000"]
