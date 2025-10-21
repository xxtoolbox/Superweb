
// Shared game logic for Name the One
(function(){
  const sanitize = (s) => (s || "").toString().replace(/[\s\W_]+/g, "").toUpperCase();
  const $ = (sel) => document.querySelector(sel);

  function initLevel(){
    try { console.log('[game] initLevel'); } catch(e) {}

    try { console.log('[game] initLevel'); } catch(e) {}
    const body = document.body;
    const answerRaw = body.getAttribute("data-answer") || "";
    const answer = sanitize(answerRaw);
    const nextUrl = body.getAttribute("data-next") || "";
    const levelKey = body.getAttribute("data-level") || location.pathname.split("/").pop() || "level";
    const hintText = body.getAttribute("data-hint") || "Think carefully 😉";
    const maxLives = 3;

    const input = $("#guessInput");
    const btn = $("#checkBtn");
    const status = $("#status");
    const livesEl = $("#lives");
    const hintBtn = $("#hintBtn");
    \1

    // Helper functions exposed globally as a fallback (for hosts that block listeners)
    function doHint(){
      if (!hintEl) return;
      hintEl.textContent = hintText;
      hintEl.style.opacity = "1";
    }
    function doCheck(){
      if (!input || !status) return;
      var val = sanitize(input.value);
      if (!val){
        var form = document.querySelector('.card');
        if (form){ form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake'); }
        status.style.color = "var(--danger)";
        status.textContent = "Please type something first.";
        return;
      }
      if (val === answer){
        status.style.color = "var(--success)";
        status.textContent = "✅ Correct! Moving on... ";
        var resolved = nextUrl ? new URL(nextUrl, location.href).href : new URL("success.html?v=3", location.href).href;
        try { localStorage.setItem("progress_last", resolved); } catch(e) {}
        try { localStorage.removeItem(storageLivesKey); } catch(e) {}
        // Add visible continue link
        var a = document.createElement('a'); a.href = resolved; a.textContent = "Continue →";
        a.className = "primary"; a.style.marginLeft = "8px"; a.style.padding = "6px 10px"; a.style.borderRadius = "8px"; a.style.textDecoration = "none";
        status.appendChild(a);
        try { location.assign(resolved); } catch(e) {}
        setTimeout(function(){ try { location.href = resolved; } catch(e) {} }, 500);
      } else {
        lives = Math.max(0, lives - 1);
        try { localStorage.setItem(storageLivesKey, String(lives)); } catch(e) {}
        if (livesEl){
          var hearts = "❤️".repeat(lives) + "🖤".repeat(maxLives - lives);
          livesEl.textContent = hearts;
        }
        status.style.color = "var(--danger)";
        status.textContent = lives > 0 ? "❌ Nope, try again! (" + lives + " " + (lives===1?"life":"lives") + " left)" : "😅 Out of lives for now. Refresh to try again!";
        var form2 = document.querySelector('.card');
        if (form2){ form2.classList.remove('shake'); void form2.offsetWidth; form2.classList.add('shake'); }
      }
    }
    // Export to window so HTML onclick can call them
    try { window.showHint = doHint; window.checkAnswer = doCheck; } catch(e) {}


    // Accessibility: associate label
    const inputLabel = $("#guessLabel");
    if (inputLabel && input) input.setAttribute("aria-labelledby", "guessLabel");

    // Init lives from storage
    const storageLivesKey = levelKey + "_lives";
    let lives; try { lives = Number(localStorage.getItem(storageLivesKey) || maxLives); } catch(e) { lives = maxLives; }
    const updateLives = () => {
      if (!livesEl) return;
      const hearts = "❤️".repeat(lives) + "🖤".repeat(maxLives - lives);
      livesEl.textContent = hearts;
    };
    updateLives();

    // Enter key submits
    if (input) { try { console.log('[game] bind enter'); } catch(e) {} input.addEventListener("keydown", function(e){
      if (e.key === "Enter") {
        e.preventDefault();
        doCheck();
      }
    }); }

    // Hint
    if (hintBtn) { try { console.log('[game] bind hint'); } catch(e) {} hintBtn.addEventListener('click', doHint); }

    // Check logic
    if (btn) { try { console.log('[game] bind check'); } catch(e) {} btn.addEventListener('click', doCheck); /* legacy inline fallback below */
function __legacyClick(){ doCheck(); }

      const val = sanitize(input.value);
      if (!val) {
        // little shake
        const form = $(".card");
        if (form) {
          form.classList.remove("shake");
          void form.offsetWidth; // reflow
          form.classList.add("shake");
        }
        status.style.color = "var(--danger)";
        status.textContent = "Please type something first.";
        return;
      }
      if (val === answer) {
        // Resolve nextUrl relative to current page
        const resolved = nextUrl ? new URL(nextUrl, location.href).href : new URL("success.html?v=2", location.href).href;

        status.style.color = "var(--success)";
        status.textContent = "✅ Correct! Moving on...";
        try { localStorage.setItem("progress_last", resolved); } catch(e) {}
        try { localStorage.removeItem(storageLivesKey); } catch(e) {}
        // Show an explicit continue link (fallback for hosts that delay redirects)
        if (status) {
          const a = document.createElement("a");
          a.href = resolved;
          a.textContent = "Continue →";
          a.style.marginLeft = "8px";
          a.className = "primary";
          a.style.padding = "6px 10px";
          a.style.borderRadius = "8px";
          a.style.textDecoration = "none";
          a.style.display = "inline-block";
          status.appendChild(a);
        }
        // Try immediate navigation
        try { location.assign(resolved); } catch(e) {}
        // And try again shortly as a safety net
        setTimeout(() => { try { location.href = resolved; } catch(e) {} }, 600);

      } else {
        lives = Math.max(0, lives - 1);
        try { localStorage.setItem(storageLivesKey, String(lives)); } catch(e) {}
        updateLives();
        status.style.color = "var(--danger)";
        status.textContent = lives > 0 ? `❌ Nope, try again! (${lives} ${lives===1?"life":"lives"} left)` : "😅 Out of lives for now. Refresh to try again!";
        const form = $(".card");
        if (form) {
          form.classList.remove("shake");
          void form.offsetWidth;
          form.classList.add("shake");
        }
      }
    }); }

    // Resume progress CTA on each page (except success)
    const resume = $("#resumeBtn");
    if (resume) {
      let last = null; try { last = localStorage.getItem("progress_last"); } catch(e) { last = null; }
      if (last && last !== (location.pathname.split("/").pop())) {
        resume.hidden = false;
        resume.addEventListener("click", ()=>location.href = last);
      }
    }
  }

  // Confetti for success page
  function initConfetti(){
    const canvas = document.getElementById("confetti");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pieces = [];
    const NUM = 140;

    function resize(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    for (let i=0;i<NUM;i++){
      pieces.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height - canvas.height,
        r: 4 + Math.random()*6,
        v: 2 + Math.random()*3,
        a: Math.random()*Math.PI*2,
        s: 0.02 + Math.random()*0.03
      });
    }

    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (const p of pieces){
        p.y += p.v;
        p.a += p.s;
        if (p.y > canvas.height) p.y = -10;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r);
        ctx.restore();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // Superweb diagnostics
  try { window.NameTheOne = { version: '1.1', lastInit: Date.now() }; } catch(e) {}
  if (document.readyState !== "loading") {
    if (document.body.classList.contains("is-success")) { initConfetti(); } else { initLevel(); }
  }
  document.addEventListener("DOMContentLoaded", ()=>{
    if (document.body.classList.contains("is-success")) {
      initConfetti();
    } else {
      initLevel();
    }
  });
})();
