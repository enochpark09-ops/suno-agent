import { useState, useEffect, useRef } from "react";

// ── 색상 팔레트 (음악 스튜디오 테마) ─────────────────────────────
const C = {
  bg:       "#0d0b14",
  surface:  "#13101f",
  surface2: "#1a1628",
  border:   "#2a2040",
  purple:   "#9b6dff",
  purpleDim:"#9b6dff22",
  purpleMid:"#9b6dff55",
  pink:     "#ff6db3",
  pinkDim:  "#ff6db322",
  cyan:     "#00e5cc",
  cyanDim:  "#00e5cc22",
  gold:     "#ffd166",
  goldDim:  "#ffd16622",
  green:    "#06d6a0",
  greenDim: "#06d6a022",
  red:      "#ff4d6a",
  redDim:   "#ff4d6a22",
  text:     "#f0eaff",
  muted:    "#8878aa",
  dim:      "#4a3d66",
};

// ── Claude API ────────────────────────────────────────────────
const SONNET = "claude-sonnet-4-5-20250929";
const HAIKU  = "claude-haiku-4-5-20251001";

const getHeaders = () => {
  const k = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!k) throw new Error("API_KEY_MISSING");
  return {
    "Content-Type": "application/json",
    "x-api-key": k,
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true",
  };
};

const callClaude = async (messages, system, max_tokens = 2000, model = SONNET) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ model, max_tokens, system, messages }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || "";
};

// ── localStorage ──────────────────────────────────────────────
const ls = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ── 아이콘 ────────────────────────────────────────────────────
const Ic = ({ n, s = 16 }) => {
  const d = {
    music:  <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
    mic:    <><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>,
    dollar: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    list:   <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    copy:   <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    check:  <polyline points="20 6 9 17 4 12"/>,
    spin:   <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>,
    plus:   <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash:  <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></>,
    star:   <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    link:   <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    play:   <><polygon points="5 3 19 12 5 21 5 3"/></>,
    zap:    <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{d[n]}</svg>;
};

const Tab = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} style={{
    flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: 3, padding: "10px 0 8px",
    background: "transparent", border: "none",
    color: active ? C.purple : C.dim,
    cursor: "pointer", fontSize: 9, fontFamily: "inherit",
    fontWeight: active ? 700 : 400,
    borderTop: `2px solid ${active ? C.purple : "transparent"}`,
    transition: "all .2s",
  }}>
    {icon}{label}
  </button>
);

// ══════════════════════════════════════════════════════════════
// 탭 1: 작곡 생성기
// ══════════════════════════════════════════════════════════════
const ComposerTab = () => {
  const [form, setForm] = useState({
    genre: "", mood: "", theme: "", tempo: "미디엄", lang: "한국어", instruments: "", extra: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState("");
  const [savedTracks, setSavedTracks] = useState(() => ls.get("suno_tracks", []));

  const GENRES = ["K-POP","팝","R&B","힙합","EDM","발라드","록","재즈","트로트","시티팝","뉴에이지","OST"];
  const MOODS  = ["밝고 경쾌한","감성적인","신나는","차분한","웅장한","몽환적인","슬픈","설레는","강렬한","평화로운"];
  const TEMPOS = ["느린 (Slow)","미디엄 (Medium)","빠른 (Fast)","매우 빠른 (Very Fast)"];
  const LANGS  = ["한국어","영어","한영 혼합","일본어","무가사 (Instrumental)"];

  const SYSTEM = `당신은 Suno AI 음악 생성 전문가입니다.
사용자의 입력을 받아 Suno에서 바로 사용할 수 있는 최적화된 프롬프트와 가사를 생성합니다.

Suno 프롬프트 작성 규칙:
- 장르, 분위기, 악기, 템포를 영어로 간결하게 기술
- 쉼표로 구분된 태그 형식 사용
- 예: "K-pop, upbeat, emotional, piano, synth, 120bpm, female vocal"

가사 작성 규칙:
- [Verse], [Chorus], [Bridge], [Outro] 구조 사용
- Suno가 인식하는 섹션 태그 활용
- 감정과 스토리가 있는 가사
- 요청 언어로 작성

JSON으로만 응답:
{"prompt":"Suno 태그 프롬프트","style":"음악 스타일 설명","lyrics":"가사 전체","title":"제안 제목","tips":"Suno 사용 팁 2-3줄"}`;

  const generate = async () => {
    if (!form.genre && !form.mood && !form.theme) return;
    setLoading(true); setResult(null);
    const prompt = `장르: ${form.genre || "자유"}
분위기: ${form.mood || "자유"}
주제/테마: ${form.theme || "자유"}
템포: ${form.tempo}
언어: ${form.lang}
악기: ${form.instruments || "자유"}
추가 요청: ${form.extra || "없음"}

위 조건으로 Suno AI용 프롬프트와 가사를 생성해주세요.`;

    try {
      const r = await callClaude([{ role:"user", content:prompt }], SYSTEM, 2000);
      const clean = r.replace(/```json|```/g, "").trim();
      const start = clean.indexOf("{"); const end = clean.lastIndexOf("}");
      const parsed = JSON.parse(clean.slice(start, end+1));
      setResult(parsed);
    } catch(e) {
      setResult({ error: e.message });
    }
    setLoading(false);
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const saveTrack = () => {
    if (!result?.title) return;
    const track = {
      id: Date.now(),
      title: result.title,
      genre: form.genre,
      mood: form.mood,
      prompt: result.prompt,
      createdAt: new Date().toLocaleDateString("ko-KR"),
      platforms: { suno: false, distrokid: false, youtube: false, spotify: false },
      revenue: "",
    };
    const updated = [track, ...savedTracks];
    setSavedTracks(updated);
    ls.set("suno_tracks", updated);
    alert(`"${result.title}" 트랙이 저장됐어요!`);
  };

  const CopyBtn = ({ text, id, label }) => (
    <button onClick={() => copy(text, id)} style={{
      background: copied===id ? C.purpleDim : "transparent",
      border: `1px solid ${copied===id ? C.purple : C.border}`,
      borderRadius: 6, padding: "5px 10px",
      color: copied===id ? C.purple : C.muted,
      cursor: "pointer", fontSize: 11, fontFamily: "inherit",
      display: "flex", alignItems: "center", gap: 4,
    }}>
      {copied===id ? <><Ic n="check" s={11}/>복사됨</> : <><Ic n="copy" s={11}/>{label}</>}
    </button>
  );

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
      <div style={{ flex:1, overflowY:"auto", padding:14 }}>

        {/* 장르 선택 */}
        <div style={{ background:C.surface, borderRadius:12, padding:14, marginBottom:12, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:10, color:C.purple, fontWeight:700, letterSpacing:1.2, marginBottom:10 }}>🎵 장르</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {GENRES.map(g => (
              <button key={g} onClick={() => setForm({...form, genre:g})} style={{
                padding:"5px 11px", background:form.genre===g?C.purpleDim:"transparent",
                border:`1px solid ${form.genre===g?C.purple:C.border}`, borderRadius:20,
                color:form.genre===g?C.purple:C.muted, fontSize:12, cursor:"pointer", fontFamily:"inherit",
              }}>{g}</button>
            ))}
          </div>
        </div>

        {/* 분위기 선택 */}
        <div style={{ background:C.surface, borderRadius:12, padding:14, marginBottom:12, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:10, color:C.pink, fontWeight:700, letterSpacing:1.2, marginBottom:10 }}>✨ 분위기</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {MOODS.map(m => (
              <button key={m} onClick={() => setForm({...form, mood:m})} style={{
                padding:"5px 11px", background:form.mood===m?C.pinkDim:"transparent",
                border:`1px solid ${form.mood===m?C.pink:C.border}`, borderRadius:20,
                color:form.mood===m?C.pink:C.muted, fontSize:12, cursor:"pointer", fontFamily:"inherit",
              }}>{m}</button>
            ))}
          </div>
        </div>

        {/* 주제 + 템포 + 언어 */}
        <div style={{ background:C.surface, borderRadius:12, padding:14, marginBottom:12, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:10, color:C.cyan, fontWeight:700, letterSpacing:1.2, marginBottom:10 }}>🎤 상세 설정</div>

          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:5 }}>주제 / 가사 테마</div>
            <input value={form.theme} onChange={e=>setForm({...form,theme:e.target.value})}
              placeholder="예: 이별 후 새로운 시작, 여름 여행, 꿈을 향해"
              style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:"9px 12px", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>

          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:5 }}>템포</div>
            <div style={{ display:"flex", gap:6 }}>
              {TEMPOS.map(t => (
                <button key={t} onClick={() => setForm({...form,tempo:t})} style={{
                  flex:1, padding:"7px 0", background:form.tempo===t?C.cyanDim:"transparent",
                  border:`1px solid ${form.tempo===t?C.cyan:C.border}`, borderRadius:8,
                  color:form.tempo===t?C.cyan:C.muted, fontSize:10, cursor:"pointer", fontFamily:"inherit",
                }}>{t.split(" ")[0]}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:5 }}>언어</div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {LANGS.map(l => (
                <button key={l} onClick={() => setForm({...form,lang:l})} style={{
                  padding:"5px 11px", background:form.lang===l?C.purpleDim:"transparent",
                  border:`1px solid ${form.lang===l?C.purple:C.border}`, borderRadius:20,
                  color:form.lang===l?C.purple:C.muted, fontSize:11, cursor:"pointer", fontFamily:"inherit",
                }}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:4 }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:5 }}>추가 악기 또는 요청 (선택)</div>
            <input value={form.extra} onChange={e=>setForm({...form,extra:e.target.value})}
              placeholder="예: 피아노 강조, 어쿠스틱 기타, 드라마틱한 엔딩"
              style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:"9px 12px", fontSize:13, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
          </div>
        </div>

        {/* 생성 버튼 */}
        <button onClick={generate} disabled={loading || (!form.genre && !form.mood && !form.theme)} style={{
          width:"100%", padding:"14px 0", marginBottom:14,
          background: (!loading && (form.genre||form.mood||form.theme))
            ? "linear-gradient(135deg, #6b3fa0, #9b6dff)"
            : C.border,
          border:"none", borderRadius:12,
          color: (!loading && (form.genre||form.mood||form.theme)) ? "#f0eaff" : C.dim,
          fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"inherit",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        }}>
          {loading
            ? <><div style={{ animation:"spin 1s linear infinite" }}><Ic n="spin" s={16}/></div>Suno 프롬프트 생성 중...</>
            : <><Ic n="zap" s={16}/>Suno 프롬프트 & 가사 생성</>
          }
        </button>

        {/* 결과 */}
        {result && !result.error && (
          <div style={{ marginBottom:20 }}>
            {/* 제목 */}
            <div style={{ background:C.surface, borderRadius:12, padding:16, marginBottom:10, border:`1px solid ${C.purpleMid}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:11, color:C.purple, marginBottom:4 }}>🎵 제안 제목</div>
                  <div style={{ fontSize:18, fontWeight:800, color:C.text }}>{result.title}</div>
                </div>
                <button onClick={saveTrack} style={{
                  background:C.purpleDim, border:`1px solid ${C.purple}`, borderRadius:8,
                  padding:"7px 12px", color:C.purple, cursor:"pointer", fontSize:12, fontFamily:"inherit",
                  display:"flex", alignItems:"center", gap:5,
                }}>
                  <Ic n="star" s={13}/>저장
                </button>
              </div>
            </div>

            {/* Suno 프롬프트 */}
            <div style={{ background:C.surface, borderRadius:12, padding:16, marginBottom:10, border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontSize:11, color:C.cyan, fontWeight:700 }}>🔧 Suno 프롬프트 (복사 후 Suno에 붙여넣기)</div>
                <CopyBtn text={result.prompt} id="prompt" label="복사"/>
              </div>
              <div style={{ background:C.bg, borderRadius:8, padding:"10px 12px", fontSize:13, color:C.purple, fontFamily:"monospace", lineHeight:1.6 }}>
                {result.prompt}
              </div>
              {result.style && (
                <div style={{ marginTop:8, fontSize:11, color:C.muted }}>{result.style}</div>
              )}
            </div>

            {/* 가사 */}
            <div style={{ background:C.surface, borderRadius:12, padding:16, marginBottom:10, border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <div style={{ fontSize:11, color:C.pink, fontWeight:700 }}>📝 생성된 가사</div>
                <CopyBtn text={result.lyrics} id="lyrics" label="가사 복사"/>
              </div>
              <div style={{ fontSize:13, color:C.text, lineHeight:2, whiteSpace:"pre-wrap" }}>{result.lyrics}</div>
            </div>

            {/* Suno 사용 팁 */}
            {result.tips && (
              <div style={{ background:C.cyanDim, borderRadius:10, padding:"11px 14px", border:`1px solid ${C.cyan}44` }}>
                <div style={{ fontSize:10, color:C.cyan, fontWeight:700, marginBottom:5 }}>💡 Suno 사용 팁</div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.7 }}>{result.tips}</div>
              </div>
            )}
          </div>
        )}

        {result?.error && (
          <div style={{ background:C.redDim, borderRadius:10, padding:14, border:`1px solid ${C.red}44` }}>
            <div style={{ fontSize:12, color:C.red }}>❌ {result.error}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 탭 2: 수익화 가이드
// ══════════════════════════════════════════════════════════════
const MonetizeTab = () => {
  const [step, setStep] = useState(0);

  const roadmap = [
    {
      phase: "Phase 1",
      title: "Suno 구독 & 음원 생성",
      icon: "🎵",
      color: C.purple,
      items: [
        { title: "Suno Pro 구독 ($8/월)", desc: "상업적 이용 권리 포함. 월 500곡 생성 가능. suno.com 가입 후 Pro 플랜 선택.", done: false, link: "https://suno.com" },
        { title: "음원 품질 확인", desc: "생성 후 WAV 또는 MP3 다운로드. 가사·멜로디·믹싱 품질 체크. 마음에 드는 것만 선별.", done: false },
        { title: "메타데이터 준비", desc: "곡 제목, 장르, 분위기, 가사(영어 번역 포함) 준비. 커버 아트 제작 (Canva 활용 가능).", done: false },
      ]
    },
    {
      phase: "Phase 2",
      title: "DistroKid 가입 & 배급",
      icon: "🚀",
      color: C.pink,
      items: [
        { title: "DistroKid 가입 ($22.99/년)", desc: "distrokid.com → Musician 플랜 선택. 무제한 업로드, Spotify·Apple Music·유튜브뮤직 등 150+ 플랫폼 동시 배급.", done: false, link: "https://distrokid.com" },
        { title: "아티스트 프로필 설정", desc: "아티스트명 설정 (실명 또는 예명). Spotify for Artists 연동. Apple Music for Artists 연동.", done: false },
        { title: "첫 앨범/싱글 업로드", desc: "음원 파일(WAV 권장) + 커버 아트(3000x3000px) 업로드. 발매일 7~10일 전에 업로드해야 피처링 신청 가능.", done: false },
      ]
    },
    {
      phase: "Phase 3",
      title: "YouTube Content ID 등록",
      icon: "📺",
      color: C.cyan,
      items: [
        { title: "DistroKid YouTube Content ID 활성화", desc: "DistroKid 업로드 시 'YouTube Money' 옵션 체크. 내 음악을 사용하는 모든 유튜브 영상에서 자동 수익 창출.", done: false },
        { title: "유튜브 채널 개설", desc: "음악 전용 유튜브 채널 개설. Lyric Video 또는 Visualizer 영상 업로드. 구독자 1000명, 시청 4000시간 달성 시 유튜브 파트너 신청.", done: false },
        { title: "쇼츠 활용", desc: "30초 미리듣기 쇼츠 업로드. 배경음악으로 쇼츠 바이럴 유도. 다른 크리에이터들이 내 음악 사용 시 Content ID 수익 발생.", done: false },
      ]
    },
    {
      phase: "Phase 4",
      title: "추가 수익 채널",
      icon: "💰",
      color: C.gold,
      items: [
        { title: "음악 라이선싱 (Pond5, AudioJungle)", desc: "Pond5.com, AudioJungle.net에 BGM으로 등록. 영상 제작자들이 구매하는 스톡 뮤직 플랫폼. 곡당 $5~$50 판매.", done: false, link: "https://pond5.com" },
        { title: "스트리밍 수익 최적화", desc: "Spotify 플레이리스트 피처링 신청 (Spotify for Artists). Apple Music 큐레이터 신청. 스트리밍 1회당 약 $0.003~$0.005.", done: false },
        { title: "NFT·독립 판매 (선택)", desc: "Bandcamp.com에서 직접 판매 (수수료 10~15%). 팬들에게 직접 판매로 가장 높은 수익률 확보.", done: false, link: "https://bandcamp.com" },
      ]
    },
  ];

  const [checklist, setChecklist] = useState(() =>
    ls.get("monetize_check", roadmap.map(p => p.items.map(() => false)))
  );

  const toggle = (pi, ii) => {
    const updated = checklist.map((p, pIdx) =>
      pIdx === pi ? p.map((v, iIdx) => iIdx === ii ? !v : v) : p
    );
    setChecklist(updated);
    ls.set("monetize_check", updated);
  };

  const totalItems = roadmap.reduce((s, p) => s + p.items.length, 0);
  const doneItems  = checklist.reduce((s, p) => s + p.filter(Boolean).length, 0);
  const pct = Math.round(doneItems / totalItems * 100);

  return (
    <div style={{ flex:1, overflowY:"auto", padding:14 }}>

      {/* 진행률 */}
      <div style={{ background:C.surface, borderRadius:12, padding:16, marginBottom:14, border:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text }}>수익화 진행률</div>
          <div style={{ fontSize:22, fontWeight:800, color:C.purple }}>{pct}%</div>
        </div>
        <div style={{ height:8, background:C.border, borderRadius:4 }}>
          <div style={{ height:"100%", borderRadius:4, background:`linear-gradient(90deg, ${C.purple}, ${C.pink})`, width:`${pct}%`, transition:"width .6s" }}/>
        </div>
        <div style={{ fontSize:11, color:C.muted, marginTop:6 }}>{doneItems} / {totalItems} 완료</div>
      </div>

      {/* 예상 수익 안내 */}
      <div style={{ background:C.goldDim, borderRadius:12, padding:14, marginBottom:14, border:`1px solid ${C.gold}44` }}>
        <div style={{ fontSize:11, color:C.gold, fontWeight:700, marginBottom:8 }}>💰 예상 월 수익 (음원 30곡 기준)</div>
        {[
          { platform:"Spotify 스트리밍", amount:"$30~$150", note:"월 1만~5만 스트림 기준" },
          { platform:"YouTube Content ID", amount:"$20~$200", note:"영상 조회수에 따라 변동" },
          { platform:"Apple Music", amount:"$10~$50", note:"스트림당 약 $0.01" },
          { platform:"스톡 뮤직 (Pond5 등)", amount:"$50~$500", note:"라이선스 판매 수 따라 변동" },
        ].map((r, i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 0", borderBottom:i<3?`1px solid ${C.gold}22`:"none" }}>
            <div>
              <div style={{ fontSize:12, color:C.text }}>{r.platform}</div>
              <div style={{ fontSize:10, color:C.muted }}>{r.note}</div>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:C.gold }}>{r.amount}</div>
          </div>
        ))}
      </div>

      {/* 단계별 가이드 */}
      {roadmap.map((phase, pi) => (
        <div key={pi} style={{ background:C.surface, borderRadius:14, padding:16, marginBottom:12, border:`1px solid ${C.border}` }}>
          {/* 페이즈 헤더 */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:22 }}>{phase.icon}</span>
            <div>
              <div style={{ fontSize:10, color:phase.color, fontWeight:700, letterSpacing:1 }}>{phase.phase}</div>
              <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{phase.title}</div>
            </div>
            <div style={{ marginLeft:"auto", fontSize:12, color:phase.color, fontWeight:700 }}>
              {checklist[pi].filter(Boolean).length}/{phase.items.length}
            </div>
          </div>

          {/* 체크리스트 항목 */}
          {phase.items.map((item, ii) => (
            <div key={ii} style={{ marginBottom:10, background:C.surface2, borderRadius:10, padding:12, border:`1px solid ${checklist[pi][ii] ? phase.color+"44" : C.border}`, opacity:checklist[pi][ii]?0.75:1 }}>
              <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                <button onClick={() => toggle(pi, ii)} style={{
                  width:22, height:22, borderRadius:5, flexShrink:0, marginTop:1,
                  border:`2px solid ${checklist[pi][ii] ? phase.color : C.border}`,
                  background:checklist[pi][ii] ? phase.color : "transparent",
                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.bg,
                }}>
                  {checklist[pi][ii] && <Ic n="check" s={12}/>}
                </button>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:checklist[pi][ii]?C.muted:C.text, textDecoration:checklist[pi][ii]?"line-through":"none", marginBottom:4 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize:11, color:C.muted, lineHeight:1.65 }}>{item.desc}</div>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex", alignItems:"center", gap:4, marginTop:5, fontSize:11, color:phase.color, textDecoration:"none" }}>
                      <Ic n="link" s={11}/>{item.link}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div style={{ marginBottom:20, background:C.surface, borderRadius:10, padding:12, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:10, color:C.muted, lineHeight:1.7 }}>
          ※ Suno AI로 생성한 음악의 상업적 이용은 Pro 이상 플랜에서만 가능합니다.<br/>
          ※ 수익은 스트리밍 횟수, 지역, 플랫폼에 따라 크게 달라질 수 있습니다.
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 탭 3: 트랙 관리
// ══════════════════════════════════════════════════════════════
const TracksTab = () => {
  const [tracks, setTracks] = useState(() => ls.get("suno_tracks", []));
  const [selected, setSelected] = useState(null);

  const PLATFORMS = [
    { id:"suno",       label:"Suno 생성",    color:C.purple },
    { id:"distrokid",  label:"DistroKid 배급", color:C.pink },
    { id:"youtube",    label:"YouTube 업로드", color:C.red },
    { id:"spotify",    label:"Spotify 등록",  color:C.green },
  ];

  const togglePlatform = (trackId, platform) => {
    const updated = tracks.map(t =>
      t.id === trackId ? { ...t, platforms: { ...t.platforms, [platform]: !t.platforms[platform] } } : t
    );
    setTracks(updated);
    ls.set("suno_tracks", updated);
  };

  const updateRevenue = (trackId, val) => {
    const updated = tracks.map(t => t.id === trackId ? { ...t, revenue: val } : t);
    setTracks(updated);
    ls.set("suno_tracks", updated);
  };

  const deleteTrack = (id) => {
    const updated = tracks.filter(t => t.id !== id);
    setTracks(updated);
    ls.set("suno_tracks", updated);
    if (selected === id) setSelected(null);
  };

  const copyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt);
    alert("프롬프트 복사됨!");
  };

  if (tracks.length === 0) return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, color:C.muted, padding:30 }}>
      <div style={{ fontSize:40 }}>🎵</div>
      <div style={{ fontSize:14, fontWeight:700, color:C.text }}>저장된 트랙이 없어요</div>
      <div style={{ fontSize:12, textAlign:"center", lineHeight:1.8 }}>
        작곡 생성기에서 프롬프트를 만들고<br/>
        "저장" 버튼을 누르면 여기에 나타나요
      </div>
    </div>
  );

  return (
    <div style={{ flex:1, overflowY:"auto", padding:14 }}>

      {/* 통계 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
        {[
          { label:"총 트랙", value:tracks.length, color:C.purple },
          { label:"배급 완료", value:tracks.filter(t=>t.platforms.distrokid).length, color:C.pink },
          { label:"YouTube 업로드", value:tracks.filter(t=>t.platforms.youtube).length, color:C.red },
        ].map((s, i) => (
          <div key={i} style={{ background:C.surface, borderRadius:10, padding:"11px 10px", border:`1px solid ${C.border}`, textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 트랙 리스트 */}
      {tracks.map(track => (
        <div key={track.id} style={{ background:C.surface, borderRadius:14, padding:14, marginBottom:10, border:`1px solid ${selected===track.id?C.purpleMid:C.border}` }}>
          {/* 헤더 */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:C.purpleDim, border:`1px solid ${C.purpleMid}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.purple, flexShrink:0 }}>
              <Ic n="music" s={18}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{track.title}</div>
              <div style={{ fontSize:10, color:C.muted }}>
                {track.genre && `${track.genre} · `}{track.createdAt}
              </div>
            </div>
            <button onClick={() => deleteTrack(track.id)} style={{ background:"none", border:"none", color:C.dim, cursor:"pointer", padding:4, display:"flex" }}>
              <Ic n="trash" s={15}/>
            </button>
          </div>

          {/* 플랫폼 체크 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 }}>
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => togglePlatform(track.id, p.id)} style={{
                display:"flex", alignItems:"center", gap:7, padding:"7px 10px",
                background:track.platforms[p.id]?p.color+"18":"transparent",
                border:`1px solid ${track.platforms[p.id]?p.color:C.border}`, borderRadius:8,
                cursor:"pointer", fontFamily:"inherit",
              }}>
                <div style={{ width:16, height:16, borderRadius:4, border:`1.5px solid ${track.platforms[p.id]?p.color:C.border}`, background:track.platforms[p.id]?p.color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", color:C.bg, flexShrink:0 }}>
                  {track.platforms[p.id] && <Ic n="check" s={10}/>}
                </div>
                <span style={{ fontSize:10, color:track.platforms[p.id]?p.color:C.muted, fontWeight:track.platforms[p.id]?700:400 }}>{p.label}</span>
              </button>
            ))}
          </div>

          {/* 수익 메모 */}
          <input value={track.revenue} onChange={e=>updateRevenue(track.id,e.target.value)}
            placeholder="이번 달 수익 메모 (예: Spotify $12, YouTube $8)"
            style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, padding:"7px 10px", fontSize:11, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>

          {/* 프롬프트 보기 */}
          {track.prompt && (
            <button onClick={() => copyPrompt(track.prompt)} style={{
              marginTop:8, width:"100%", padding:"7px 0",
              background:"transparent", border:`1px solid ${C.border}`, borderRadius:8,
              color:C.muted, cursor:"pointer", fontSize:11, fontFamily:"inherit",
              display:"flex", alignItems:"center", justifyContent:"center", gap:5,
            }}>
              <Ic n="copy" s={11}/>Suno 프롬프트 복사
            </button>
          )}
        </div>
      ))}
      <div style={{ marginBottom:20 }}/>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 메인 앱
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("composer");

  const tabs = [
    { id:"composer", icon:<Ic n="music" s={18}/>, label:"작곡 생성" },
    { id:"monetize", icon:<Ic n="dollar" s={18}/>, label:"수익화 가이드" },
    { id:"tracks",   icon:<Ic n="list" s={18}/>, label:"트랙 관리" },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100dvh", background:C.bg, fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif", color:C.text, overflow:"hidden" }}>
      {/* 헤더 */}
      <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, paddingTop:"calc(10px + env(safe-area-inset-top,0px))" }}>
        <div>
          <div style={{ fontSize:14, fontWeight:800, letterSpacing:2, lineHeight:1, background:"linear-gradient(135deg, #9b6dff, #ff6db3)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            SUNO AGENT
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
            <div style={{ fontSize:8, color:C.dim, letterSpacing:2 }}>AI MUSIC STUDIO</div>
            <div style={{ background:C.purpleDim, border:`1px solid ${C.purpleMid}`, borderRadius:3, padding:"1px 5px", fontSize:8, color:C.purple, fontFamily:"monospace" }}>v1.0</div>
            <div style={{ fontSize:8, color:C.dim }}>2026.04.27</div>
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:10, color:C.muted }}>
            {new Date().toLocaleDateString("ko-KR", { month:"short", day:"numeric", weekday:"short" })}
          </div>
          <div style={{ fontSize:9, color:C.purple }}>● STUDIO</div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {tab==="composer" && <ComposerTab/>}
        {tab==="monetize" && <MonetizeTab/>}
        {tab==="tracks"   && <TracksTab/>}
      </div>

      {/* 하단 탭바 */}
      <div style={{ background:C.surface, borderTop:`1px solid ${C.border}`, display:"flex", flexShrink:0, paddingBottom:"env(safe-area-inset-bottom,0px)" }}>
        {tabs.map(t => <Tab key={t.id} active={tab===t.id} onClick={()=>setTab(t.id)} icon={t.icon} label={t.label}/>)}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #2a2040; border-radius: 2px; }
        input::placeholder, textarea::placeholder { color: #4a3d66; }
        a { color: inherit; }
      `}</style>
    </div>
  );
}
