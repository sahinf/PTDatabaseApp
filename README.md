## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```


# Develop

This application uses Svelte and Typescript.

## Svelte
Svelte is a tool for building fast web applications, similar to React, Angular, or Vue. 

We highly recommend going through the [quick tutorial that Svelte maintainers have prepared](https://svelte.dev/tutorial/basics).

## Typescript
Typescript is a superset of Javascript. It is statically typed (strong typing enforcement like in C or C++) as opposed to the dynamically typed Javascript (what are types?). Typescript is also more object-oriented (supports interfaces for example), while Javascript is a more prototype based language.

Typescript is compiled into Javascript by the TSC compiler. Install `Node.js` on your system and then use npm to install the compiler

```bash
npm install -g typescript
```
Then you can compile a typescript file as such

```bash
tsc app.ts
```
and then run the compiled js file using `node` as such

```bash
node app.js
```

Although, this should ideally be handled by an npm `package.json` script as in this project.

**package.json**
```js
{
  "name": "typescript-project",
  "version": "1.0.0",
  "main": "app.js",
  "devDependencies": {
    "typescript": "^4.7.2"
  },
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node out/app.js",
    "prestart": "npm run build",
    "build": "tsc"
  }
}
```
**tsconfig.json**
```js
{
    "compilerOptions": {
        "outDir": "./out",
        "rootDir": "./src",
        "sourceMap": true,
        "moduleResolution": "node",
        "target": "es6"
    }
}
```

The above would be a standalone typescript project.
```
typescript-project
|-node_modules/
|-out/
    |-app.js
    |-app.js.map
|-src/
    |-app.ts
|-package.json
|-package-lock.json
|-tsconfig.json
```
If we were to use Svelte (as in this project), then
the `package.json` script would use `rollup` instead
of `node`.
