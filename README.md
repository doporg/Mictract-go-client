# mictract

A front-end app for [Mictract](https://github.com/doporg/Mictract-go-server).

WIP

## Deployment

### Development Env

Note: Running in this mode will lose a part of `antd` styles, because some styles are not counted for dynamic compilation.

```shell
yarn install
yarn dev
```

### Production Env

SSR is the default option.

```shell
yarn install
yarn build
yarn start
```
