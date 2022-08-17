# How To Use

The latest production build can be accessed [here](https://sahinf.github.io/PTDatabaseApp/).

Please use the [example template file](./pt-db-example.json) to play around with the app. Download that file and upload it with "Data Base Upload" button. 

The app is hosted on the [gh-pages](https://github.com/sahinf/PTDatabaseApp/tree/gh-pages) branch. It utilizes Github Actions through our workflow defined by this [`YAML`](./.github/workflows/deploy.yml) file. All pushes to `origin/master` should trigger deployment, basically. If, for some reason, the live build is down (404 Error perhaps), we can always clone this repository and run it manually with the steps below

# Development 

This app requires the Node Package Manager (`npm`). 


```bash
git clone https://github.com/sahinf/PTDatabaseApp.git &&
cd PTDatabaseApp &&
npm i
```

To run the development build after letting `npm` install the required packages:
```bash
npm run dev
```
Now Vite's live server should be running and automatically recompiling with each change to the source code.


The original version of this app (forked from Scott Wilkins) used [Rollup](https://rollupjs.org/guide/en/). It has now been switched to use [Vite](https://vitejs.dev/), which allows an effortless project setup for various frameworks. A project that uses `Svelte`, `tailwind`, `postcss`, can easily be instantiated with



```shell
npm create vite@latest
```


**note** that `npm run <arg>` is defined in [`package.json`](./package.json)

Navigate to whichever `localhost:PORT/PTDatabaseApp` URL Vite chose for the server. The link should be written to `STDOUT` so keep an eye on your shell after running the command above.


This application uses Svelte, Typescript, Tailwind, and daisyUI.

## Svelte
Svelte is a tool for building fast web applications, similar to React, Angular, or Vue. 

I highly recommend going through the [quick tutorial that Svelte maintainers have prepared](https://svelte.dev/tutorial/basics). 

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
Once you become familiar with Typescript, you will never go back to plain Javascript. 
## Tailwind CSS

Tailwind's utility-first fundamentals favor inline CSS in HTML files over maintaining separate CSS classes for each component. It focuses on building complex components from a constrained set of primitive utilities (the utilities offered by Tailwind through `<div class="">`). Building designs through Tailwind's utilities 
- Saves energy investing class names for everything
- Reduces the overall CSS complexity of a project
- Makes changes feel safer (changing a CSS class might unintentionall affect another component that uses this class)

Although it may feel like basically inline css but with shorter text, Tailwind's utility classes provide advantages over inline styles such as
- Designing with constraints: The predefined design system makes it easier to build visually consistent UI
- Responsive design: `@media` breakpoints can easily be factored in through the `sm`, `md`, `lg`, `xl`, and `2xl` prefixes
- Hover, focus, and other states: Inline styles cannot target states like hover or focus, while Tailwind's state variants make it easy through prefixes.

In this project, Tailwind directives are located in [app.css](./src/app.css)

## daisyUI

[daisyUI](https://daisyui.com/components/) is a Tailwind CSS component library. There are a million of component libraries to choose from when using `Svelte` and `Tailwind`. I chose this because I liked their components. 