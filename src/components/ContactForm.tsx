"use client";

import { useState, type FormEvent } from "react";
import { buildMailto } from "@/lib/contact";

type FormState = "idle" | "sending" | "success";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [mailtoHref, setMailtoHref] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    if (String(data.get("company") ?? "").trim()) {
      setState("success");
      form.reset();
      return;
    }

    setState("sending");

    const href = buildMailto({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    });

    setMailtoHref(href);
    window.location.assign(href);
    form.reset();
    setState("success");
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex flex-col gap-5">
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Company
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-[11px] tracking-[0.16em] text-white/45 uppercase">
            Name
          </span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            className="rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-cyan-400/40"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-[11px] tracking-[0.16em] text-white/45 uppercase">
            Email
          </span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="rounded-full border border-white/15 bg-white/[0.03] px-5 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-cyan-400/40"
          />
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-[11px] tracking-[0.16em] text-white/45 uppercase">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Write a note — I'll get it by email."
          className="resize-none rounded-3xl border border-white/15 bg-white/[0.03] px-5 py-4 text-sm leading-7 text-white outline-none transition-colors placeholder:text-white/25 focus:border-cyan-400/40"
        />
      </label>

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex w-full items-center justify-center rounded-full border border-white/80 px-7 py-3 text-xs tracking-[0.16em] text-white uppercase transition-all hover:bg-white hover:text-[#030712] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {state === "sending" ? "Opening…" : "Send message"}
      </button>

      {state === "success" && (
        <p className="text-sm text-cyan-300/80">
          Your email app should open with the message. Send it from there.
          {mailtoHref ? (
            <>
              {" "}
              If nothing opened,{" "}
              <a href={mailtoHref} className="underline hover:text-white">
                click here
              </a>
              .
            </>
          ) : null}
        </p>
      )}
    </form>
  );
}
