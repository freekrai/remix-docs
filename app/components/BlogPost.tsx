import { Link, useLoaderData } from "@remix-run/react";
import cn from 'classnames';

export default function BlogPost({
  title,
  excerpt,
  slug
}){
  return (
    <Link prefetch="intent" to={slug} className="w-full no-underline	">
        <div className="flex flex-col justify-between md:flex-row">
          <h4 className="w-full mb-2 text-lg font-medium text-blue-600 md:text-xl dark:text-gray-100">
            {title}
          </h4>
        </div>
        {excerpt && <p className="text-gray-600 dark:text-gray-300">{excerpt}...</p>}
    </Link>
  );
}
