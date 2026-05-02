import { useState, useEffect, useRef } from "react";

const C = {
  bg:"#0d0b14", surface:"#13101f", surface2:"#1a1628", surface3:"#211c35",
  border:"#2a2040", borderLight:"#3a3060",
  purple:"#9b6dff", purpleDim:"#9b6dff18", purpleMid:"#9b6dff44",
  pink:"#ff6db3", pinkDim:"#ff6db318",
  cyan:"#00e5cc", cyanDim:"#00e5cc18",
  gold:"#ffd166", goldDim:"#ffd16618",
  green:"#06d6a0", greenDim:"#06d6a018",
  red:"#ff4d6a", redDim:"#ff4d6a18",
  text:"#f0eaff", muted:"#8878aa", dim:"#4a3d66",
};

const SONNET="claude-sonnet-4-5-20250929";
const HAIKU="claude-haiku-4-5-20251001";

const getHeaders=()=>{
  const k=import.meta.env.VITE_ANTHROPIC_API_KEY;
  if(!k)throw new Error("API_KEY_MISSING");
  return{"Content-Type":"application/json","x-api-key":k,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"};
};

const callClaude=async(messages,system,max_tokens=2000,model=SONNET)=>{
  const res=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:getHeaders(),
    body:JSON.stringify({model,max_tokens,system,messages}),
  });
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e?.error?.message||`HTTP ${res.status}`);}
  return(await res.json()).content?.[0]?.text||"";
};

const ls={
  get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
};

const Ic=({n,s=16})=>{
  const icons={
    music:<><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
    home:<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    star:<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    dollar:<><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    list:<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    user:<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    trend:<><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    copy:<><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    check:<polyline points="20 6 9 17 4 12"/>,
    spin:<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    trash:<><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></>,
    zap:<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    eq:<><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></>,
    link:<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    palette:<><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></>,
    refresh:<><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{icons[n]}</svg>;
};

const GradBtn=({children,onClick,disabled,g="purple",style={}})=>{
  const gs={purple:"#6b3fa0,#9b6dff",pink:"#a03070,#ff6db3",cyan:"#00a090,#00e5cc",gold:"#a08020,#ffd166",green:"#04a070,#06d6a0"};
  return <button onClick={onClick} disabled={disabled} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7,padding:"13px 0",width:"100%",border:"none",borderRadius:10,cursor:disabled?"not-allowed":"pointer",background:disabled?C.border:`linear-gradient(135deg,${gs[g]})`,color:disabled?C.dim:g==="gold"?"#1a1400":"#f0eaff",fontSize:14,fontWeight:800,fontFamily:"inherit",opacity:disabled?0.6:1,...style}}>{children}</button>;
};

const Tab=({active,onClick,icon,label})=>(
  <button onClick={onClick} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"10px 0 8px",background:"transparent",border:"none",color:active?C.purple:C.dim,cursor:"pointer",fontSize:9,fontFamily:"inherit",fontWeight:active?700:400,borderTop:`2px solid ${active?C.purple:"transparent"}`,transition:"all .2s"}}>{icon}{label}</button>
);

// ══════════════════════════════════════════════════════════════
// 탭1: 홈 대시보드
// ══════════════════════════════════════════════════════════════
const HomeTab=({setTab})=>{
  const [recommend,setRecommend]=useState(null);
  const [loading,setLoading]=useState(false);
  const [copied,setCopied]=useState("");
  const tracks=ls.get("suno_tracks",[]);
  const artist=ls.get("artist_profile",null);

  const getRecommend=async()=>{
    setLoading(true);setRecommend(null);
    const sys=`당신은 AI 음악 수익화 전문가입니다. 2026년 기준 수익성 높은 장르를 JSON으로만 응답:
{"categories":[{"genre":"장르명","revenue":"월 예상수익","reason":"수익 이유","themes":["테마1","테마2","테마3"],"suno_prompt":"Suno 최적화 프롬프트(영어)","difficulty":"쉬움/보통/어려움","color":"purple/pink/cyan/gold/green"}]}`;
    try{
      const r=await callClaude([{role:"user",content:"2026년 AI 음악으로 수익성이 가장 높은 장르 5가지를 추천해줘. Spotify 스트리밍+YouTube BGM+스톡뮤직 수요 종합."}],sys,1500,HAIKU);
      const clean=r.replace(/```json|```/g,"").trim();
      const s=clean.indexOf("{");const e=clean.lastIndexOf("}");
      setRecommend(JSON.parse(clean.slice(s,e+1)));
    }catch(err){setRecommend({error:err.message});}
    setLoading(false);
  };

  const copy=(text,key)=>{navigator.clipboard.writeText(text);setCopied(key);setTimeout(()=>setCopied(""),2000);};
  const colorMap={purple:C.purple,pink:C.pink,cyan:C.cyan,gold:C.gold,green:C.green};

  return(
    <div style={{flex:1,overflowY:"auto",padding:14}}>

      {/* 아티스트 카드 */}
      {artist?.name?(
        <div onClick={()=>setTab("artist")} style={{background:`linear-gradient(135deg,${C.surface3},${C.surface2})`,borderRadius:14,padding:16,marginBottom:14,border:`1px solid ${C.purpleMid}`,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:52,height:52,borderRadius:14,background:`linear-gradient(135deg,${artist.color1||C.purple},${artist.color2||C.pink})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0,boxShadow:`0 4px 16px ${artist.color1||C.purple}44`}}>{artist.emoji||"🎵"}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:15,fontWeight:800,color:C.text}}>{artist.name}</div>
              <div style={{fontSize:11,color:C.muted,marginTop:2}}>{artist.genre} · {artist.concept}</div>
            </div>
            <div style={{fontSize:11,color:C.purple}}>편집 →</div>
          </div>
        </div>
      ):(
        <div onClick={()=>setTab("artist")} style={{background:C.purpleDim,borderRadius:14,padding:18,marginBottom:14,border:`2px dashed ${C.purpleMid}`,cursor:"pointer",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:6}}>🎤</div>
          <div style={{fontSize:13,fontWeight:700,color:C.purple}}>AI 아티스트 프로필 만들기</div>
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>탭하면 시작</div>
        </div>
      )}

      {/* 빠른 링크 */}
      <div style={{fontSize:10,color:C.muted,fontWeight:700,letterSpacing:1,marginBottom:8}}>🔗 빠른 접속</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
        {[
          {emoji:"🎵",name:"Suno",sub:"음악 생성",url:"https://suno.com",c1:"#1a0a2e",c2:"#2d1a4e",bc:C.purpleMid,tc:C.purple},
          {emoji:"🚀",name:"DistroKid",sub:"음원 배급",url:"https://distrokid.com",c1:"#0a1e1a",c2:"#1a3d35",bc:`${C.cyan}44`,tc:C.cyan},
          {emoji:"🎧",name:"Spotify",sub:"for Artists",url:"https://artists.spotify.com",c1:"#0a1e0a",c2:"#1a3d1a",bc:`${C.green}44`,tc:C.green},
          {emoji:"💰",name:"Pond5",sub:"스톡뮤직",url:"https://pond5.com",c1:"#1e1a0a",c2:"#3d350a",bc:`${C.gold}44`,tc:C.gold},
        ].map((lk,i)=>(
          <a key={i} href={lk.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
            <div style={{background:`linear-gradient(135deg,${lk.c1},${lk.c2})`,borderRadius:12,padding:14,border:`1px solid ${lk.bc}`,display:"flex",alignItems:"center",gap:10,transition:"opacity .15s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=".8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <div style={{fontSize:24}}>{lk.emoji}</div>
              <div>
                <div style={{fontSize:13,fontWeight:800,color:lk.tc}}>{lk.name}</div>
                <div style={{fontSize:10,color:C.muted}}>{lk.sub} →</div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* 통계 */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
        {[{l:"총 트랙",v:tracks.length,c:C.purple},{l:"배급 완료",v:tracks.filter(t=>t.platforms?.distrokid).length,c:C.cyan},{l:"YouTube",v:tracks.filter(t=>t.platforms?.youtube).length,c:C.pink}].map((s,i)=>(
          <div key={i} style={{background:C.surface,borderRadius:10,padding:"10px 8px",border:`1px solid ${C.border}`,textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:9,color:C.muted,marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* 수익성 추천 */}
      <div style={{background:C.surface,borderRadius:14,padding:14,marginBottom:20,border:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={{fontSize:11,color:C.gold,fontWeight:700,letterSpacing:1}}>📈 수익성 장르 추천</div>
            <div style={{fontSize:10,color:C.muted,marginTop:2}}>2026 시장 기반 AI 분석</div>
          </div>
          <button onClick={getRecommend} disabled={loading} style={{background:C.goldDim,border:`1px solid ${C.gold}44`,borderRadius:8,padding:"6px 12px",color:C.gold,cursor:loading?"not-allowed":"pointer",fontSize:11,fontFamily:"inherit",display:"flex",alignItems:"center",gap:5}}>
            {loading?<><div style={{animation:"spin 1s linear infinite"}}><Ic n="spin" s={12}/></div>분석중...</>:<><Ic n="trend" s={12}/>추천 받기</>}
          </button>
        </div>
        {!recommend&&!loading&&(
          <div style={{textAlign:"center",padding:"16px 0",color:C.dim,fontSize:12}}>버튼을 눌러 수익성 높은 장르를 확인하세요</div>
        )}
        {recommend?.categories?.map((cat,i)=>{
          const col=colorMap[cat.color]||C.purple;
          return(
            <div key={i} style={{background:C.surface2,borderRadius:10,padding:12,marginBottom:8,border:`1px solid ${col}33`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:13,fontWeight:700,color:col}}>{cat.genre}</span>
                  <span style={{fontSize:9,background:C.border,color:C.muted,padding:"1px 6px",borderRadius:4}}>{cat.difficulty}</span>
                </div>
                <span style={{fontSize:12,fontWeight:700,color:C.gold}}>{cat.revenue}</span>
              </div>
              <div style={{fontSize:11,color:C.muted,marginBottom:6,lineHeight:1.6}}>{cat.reason}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
                {cat.themes?.map((t,ti)=>(
                  <span key={ti} style={{fontSize:10,background:`${col}18`,color:col,border:`1px solid ${col}33`,padding:"2px 7px",borderRadius:10}}>{t}</span>
                ))}
              </div>
              {cat.suno_prompt&&(
                <div style={{display:"flex",alignItems:"center",gap:6,background:C.surface3,borderRadius:6,padding:"6px 9px"}}>
                  <div style={{fontSize:10,color:C.purple,flex:1,fontFamily:"monospace",lineHeight:1.5}}>{cat.suno_prompt}</div>
                  <button onClick={()=>copy(cat.suno_prompt,`p${i}`)} style={{background:"none",border:"none",color:copied===`p${i}`?C.green:C.dim,cursor:"pointer",padding:2,flexShrink:0}}>
                    <Ic n={copied===`p${i}`?"check":"copy"} s={12}/>
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {recommend?.error&&<div style={{fontSize:12,color:C.red}}>❌ {recommend.error}</div>}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 탭2: 작곡 생성기 (믹싱 가이드 포함)
// ══════════════════════════════════════════════════════════════
const ComposerTab=()=>{
  const [form,setForm]=useState({genre:"",mood:"",theme:"",tempo:"미디엄",lang:"한국어",extra:""});
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [copied,setCopied]=useState("");
  const [showMix,setShowMix]=useState(false);
  const [mixResult,setMixResult]=useState(null);
  const [mixLoading,setMixLoading]=useState(false);

  const GENRES=["Lo-fi","K-POP","팝","R&B","힙합","EDM","발라드","록","시티팝","뉴에이지","앰비언트","OST"];
  const MOODS=["밝고 경쾌한","감성적인","신나는","차분한","웅장한","몽환적인","슬픈","설레는","강렬한","평화로운"];
  const TEMPOS=["느린","미디엄","빠른","매우 빠른"];
  const LANGS=["한국어","영어","한영 혼합","무가사"];

  const COMPOSE_SYS=`당신은 Suno AI 음악 생성 전문가입니다. JSON으로만 응답:
{"prompt":"Suno 태그(영어)","style":"스타일 설명","lyrics":"가사([Verse][Chorus][Bridge] 구조)","title":"제안 제목","tips":"Suno 사용 팁"}`;

  const MIX_SYS=`당신은 Suno AI 음원 믹싱·마스터링 전문가입니다. JSON으로만:
{"lufs_target":"-14 LUFS","checklist":["항목1","항목2","항목3","항목4","항목5"],"free_tools":[{"name":"툴명","how":"사용법","url":"링크"}],"approval_tips":["DistroKid 승인 팁1","팁2","팁3"],"common_errors":["실수1","실수2"]}`;

  const generate=async()=>{
    if(!form.genre&&!form.mood&&!form.theme)return;
    setLoading(true);setResult(null);
    try{
      const r=await callClaude([{role:"user",content:`장르:${form.genre||"자유"} 분위기:${form.mood||"자유"} 주제:${form.theme||"자유"} 템포:${form.tempo} 언어:${form.lang} 추가:${form.extra||"없음"}`}],COMPOSE_SYS,2000);
      const clean=r.replace(/```json|```/g,"").trim();
      const s=clean.indexOf("{");const e=clean.lastIndexOf("}");
      setResult(JSON.parse(clean.slice(s,e+1)));
    }catch(err){setResult({error:err.message});}
    setLoading(false);
  };

  const getMix=async()=>{
    if(mixResult)return;
    setMixLoading(true);
    try{
      const r=await callClaude([{role:"user",content:"Suno AI 음원을 DistroKid에 올릴 때 승인율 높이는 믹싱·마스터링 체크리스트와 무료 툴 사용법"}],MIX_SYS,1200,HAIKU);
      const clean=r.replace(/```json|```/g,"").trim();
      const s=clean.indexOf("{");const e=clean.lastIndexOf("}");
      setMixResult(JSON.parse(clean.slice(s,e+1)));
    }catch(err){setMixResult({error:err.message});}
    setMixLoading(false);
  };

  const copy=(text,key)=>{navigator.clipboard.writeText(text);setCopied(key);setTimeout(()=>setCopied(""),2000);};

  const saveTrack=()=>{
    if(!result?.title)return;
    const t={id:Date.now(),title:result.title,genre:form.genre,mood:form.mood,prompt:result.prompt,createdAt:new Date().toLocaleDateString("ko-KR"),platforms:{suno:false,distrokid:false,youtube:false,spotify:false},revenue:""};
    ls.set("suno_tracks",[t,...ls.get("suno_tracks",[])]);
    alert(`"${result.title}" 저장됨!`);
  };

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{flex:1,overflowY:"auto",padding:14}}>

        {/* 장르 */}
        <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,color:C.purple,fontWeight:700,letterSpacing:1.2,marginBottom:10}}>🎵 장르</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {GENRES.map(g=>(
              <button key={g} onClick={()=>setForm({...form,genre:g})} style={{padding:"5px 11px",background:form.genre===g?C.purpleDim:"transparent",border:`1px solid ${form.genre===g?C.purple:C.border}`,borderRadius:20,color:form.genre===g?C.purple:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{g}</button>
            ))}
          </div>
        </div>

        {/* 분위기 */}
        <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,color:C.pink,fontWeight:700,letterSpacing:1.2,marginBottom:10}}>✨ 분위기</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {MOODS.map(m=>(
              <button key={m} onClick={()=>setForm({...form,mood:m})} style={{padding:"5px 11px",background:form.mood===m?C.pinkDim:"transparent",border:`1px solid ${form.mood===m?C.pink:C.border}`,borderRadius:20,color:form.mood===m?C.pink:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>{m}</button>
            ))}
          </div>
        </div>

        {/* 설정 */}
        <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:10,color:C.cyan,fontWeight:700,letterSpacing:1.2,marginBottom:10}}>🎤 상세 설정</div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:5}}>주제 / 테마</div>
            <input value={form.theme} onChange={e=>setForm({...form,theme:e.target.value})} placeholder="예: 이별 후 새로운 시작, 새벽 감성" style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            {TEMPOS.map(t=>(
              <button key={t} onClick={()=>setForm({...form,tempo:t})} style={{flex:1,padding:"7px 0",background:form.tempo===t?C.cyanDim:"transparent",border:`1px solid ${form.tempo===t?C.cyan:C.border}`,borderRadius:8,color:form.tempo===t?C.cyan:C.muted,fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>{t}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
            {LANGS.map(l=>(
              <button key={l} onClick={()=>setForm({...form,lang:l})} style={{padding:"5px 11px",background:form.lang===l?C.purpleDim:"transparent",border:`1px solid ${form.lang===l?C.purple:C.border}`,borderRadius:20,color:form.lang===l?C.purple:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
            ))}
          </div>
          <input value={form.extra} onChange={e=>setForm({...form,extra:e.target.value})} placeholder="추가 요청 (예: 피아노 강조, 드라마틱한 엔딩)" style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,padding:"9px 12px",fontSize:13,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
        </div>

        {/* 버튼 */}
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          <GradBtn onClick={generate} disabled={loading||(!form.genre&&!form.mood&&!form.theme)} style={{flex:2}}>
            {loading?<><div style={{animation:"spin 1s linear infinite"}}><Ic n="spin" s={15}/></div>생성 중...</>:<><Ic n="zap" s={15}/>프롬프트 & 가사 생성</>}
          </GradBtn>
          <button onClick={()=>{setShowMix(!showMix);getMix();}} style={{flex:1,padding:"12px 0",background:showMix?C.goldDim:"transparent",border:`1px solid ${showMix?C.gold:C.border}`,borderRadius:10,color:showMix?C.gold:C.muted,cursor:"pointer",fontSize:11,fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:5,fontWeight:showMix?700:400}}>
            <Ic n="eq" s={13}/>믹싱 가이드
          </button>
        </div>

        {/* 믹싱 가이드 */}
        {showMix&&(
          <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:14,border:`1px solid ${C.gold}44`}}>
            <div style={{fontSize:11,color:C.gold,fontWeight:700,marginBottom:10}}>🎛️ DistroKid 승인율 높이는 믹싱 가이드</div>
            {mixLoading&&<div style={{fontSize:12,color:C.muted,display:"flex",gap:6,alignItems:"center"}}><div style={{animation:"spin 1s linear infinite"}}><Ic n="spin" s={12}/></div>분석 중...</div>}
            {mixResult&&!mixResult.error&&(
              <>
                <div style={{background:C.goldDim,borderRadius:8,padding:"8px 10px",marginBottom:10,border:`1px solid ${C.gold}33`}}>
                  <div style={{fontSize:10,color:C.gold,fontWeight:700}}>🎯 목표 음량</div>
                  <div style={{fontSize:14,color:C.text,fontWeight:700,marginTop:2}}>{mixResult.lufs_target} (Spotify 기준)</div>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:6}}>✅ 업로드 전 체크리스트</div>
                  {mixResult.checklist?.map((item,i)=>(
                    <div key={i} style={{fontSize:11,color:C.text,padding:"5px 0",borderBottom:`1px solid ${C.border}`,display:"flex",gap:7}}>
                      <span style={{color:C.gold,flexShrink:0}}>{i+1}.</span>{item}
                    </div>
                  ))}
                </div>
                {mixResult.free_tools?.length>0&&(
                  <div style={{marginBottom:10}}>
                    <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:6}}>🔧 무료 툴</div>
                    {mixResult.free_tools.map((t,i)=>(
                      <div key={i} style={{background:C.surface2,borderRadius:8,padding:"8px 10px",marginBottom:6}}>
                        <div style={{fontSize:12,fontWeight:700,color:C.cyan}}>{t.name}</div>
                        <div style={{fontSize:11,color:C.muted,marginTop:2}}>{t.how}</div>
                        {t.url&&<a href={t.url} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:C.purple,display:"block",marginTop:3}}>{t.url}</a>}
                      </div>
                    ))}
                  </div>
                )}
                {mixResult.approval_tips?.length>0&&(
                  <div style={{background:C.cyanDim,borderRadius:8,padding:"9px 11px",border:`1px solid ${C.cyan}33`}}>
                    <div style={{fontSize:10,color:C.cyan,fontWeight:700,marginBottom:5}}>💡 승인율 팁</div>
                    {mixResult.approval_tips.map((t,i)=><div key={i} style={{fontSize:11,color:C.muted,padding:"2px 0"}}>• {t}</div>)}
                  </div>
                )}
              </>
            )}
            {mixResult?.error&&<div style={{fontSize:12,color:C.red}}>❌ {mixResult.error}</div>}
          </div>
        )}

        {/* 결과 */}
        {result&&!result.error&&(
          <div style={{marginBottom:20}}>
            <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.purpleMid}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:17,fontWeight:800,color:C.text}}>{result.title}</div>
              <button onClick={saveTrack} style={{background:C.purpleDim,border:`1px solid ${C.purple}`,borderRadius:7,padding:"5px 11px",color:C.purple,cursor:"pointer",fontSize:11,fontFamily:"inherit"}}>저장</button>
            </div>
            <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:11,color:C.cyan,fontWeight:700}}>🔧 Suno 프롬프트 (복사 → suno.com에 붙여넣기)</div>
                <button onClick={()=>copy(result.prompt,"p")} style={{background:copied==="p"?C.cyanDim:"transparent",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 9px",color:copied==="p"?C.cyan:C.muted,cursor:"pointer",fontSize:10,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                  <Ic n={copied==="p"?"check":"copy"} s={11}/>{copied==="p"?"복사됨":"복사"}
                </button>
              </div>
              <div style={{background:C.bg,borderRadius:8,padding:"9px 11px",fontSize:12,color:C.purple,fontFamily:"monospace",lineHeight:1.6}}>{result.prompt}</div>
            </div>
            <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:11,color:C.pink,fontWeight:700}}>📝 가사</div>
                <button onClick={()=>copy(result.lyrics,"l")} style={{background:copied==="l"?C.pinkDim:"transparent",border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 9px",color:copied==="l"?C.pink:C.muted,cursor:"pointer",fontSize:10,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                  <Ic n={copied==="l"?"check":"copy"} s={11}/>{copied==="l"?"복사됨":"가사 복사"}
                </button>
              </div>
              <div style={{fontSize:13,color:C.text,lineHeight:2,whiteSpace:"pre-wrap"}}>{result.lyrics}</div>
            </div>
            {result.tips&&<div style={{background:C.cyanDim,borderRadius:10,padding:"11px 13px",border:`1px solid ${C.cyan}33`}}>
              <div style={{fontSize:10,color:C.cyan,fontWeight:700,marginBottom:4}}>💡 Suno 팁</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.7}}>{result.tips}</div>
            </div>}
          </div>
        )}
        {result?.error&&<div style={{background:C.redDim,borderRadius:10,padding:12,border:`1px solid ${C.red}33`,fontSize:12,color:C.red}}>❌ {result.error}</div>}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 탭3: AI 아티스트 에이전트
// ══════════════════════════════════════════════════════════════
const ArtistTab=()=>{
  const [artist,setArtist]=useState(()=>ls.get("artist_profile",{name:"",genre:"",concept:"",story:"",targetAudience:"",color1:"#9b6dff",color2:"#ff6db3",emoji:"🎵",visualKeywords:"",socialBio:"",releaseStrategy:""}));
  const [loading,setLoading]=useState(false);
  const [ideaLoading,setIdeaLoading]=useState(false);
  const [aiResult,setAiResult]=useState(null);
  const [copied,setCopied]=useState("");

  useEffect(()=>{ls.set("artist_profile",artist);},[artist]);

  const COLORS=[["#9b6dff","#ff6db3"],["#00e5cc","#9b6dff"],["#ff6db3","#ffd166"],["#06d6a0","#00e5cc"],["#ffd166","#ff6db3"],["#9b6dff","#06d6a0"]];
  const EMOJIS=["🎵","🎤","🎹","🎸","🎧","🌙","✨","🔥","💫","🌊","🦋","🎭"];
  const GENRES=["Lo-fi","K-POP","R&B","힙합","앰비언트","팝","OST","시티팝","EDM","발라드"];

  const BRAND_SYS=`당신은 AI 아티스트 브랜딩 전문가입니다. JSON으로만:
{"tagline":"슬로건","visual_concept":"비주얼 컨셉","color_mood":"색상 감성","cover_art_prompt":"커버아트 이미지AI 프롬프트(영어)","social_strategy":{"instagram":"인스타 전략","youtube":"유튜브 전략","tiktok":"틱톡 전략"},"release_cadence":"발매 전략","brand_voice":"브랜드 보이스","naming_tips":["트랙 네이밍 팁1","팁2"]}`;

  const IDEA_SYS=`당신은 AI 아티스트 크리에이티브 디렉터입니다. JSON으로만:
{"album_concepts":[{"title":"앨범명","theme":"테마","tracks":["트랙1","트랙2","트랙3"],"visual":"비주얼 컨셉"}],"campaign_ideas":["캠페인1","2","3"],"viral_concepts":["바이럴 아이디어1","2","3"],"collab_ideas":["협업 아이디어1","2"]}`;

  const generateBrand=async()=>{
    if(!artist.name||!artist.genre)return;
    setLoading(true);
    try{
      const r=await callClaude([{role:"user",content:`아티스트명:${artist.name} 장르:${artist.genre} 컨셉:${artist.concept} 스토리:${artist.story} 타겟:${artist.targetAudience} 비주얼:${artist.visualKeywords}\nAI 아티스트 브랜드 아이덴티티 생성`}],BRAND_SYS,2000);
      const clean=r.replace(/```json|```/g,"").trim();
      const s=clean.indexOf("{");const e=clean.lastIndexOf("}");
      const parsed=JSON.parse(clean.slice(s,e+1));
      setArtist(prev=>({...prev,socialBio:parsed.tagline||prev.socialBio,releaseStrategy:parsed.release_cadence||prev.releaseStrategy}));
      setAiResult(prev=>({...prev,...parsed}));
    }catch(err){setAiResult({error:err.message});}
    setLoading(false);
  };

  const generateIdea=async()=>{
    setIdeaLoading(true);
    try{
      const r=await callClaude([{role:"user",content:`${artist.name||"AI 아티스트"}(${artist.genre||"Lo-fi"}) 6개월 크리에이티브 아이디어. 컨셉:${artist.concept||"감성적"}`}],IDEA_SYS,1200,HAIKU);
      const clean=r.replace(/```json|```/g,"").trim();
      const s=clean.indexOf("{");const e=clean.lastIndexOf("}");
      setAiResult(prev=>({...(prev||{}),...JSON.parse(clean.slice(s,e+1))}));
    }catch(err){console.error(err);}
    setIdeaLoading(false);
  };

  const copy=(text,key)=>{navigator.clipboard.writeText(text);setCopied(key);setTimeout(()=>setCopied(""),2000);};

  const F=({label,field,ph,ml=false})=>(
    <div style={{marginBottom:10}}>
      <div style={{fontSize:10,color:C.muted,marginBottom:4}}>{label}</div>
      {ml?<textarea value={artist[field]||""} onChange={e=>setArtist({...artist,[field]:e.target.value})} placeholder={ph} rows={2} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,padding:"9px 11px",fontSize:12,outline:"none",fontFamily:"inherit",resize:"none",boxSizing:"border-box"}}/>
        :<input value={artist[field]||""} onChange={e=>setArtist({...artist,[field]:e.target.value})} placeholder={ph} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.text,padding:"9px 11px",fontSize:12,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>}
    </div>
  );

  return(
    <div style={{flex:1,overflowY:"auto",padding:14}}>

      {/* 비주얼 미리보기 */}
      <div style={{background:`linear-gradient(135deg,${artist.color1}22,${artist.color2}22)`,borderRadius:16,padding:20,marginBottom:14,border:`1px solid ${artist.color1}44`,textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:20,background:`linear-gradient(135deg,${artist.color1},${artist.color2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 10px",boxShadow:`0 8px 32px ${artist.color1}44`}}>{artist.emoji}</div>
        <div style={{fontSize:20,fontWeight:800,color:C.text,marginBottom:4}}>{artist.name||"아티스트명"}</div>
        <div style={{fontSize:12,color:C.muted}}>{artist.genre||"장르"} · {artist.concept||"컨셉"}</div>
        {artist.socialBio&&<div style={{fontSize:11,color:artist.color1,marginTop:6,lineHeight:1.6,fontStyle:"italic"}}>"{artist.socialBio}"</div>}
      </div>

      {/* 이모지 & 색상 */}
      <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.purple,fontWeight:700,letterSpacing:1,marginBottom:10}}>🎨 비주얼 아이덴티티</div>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:6}}>아티스트 심볼</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{EMOJIS.map(em=>(
            <button key={em} onClick={()=>setArtist({...artist,emoji:em})} style={{fontSize:20,background:artist.emoji===em?C.purpleDim:"transparent",border:`1px solid ${artist.emoji===em?C.purple:C.border}`,borderRadius:8,padding:"4px 8px",cursor:"pointer"}}>{em}</button>
          ))}</div>
        </div>
        <div>
          <div style={{fontSize:10,color:C.muted,marginBottom:6}}>시그니처 컬러 조합</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{COLORS.map(([c1,c2],i)=>(
            <button key={i} onClick={()=>setArtist({...artist,color1:c1,color2:c2})} style={{width:44,height:44,borderRadius:12,cursor:"pointer",background:`linear-gradient(135deg,${c1},${c2})`,border:`3px solid ${artist.color1===c1&&artist.color2===c2?"white":"transparent"}`,transition:"transform .15s"}}/>
          ))}</div>
        </div>
      </div>

      {/* 프로필 */}
      <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.pink,fontWeight:700,letterSpacing:1,marginBottom:10}}>📋 아티스트 프로필</div>
        <F label="아티스트명 *" field="name" ph="예: LUNA, DayDream, 새벽감성"/>
        <div style={{marginBottom:10}}>
          <div style={{fontSize:10,color:C.muted,marginBottom:6}}>주 장르 *</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{GENRES.map(g=>(
            <button key={g} onClick={()=>setArtist({...artist,genre:g})} style={{padding:"4px 10px",background:artist.genre===g?C.pinkDim:"transparent",border:`1px solid ${artist.genre===g?C.pink:C.border}`,borderRadius:20,color:artist.genre===g?C.pink:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>{g}</button>
          ))}</div>
        </div>
        <F label="아티스트 컨셉" field="concept" ph="예: 새벽감성, 몽환적, 도시적"/>
        <F label="아티스트 스토리" field="story" ph="예: 인공지능이 꿈꾸는 감성 음악, 디지털 세대의 힐링" ml/>
        <F label="타겟 청취자" field="targetAudience" ph="예: 20-30대 직장인, 공부하는 학생"/>
        <F label="비주얼 키워드" field="visualKeywords" ph="예: 새벽, 도시, 네온, 빗소리, 커피"/>
      </div>

      {/* 버튼 */}
      <GradBtn onClick={generateBrand} disabled={loading||!artist.name||!artist.genre} g="pink" style={{marginBottom:8}}>
        {loading?<><div style={{animation:"spin 1s linear infinite"}}><Ic n="spin" s={15}/></div>브랜드 아이덴티티 생성 중...</>:<><Ic n="palette" s={15}/>AI 브랜드 아이덴티티 생성</>}
      </GradBtn>
      <button onClick={generateIdea} disabled={ideaLoading} style={{width:"100%",padding:"11px 0",marginBottom:14,background:"transparent",border:`1px solid ${C.cyan}44`,borderRadius:10,color:C.cyan,cursor:"pointer",fontSize:13,fontFamily:"inherit",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
        {ideaLoading?<><div style={{animation:"spin 1s linear infinite"}}><Ic n="spin" s={14}/></div>아이디어 생성 중...</>:<><Ic n="zap" s={14}/>6개월 크리에이티브 아이디어</>}
      </button>

      {/* AI 결과 */}
      {aiResult&&!aiResult.error&&(
        <div style={{marginBottom:20}}>
          {aiResult.tagline&&(
            <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.purpleMid}`}}>
              <div style={{fontSize:10,color:C.purple,fontWeight:700,marginBottom:8}}>✨ 브랜드 아이덴티티</div>
              <div style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:6}}>"{aiResult.tagline}"</div>
              {aiResult.visual_concept&&<div style={{fontSize:12,color:C.muted,lineHeight:1.7,marginBottom:8}}>{aiResult.visual_concept}</div>}
              {aiResult.brand_voice&&<div style={{background:C.purpleDim,borderRadius:8,padding:"8px 10px",fontSize:11,color:C.muted}}><span style={{color:C.purple,fontWeight:700}}>브랜드 보이스: </span>{aiResult.brand_voice}</div>}
              {aiResult.cover_art_prompt&&(
                <div style={{background:C.surface2,borderRadius:8,padding:"9px 10px",marginTop:8}}>
                  <div style={{fontSize:10,color:C.gold,marginBottom:4}}>🎨 커버아트 AI 프롬프트</div>
                  <div style={{fontSize:11,color:C.purple,fontFamily:"monospace",lineHeight:1.6,marginBottom:5}}>{aiResult.cover_art_prompt}</div>
                  <button onClick={()=>copy(aiResult.cover_art_prompt,"art")} style={{background:"none",border:"none",color:copied==="art"?C.green:C.dim,cursor:"pointer",fontSize:10,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>
                    <Ic n={copied==="art"?"check":"copy"} s={10}/>{copied==="art"?"복사됨":"복사 (Midjourney/DALL-E에 사용)"}
                  </button>
                </div>
              )}
            </div>
          )}
          {aiResult.social_strategy&&(
            <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:10,color:C.cyan,fontWeight:700,marginBottom:10}}>📱 플랫폼별 전략</div>
              {[["인스타그램","instagram",C.pink],["유튜브","youtube",C.red],["틱톡","tiktok",C.purple]].map(([label,key,col])=>(
                aiResult.social_strategy[key]&&(
                  <div key={key} style={{marginBottom:8,padding:"8px 10px",background:C.surface2,borderRadius:8,borderLeft:`3px solid ${col}`}}>
                    <div style={{fontSize:10,color:col,fontWeight:700,marginBottom:3}}>{label}</div>
                    <div style={{fontSize:11,color:C.muted,lineHeight:1.6}}>{aiResult.social_strategy[key]}</div>
                  </div>
                )
              ))}
            </div>
          )}
          {aiResult.album_concepts&&(
            <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:10,color:C.pink,fontWeight:700,marginBottom:10}}>💿 앨범 컨셉 아이디어</div>
              {aiResult.album_concepts.map((a,i)=>(
                <div key={i} style={{background:C.surface2,borderRadius:10,padding:12,marginBottom:8}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:3}}>{a.title}</div>
                  <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{a.theme}</div>
                  {a.tracks&&<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{a.tracks.map((t,ti)=><span key={ti} style={{fontSize:10,background:C.purpleDim,color:C.purple,border:`1px solid ${C.purpleMid}`,padding:"2px 7px",borderRadius:10}}>{t}</span>)}</div>}
                </div>
              ))}
            </div>
          )}
          {aiResult.viral_concepts&&(
            <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:10,color:C.green,fontWeight:700,marginBottom:8}}>🔥 바이럴 아이디어</div>
              {aiResult.viral_concepts.map((v,i)=><div key={i} style={{fontSize:12,color:C.muted,padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>• {v}</div>)}
            </div>
          )}
        </div>
      )}
      {aiResult?.error&&<div style={{background:C.redDim,borderRadius:10,padding:12,border:`1px solid ${C.red}33`,fontSize:12,color:C.red}}>❌ {aiResult.error}</div>}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 탭4: 수익화 가이드
// ══════════════════════════════════════════════════════════════
const MonetizeTab=()=>{
  const roadmap=[
    {phase:"Phase 1",title:"Suno Pro + 음원 준비",icon:"🎵",color:C.purple,items:[
      {title:"Suno Pro 플랜 ($8/월) 구독",desc:"상업적 이용 필수. suno.com에서 구독."},
      {title:"음원 WAV 파일 다운로드",desc:"최고 품질로 다운로드. MP3보다 WAV 권장."},
      {title:"Audacity로 -14 LUFS 노멀라이제이션",desc:"무료. Effect → Loudness Normalization → -14 LUFS."},
      {title:"커버아트 제작 (3000×3000px)",desc:"Canva 무료 플랜. 정사각형 PNG 또는 JPG."},
    ]},
    {phase:"Phase 2",title:"DistroKid 배급",icon:"🚀",color:C.pink,items:[
      {title:"AI 생성 음원 체크박스 필수 체크",desc:"미체크 시 계정 정지 위험."},
      {title:"장르·서브장르 정확히 설정",desc:"알고리즘 추천 핵심. 넓은 장르보다 세분화."},
      {title:"발매일 금요일, 2주 전 업로드",desc:"Spotify 에디토리얼 주기 맞춤."},
      {title:"YouTube Money 옵션 체크",desc:"내 음악 사용하는 모든 유튜브 영상에서 자동 수익."},
    ]},
    {phase:"Phase 3",title:"Spotify 피칭 & 홍보",icon:"🎧",color:C.cyan,items:[
      {title:"Spotify for Artists 등록",desc:"artists.spotify.com → DistroKid 연동."},
      {title:"발매 14일 전 피칭 신청",desc:"장르·분위기·악기 메타데이터 꼼꼼히."},
      {title:"독립 큐레이터 제출 (Submithub)",desc:"니치 플레이리스트 타겟."},
      {title:"발매 후 48시간 집중 홍보",desc:"초기 세이브·재생률이 알고리즘 결정."},
    ]},
    {phase:"Phase 4",title:"멀티 수익 채널",icon:"💰",color:C.gold,items:[
      {title:"Pond5 스톡뮤직 등록",desc:"영상 제작자 구매. 곡당 $5~$50."},
      {title:"4~6주마다 정기 발매",desc:"알고리즘 모멘텀 유지."},
      {title:"아티스트 소셜 채널 운영",desc:"30초 쇼츠로 바이럴 유도."},
      {title:"Bandcamp 직접 판매",desc:"수수료 10~15%로 가장 높은 수익률."},
    ]},
  ];
  const [checklist,setChecklist]=useState(()=>ls.get("monetize_check",roadmap.map(p=>p.items.map(()=>false))));
  const toggle=(pi,ii)=>{const u=checklist.map((p,pIdx)=>pIdx===pi?p.map((v,iIdx)=>iIdx===ii?!v:v):p);setChecklist(u);ls.set("monetize_check",u);};
  const total=roadmap.reduce((s,p)=>s+p.items.length,0);
  const done=checklist.reduce((s,p)=>s+p.filter(Boolean).length,0);
  const pct=Math.round(done/total*100);

  return(
    <div style={{flex:1,overflowY:"auto",padding:14}}>
      <div style={{background:C.surface,borderRadius:12,padding:14,marginBottom:14,border:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text}}>수익화 진행률</div>
          <div style={{fontSize:22,fontWeight:800,color:C.purple}}>{pct}%</div>
        </div>
        <div style={{height:8,background:C.border,borderRadius:4}}><div style={{height:"100%",borderRadius:4,background:`linear-gradient(90deg,${C.purple},${C.pink})`,width:`${pct}%`,transition:"width .6s"}}/></div>
        <div style={{fontSize:11,color:C.muted,marginTop:6}}>{done}/{total} 완료</div>
      </div>
      {roadmap.map((phase,pi)=>(
        <div key={pi} style={{background:C.surface,borderRadius:14,padding:14,marginBottom:12,border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,paddingBottom:10,borderBottom:`1px solid ${C.border}`}}>
            <span style={{fontSize:22}}>{phase.icon}</span>
            <div style={{flex:1}}><div style={{fontSize:10,color:phase.color,fontWeight:700,letterSpacing:1}}>{phase.phase}</div><div style={{fontSize:14,fontWeight:700,color:C.text}}>{phase.title}</div></div>
            <div style={{fontSize:12,color:phase.color,fontWeight:700}}>{checklist[pi].filter(Boolean).length}/{phase.items.length}</div>
          </div>
          {phase.items.map((item,ii)=>(
            <div key={ii} style={{marginBottom:8,background:C.surface2,borderRadius:10,padding:11,border:`1px solid ${checklist[pi][ii]?phase.color+"33":C.border}`,opacity:checklist[pi][ii]?0.7:1}}>
              <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                <button onClick={()=>toggle(pi,ii)} style={{width:21,height:21,borderRadius:5,flexShrink:0,marginTop:1,border:`2px solid ${checklist[pi][ii]?phase.color:C.border}`,background:checklist[pi][ii]?phase.color:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.bg}}>
                  {checklist[pi][ii]&&<Ic n="check" s={11}/>}
                </button>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:checklist[pi][ii]?C.muted:C.text,textDecoration:checklist[pi][ii]?"line-through":"none",marginBottom:3}}>{item.title}</div>
                  <div style={{fontSize:11,color:C.muted,lineHeight:1.6}}>{item.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{marginBottom:20}}/>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 탭5: 트랙 관리
// ══════════════════════════════════════════════════════════════
const TracksTab=()=>{
  const [tracks,setTracks]=useState(()=>ls.get("suno_tracks",[]));
  const PLATFORMS=[{id:"suno",label:"Suno",color:C.purple},{id:"distrokid",label:"DistroKid",color:C.pink},{id:"youtube",label:"YouTube",color:C.red},{id:"spotify",label:"Spotify",color:C.green}];
  const toggleP=(id,p)=>{const u=tracks.map(t=>t.id===id?{...t,platforms:{...t.platforms,[p]:!t.platforms?.[p]}}:t);setTracks(u);ls.set("suno_tracks",u);};
  const updateRev=(id,v)=>{const u=tracks.map(t=>t.id===id?{...t,revenue:v}:t);setTracks(u);ls.set("suno_tracks",u);};
  const del=(id)=>{const u=tracks.filter(t=>t.id!==id);setTracks(u);ls.set("suno_tracks",u);};

  if(!tracks.length)return(
    <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10,color:C.muted,padding:30,textAlign:"center"}}>
      <div style={{fontSize:40}}>🎵</div>
      <div style={{fontSize:14,fontWeight:700,color:C.text}}>저장된 트랙이 없어요</div>
      <div style={{fontSize:12,lineHeight:1.8}}>작곡 탭에서 생성 후 "저장" 버튼을 누르면 여기에 나타나요</div>
    </div>
  );

  return(
    <div style={{flex:1,overflowY:"auto",padding:14}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {[{l:"총 트랙",v:tracks.length,c:C.purple},{l:"배급 완료",v:tracks.filter(t=>t.platforms?.distrokid).length,c:C.pink},{l:"YouTube",v:tracks.filter(t=>t.platforms?.youtube).length,c:C.red}].map((s,i)=>(
          <div key={i} style={{background:C.surface,borderRadius:10,padding:"10px 8px",border:`1px solid ${C.border}`,textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:9,color:C.muted,marginTop:2}}>{s.l}</div>
          </div>
        ))}
      </div>
      {tracks.map(track=>(
        <div key={track.id} style={{background:C.surface,borderRadius:14,padding:14,marginBottom:10,border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:C.purpleDim,border:`1px solid ${C.purpleMid}`,display:"flex",alignItems:"center",justifyContent:"center",color:C.purple,flexShrink:0}}><Ic n="music" s={16}/></div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:C.text}}>{track.title}</div>
              <div style={{fontSize:10,color:C.muted}}>{track.genre&&`${track.genre} · `}{track.createdAt}</div>
            </div>
            <button onClick={()=>del(track.id)} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",padding:4,display:"flex"}}><Ic n="trash" s={14}/></button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
            {PLATFORMS.map(p=>(
              <button key={p.id} onClick={()=>toggleP(track.id,p.id)} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 10px",background:track.platforms?.[p.id]?`${p.color}18`:"transparent",border:`1px solid ${track.platforms?.[p.id]?p.color:C.border}`,borderRadius:8,cursor:"pointer",fontFamily:"inherit"}}>
                <div style={{width:15,height:15,borderRadius:4,border:`1.5px solid ${track.platforms?.[p.id]?p.color:C.border}`,background:track.platforms?.[p.id]?p.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:C.bg,flexShrink:0}}>
                  {track.platforms?.[p.id]&&<Ic n="check" s={9}/>}
                </div>
                <span style={{fontSize:10,color:track.platforms?.[p.id]?p.color:C.muted,fontWeight:track.platforms?.[p.id]?700:400}}>{p.label}</span>
              </button>
            ))}
          </div>
          <input value={track.revenue||""} onChange={e=>updateRev(track.id,e.target.value)} placeholder="수익 메모 (예: Spotify $12, YouTube $8)" style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.muted,padding:"7px 10px",fontSize:11,outline:"none",fontFamily:"inherit",boxSizing:"border-box"}}/>
        </div>
      ))}
      <div style={{marginBottom:20}}/>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 메인
// ══════════════════════════════════════════════════════════════
export default function App(){
  const [tab,setTab]=useState("home");
  const tabs=[
    {id:"home",icon:<Ic n="home" s={17}/>,label:"홈"},
    {id:"composer",icon:<Ic n="music" s={17}/>,label:"작곡"},
    {id:"artist",icon:<Ic n="user" s={17}/>,label:"아티스트"},
    {id:"monetize",icon:<Ic n="dollar" s={17}/>,label:"수익화"},
    {id:"tracks",icon:<Ic n="list" s={17}/>,label:"트랙"},
  ];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100dvh",background:C.bg,fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif",color:C.text,overflow:"hidden"}}>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,paddingTop:"calc(10px + env(safe-area-inset-top,0px))"}}>
        <div>
          <div style={{fontSize:14,fontWeight:800,letterSpacing:2,lineHeight:1,background:"linear-gradient(135deg,#9b6dff,#ff6db3)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>SUNO AGENT</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
            <div style={{fontSize:8,color:C.dim,letterSpacing:2}}>AI ARTIST STUDIO</div>
            <div style={{background:C.purpleDim,border:`1px solid ${C.purpleMid}`,borderRadius:3,padding:"1px 5px",fontSize:8,color:C.purple,fontFamily:"monospace"}}>v1.1</div>
            <div style={{fontSize:8,color:C.dim}}>2026.04.29</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,color:C.muted}}>{new Date().toLocaleDateString("ko-KR",{month:"short",day:"numeric",weekday:"short"})}</div>
          <div style={{fontSize:9,color:C.purple}}>● STUDIO</div>
        </div>
      </div>
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        {tab==="home"&&<HomeTab setTab={setTab}/>}
        {tab==="composer"&&<ComposerTab/>}
        {tab==="artist"&&<ArtistTab/>}
        {tab==="monetize"&&<MonetizeTab/>}
        {tab==="tracks"&&<TracksTab/>}
      </div>
      <div style={{background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",flexShrink:0,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
        {tabs.map(t=><Tab key={t.id} active={tab===t.id} onClick={()=>setTab(t.id)} icon={t.icon} label={t.label}/>)}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}*{-webkit-tap-highlight-color:transparent;box-sizing:border-box;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#2a2040;border-radius:2px;}input::placeholder,textarea::placeholder{color:#4a3d66;}`}</style>
    </div>
  );
}
