import fm from "front-matter";
import { BlogPostAttributes } from "../app/types";
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

async function getPosts() {
	let walkPath = './content/posts';

	let blogPosts: Array<BlogPost> = [];

	let addFile = async (file: string) => {
		if (file.endsWith('index.mdx')) {
			let frontmatter = fm<BlogPostAttributes>(await fs.readFile(file, 'utf-8'));
			blogPosts.push({
				attributes: frontmatter.attributes,
				body: frontmatter.attributes.excerpt.substring(0, 100) + '...',
				url: `/blog/${file.substring(walkPath.length + 1, file.length - '/index.mdx'.length)}`
			});
		} else if (file.endsWith('.mdx')) {
			let frontmatter = fm<BlogPostAttributes>(await fs.readFile(file, 'utf-8'));
			blogPosts.push({
				attributes: frontmatter.attributes,
				body: frontmatter.attributes.excerpt.substring(0, 100) + '...',
				url: `/blog/${file.substring(walkPath.length + 1, file.length - '.mdx'.length)}`
			});
		}
	}

	await walk(walkPath, addFile);
	
	// sort by the date in frontmatter
	blogPosts = blogPosts.sort((a, z) => {
		const aTime = new Date(a.attributes.date ?? '').getTime()
		const zTime = new Date(z.attributes.date ?? '').getTime()
		return aTime > zTime ? -1 : aTime === zTime ? 0 : 1
	});

	await fs.writeFile('./content/blog-cache.json', JSON.stringify(blogPosts));
}

async function getDocs() {
	let walkPath = './content/docs';

	let blogPosts: Array<BlogPost> = [];

	let addFile = async (file: string) => {
		if (file.endsWith('index.mdx')) {
			let frontmatter = fm<BlogPostAttributes>(await fs.readFile(file, 'utf-8'));
			blogPosts.push({
				attributes: frontmatter.attributes,
				body: frontmatter.attributes.excerpt.substring(0, 100) + '...',
				url: `/docs/${file.substring(walkPath.length + 1, file.length - '/index.mdx'.length)}`
			});
		} else if (file.endsWith('.mdx')) {
			let frontmatter = fm<BlogPostAttributes>(await fs.readFile(file, 'utf-8'));
			blogPosts.push({
				attributes: frontmatter.attributes,
				body: frontmatter.attributes.excerpt.substring(0, 100) + '...',
				url: `/docs/${file.substring(walkPath.length + 1, file.length - '.mdx'.length)}`
			});
		}
	}

	await walk(walkPath, addFile);
	
	// sort by the date in frontmatter
	blogPosts = blogPosts.sort((a, z) => {
		const aTime = new Date(a.attributes.date ?? '').getTime()
		const zTime = new Date(z.attributes.date ?? '').getTime()
		return aTime > zTime ? -1 : aTime === zTime ? 0 : 1
	});

	await fs.writeFile('./content/docs-cache.json', JSON.stringify(blogPosts));
}


async function getPages() {
	let walkPath = './content/pages';

	let blogPosts: Array<BlogPost> = [];

	let addFile = async (file: string) => {
		if (file.endsWith('index.mdx')) {
			let frontmatter = fm<BlogPostAttributes>(await fs.readFile(file, 'utf-8'));
			blogPosts.push({
				attributes: frontmatter.attributes,
				body: frontmatter.attributes.excerpt.substring(0, 100) + '...',
				url: `/${file.substring(walkPath.length + 1, file.length - '/index.mdx'.length)}`
			});
		} else if (file.endsWith('.mdx')) {
			let frontmatter = fm<BlogPostAttributes>(await fs.readFile(file, 'utf-8'));
			blogPosts.push({
				attributes: frontmatter.attributes,
				body: frontmatter.attributes.excerpt.substring(0, 100) + '...',
				url: `/${file.substring(walkPath.length + 1, file.length - '.mdx'.length)}`
			});
		}
	}

	await walk(walkPath, addFile);
	
	// sort by the date in frontmatter
	blogPosts = blogPosts.sort((a, z) => {
		const aTime = new Date(a.attributes.date ?? '').getTime()
		const zTime = new Date(z.attributes.date ?? '').getTime()
		return aTime > zTime ? -1 : aTime === zTime ? 0 : 1
	});

	await fs.writeFile('./content/page-cache.json', JSON.stringify(blogPosts));
}


getPosts();
getDocs();
getPages();

if (process.argv.at(-1) === 'watch') {
	watch('./content', (eventType, filename) => {
		if (filename.endsWith('.mdx')) {
			getPosts();
		}
	});
}