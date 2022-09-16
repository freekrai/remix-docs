import { ErrorBoundaryComponent, json, LoaderArgs, } from '@remix-run/node';
import { Link,  useLoaderData } from "@remix-run/react";
import { BlogPost as BlogPostType } from '~/types';
import { getPosts } from '~/utils/blog.server';
import BlogPost from '~/components/BlogPost';
import { CacheControl } from "~/utils/cache-control.server";
import { getSeoMeta } from "~/seo";

export let meta = ({ context }) => {
	let seoMeta = getSeoMeta({
		title: `Blog`
	});
	return {
		...seoMeta,
	};
};

export let loader = async function({}: LoaderArgs) {
  return json({
    blogPosts: await getPosts(),
  }, {
    headers: {
      "Cache-Control": new CacheControl("swr").toString(),
    }
  });
}


export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-start justify-center w-full max-w-2xl mx-auto mb-16">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
        Blog
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
      </p>
        {data.blogPosts.map(post => (
          <BlogPost key={post.url}
            title={post.attributes.meta.title}
            slug={post.url}
            excerpt={post.attributes.excerpt}
          />
        ))}
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({error}) => {
  return (
    <main>
      <h1>Unable to fetch list of blog posts. Please check back later</h1>
    </main>
  )
}
