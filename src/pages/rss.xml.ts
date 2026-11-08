import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts, postPath } from "../lib/blog";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "The VietCaPhe blog",
    description: "Guides, product ideas and market notes on specialty robusta for Australian roasters and green coffee buyers.",
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.pubDate,
      link: postPath(p),
      categories: [p.data.category, ...p.data.tags],
    })),
    customData: "<language>en-au</language>",
  });
}
