# peacock
A javascript 3D library with WebGL.

To run:

1. Run npm install or yarn to install all the required node modules from package.json.
```shell
npm install 
// or
yarn
```

2. Run webpack in dev-server mode, which includes hot-reloading
```shell
npm run start
// or
yarn start
```
The end result should be that a webBrowser window open with a dev-webserver open this example webpage.
```shell
dist/index.html
```
It will automatically reload when you change the source code that it is watching.

The bundle it produces will be here:
```shell
/dist/index.js  // compiled source code
/dist/index.js.map  // source-map
```
The bundle used for development will be large as it includes the webpack reloaded.

iIf you want to build an optimized  production version run:

```shell
npm run build
```
This will create only a small Javascript file:
```shell
/dist/index.js
```
