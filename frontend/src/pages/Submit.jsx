import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { postSubmission } from "@/lib/api";
import PageHead from "@/components/PageHead";
import { FadeIn } from "@/components/Reveal";

const inputCls =
  "w-full border-b border-ink/25 bg-transparent py-4 text-base placeholder:text-inksoft/50 focus:border-sagedeep focus:outline-none transition-colors duration-300";
const labelCls = "text-xs uppercase tracking-[0.2em] text-inksoft";

function Field({ label, name, type = "text", placeholder, value, onChange, textarea = false, testId, required = true }) {
  return (
    <div>
      <label htmlFor={name} className={labelCls}>{label}</label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          data-testid={testId}
          className={`${inputCls} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          data-testid={testId}
          className={inputCls}
        />
      )}
    </div>
  );
}

const EMPTY_SHOW = { name: "", email: "", idea: "", format: "", links: "", why: "" };
const EMPTY_PROJECT = { name: "", email: "", title: "", category: "Music", description: "", link: "" };

export default function Submit() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "project" ? "project" : "show";
  const [showForm, setShowForm] = useState(EMPTY_SHOW);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [sending, setSending] = useState(false);

  const setTab = (t) => setParams({ tab: t });
  const updShow = (e) => setShowForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const updProject = (e) => setProjectForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submitShow = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await postSubmission({
        kind: "show",
        name: showForm.name,
        email: showForm.email,
        fields: {
          "Show idea": showForm.idea,
          "Format": showForm.format,
          "Links": showForm.links,
          "Why Open House?": showForm.why,
        },
      });
      toast.success("Thanks — your show pitch is in. We'll be in touch soon.");
      setShowForm(EMPTY_SHOW);
    } catch {
      toast.error("Something went wrong sending that. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const submitProject = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await postSubmission({
        kind: "project",
        name: projectForm.name,
        email: projectForm.email,
        fields: {
          "Project title": projectForm.title,
          "Category": projectForm.category,
          "Description": projectForm.description,
          "Link / Instagram": projectForm.link,
        },
      });
      toast.success("Thanks — your project is in. We'll take a proper look.");
      setProjectForm(EMPTY_PROJECT);
    } catch {
      toast.error("Something went wrong sending that. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="submit-page" className="pb-20 md:pb-32">
      <PageHead
        kicker="Join in"
        title="Submit"
        intro="Open House runs on what people bring through the door. Pitch a show, share a project, or just start the conversation — we read everything, and we reply."
      />

      <FadeIn delay={0.4} className="mx-auto mt-14 max-w-[1600px] px-4 sm:px-8">
        <div className="flex gap-3" data-testid="submit-tabs">
          {[
            ["show", "Pitch a Show"],
            ["project", "Submit a Project"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              data-testid={`tab-${key}`}
              className={`border px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors duration-300 ${
                tab === key
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-transparent text-inksoft hover:border-ink hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </FadeIn>

      <div className="mx-auto mt-14 max-w-[1600px] px-4 sm:px-8">
        <AnimatePresence mode="wait">
          {tab === "show" ? (
            <motion.form
              key="show"
              data-testid="pitch-show-form"
              onSubmit={submitShow}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid max-w-3xl gap-10"
            >
              <div className="grid gap-10 sm:grid-cols-2">
                <Field label="Name" name="name" placeholder="Your name" value={showForm.name} onChange={updShow} testId="show-name-input" />
                <Field label="Email" name="email" type="email" placeholder="you@email.com" value={showForm.email} onChange={updShow} testId="show-email-input" />
              </div>
              <Field label="Show idea" name="idea" textarea placeholder="What's the show? What does it sound like? Who is it for?" value={showForm.idea} onChange={updShow} testId="show-idea-input" />
              <Field label="Format" name="format" placeholder="Weekly mix, monthly interview, one-off special…" value={showForm.format} onChange={updShow} testId="show-format-input" />
              <Field label="Links" name="links" placeholder="Mixes, SoundCloud, Instagram — anything that helps us hear you" value={showForm.links} onChange={updShow} testId="show-links-input" required={false} />
              <Field label="Why Open House?" name="why" textarea placeholder="No wrong answers. Tell us why this belongs here." value={showForm.why} onChange={updShow} testId="show-why-input" />
              <div>
                <button
                  type="submit"
                  disabled={sending}
                  data-testid="pitch-show-submit-btn"
                  className="group flex items-center gap-3 bg-ink px-8 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-sagedeep hover:text-ink disabled:opacity-50"
                >
                  {sending ? "Sending…" : "Send Pitch"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="project"
              data-testid="submit-project-form"
              onSubmit={submitProject}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="grid max-w-3xl gap-10"
            >
              <div className="grid gap-10 sm:grid-cols-2">
                <Field label="Name" name="name" placeholder="Your name" value={projectForm.name} onChange={updProject} testId="project-name-input" />
                <Field label="Email" name="email" type="email" placeholder="you@email.com" value={projectForm.email} onChange={updProject} testId="project-email-input" />
              </div>
              <div className="grid gap-10 sm:grid-cols-2">
                <Field label="Project title" name="title" placeholder="What is it called?" value={projectForm.title} onChange={updProject} testId="project-title-input" />
                <div>
                  <label htmlFor="category" className={labelCls}>Category</label>
                  <select
                    id="category"
                    name="category"
                    value={projectForm.category}
                    onChange={updProject}
                    data-testid="project-category-select"
                    className={`${inputCls} cursor-pointer`}
                  >
                    {["Music", "Art", "Events", "Film", "Photography", "Fashion", "Other"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Field label="Description" name="description" textarea placeholder="Tell us about it — what it is, who made it, where it lives." value={projectForm.description} onChange={updProject} testId="project-description-input" />
              <Field label="Link / Instagram" name="link" placeholder="Where can we see it?" value={projectForm.link} onChange={updProject} testId="project-link-input" required={false} />
              <div
                data-testid="media-upload-placeholder"
                className="flex flex-col items-center justify-center gap-2 border border-dashed border-ink/25 bg-surface/60 p-10 text-center"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-ink">Media upload</p>
                <p className="max-w-xs text-sm text-inksoft">File uploads are coming soon — for now, a link above works perfectly.</p>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={sending}
                  data-testid="submit-project-submit-btn"
                  className="group flex items-center gap-3 bg-ink px-8 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-sagedeep hover:text-ink disabled:opacity-50"
                >
                  {sending ? "Sending…" : "Send Project"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
