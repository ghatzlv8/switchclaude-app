import "./globals.css"

export default function Page(){
  const faq = [
    ["How fast is switching, really?", "About 2 seconds. SwitchClaude quits Claude Desktop and relaunches it with the other account's isolated profile."],
    ["Are my chats and projects safe?", "Yes. Each account lives in its own profile directory. Switching never deletes, merges, or touches your data."],
    ["Does it work with Google login?", "Yes. Log in once per profile (email or Google) — the session stays saved in that profile."],
    ["Which platforms are supported?", "macOS 12+, Windows 10+, and Ubuntu 20+ (plus most Linux distros). One codebase, native installers for each."],
    ["Is there a subscription?", "No. You pay once per extra account ($9.99) or $29 for Team (up to 5 accounts). Lifetime updates included."],
    ["What if I get a new computer?", "Licenses are bound to devices (1 + your extra accounts). Email info@lv8.gr and we reset the binding."],
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "SwitchClaude",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: ["macOS", "Windows", "Linux"],
        url: "https://switchclaude.com",
        description: "Menubar switcher for Claude Desktop. Swap between multiple Claude accounts in 2 seconds with isolated profiles.",
        offers: [
          { "@type": "Offer", name: "Starter", price: "0", priceCurrency: "USD" },
          { "@type": "Offer", name: "Pro — per extra account", price: "9.99", priceCurrency: "USD" },
          { "@type": "Offer", name: "Team — up to 5 accounts", price: "29", priceCurrency: "USD" },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map(([q, a]) => ({
          "@type": "Question", name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div id="consent" style={{display:"none", position:"fixed", left:0, right:0, bottom:0, zIndex:60, background:"#061b31", color:"#fff", padding:"16px 24px"}}>
        <div style={{maxWidth:1080, margin:"0 auto", display:"flex", gap:16, alignItems:"center", justifyContent:"space-between", flexWrap:"wrap"}}>
          <div style={{fontSize:13, maxWidth:640}}>We use only strictly-necessary storage plus optional Google Fonts. No tracking, no ads. <a href="/privacy" style={{color:"#b9b9f9"}}>Privacy policy</a></div>
          <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
            <button id="c-reject" style={{background:"transparent", border:"1px solid #b9b9f9", color:"#fff", padding:"8px 14px", borderRadius:4, cursor:"pointer"}}>Reject</button>
            <button id="c-custom" style={{background:"transparent", border:"1px solid #e5edf5", color:"#fff", padding:"8px 14px", borderRadius:4, cursor:"pointer"}}>Customize</button>
            <button id="c-accept" style={{background:"#533afd", border:0, color:"#fff", padding:"8px 14px", borderRadius:4, cursor:"pointer", fontWeight:600}}>Accept all</button>
          </div>
        </div>
        <div id="c-detail" style={{display:"none", maxWidth:1080, margin:"12px auto 0", fontSize:13, background:"rgba(255,255,255,0.06)", borderRadius:6, padding:12}}>
          <label style={{display:"block", marginBottom:8}}><input type="checkbox" checked disabled /> Strictly necessary (consent record) — always on</label>
          <label style={{display:"block"}}><input type="checkbox" id="c-fonts" /> Enhanced fonts (loads from Google CDN — sends your IP to Google)</label>
          <div style={{marginTop:10}}><button id="c-save" style={{background:"#533afd", border:0, color:"#fff", padding:"8px 14px", borderRadius:4, cursor:"pointer", fontWeight:600}}>Save choice</button></div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{__html: `(function(){
        var KEY='sc-consent';
        var mem=null; // in-memory fallback if localStorage is blocked
        function read(){ if(mem) return mem; try{ var v=localStorage.getItem(KEY); return v?JSON.parse(v):null; }catch(e){ return null; } }
        function loadFonts(){
          if(document.getElementById('sc-fonts')) return;
          var l=document.createElement('link');
          l.id='sc-fonts'; l.rel='stylesheet';
          l.href='https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600&family=Source+Code+Pro:wght@400;500&display=swap';
          document.head.appendChild(l);
        }
        function apply(c){ if(c && c.fonts) loadFonts(); }
        function show(){ var b=document.getElementById('consent'); if(b) b.style.display='block'; var f=document.getElementById('cookie-fab'); if(f) f.style.display='none'; }
        function hide(){ var b=document.getElementById('consent'); if(b) b.style.display='none'; var f=document.getElementById('cookie-fab'); if(f) f.style.display='block'; }
        function save(fonts){
          mem={necessary:true, fonts:!!fonts, ts:Date.now()};
          try{ localStorage.setItem(KEY, JSON.stringify(mem)); }catch(e){}
          apply(mem); hide();
          var b=document.getElementById('c-accept'); if(b && fonts){ b.textContent='Saved ✓'; }
        }
        function wire(id, fn){ var el=document.getElementById(id); if(el) el.onclick=fn; }
        // Delegated clicks survive React hydration node replacement.
        document.addEventListener('click', function(e){
          var t=e.target && e.target.closest ? e.target.closest('#c-accept,#c-reject,#c-custom,#c-save,#c-open,#cookie-fab') : null;
          if(!t) return;
          if(t.id==='c-accept'){ save(true); }
          else if(t.id==='c-reject'){ save(false); }
          else if(t.id==='c-custom'){
            var d=document.getElementById('c-detail'); if(!d) return;
            d.style.display=(d.style.display==='none'||!d.style.display)?'block':'none';
          }
          else if(t.id==='c-save'){ var c=document.getElementById('c-fonts'); save(c && c.checked); }
          else if(t.id==='c-open'){ e.preventDefault(); try{localStorage.removeItem(KEY);}catch(x){} show(); }
          else if(t.id==='cookie-fab'){ try{localStorage.removeItem(KEY);}catch(x){} show(); }
        });
        function boot(){
          var cur=read();
          if(cur){ apply(cur); hide(); } else { show(); }
          setTimeout(function(){ if(!read()) show(); }, 800);
          setTimeout(function(){ if(!read()) show(); }, 2500);
        }
        wire('c-accept', function(){ save(true); });
        wire('c-reject', function(){ save(false); });
        wire('c-custom', function(){
          var d=document.getElementById('c-detail'); if(!d) return;
          d.style.display = (d.style.display==='none' || !d.style.display) ? 'block' : 'none';
        });
        wire('c-save', function(){ var c=document.getElementById('c-fonts'); save(c && c.checked); });
        wire('c-open', function(e){ if(e) e.preventDefault(); try{localStorage.removeItem(KEY);}catch(x){} show(); });
        wire('cookie-fab', function(){ try{localStorage.removeItem(KEY);}catch(x){} show(); });
        window.scCookies=function(){ try{localStorage.removeItem(KEY);}catch(e){} show(); };
        if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded', boot); }
        else { boot(); }
      })();`}} />
      {/* Fonts load only after consent (see consent script) — system stack before that. */}
      <style>{`* { font-feature-settings: "ss01"; }
        body { font-family: 'Source Sans 3', system-ui, sans-serif; margin: 0; }
        .hero-grid { max-width: 1080px; margin: 0 auto; padding: 64px 24px 40px; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 32px; align-items: center; }
        .hero-h1 { margin-top: 16px; font-size: clamp(36px, 8vw, 56px); font-weight: 300; line-height: 1.05; letter-spacing: -0.04em; color: #061b31; }
        .sec-h2 { font-size: clamp(24px, 5.5vw, 32px); font-weight: 300; letter-spacing: -0.02em; }
        .cards-grid { margin-top: 24px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .cta-row { margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap; }
        .cta-row a { flex: 1 1 auto; text-align: center; white-space: nowrap; }
        .dl-row { margin-top: 16px; display: flex; gap: 12px; flex-wrap: wrap; }
        .dl-row a { flex: 1 1 200px; text-align: center; }
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr; padding: 40px 20px 28px; gap: 24px; }
          .cards-grid { grid-template-columns: 1fr; }
          section[id] { padding-left: 20px !important; padding-right: 20px !important; }
        }
        @media (max-width: 640px) {
          .nav-links a.nav-hide-mobile { display: none; }
        }`}</style>
      <div style={{background:"#fff", color:"#061b31"}}>
        {/* NAV */}
        <header style={{position:"sticky", top:0, backdropFilter:"blur(12px)", background:"rgba(255,255,255,0.8)", borderBottom:"1px solid #e5edf5", zIndex:10}}>
          <div style={{maxWidth:1080, margin:"0 auto", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div style={{display:"flex", alignItems:"center", gap:10, fontWeight:600, letterSpacing:"-0.3px"}}><span style={{width:28, height:28, borderRadius:8, background:"#533afd", color:"#fff", display:"grid", placeItems:"center", fontSize:14}}>⇄</span> SwitchClaude</div>
            <div className="nav-links" style={{display:"flex", gap:20, alignItems:"center", fontSize:14}}>
              <a href="#how" className="nav-hide-mobile" style={{color:"#061b31", textDecoration:"none"}}>How it works</a>
              <a href="#pricing" className="nav-hide-mobile" style={{color:"#061b31", textDecoration:"none"}}>Pricing</a>
              <a href="#download" style={{background:"#533afd", color:"#fff", padding:"8px 16px", borderRadius:4, textDecoration:"none", fontWeight:500}}>Download</a>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="hero-grid">
          <div>
            <div style={{display:"inline-flex", alignItems:"center", gap:8, fontSize:12, padding:"4px 10px", borderRadius:20, border:"1px solid #e5edf5", background:"#f6f9fc", maxWidth:"100%"}}><span style={{width:6, height:6, borderRadius:999, background:"#15be53", flexShrink:0}}/> Works with Google login • macOS • Windows • Linux</div>
            <h1 className="hero-h1">Switch Claude<br/>accounts in<br/>2 seconds.</h1>
            <p style={{marginTop:16, fontSize:18, fontWeight:300, lineHeight:1.4, color:"#64748d"}}>The WiFi switch for Claude Desktop. Isolated profiles — chats never lost, Google OAuth supported.</p>
            <div className="cta-row">
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
          <h2 className="sec-h2">How it works</h2>
          <div style={{marginTop:16, borderRadius:8, overflow:"hidden", border:"1px solid #e5edf5", boxShadow:"rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px"}}>
            <video controls preload="metadata" poster="/explainer-poster.png" style={{width:"100%", display:"block", aspectRatio:"16/9", background:"#0A0A14"}}>
              <source src="/explainer.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="cards-grid">
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
          <h2 className="sec-h2">Pricing — one-time</h2>
          <p style={{color:"#64748d", fontSize:14}}>Pay once per extra account you want to add. First account is free (trial).</p>
          <div className="cards-grid">
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

        {/* FAQ */}
        <section id="faq" style={{maxWidth:1080, margin:"0 auto", padding:"40px 24px", borderTop:"1px solid #e5edf5"}}>
          <h2 className="sec-h2">Frequently asked questions</h2>
          <div className="cards-grid">
            {faq.map(([q,a])=>(
              <div key={q} style={{border:"1px solid #e5edf5", borderRadius:6, padding:20, background:"#fff"}}>
                <div style={{fontWeight:600, color:"#061b31", fontSize:15}}>{q}</div>
                <div style={{marginTop:8, fontSize:14, color:"#64748d", lineHeight:1.5}}>{a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* DOWNLOAD */}
        <section id="download" style={{maxWidth:1080, margin:"0 auto", padding:"40px 24px", borderTop:"1px solid #e5edf5"}}>
          <h2 className="sec-h2">Download — macOS • Windows • Linux</h2>
          <div className="dl-row">
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

        <footer style={{maxWidth:1080, margin:"0 auto", padding:"24px", borderTop:"1px solid #e5edf5", fontSize:11, color:"#64748d"}}>© 2026 SwitchClaude — Not affiliated with Anthropic. • info@lv8.gr • <a href="/privacy" style={{color:"#64748d"}}>Privacy</a> • <a href="#" id="c-open" style={{color:"#64748d"}}>Cookie settings</a></footer>
      </div>
      <div id="proof" style={{display:"none", position:"fixed", left:16, bottom:16, zIndex:50, background:"#fff", border:"1px solid #e5edf5", borderRadius:8, padding:"12px 14px", maxWidth:280, boxShadow:"rgba(50,50,93,0.25) 0px 13px 27px -5px, rgba(0,0,0,0.1) 0px 8px 16px -8px", fontSize:13}}></div>
      <button id="cookie-fab" title="Cookie settings" style={{display:"none", position:"fixed", left:16, bottom:16, zIndex:55, width:40, height:40, borderRadius:"50%", border:"1px solid #e5edf5", background:"#fff", cursor:"pointer", fontSize:18}}>🍪</button>
      <script dangerouslySetInnerHTML={{__html: `(function(){
        var box=document.getElementById('proof'); if(!box) return;
        fetch('/api/social').then(function(r){return r.json()}).then(function(j){
          if(!j.sales || !j.sales.length) return; // no sales yet → stay hidden
          var i=0;
          function show(){
            var s=j.sales[i%j.sales.length];
            var where=s.country?(' from '+s.country):'';
            box.innerHTML='<div style="display:flex;gap:10px;align-items:center"><span style="width:32px;height:32px;border-radius:50%;background:#533afd;color:#fff;display:grid;place-items:center;font-weight:600">✓</span><div><b>Someone'+where+'</b> just got <b>SwitchClaude '+s.plan+'</b><div style="font-size:11px;color:#64748d">'+s.age+' • verified purchase</div></div></div>';
            box.style.display='block';
            setTimeout(function(){ box.style.display='none'; }, 5000);
            i++;
            setTimeout(show, 12000);
          }
          setTimeout(show, 4000);
        }).catch(function(){});
      })();`}} />
    </>
  )
}
