import { useState } from "react";
import { subscribeEmail } from "../lib/newsletter";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("That email doesn't look quite right.");
      return;
    }
    setError("");
    setState("sending");
    try {
      await subscribeEmail(value);
      setState("done");
    } catch {
      setState("idle");
      setError("Something went wrong – try again in a moment.");
    }
  };

  if (state === "done") {
    return (
      <p className="mt-5 max-w-md border border-line bg-paper px-4 py-3 text-sm text-ink" data-testid="newsletter-success">
        You're in – talk soon. <span className="font-serifaccent italic text-sagedeep">The kettle's on.</span>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} data-testid="newsletter-form" className="mt-5 w-full max-w-md" noValidate>
      <div className="flex">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          data-testid="newsletter-email-input"
          className="w-full min-w-0 border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-inksoft/50 focus:border-sagedeep focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          data-testid="newsletter-submit-btn"
          className="shrink-0 bg-ink px-6 text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-sagedeep hover:text-ink disabled:opacity-60"
        >
          {state === "sending" ? "…" : "Sign up"}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-sagedeep" data-testid="newsletter-error">
          {error}
        </p>
      )}
    </form>
  );
}
