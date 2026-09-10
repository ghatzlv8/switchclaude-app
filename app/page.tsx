import "./globals.css"

export const metadata = { title: "SwitchClaude — Switch Claude accounts in 2 seconds", description: "The WiFi switch for Claude Desktop. Isolated profiles, never lost chats." }

export default function Page(){
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`*{font-feature-settings:"ss01"} body{font-family:'Source Sans 3',system-ui,sans-serif}`}</style>
      <div style={{background:"#fff", color:"#061b31"}}>
        {/* NAV */}
        <header style={{position:"sticky", top:0, backdropFilter:"blur(12px)", background:"rgba(255,255,255,0.8)", borderBottom:"1px solid #e5edf5", zIndex:10}}>
          <div style={{maxWidth:1080, margin:"0 auto", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div style={{display:"flex", alignItems:"center", gap:10, fontWeight:600, letterSpacing:"-0.3px"}}><span style={{width:28, height:28, borderRadius:8, background:"#533afd", color:"#fff", display:"grid", placeItems:"center", fontSize:14}}>⇄</span> SwitchClaude</div>
            <div style={{display:"flex", gap:20, alignItems:"center", fontSize:14}}>
              <a href="#how" style={{color:"#061b31", textDecoration:"none"}}>How it works</a>
              <a href="#pricing" style={{color:"#061b31", textDecoration:"none"}}>Pricing</a>
              <a href="#download" style={{background:"#533afd", color:"#fff", padding:"8px 16px", borderRadius:4, textDecoration:"none", fontWeight:500}}>Download</a>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section style={{maxWidth:1080, margin:"0 auto", padding:"64px 24px 40px", display:"grid", gridTemplateColumns:"1.1fr 0.9fr", gap:32, alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex", alignItems:"center", gap:8, fontSize:12, padding:"4px 10px", borderRadius:20, border:"1px solid #e5edf5", background:"#f6f9fc"}}><span style={{width:6, height:6, borderRadius:999, background:"#15be53"}}/> Works with Google login • macOS • Windows • Linux</div>
            <h1 style={{marginTop:16, fontSize:56, fontWeight:300, lineHeight:1.03, letterSpacing:"-1.4px", color:"#061b31", fontFeatureSettings:'"ss01"'}}>Switch Claude<br/>accounts in<br/>2 seconds.</h1>
            <p style={{marginTop:16, fontSize:18, fontWeight:300, lineHeight:1.4, color:"#64748d"}}>The WiFi switch for Claude Desktop. Isolated profiles — chats never lost, Google OAuth supported.</p>
            <div style={{marginTop:24, display:"flex", gap:12}}>
              <a href="#pricing" style={{background:"#533afd", color:"#fff", padding:"10px 18px", borderRadius:4, textDecoration:"none", fontWeight:500, boxShadow:"rgba(50,50,93,0.25) 0px 13px 27px -5px, rgba(0,0,0,0.1) 0px 8px 16px -8px"}}>Get SwitchClaude — $9.99</a>
              <a href="#how" style={{border:"1px solid #b9b9f9", color:"#533afd", padding:"10px 18px", borderRadius:4, textDecoration:"none", fontWeight:500}}>See how it works</a>
            </div>
            <div style={{marginTop:12, fontSize:12, color:"#64748d"}}>One-time payment • $9.99 per extra account • No subscription • 7-day trial</div>
          </div>
          <div style={{background:"#fff", border:"1px solid #e5edf5", borderRadius:8, padding:16, boxShadow:"rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12, fontWeight:600}}><span>Claude Switcher</span><span style={{background:"rgba(21,190,83,0.15)", color:"#108c3d", border:"1px solid rgba(21,190,83,0.3)", padding:"2px 8px", borderRadius:4, fontSize:10}}>● Active</span></div>
            <div style={{marginTop:16, display:"flex", flexDirection:"column", gap:10}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", borderRadius:6, background:"#061b31", color:"#fff"}}><span style={{fontWeight:500}}>● work@company.com</span><span style={{fontSize:11, opacity:0.7}}>Active</span></div>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", borderRadius:6, border:"1px solid #e5edf5", background:"#fff"}}><span>personal@gmail.com</span><span style={{background:"#533afd", color:"#fff", padding:"6px 12px", borderRadius:4, fontSize:12}}>Switch →</span></div>
            </div>
            <div style={{marginTop:12, fontSize:11, color:"#64748d"}}>Isolated profiles • Chats never lost</div>
          </div>
        </section>

        {/* HOW */}
        <section id="how" style={{maxWidth:1080, margin:"0 auto", padding:"40px 24px", borderTop:"1px solid #e5edf5"}}>
          <h2 style={{fontSize:32, fontWeight:300, letterSpacing:"-0.64px"}}>How it works</h2>
          <div style={{marginTop:24, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16}}>
            {[
              ["01 — Add account","Click + → Claude opens empty → you log in once (Email or Google). We save an isolated profile — chats never lost."],
              ["02 — Switch in 2 sec","Click Switch → Claude restarts with the other profile. No chat loss, ever."],
              ["03 — Stay organized","Each account keeps its own chats and projects. Optional: Move profiles to external disk (1 click)."]
            ].map(([t,d])=>(
              <div key={t} style={{border:"1px solid #e5edf5", borderRadius:6, padding:20, background:"#fff"}}>
                <div style={{fontWeight:600, color:"#061b31"}}>{t}</div>
                <div style={{marginTop:8, fontSize:14, color:"#64748d", lineHeight:1.4}}>{d}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" style={{maxWidth:1080, margin:"0 auto", padding:"40px 24px", borderTop:"1px solid #e5edf5"}}>
          <h2 style={{fontSize:32, fontWeight:300, letterSpacing:"-0.64px"}}>Pricing — one-time</h2>
          <p style={{color:"#64748d", fontSize:14}}>Pay once per extra account you want to add. First account is free (trial).</p>
          <div style={{marginTop:24, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16}}>
            <div style={{border:"1px solid #e5edf5", borderRadius:6, padding:24}}>
              <div style={{fontWeight:600}}>Starter</div><div style={{fontSize:32, fontWeight:300, marginTop:8}}>$0</div><div style={{fontSize:13, color:"#64748d"}}>1 account • 7-day trial</div>
              <a href="#download" style={{display:"block", marginTop:16, textAlign:"center", padding:"10px 0", borderRadius:4, border:"1px solid #e5edf5", textDecoration:"none", color:"#061b31", fontWeight:500}}>Download free</a>
            </div>
            <div style={{border:"2px solid #061b31", borderRadius:6, padding:24, background:"#061b31", color:"#fff", boxShadow:"rgba(50,50,93,0.25) 0px 30px 45px -30px"}}>
              <div style={{fontWeight:600}}>Pro — Most popular</div><div style={{fontSize:32, fontWeight:300, marginTop:8}}>$9.99 <span style={{fontSize:13, opacity:0.7}}>/ extra account</span></div><div style={{fontSize:13, opacity:0.7}}>2 accounts total • One-time • Lifetime updates</div>
              <a href="/api/checkout?accounts=1" style={{display:"block", marginTop:16, textAlign:"center", padding:"10px 0", borderRadius:4, background:"#533afd", color:"#fff", textDecoration:"none", fontWeight:500}}>Buy 1 extra — $9.99</a>
              <div style={{marginTop:8, fontSize:11, opacity:0.6}}>Need 3 accounts? 2 × $9.99 = $19.98</div>
            </div>
            <div style={{border:"1px solid #e5edf5", borderRadius:6, padding:24}}>
              <div style={{fontWeight:600}}>Team</div><div style={{fontSize:32, fontWeight:300, marginTop:8}}>$29</div><div style={{fontSize:13, color:"#64748d"}}>Up to 5 accounts • One-time</div>
              <a href="/api/checkout?accounts=4" style={{display:"block", marginTop:16, textAlign:"center", padding:"10px 0", borderRadius:4, background:"#061b31", color:"#fff", textDecoration:"none", fontWeight:500}}>Buy Team — $29</a>
            </div>
          </div>
        </section>

        {/* DOWNLOAD */}
        <section id="download" style={{maxWidth:1080, margin:"0 auto", padding:"40px 24px", borderTop:"1px solid #e5edf5"}}>
          <h2 style={{fontSize:26, fontWeight:300}}>Download — macOS • Windows • Linux</h2>
          <div style={{marginTop:16, display:"flex", gap:12, flexWrap:"wrap"}}>
            <a href="/api/download?platform=mac" style={{background:"#533afd", color:"#fff", padding:"10px 18px", borderRadius:4, textDecoration:"none", fontWeight:500}}>Download for macOS (.dmg)</a>
            <a href="/api/download?platform=win" style={{background:"#061b31", color:"#fff", padding:"10px 18px", borderRadius:4, textDecoration:"none", fontWeight:500}}>Download for Windows (.exe)</a>
            <a href="/api/download?platform=linux" style={{border:"1px solid #b9b9f9", color:"#533afd", padding:"10px 18px", borderRadius:4, textDecoration:"none", fontWeight:500}}>Download for Linux (.AppImage)</a>
          </div>
          <div style={{marginTop:16, background:"#f6f9fc", border:"1px solid #e5edf5", borderRadius:6, padding:16}}>
            <div style={{fontWeight:600, fontSize:14}}>How licensing works</div>
            <div style={{marginTop:8, fontSize:13, color:"#64748d", lineHeight:1.5}}>
              1. Buy once — $9.99 per extra account (Stripe Checkout, one-time, no subscription).<br/>
              2. You get a license key <code style={{fontFamily:"Source Code Pro", background:"#fff", padding:"2px 6px", borderRadius:4, border:"1px solid #e5edf5"}}>CLAUDE-SWITCHER-XXXX-XXXX</code> by email.<br/>
              3. Paste the key in the app → <code style={{fontFamily:"Source Code Pro", background:"#fff", padding:"2px 6px", borderRadius:4}}>Settings → License</code> → app calls <code style={{fontFamily:"Source Code Pro", background:"#fff", padding:"2px 6px", borderRadius:4}}>POST /api/validate</code>.<br/>
              4. If valid, the app unlocks + Add Account. The key is saved locally and cached for 7 days for offline use.
            </div>
          </div>
          <div style={{marginTop:8, fontSize:11, color:"#64748d"}}>macOS 12+ • Windows 10+ • Ubuntu 20+ • No Apple Developer needed.</div>
        </section>

        <footer style={{maxWidth:1080, margin:"0 auto", padding:"24px", borderTop:"1px solid #e5edf5", fontSize:11, color:"#64748d"}}>© 2026 SwitchClaude — Not affiliated with Anthropic. • info@lv8.gr</footer>
      </div>
    </>
  )
}
