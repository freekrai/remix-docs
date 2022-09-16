import type {LoaderFunction} from '@remix-run/node'
import * as dateFns from 'date-fns'
import {getDomainUrl} from '~/utils'
import { getPosts, getPages, getDocs } from '~/utils/blog.server';
import { createSitemap } from '~/utils/sitemap.server';
import { CacheControl } from "~/utils/cache-control.server";

export const loader = async ({request}) => {
    const blogUrl = `${getDomainUrl(request)}`
    let [pageUrls, pages, posts, docs] = await Promise.all([
        [
            '/',
            '/blog',
            '/docs',
        ].map((url) => ({ url: `${blogUrl}${url}` })),
        getPages(),
        getPosts(),
        getDocs(),
    ]);    

    const postUrls = [...pages, ...posts, ...docs].map( post => {
        return {url: `${blogUrl}${post.url}`}
    }) || []

    const urls = [...pageUrls, ...postUrls];
    const sitemap = createSitemap(urls);
    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
            "Cache-Control": new CacheControl("swr").toString() 
        },
    });
};