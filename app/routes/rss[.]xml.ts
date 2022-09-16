import type {LoaderFunction} from '@remix-run/node'
import * as dateFns from 'date-fns'
import {getDomainUrl} from '~/utils'
import { getPosts } from '~/utils/blog.server';
import { CacheControl } from "~/utils/cache-control.server";

const SITENAME=''
const SITEDESCRIPTION=''

export const loader: LoaderFunction = async ({request}) => {
  const blogUrl = `${getDomainUrl(request)}`

  const posts = await getPosts()

  const rss = `
    <rss xmlns:blogChannel="${blogUrl}" version="2.0">
      <channel>
        <title>${SITENAME}</title>
        <link>${blogUrl}</link>
        <description>${SITEDESCRIPTION}</description>
        <language>en-us</language>
        <generator>Remix</generator>
        <ttl>40</ttl>
        ${posts
          .map(post =>
            `
            <item>
              <title>${cdata(post.attributes.meta.title ?? 'Untitled Post')}</title>
              <description>${cdata(
                post.attributes.excerpt ?? 'This post is... indescribable',
              )}</description>
              <pubDate>${dateFns.format(
                dateFns.add(
                  post.attributes.date
                    ? dateFns.parseISO(post.attributes.date)
                    : Date.now(),
                  {minutes: new Date().getTimezoneOffset()},
                ),
                'yyyy-MM-ii',
              )}</pubDate>
              <link>${blogUrl}${post.url}</link>
              <guid>${blogUrl}${post.url}</guid>
            </item>
          `.trim(),
          )
          .join('\n')}
      </channel>
    </rss>
  `.trim()

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      "Cache-Control": new CacheControl("swr").toString(),
      'Content-Length': String(Buffer.byteLength(rss)),
    },
  })
}

function cdata(s: string) {
  return `<![CDATA[${s}]]>`
}