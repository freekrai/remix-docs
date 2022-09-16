import { LoaderArgs, json } from "remix";
import { getPosts, getDocs } from '~/utils/blog.server';
import {getDomainUrl} from '~/utils'

export let loader = async ({ request }: LoaderArgs) => {
  const blogUrl = `${getDomainUrl(request)}`
  
  let url = new URL(request.url);
  let term = url.searchParams.get("term");

  let [posts, docs] = await Promise.all([
    getPosts(),
    getDocs(),
  ]);    

  const postUrls = [...posts, ...docs].map( post => {
    let url = post.url.replace("//", "/");
    return {
        url: `${blogUrl}${url}`,
        title: post.attributes.meta.title,
        body: post.body,
        type: url.includes('docs/') ? 'Docs' : 'Blog',
    } 
  }) || []
  
  // this function should query the DB or fetch an API to get the users
  const results = term ? postUrls.filter(
    post => post.title.toLowerCase().includes( String(term) ) || 
    post.body.toLowerCase().includes( String(term) ) 
  ) : []
  
  return json({ results });
};