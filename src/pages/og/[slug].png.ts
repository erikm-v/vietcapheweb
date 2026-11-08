import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { APIRoute } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PostCover } from "../../components/blog/PostCover";
import { getPosts, type Post } from "../../lib/blog";

export async function getStaticPaths() {
  const posts = await getPosts();
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}

const file = (p: string) => readFile(resolve(process.cwd(), p));

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as { post: Post };
  const d = post.data;
  const [display, body, logo] = await Promise.all([
    file("node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff"),
    file("node_modules/@fontsource/inter/files/inter-latin-600-normal.woff"),
    file("src/assets/logo.png"),
  ]);

  const coverSvg = renderToStaticMarkup(createElement(PostCover, { seed: post.id, theme: d.coverTheme }));
  const cover = `data:image/svg+xml;base64,${Buffer.from(coverSvg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"')).toString("base64")}`;

  const tree = h("div", { width: 1200, height: 630, display: "flex", position: "relative", fontFamily: "Inter" }, [
    h("img", { position: "absolute", top: 0, left: 0, width: 1200, height: 675 }, undefined, { src: cover, width: 1200, height: 675 }),
    h(
      "div",
      {
        position: "absolute",
        left: 48,
        bottom: 48,
        width: 860,
        display: "flex",
        flexDirection: "column",
        background: "#f6eee2",
        borderRadius: 36,
        padding: "40px 44px",
        color: "#140d09",
      },
      [
        h("div", { display: "flex", alignItems: "center", gap: 14 }, [
          h("div", { display: "flex", width: 52, height: 52, borderRadius: 14, background: "#ffc93c", alignItems: "center", justifyContent: "center" }, [
            h("img", { width: 38, height: 38 }, undefined, { src: `data:image/png;base64,${logo.toString("base64")}`, width: 38, height: 38 }),
          ]),
          h("div", { display: "flex", fontFamily: "Bricolage", fontSize: 26, letterSpacing: -0.5 }, "VIETCAPHE"),
          h("div", { display: "flex", marginLeft: 12, fontSize: 22, color: "#ff6a13" }, d.category),
        ]),
        h("div", { display: "flex", marginTop: 22, fontFamily: "Bricolage", fontSize: d.title.length > 48 ? 56 : 66, lineHeight: 1, letterSpacing: -2 }, d.title),
        h("div", { display: "flex", marginTop: 22, fontSize: 22, color: "rgba(20,13,9,0.6)" }, "vietcaphe.com.au/blog"),
      ],
    ),
  ]);

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Bricolage", data: display, weight: 800, style: "normal" },
      { name: "Inter", data: body, weight: 600, style: "normal" },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
};
