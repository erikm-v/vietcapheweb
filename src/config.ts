export const site = {
  email: "info@vietcaphe.com.au",
  // Optional form backend (Formspree, Getform, etc.). When empty, the contact form opens the visitor's email app instead.
  formEndpoint: "",
};

export function mailto(subject: string, body?: string) {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${site.email}?${params.join("&")}`;
}
