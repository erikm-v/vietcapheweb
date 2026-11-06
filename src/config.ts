export const site = {
  email: "info@vietcaphe.com.au",
  // Google Apps Script web app URL (ends in /exec), see apps-script/Code.gs. When empty, the contact form opens the visitor's email app instead.
  formEndpoint: "https://script.google.com/macros/s/AKfycbwaWr337s69S6TL1iPxgiTZXdl6-2a-q2M2GTxl-BaMJeC6scOHHLhOYuR0MkJBJplz/exec",
};

export function mailto(subject: string, body?: string) {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${site.email}?${params.join("&")}`;
}
