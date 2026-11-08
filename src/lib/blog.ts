import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"blog">;

export async function getPosts() {
  const posts = await getCollection("blog", (p) => import.meta.env.DEV || !p.data.draft);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export const postPath = (p: Post) => `/blog/${p.id}/`;

export function readingMinutes(body = "") {
  const words = body
    .replace(/^import .*$/gm, "")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "Australia/Sydney" });

/** Posts sharing the most tags (then category) with `post`, newest first. */
export function related(post: Post, all: Post[], n = 3) {
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      p,
      score: p.data.tags.filter((t) => post.data.tags.includes(t)).length + (p.data.category === post.data.category ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score || b.p.data.pubDate.getTime() - a.p.data.pubDate.getTime())
    .slice(0, n)
    .map((x) => x.p);
}
