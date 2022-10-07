import fm from "front-matter";
import type { BlogPostAttributes } from "../app/types";
import fs from 'fs/promises'
import { watch } from 'fs';

type BlogPost = {
	attributes: BlogPostAttributes
	body: string
	url: string
}

async function walk(path: string, callback: (path: string, stat: any) => Promise<void> | void): Promise<void> {
	const results = await fs.readdir(path)

	await Promise.all(results.map(async (fileOrDirectory) => {
		const filePath = `${path}/${fileOrDirectory}`
		const stat = await fs.stat(filePath)

		if (stat.isDirectory()) {
			return walk(filePath, callback)
		} else {
			return callback(filePath, stat)
		}
	}));
};

/*** 
 * build a cache file for each content-type
 * walkPath: the path to read
 * filename: what to save the cache file as
 * urlPath: used for slugs, such as /docs, /posts, etc
***/
async function cacheFile(walkPath, filename, urlPath) {
	let blogPosts: Array<BlogPost> = [];

	let addFile = async (file: string) => {
		let frontmatter = fm<BlogPostAttributes>(await fs.readFile(file, 'utf-8'));
	    let url = '';

		// is this an index.mdx file?
		if (file.endsWith('index.mdx')) {
			url = `${urlPath}/${file.substring(walkPath.length + 1, file.length - '/index.mdx'.length)}`;
		// is this any other mdx file?
		} else if (file.endsWith('.mdx')) {
            url = `${urlPath}/${file.substring(walkPath.length + 1, file.length - '.mdx'.length)}`;
		}

		blogPosts.push({
			attributes: frontmatter.attributes,
			body: frontmatter.attributes.excerpt.substring(0, 100) + '...',
			url: url.replace(/\/\//g,"/")
		});
	}

	await walk(walkPath, addFile);
	
	// sort by the date in frontmatter
	blogPosts = blogPosts.sort((a, z) => {
		const aTime = new Date(a.attributes.date ?? '').getTime()
		const zTime = new Date(z.attributes.date ?? '').getTime()
		return aTime > zTime ? -1 : aTime === zTime ? 0 : 1
	});

	await fs.writeFile(filename, JSON.stringify(blogPosts));
}

// for each content-type, we can generate a cache json file
async function getContent() {
	// posts
	await cacheFile('./content/posts', './content/blog-cache.json','/blog');
	// docs
	await cacheFile('./content/docs', './content/docs-cache.json', '/docs');
	// pages
	await cacheFile('./content/pages', './content/page-cache.json','');
}

getContent();

if (process.argv.at(-1) === 'watch') {
	watch('./content', (eventType, filename) => {
		if (filename.endsWith('.mdx')) {
			getContent();
		}
	});
}
