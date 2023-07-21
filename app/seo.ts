import config from '~/docs.config';

export const getSeo = ({title, url, description, ogimage}: {title: string, url?: string, description?: string, ogimage?: string}) => {

  let seoDescription = description || config.description
  let seoKeywords = config.title;
  
	return [
		{ title: `${title} | ${config.title}`  },
		{ name: "description", content: seoDescription },
    { name: "keywords", content: seoKeywords },
		{ property: "og:title", content: `${title} | ${config.title}`  },
		{ property: "og:description", content: seoDescription },
		{ property: "twitter::title", content: `${title} | ${config.title}`  },
		{ property: "twitter::description", content: seoDescription },
    { name: "robots", content: "index,follow" },
    { name: "googlebot", content: "index,follow" },
	];
}

