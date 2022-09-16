# Remix Docs Stack

Learn more about [Remix Stacks](https://remix.run/stacks).

```bash
npx create-remix --template freekrai/remix-docs
```

## Remix Docs 📖

Remix Docs is a documentation site starter.

- `content`: where mdx is stored
- `content/docs`: docs, stored as: `SLUG/index.mdx`
- `content/posts`: blog posts, stored as: `SLUG/index.mdx`
- `content/pages`: pages, stored as `SLUG/index.mdx`

The structure is based on Gatsby and gives us more flexibility, each page and post is a folder and contains an `index.mdx` file, this folder name becomes the slug.

This also gives you a lot of flexibility, for example, you can have multiple files inside one folder

- `content/posts/hello-world/index.mdx` returns as `/hello-world`
- `content/posts/hello-world/abc.mdx` returns as `/hello-world/abc`
- `content/posts/hello-world/more-hello/index.mdx` returns as  `hello-world/more-hello`
- `content/posts/hello/still-hello/index.mdx` returns as `hello/still-hello`
- `content/posts/2022/test/index.mdx` returns as `/2022/test`

This lets you structure content however you want.

On build, we generate a cached json file in content (`blog-cache.json`) for all blog posts, which we then reference later for the blog index, rss, sitemap, etc.

We also generate a separate cache json file in content (`docs-cache.json`) for all docs, this can then be used for sitemap, etc as well.

Finally, we generate a separate cache json file in content (`page-cache.json`) for all pages, this can then be used for sitemap, etc as well.

Mdx files contain frontmatter which we use on the site, this frontmatter looks like:

```jsx
---
meta:
  title: Another Post
  description: A description
date: '2021-10-02T00:00:00'
updated: '2021-10-02T00:00:00'
excerpt: Hello Gaseous cloud...
headers:
  Cache-Control: no-cache
---
```

## Config

There are two parts to config, first is our env variables:

### Env Variables

By default, remix-docs will try to use the file system to read files, this works great but if you are on a hosting service like cloudflare where you can't access the file system then we need to use Github, you can configure how it accesses files in your .env file:

- `SESSION_SECRET`: Session Secret used for sessions such as dark mode
- `USE_FILESYSTEM_OR_GITHUB`: this is either `fs` or `gh`
- `GITHUB_TOKEN`:  your Personal access token
- `GITHUB_OWNER`: your Github name
- `GITHUB_REPO`: your Github repo

The Github variables are only needed if `USE_FILESYSTEM_OR_GITHUB` is set to `gh`, it's `fs` by default.

### Docs Config

The second part of our config is inside the `app/docs.config.ts` file:

```js
export default {
    base: '/',
	lang: 'en-US',
    title: 'Remix Docs',
    description: 'Just playing around.',
    nav: [
        { text: 'Docs', link: '/docs' },
        { text: 'Blog', link: '/blog' },
    ],
    head: [

    ],
    sidebar: [
        {
            title: 'Introduction',
            links: [
                { title: 'Getting started', href: '/docs/getting-started' },
                { title: 'Installation', href: '/docs/installation' },
            ],
        },
        {
            title: 'Core Concepts',
            links: [
                { title: 'Roadmap', href: '/docs/roadmap' },
                { title: 'Changelog', href: '/docs/changelog' },
            ],
        },
    ],
    search: {
        enabled: true,
    },
    editLink: {
        link: 'https://github.com/freekrai/remix-docs',
        text: 'Edit this page on GitHub',
    },
};
```

This lets you customize the top nav, sidebar links, enable search, etc.

## Available scripts

- `build` - compile and build the Remix app, Tailwind and cache blog posts into a json file in `production` mode
- `dev` - starts Remix watcher, blog cache watcher and Tawilwind CLI in watch mode

## Development

To run your Remix app locally, first, copy `.env.example` to `.env` and configure as needed following the `Config` step above.

Next, make sure your project's local dependencies are installed:

```bash
npm install
```

Afterwards, start the Remix development server like so:

```bash
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

---

## Deployment

Initially, this stack is set up for deploying to Vercel, but it can be deployed to other hosts quickly and we'll update the wiki with instructions for each.

### Vercel

Open `server.js` and save it as:

```jsx
import { createRequestHandler } from "@remix-run/vercel";
import * as build from "@remix-run/dev/server-build";
export default createRequestHandler({ build, mode: process.env.NODE_ENV });
```

Then update your `remix.config.js` file as follows:

```jsx
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "vercel",
  server: process.env.NODE_ENV === "development" ? undefined : "./server.js",
  ignoredRouteFiles: ["**/.*"],
};
```

This will instruct your Remix app to use the Vercel runtime, after doing this, you only need to [import your Git repository](https://vercel.com/new) into Vercel, and it will be deployed.

If you'd like to avoid using a Git repository, you can also deploy the directory by running [Vercel CLI](https://vercel.com/cli):

```bash
npm i -g vercel
vercel
```

It is generally recommended to use a Git repository, because future commits will then automatically be deployed by Vercel, through its [Git Integration](https://vercel.com/docs/concepts/git).

### Cloudflare Pages

Coming Soon

### Netlify

Coming Soon