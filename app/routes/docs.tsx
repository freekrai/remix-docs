import { ErrorBoundaryComponent, json, LoaderArgs, SerializeFrom} from '@remix-run/node';
import { Link,  useLoaderData } from "@remix-run/react";
import { BlogPost as BlogPostType } from '~/types';
import { getContent } from '~/utils/blog.server';
import BlogPost from '~/components/BlogPost';
import { CacheControl } from "~/utils/cache-control.server";
import { getSeoMeta } from "~/seo";

import { MarkdownView } from "~/components/Markdown";
import { parseMarkdown } from "~/utils/markdoc.server";

export const meta = ({data}) => {
	if (!data) return {};
	let { post } = data as SerializeFrom<typeof loader>;

	let seoMeta = getSeoMeta({
		title: post.frontmatter.meta.title,
		description: post.frontmatter.meta.description,
	});
	return {
		...seoMeta,
	};
}
export let loader = async function({}: LoaderArgs) {
  const files = await getContent(`docs/index`);
  let post = files && parseMarkdown(files[0].content);

  return json({
    post
  }, {
    headers: {
      "Cache-Control": new CacheControl("swr").toString(),
    }
  });
}


export default function Index() {
	const {post} = useLoaderData<typeof loader>();

	return (
		<article className="flex flex-col items-start justify-center w-full max-w-2xl mx-auto mb-16">
			<h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">{post.frontmatter.meta.title}</h1>
			<div className="w-full mt-4 prose dark:prose-dark max-w-none">
				{post.body && <MarkdownView content={post.body} />}
			</div>
		</article>
	)
}

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
  return (
    <main>
      <h1>Unable to fetch list of blog posts. Please check back later</h1>
    </main>
  )
}
