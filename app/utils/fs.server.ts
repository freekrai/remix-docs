import { statSync, existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import fs from 'fs/promises';
import fm from 'front-matter';
import { GitHubFile } from '~/utils/mdx.server';

const contentPath = 'content'
const blogBasePath = join(process.cwd(), 'content');

export const getLocalFile = async (path: string): Promise<string> => {
	const jsonDirectory = __dirname + "/../" + contentPath;
	const data = await fs.readFile(`${jsonDirectory}/${path}`, "utf8");
	return data.toString();
}

export const getLocalContent = async (path: string) => {
	try {
		const mdxPath = __dirname + "/../" + contentPath;
		// if it's a file then load the file
		if ( existsSync( join(mdxPath, `${path}.mdx`) ) ){
			const data = readFileSync(join(mdxPath, `${path}.mdx`), { encoding: 'utf-8'});
			return [{
				path: `${path}.mdx`,
				content: data.toString(),
			}]
		// otherwise... if it's a directory then we load the directory with index.mdx
		} else if ( statSync( join(mdxPath, path) ).isDirectory() ) {
			if (path.slice(-1) != '/') path += '/';
			const file = path + "index.mdx";
			const data = readFileSync( join(mdxPath, file), { encoding: 'utf-8'});
			return [{
				path: file,
				content: data.toString(),
			}]
		}
	} catch (error: any) {
		if (error.code?.includes('ENOENT')) {
			throw new Error('Not found')
		}

		throw error;
	}	
}

export function loadMdxSingle(filepath) {
	const relativeFilePath = filepath.replace(/^\/blog\//, '').replace(/\/$/, '');
	const fileContents = readFileSync( join(blogBasePath, `${relativeFilePath}.mdx`), {encoding: 'utf-8'} );
  
	const { attributes } = fm(fileContents);
  
	return attributes;
  }
  
  export function loadMdx() {
	const dirEntries = readdirSync(blogBasePath, { withFileTypes: true });
	const dirs = dirEntries.filter((entry) => entry.isDirectory());
	const files = dirEntries.filter((entry) => entry.isFile());
  
	const subFiles = dirs
	  .map((dir) => {
		const subDirEntries = readdirSync(join(blogBasePath, dir.name), {
		  withFileTypes: true,
		})
		  .filter((e) => e.isFile())
		  .map((e) => ({ name: join(dir.name, e.name) }));
  
		return subDirEntries;
	  })
	  .flat();
  
	const entries = [...files, ...subFiles].map((entry) => {
	  if (entry.name === 'index.jsx') {
		return;
	  }
  
	  const fileContents = readFileSync(join(blogBasePath, entry.name), {
		encoding: 'utf-8',
	  });
  
	  const { attributes } = fm(fileContents);
  
	  return {
		date: attributes.date,
		slug: entry.name.replace('.mdx', ''),
		title: attributes.meta.title,
		description: attributes.meta.description,
	  };
	});
  
	return entries.filter(Boolean).sort((a, b) => b.date - a.date);
}