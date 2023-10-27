FROM golang:alpine AS build

WORKDIR /build

COPY go.mod /build/go.mod
COPY go.sum /build/go.sum

RUN go mod download

COPY . /build/

RUN go build -o /build/main .

FROM alpine AS shell

COPY --from=build /build/main /bin/tig

ENTRYPOINT ["/bin/ash"]
