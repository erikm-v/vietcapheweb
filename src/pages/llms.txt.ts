import { getPosts, postPath } from "../lib/blog";
import { absolute } from "../lib/seo";
import { site } from "../config";

export async function GET() {
  const posts = await getPosts();
  const body = `# VietCaPhe

> ${site.entity} Our focus is specialty-grade, honey-processed robusta from the Central Highlands of Vietnam (Cu M'gar, Dak Lak and Gia Lai). We do not sell roasted coffee or supply cafés directly. Roasters can request a green sample at ${absolute("/#contact")} or by emailing ${site.email}.

## Key pages

- [Home](${absolute("/")}): what we supply, our lots, how they are processed, and how to request a green sample.
- [Blog](${absolute("/blog/")}): guides and market notes on specialty robusta for roasters and green coffee buyers.
- [RSS feed](${absolute("/rss.xml")})

## Blog posts

${posts.map((p) => `- [${p.data.title}](${absolute(postPath(p))}): ${p.data.description}`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
