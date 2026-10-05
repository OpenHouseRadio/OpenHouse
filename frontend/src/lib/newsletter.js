// NEWSLETTER WIRING – the form is live, the mailing list is not (yet).
// Pick a service, create a free account, then set ENDPOINT and, if needed,
// adjust the body format below:
//   Buttondown: "https://buttondown.email/api/emails/embed-subscribe/<username>"
//               body: new URLSearchParams({ email })  – form POST, no API key needed
//   Mailchimp:  your list's embed form action URL (…/subscribe/post?u=…&id=…)
//               body: new URLSearchParams({ EMAIL: email })  – note the capital EMAIL
//   Substack:   "https://<your-publication>.substack.com/api/v1/free"
//               body: JSON.stringify({ email }) + Content-Type: application/json header
const ENDPOINT = null;

export async function subscribeEmail(email) {
  if (!ENDPOINT) {
    // Not connected yet – simulate success so the form is fully testable.
    await new Promise((r) => setTimeout(r, 500));
    return { ok: true, mocked: true };
  }
  const res = await fetch(ENDPOINT, {
    method: "POST",
    body: new URLSearchParams({ email }),
  });
  if (!res.ok) throw new Error("subscribe failed");
  return { ok: true };
}
