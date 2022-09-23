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
        enabled: true,
        link: 'https://github.com/freekrai/remix-docs',
        text: 'Edit this page on GitHub',
    },
};