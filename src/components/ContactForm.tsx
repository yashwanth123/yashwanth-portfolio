"use client";

import { useState, type FormEvent } from "react";
import {
  loadRuntimeContactConfig,
  submitContactMessage,
} from "@/lib/contact";

type FormState = "idle" | "sending" | "success" | "error" | "activation";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const config = await loadRuntimeContactConfig();
      const result = await submitContactMessage(config, {
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
        honey: String(data.get("company") ?? ""),
      });

      if (result.ok) {
        setState("success");
        form.reset();
        return;
      }

      setErrorMessage(result.error);
      setState(result.needsActivation ? "activation" : "error");
    } catch {
      setState("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
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
        {state === "sending" ? "Sending…" : "Send message"}
      </button>

      {state === "success" && (
        <p className="text-sm text-cyan-300/80">
          Message sent — thanks, I&apos;ll get back to you soon.
        </p>
      )}

      {state === "activation" && (
        <p className="text-sm text-amber-200/80">{errorMessage}</p>
      )}

      {state === "error" && (
        <p className="text-sm text-red-300/80">
          {errorMessage}{" "}
          <a
            href="https://github.com/yashwanth123"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            GitHub
          </a>
        </p>
      )}
    </form>
  );
}
