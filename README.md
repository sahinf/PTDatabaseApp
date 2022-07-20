# How To Use

The latest production build can be accessed [here](https://sahinf.github.io/PTDatabaseApp/).

The app is hosted on the [gh-pages](https://github.com/sahinf/PTDatabaseApp/tree/gh-pages) branch. It utilizes Github Actions through our workflow defined by this [`YAML`](./.github/workflows/deploy.yml) file. 

If, for some reason, the live build is down (404 Error perhaps), we can always clone this repository and run it manually

# Development 

This app requires the Node Package Manager (`npm`). 


```bash
git clone https://github.com/sahinf/PTDatabaseApp.git &&
cd PTDatabaseApp &&
npm i
```

Then start [Rollup](https://rollupjs.org)

```bash
npm run dev
```

**note** that `npm run <arg>` is defined in [`package.json`](./package.json)

Navigate to [localhost:1776](http://localhost:1776) to interact with the app through the browser. The port is *always* subject to change, so read the output in your terminal to see the port chosen by `sirv`. 


By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

This application uses Svelte and Typescript.

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

## Tailwind

This project began by mainly utilizing the Svelte UI library named [Svelte Material UI](https://sveltematerialui.com/). As this is the first time I am working with professional-level web development tools (other than a not-so-elegant React project), I began looking into web development philosophy and methodologies. I came across a popular tool named Tailwind that is used by global companies like Github, Netflix, Heroku, Kickstarter, Twitch, and Segment. 

Tailwind's utility-first fundamentals favor inline CSS in HTML files over maintaining separate CSS classes for each component. It focuses on building complex components from a constrained set of primitive utilities (the utilities offered by Tailwind through `<div class="">`). Building designs through Tailwind's utilities 
- Saves energy investing class names for everything
- Reduces the overall CSS complexity of a project
- Makes changes feel safer (changing a CSS class might unintentionall affect another component that uses this class)

Although it may feel like basically inline css but with shorter text, Tailwind's utility classes provide advantages over inline styles such as
- Designing with constraints: The predefined design system makes it easier to build visually consistent UI
- Responsive design: `@media` breakpoints can easily be factored in through the `sm`, `md`, `lg`, `xl`, and `2xl` prefixes
- Hover, focus, and other states: Inline styles cannot target states like hover or focus, while Tailwind's state variants make it easy through prefixes.