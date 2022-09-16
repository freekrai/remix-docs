/*

*/

export type BlogPost = {
	attributes: BlogPostAttributes
	body: string
	url: string
}

export type BlogPostAttributes = {
	meta: {
		[key: string]: string
	}
	headers: {
		[key: string]: string
	}
	date: string
	hero: string
	excerpt: string
}

export type FrontMatterBlogPost = {
	attributes: BlogPostAttributes
	body: string
}

export type NonNullProperties<Type> = {
  [Key in keyof Type]-?: Exclude<Type[Key], null | undefined>
}

export type SitemapEntry = {
    route: string
    lastmod?: string
    changefreq?:
      | 'always'
      | 'hourly'
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'never'
    priority?: 0.0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1.0
  }

export type Handle = {
    /** this just allows us to identify routes more directly rather than relying on pathnames */
    id?: string
    /** this is here to allow us to disable scroll restoration until Remix gives us better control */
    restoreScroll?: false
    getSitemapEntries?: (
      request: Request,
    ) =>
      | Promise<Array<SitemapEntry | null> | null>
      | Array<SitemapEntry | null>
      | null
  }
  