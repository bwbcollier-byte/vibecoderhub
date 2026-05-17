import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const AIRTABLE_BASE_ID = "app6biS7yjV6XzFVG";
const DEV_ISSUES_TABLE_ID = "tblWTdcQhGVIGg5lC";
const APP_NAME = "PromptKit";

type ReportPayload = {
  title?: string;
  description?: string;
  severity?: "Critical" | "High" | "Medium" | "Low";
  pageUrl?: string;
  userAgent?: string;
  viewport?: string;
  reporter?: string;
  screenshotDataUrl?: string;
  screenshotName?: string;
};

async function uploadScreenshotAttachment(
  recordId: string,
  fieldId: string,
  dataUrl: string,
  filename: string,
  token: string,
) {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) return null;
  const contentType = match[1];
  const base64 = match[2];
  const res = await fetch(
    `https://content.airtable.com/v0/${AIRTABLE_BASE_ID}/${recordId}/${fieldId}/uploadAttachment`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contentType,
        file: base64,
        filename,
      }),
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Airtable upload failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function POST(request: Request) {
  const token = process.env.AIRTABLE_API_KEY;
  if (!token) {
    return NextResponse.json(
      { error: "AIRTABLE_API_KEY not configured" },
      { status: 500 },
    );
  }

  let body: ReportPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const title = (body.title || "").trim();
  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 },
    );
  }

  // Step 1: create the record without screenshot
  const createRes = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${DEV_ISSUES_TABLE_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Title: title.slice(0, 200),
          App: APP_NAME,
          Status: "New",
          Severity: body.severity || "Medium",
          Description: (body.description || "").slice(0, 100000),
          "Page URL": body.pageUrl || "",
          "User Agent": (body.userAgent || "").slice(0, 500),
          Viewport: (body.viewport || "").slice(0, 50),
          Reporter: (body.reporter || "anonymous").slice(0, 200),
          Created: new Date().toISOString(),
        },
        typecast: true,
      }),
    },
  );

  if (!createRes.ok) {
    const text = await createRes.text();
    return NextResponse.json(
      { error: `Airtable create failed: ${createRes.status}`, detail: text },
      { status: 502 },
    );
  }

  const record = (await createRes.json()) as { id: string };

  // Step 2: upload screenshot if provided (best-effort)
  let screenshotUploaded = false;
  if (body.screenshotDataUrl) {
    try {
      await uploadScreenshotAttachment(
        record.id,
        "fldg94FWuHAgnFYiQ",
        body.screenshotDataUrl,
        body.screenshotName || "screenshot.png",
        token,
      );
      screenshotUploaded = true;
    } catch (e) {
      // Don't fail the whole request; just report
      console.error("[report-issue] screenshot upload failed", e);
    }
  }

  return NextResponse.json({
    ok: true,
    recordId: record.id,
    screenshotUploaded,
  });
}
