export const metadata = { title: "Privacy Policy — SwitchClaude" };

const S: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: 720, margin: "0 auto", padding: "56px 24px", color: "#061b31", fontFamily: "system-ui, sans-serif" },
  h1: { fontWeight: 300, fontSize: 36, letterSpacing: "-0.02em" },
  h2: { fontWeight: 600, fontSize: 18, marginTop: 32 },
  p: { fontSize: 14, lineHeight: 1.65, color: "#273951" },
  li: { fontSize: 14, lineHeight: 1.65, color: "#273951" },
  table: { width: "100%", fontSize: 13, borderCollapse: "collapse", marginTop: 12 },
  th: { textAlign: "left", borderBottom: "2px solid #061b31", padding: "8px" },
  td: { borderBottom: "1px solid #e5edf5", padding: "8px" },
};

export default function Privacy() {
  return (
    <div style={S.wrap}>
      <h1 style={S.h1}>Privacy Policy</h1>
      <p style={S.p}>Last updated: 10 September 2026.</p>

      <h2 style={S.h2}>1. Controller</h2>
      <p style={S.p}>SwitchClaude — contact: <a href="mailto:info@lv8.gr">info@lv8.gr</a>. For any privacy request (access, correction, erasure, portability, objection), email us and we reply within 30 days.</p>

      <h2 style={S.h2}>2. What we collect — and what we don&apos;t</h2>
      <ul>
        <li style={S.li}><b>License validation:</b> when you activate the app, your license key is sent to our server to verify its signature. Keys are random strings — they contain no name, email, or personal data.</li>
        <li style={S.li}><b>Payments:</b> handled entirely by Stripe. We never see or store your card number. Stripe shares with us only the purchase status, plan, and (if you provide it) country — used to issue your license and show truthful &quot;recent purchase&quot; notices.</li>
        <li style={S.li}><b>No accounts, no tracking:</b> this site has no user accounts, no advertising cookies, no analytics, no fingerprinting. We do not sell data to anyone.</li>
      </ul>

      <h2 style={S.h2}>3. Cookies &amp; similar storage</h2>
      <table style={S.table}>
        <thead><tr><th style={S.th}>Name</th><th style={S.th}>Purpose</th><th style={S.th}>Legal basis</th><th style={S.th}>Expiry</th></tr></thead>
        <tbody>
          <tr><td style={S.td}><code>sc-consent</code> (localStorage)</td><td style={S.td}>Remembers your cookie choice</td><td style={S.td}>Legal obligation (GDPR consent record)</td><td style={S.td}>12 months</td></tr>
          <tr><td style={S.td}>Google Fonts (only if you accept)</td><td style={S.td}>Loads display fonts from Google&apos;s CDN (transfers your IP to Google)</td><td style={S.td}>Consent (Art. 6(1)(a))</td><td style={S.td}>Session</td></tr>
          <tr><td style={S.td}>Stripe checkout cookies</td><td style={S.td}>Set by stripe.com during payment only</td><td style={S.td}>Contract (Art. 6(1)(b))</td><td style={S.td}>Per Stripe&apos;s policy</td></tr>
        </tbody>
      </table>
      <p style={S.p}>Non-essential loading (Google Fonts) is blocked until you consent. You can change or withdraw consent anytime via the &quot;Cookie settings&quot; link in the footer — withdrawal takes effect immediately for future visits.</p>

      <h2 style={S.h2}>4. Legal bases (GDPR)</h2>
      <ul>
        <li style={S.li}><b>Contract</b> — issuing and validating the license you bought.</li>
        <li style={S.li}><b>Consent</b> — optional enhanced fonts; withdraw anytime.</li>
        <li style={S.li}><b>Legal obligation</b> — keeping a record of your consent choice; invoicing records via Stripe.</li>
      </ul>

      <h2 style={S.h2}>5. Retention</h2>
      <p style={S.p}>License validation requests are not logged with personal data. Consent records are kept 12 months. Payment records live with Stripe under their retention schedule.</p>

      <h2 style={S.h2}>6. Your rights</h2>
      <p style={S.p}>Access, rectification, erasure, restriction, portability, and objection (GDPR Articles 15–21), plus the right to lodge a complaint with your national data protection authority. Since we hold almost nothing about you, most requests resolve as confirmation that we hold nothing. Contact: <a href="mailto:info@lv8.gr">info@lv8.gr</a>.</p>

      <h2 style={S.h2}>7. Minors</h2>
      <p style={S.p}>SwitchClaude is not directed at children under 16.</p>

      <p style={{ ...S.p, marginTop: 32 }}><a href="/">← Back to SwitchClaude</a></p>
    </div>
  );
}
