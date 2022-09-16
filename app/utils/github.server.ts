import nodePath from 'path'
import { Octokit as createOctokit } from '@octokit/rest'
import { throttling } from '@octokit/plugin-throttling'
import { GitHubFile } from './mdx.server'

import { envSchema } from "~/env.server";

let env = envSchema.parse(process.env);

const Octokit = createOctokit.plugin(throttling)

type ThrottleOptions = {
	method: string
	url: string
	request: { retryCount: number }
}

const octokit = new Octokit({
	auth: env.BOT_GITHUB_TOKEN,
	throttle: {
		onRateLimit: (retryAfter: number, options: ThrottleOptions) => {
			console.warn(
				`Request quota exhausted for request ${options.method} ${options.url}. Retrying after ${retryAfter} seconds.`,
			)

			return true
		},
		onAbuseLimit: (retryAfter: number, options: ThrottleOptions) => {
			// does not retry, only logs a warning
			octokit.log.warn(
				`Abuse detected for request ${options.method} ${options.url}`,
			)
		},
	},
})

async function downloadFirstMdxFile(
	list: Array<{ name: string; type: string; path: string; sha: string }>,
) {
	const filesOnly = list.filter(({ type }) => type === 'file')
	for (const extension of ['.mdx', '.md']) {
		const file = filesOnly.find(({ name }) => name.endsWith(extension))
		if (file) return downloadFileBySha(file.sha)
	}
	return null
}

async function downloadMdxFileOrDirectory(
	relativeMdxFileOrDirectory: string,
): Promise<{ entry: string; files: Array<GitHubFile> }> {
	const mdxFileOrDirectory = `content/${relativeMdxFileOrDirectory}`

	const parentDir = nodePath.dirname(mdxFileOrDirectory)
	const dirList = await downloadDirList(parentDir)

	const basename = nodePath.basename(mdxFileOrDirectory)
	const mdxFileWithoutExt = nodePath.parse(mdxFileOrDirectory).name
	const potentials = dirList.filter(({ name }) => name.startsWith(basename))
	const exactMatch = potentials.find(
		({ name }) => nodePath.parse(name).name === mdxFileWithoutExt,
	)
	const dirPotential = potentials.find(({ type }) => type === 'dir')

	const content = await downloadFirstMdxFile(
		exactMatch ? [exactMatch] : potentials,
	)
	let files: Array<GitHubFile> = []
	let entry = mdxFileOrDirectory
	if (content) {
		entry = mdxFileOrDirectory.endsWith('.mdx')
			? mdxFileOrDirectory
			: `${mdxFileOrDirectory}.mdx`
		files = [{ path: nodePath.join(mdxFileOrDirectory, 'index.mdx'), content }]
	} else if (dirPotential) {
		entry = dirPotential.path
		files = await downloadDirectory(mdxFileOrDirectory)
	}

	return { entry, files }
}

async function downloadDirectory(dir: string): Promise<Array<GitHubFile>> {
	const dirList = await downloadDirList(dir)

	const result = await Promise.all(
		dirList.map(async ({ path: fileDir, type, sha }) => {
			switch (type) {
				case 'file': {
					const content = await downloadFileBySha(sha)
					return { path: fileDir, content }
				}
				case 'dir': {
					return downloadDirectory(fileDir)
				}
				default: {
					throw new Error(`Unexpected repo file type: ${type}`)
				}
			}
		}),
	)

	return result.flat()
}

async function downloadFileBySha(sha: string) {
	const { data } = await octokit.request(
		'GET /repos/{owner}/{repo}/git/blobs/{file_sha}',
		{
			owner: env.GITHUB_OWNER,
			repo: env.GITHUB_REPO,
			file_sha: sha,
		},
	)
	const encoding = data.encoding as Parameters<typeof Buffer.from>['1']
	return Buffer.from(data.content, encoding).toString()
}

async function downloadFile(path: string) {
	const { data } = (await octokit.request(
		'GET /repos/{owner}/{repo}/contents/{path}',
		{
			owner: env.GITHUB_OWNER,
			repo: env.GITHUB_REPO,
			path,
		},
	)) as { data: { content?: string; encoding?: string } }

	if (!data.content || !data.encoding) {
		console.error(data)
		throw new Error(
			`Tried to get ${path} but got back something that was unexpected. It doesn't have a content or encoding property`,
		)
	}

	const encoding = data.encoding as Parameters<typeof Buffer.from>['1']
	return Buffer.from(data.content, encoding).toString()
}

async function downloadDirList(path: string) {
	const resp = await octokit.repos.getContent({
        owner: env.GITHUB_OWNER,
        repo: env.GITHUB_REPO,
        path,
	})
	const data = resp.data

	if (!Array.isArray(data)) {
		throw new Error(
			`Tried to download content from ${path}. GitHub did not return an array of files. This should never happen...`,
		)
	}

	return data
}

export { downloadMdxFileOrDirectory, downloadDirList, downloadFile }