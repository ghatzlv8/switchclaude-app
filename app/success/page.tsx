export default async function Success({ searchParams }: { searchParams: { session_id?: string } }) {
  const sid = searchParams.session_id || "";
  let key = "";
  let accounts = 0;
  let error = "";
  if (sid) {
    try {
      const r = await fetch(`https://switchclaude.vercel.app/api/license?session_id=${sid}`, { cache: "no-store" });
      const j = await r.json();
      if (j.license_key) { key = j.license_key; accounts = j.accounts; }
      else error = j.error || "unknown";
    } catch { error = "network"; }
  } else error = "missing session";
  return (
    <div style={{ maxWidth: 640, margin: "80px auto", padding: 24, fontFamily: "system-ui", color: "#061b31" }}>
      <h1 style={{ fontWeight: 300 }}>Thank you — payment confirmed.</h1>
      {key ? (
        <>
          <p>Your license key ({accounts} extra account{accounts > 1 ? "s" : ""}):</p>
          <code style={{ display: "block", padding: 16, background: "#f6f9fc", border: "1px solid #e5edf5", borderRadius: 6, wordBreak: "break-all" }}>{key}</code>
          <p style={{ fontSize: 13, color: "#64748d" }}>Paste it in the app → Settings → License. Save it — this page is the only copy.</p>
          <a href="/#download" style={{ display: "inline-block", marginTop: 12, background: "#533afd", color: "#fff", padding: "10px 18px", borderRadius: 4, textDecoration: "none" }}>Download SwitchClaude</a>
        </>
      ) : (
        <p style={{ color: "#a00" }}>Could not issue license ({error}). Contact info@lv8.gr with your receipt.</p>
      )}
    </div>
  );
}
