"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Severity = "Critical" | "High" | "Medium" | "Low";

const SEVERITY_OPTIONS: Severity[] = ["Critical", "High", "Medium", "Low"];

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function ReportIssueButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Severity>("Medium");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    setTitle("");
    setDescription("");
    setSeverity("Medium");
    setScreenshot(null);
    setScreenshotPreview(null);
    setSubmitState("idle");
    setErrorMessage("");
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Paste-to-attach: when modal open, listen for paste events with images
  useEffect(() => {
    if (!open) return;
    const onPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            setScreenshot(file);
            fileToDataUrl(file).then(setScreenshotPreview);
            e.preventDefault();
            return;
          }
        }
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    fileToDataUrl(file).then(setScreenshotPreview);
  };

  const submit = async () => {
    if (!title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }
    setSubmitting(true);
    setSubmitState("idle");
    setErrorMessage("");

    try {
      const screenshotDataUrl = screenshot
        ? await fileToDataUrl(screenshot)
        : undefined;

      const res = await fetch("/api/report-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          severity,
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          reporter: "anonymous",
          screenshotDataUrl,
          screenshotName: screenshot?.name,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server returned ${res.status}: ${text}`);
      }

      setSubmitState("success");
      // Auto-close after 1.5s
      setTimeout(() => {
        setOpen(false);
        reset();
      }, 1500);
    } catch (e) {
      setSubmitState("error");
      setErrorMessage(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating trigger button — sits top-right, above content, all pages */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Report Dev Issue"
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 9000,
          background: "#fb2c63",
          color: "white",
          border: "none",
          borderRadius: 6,
          padding: "6px 12px",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.02em",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
          fontFamily: "var(--font-body), system-ui, sans-serif",
        }}
      >
        Report Dev Issue
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-issue-title"
          onClick={(e) => {
            if (e.target === dialogRef.current) setOpen(false);
          }}
          ref={dialogRef}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 17, 23, 0.55)",
            zIndex: 9001,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "8vh 16px 16px",
            backdropFilter: "blur(2px)",
            fontFamily: "var(--font-body), system-ui, sans-serif",
          }}
        >
          <div
            style={{
              background: "white",
              color: "#1f2230",
              width: "100%",
              maxWidth: 520,
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 24px 48px rgba(0,0,0,0.25)",
              maxHeight: "84vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBottom: 4,
              }}
            >
              <h2
                id="report-issue-title"
                style={{ fontSize: 18, fontWeight: 700, margin: 0 }}
              >
                Report Dev Issue
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 22,
                  lineHeight: 1,
                  cursor: "pointer",
                  color: "#5b6170",
                  padding: 0,
                }}
              >
                ×
              </button>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "#5b6170",
                margin: "0 0 16px",
              }}
            >
              Tell us what broke. Paste a screenshot if you have one.
            </p>

            {submitState === "success" ? (
              <div
                style={{
                  background: "#e6f4ec",
                  color: "#0a6b3d",
                  padding: 16,
                  borderRadius: 8,
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Thanks. Logged. Closing…
              </div>
            ) : (
              <>
                <label style={labelStyle}>
                  Title <span style={{ color: "#fb2c63" }}>*</span>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="One-line summary"
                    maxLength={200}
                    autoFocus
                    style={inputStyle}
                  />
                </label>

                <label style={labelStyle}>
                  Severity
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as Severity)}
                    style={inputStyle}
                  >
                    {SEVERITY_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={labelStyle}>
                  Description
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What happened, what you expected, steps to reproduce..."
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </label>

                <label style={labelStyle}>
                  Screenshot (paste or upload)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ ...inputStyle, padding: "8px 6px" }}
                  />
                </label>

                {screenshotPreview && (
                  <div
                    style={{
                      marginBottom: 16,
                      border: "1px solid #e6e8ee",
                      borderRadius: 8,
                      padding: 8,
                      background: "#f8f9fb",
                    }}
                  >
                    <img
                      src={screenshotPreview}
                      alt="Screenshot preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: 200,
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setScreenshot(null);
                        setScreenshotPreview(null);
                      }}
                      style={{
                        marginTop: 8,
                        background: "none",
                        border: "none",
                        color: "#5b6170",
                        fontSize: 12,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}

                {submitState === "error" && (
                  <div
                    style={{
                      background: "#fde7eb",
                      color: "#9b1b30",
                      padding: 10,
                      borderRadius: 6,
                      fontSize: 12,
                      marginBottom: 12,
                    }}
                  >
                    {errorMessage || "Failed to submit. Try again."}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "flex-end",
                    marginTop: 8,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    style={{
                      background: "transparent",
                      color: "#5b6170",
                      border: "1px solid #e6e8ee",
                      borderRadius: 6,
                      padding: "8px 16px",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting || !title.trim()}
                    style={{
                      background:
                        submitting || !title.trim() ? "#c2c6d0" : "#fb2c63",
                      color: "white",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 16px",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor:
                        submitting || !title.trim()
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    {submitting ? "Sending…" : "Submit"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#3d4150",
  marginBottom: 14,
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  marginTop: 4,
  padding: "8px 10px",
  border: "1px solid #d3d7e0",
  borderRadius: 6,
  fontSize: 13,
  fontFamily: "inherit",
  color: "#1f2230",
  background: "white",
};
