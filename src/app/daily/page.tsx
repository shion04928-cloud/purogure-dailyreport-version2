'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

type Category = { name: string; templates: string[] };

type FormState = {
  aisatsu: boolean;
  userState: string;
  closingNote: string;
  toiletAssist: boolean;
  toiletGuide: boolean;
  senshoku: string;
  hairWash: boolean;
  zenshinyoku: string;
  facialCare: boolean;
  oralCare: boolean;
  dressing: boolean;
  movementAssist: boolean;
  wakeAssist: boolean;
  sleepAssist: boolean;
  medicationCheck: boolean;
  safeguard: boolean;
  healthManagement: boolean;
  cleanRoom: boolean;
  cleanToilet: boolean;
  cleanBed: boolean;
  cleanKitchen: boolean;
  cleanBath: boolean;
  garbageOut: boolean;
  laundry: boolean;
  cooking: boolean;
  serving: boolean;
  servingOnly: boolean;
  shopping: boolean;
  fireCheck: boolean;
  electricCheck: boolean;
  waterCheck: boolean;
  lockCheck: boolean;
};

const initial: FormState = {
  aisatsu: false,
  userState: '',
  closingNote: '',
  toiletAssist: false,
  toiletGuide: false,
  senshoku: '',
  hairWash: false,
  zenshinyoku: '',
  facialCare: false,
  oralCare: false,
  dressing: false,
  movementAssist: false,
  wakeAssist: false,
  sleepAssist: false,
  medicationCheck: false,
  safeguard: false,
  healthManagement: false,
  cleanRoom: false,
  cleanToilet: false,
  cleanBed: false,
  cleanKitchen: false,
  cleanBath: false,
  garbageOut: false,
  laundry: false,
  cooking: false,
  serving: false,
  servingOnly: false,
  shopping: false,
  fireCheck: false,
  electricCheck: false,
  waterCheck: false,
  lockCheck: false,
};

const SHEET_CODES: { code: string; hint: string }[] = [
  { code: '挨拶',         hint: '挨拶' },
  { code: 'トイレ介助',   hint: 'トイレ介助' },
  { code: 'トイレ誘導',   hint: 'トイレ誘導' },
  { code: '全身清拭',     hint: '清拭→全身' },
  { code: '部分清拭',     hint: '清拭→部分' },
  { code: '洗髪',         hint: '洗髪' },
  { code: '一般浴',       hint: '全身浴→一般' },
  { code: 'シャワー浴',   hint: '全身浴→シャワー' },
  { code: '機械浴',       hint: '全身浴→機械' },
  { code: '洗面',         hint: '洗面' },
  { code: '口腔ケア',     hint: '口腔ケア' },
  { code: '更衣介助',     hint: '更衣介助' },
  { code: '移動介助',     hint: '移動介助' },
  { code: '起床介助',     hint: '起床介助' },
  { code: '就寝介助',     hint: '就寝介助' },
  { code: '服薬確認',     hint: '服薬確認' },
  { code: '安全確保',     hint: '安全確保' },
  { code: '健康管理',     hint: '健康管理' },
  { code: '清掃_居室',    hint: '清掃→居室' },
  { code: '清掃_トイレ',  hint: '清掃→トイレ' },
  { code: '清掃_ベッド',  hint: '清掃→ベッド' },
  { code: '清掃_台所',    hint: '清掃→台所' },
  { code: '清掃_浴室',    hint: '清掃→浴室' },
  { code: 'ゴミ出し',     hint: 'ゴミ出し' },
  { code: '洗濯',         hint: '洗濯' },
  { code: '調理',         hint: '調理' },
  { code: '配下膳',       hint: '配膳・下膳' },
  { code: '配膳のみ',     hint: '配膳のみ' },
  { code: '買物',         hint: '日常品等の買物' },
];

function buildMap(categories: Category[]): Map<string, string[]> {
  return new Map(categories.map(c => [c.name, c.templates]));
}

function pick(map: Map<string, string[]>, key: string, fallback: string): string {
  const ts = map.get(key);
  const text = (!ts || ts.length === 0) ? fallback : ts[Math.floor(Math.random() * ts.length)];
  return text.replace(/[。、．,]+$/, '');
}

function oneOf(opts: string[]): string {
  return opts[Math.floor(Math.random() * opts.length)];
}

function generateReport(f: FormState, map: Map<string, string[]>): string {
  const segs: string[] = [];
  const done = new Set<string>();
  const use = (...keys: string[]) => keys.forEach(k => done.add(k));
  const avail = (k: string) => !done.has(k);
  let prefix = '';
  let firstCare = true;

  const add = (text: string) => { segs.push(prefix + text); prefix = ''; };

  const addC = (text: string) => {
    const conn = (firstCare && segs.length > 0) ? oneOf(['その後、', '続いて、']) : '';
    firstCare = false;
    add(conn + text);
  };

  const toConn = (s: string) =>
    s.replace(/しました$/, 'し').replace(/ました$/, '').replace(/済みです$/, '済ませ');

  // ── 入室 ──
  if (f.aisatsu && f.healthManagement) {
    add(oneOf([
      '挨拶して入室し、体調をお変わりないかご確認しました',
      'チャイムを鳴らし挨拶して入室し、ご気分をお聞きしました',
    ]));
    use('aisatsu', 'healthManagement');
  } else if (f.aisatsu) {
    prefix = oneOf(['挨拶して入室し、', 'チャイムを鳴らし挨拶して入室し、']);
    use('aisatsu');
  } else if (f.healthManagement) {
    add(pick(map, '健康管理', '体調をお変わりないかご確認しました'));
    use('healthManagement');
  }

  if (f.userState.trim()) add(f.userState.trim());

  // ── 身体介護 ──
  const body: string[] = [];
  const bd = (s: string) => body.push(s);

  if (f.wakeAssist) {
    const wF = f.facialCare, wO = f.oralCare, wD = f.dressing;
    if (wF && wO && wD) {
      bd(oneOf(['声掛けして起床を介助し、洗面・口腔ケアを済ませ、更衣のお手伝いをしました', '起床のお手伝いをし、洗面・口腔ケア・更衣のお手伝いをしました']));
      use('wakeAssist', 'facialCare', 'oralCare', 'dressing');
    } else if (wF && wO) {
      bd(oneOf(['声掛けして起床を介助し、洗面・口腔ケアをしました', '起床のお手伝いをし、洗面・口腔ケアをしました']));
      use('wakeAssist', 'facialCare', 'oralCare');
    } else if (wD) {
      bd('起床のお手伝いをし、更衣をしました'); use('wakeAssist', 'dressing');
    } else {
      bd(pick(map, '起床介助', '起床のお手伝いをしました')); use('wakeAssist');
    }
  }

  if (f.toiletGuide || f.toiletAssist) {
    const withMove = f.movementAssist && avail('movementAssist');
    if (withMove && f.toiletGuide && f.toiletAssist) {
      bd(oneOf(['トイレへお誘いして移動を介助し、排泄介助をしました', 'トイレへの移動を介助し、排泄介助をしました']));
      use('movementAssist', 'toiletGuide', 'toiletAssist');
    } else if (withMove && f.toiletAssist) {
      bd('トイレへの移動を介助し、排泄介助をしました'); use('movementAssist', 'toiletAssist');
    } else if (f.toiletGuide && f.toiletAssist) {
      bd(oneOf(['トイレへお誘いし、排泄介助をしました', 'トイレ誘導・介助をしました'])); use('toiletGuide', 'toiletAssist');
    } else {
      if (f.toiletGuide)  { bd(pick(map, 'トイレ誘導', 'トイレへお誘いしました')); }
      if (f.toiletAssist) { bd(pick(map, 'トイレ介助', 'トイレ介助をしました')); }
    }
  }

  if (f.senshoku) {
    if (f.dressing && avail('dressing')) {
      bd(oneOf([`${f.senshoku}をし、更衣のお手伝いをしました`, `${f.senshoku}後に更衣をしました`])); use('senshoku', 'dressing');
    } else {
      bd(pick(map, f.senshoku, `${f.senshoku}をしました`)); use('senshoku');
    }
  }

  if (f.zenshinyoku) {
    const withMove = f.movementAssist && avail('movementAssist');
    const canHair  = f.hairWash && avail('hairWash');
    const canDress = f.dressing && avail('dressing');
    const b = f.zenshinyoku;
    if (withMove && canHair && canDress) {
      bd(oneOf([`浴室へ誘導して${b}・洗髪を実施し、更衣のお手伝いをしました`, `浴室への移動を介助し、${b}・洗髪を実施し、入浴後に更衣をしました`]));
      use('movementAssist', 'zenshinyoku', 'hairWash', 'dressing');
    } else if (withMove && canDress) {
      bd(oneOf([`浴室へ誘導して${b}を実施し、入浴後に更衣のお手伝いをしました`, `浴室への移動を介助し、${b}実施後に更衣をしました`]));
      use('movementAssist', 'zenshinyoku', 'dressing');
    } else if (withMove && canHair) {
      bd(oneOf([`浴室へ誘導して${b}・洗髪を実施しました`, `浴室への移動を介助し、洗髪しながら${b}を実施しました`]));
      use('movementAssist', 'zenshinyoku', 'hairWash');
    } else if (withMove) {
      bd(oneOf([`浴室へ誘導して${b}を実施しました`, `浴室への移動を介助し、${b}を実施しました`])); use('movementAssist', 'zenshinyoku');
    } else if (canHair && canDress) {
      bd(oneOf([`${b}・洗髪をし、入浴後に更衣のお手伝いをしました`, `${b}の介助をし、洗髪・更衣を済ませました`])); use('zenshinyoku', 'hairWash', 'dressing');
    } else if (canDress) {
      bd(oneOf([`${b}をし、入浴後に更衣のお手伝いをしました`, `${b}後に更衣のお手伝いをしました`])); use('zenshinyoku', 'dressing');
    } else if (canHair) {
      bd(oneOf([`${b}・洗髪をしました`, `洗髪しながら${b}を実施しました`])); use('zenshinyoku', 'hairWash');
    } else {
      bd(pick(map, b, `${b}に入っていただきました`)); use('zenshinyoku');
    }
  }

  if (f.hairWash && avail('hairWash')) bd(pick(map, '洗髪', '洗髪をしました'));

  const hasFacial = f.facialCare && avail('facialCare');
  const hasOral   = f.oralCare   && avail('oralCare');
  const hasDress  = f.dressing   && avail('dressing');
  if (hasFacial && hasOral && hasDress) {
    bd(oneOf(['洗面・口腔ケアをし、更衣のお手伝いをしました', '洗面・口腔ケア・更衣のお手伝いをしました'])); use('facialCare', 'oralCare', 'dressing');
  } else if (hasFacial && hasOral) {
    bd(oneOf(['洗面・口腔ケアをしました', '洗面のお手伝いをし、口腔ケアをしました'])); use('facialCare', 'oralCare');
  } else {
    if (hasFacial) { bd(pick(map, '洗面',     '洗面のお手伝いをしました')); use('facialCare'); }
    if (hasOral)   { bd(pick(map, '口腔ケア', '口腔ケアをしました'));       use('oralCare'); }
  }
  if (f.dressing && avail('dressing')) { bd(pick(map, '更衣介助', '更衣のお手伝いをしました')); use('dressing'); }
  if (f.movementAssist && avail('movementAssist')) bd(pick(map, '移動介助', '移動介助をしました'));
  if (f.sleepAssist) bd(pick(map, '就寝介助', '就寝のお手伝いをしました'));
  if (f.safeguard)   bd(pick(map, '安全確保', '室内の安全確認をしました'));

  if (body.length >= 2) {
    addC([...body.slice(0, -1).map(toConn), body[body.length - 1]].join('、'));
  } else if (body.length === 1) {
    addC(body[0]);
  }

  // ── 生活援助 ──
  type HK = { c: string; f: string };
  const hk: HK[] = [];
  const rooms: string[] = [];
  if (f.cleanRoom)    rooms.push('居室');
  if (f.cleanToilet)  rooms.push('トイレ');
  if (f.cleanBed)     rooms.push('ベッド周り');
  if (f.cleanKitchen) rooms.push('台所');
  if (f.cleanBath)    rooms.push('浴室');
  if (rooms.length >= 2) hk.push({ c: `${rooms.join('・')}を清掃し`, f: `${rooms.join('・')}を清掃しました` });
  else if (f.cleanRoom)    hk.push({ c: '居室を清掃し',     f: pick(map, '清掃_居室',   '居室を清掃しました') });
  else if (f.cleanToilet)  hk.push({ c: 'トイレを清掃し',   f: pick(map, '清掃_トイレ', 'トイレを清掃しました') });
  else if (f.cleanBed)     hk.push({ c: 'ベッド周りを整え', f: pick(map, '清掃_ベッド', 'ベッド周りを整えました') });
  else if (f.cleanKitchen) hk.push({ c: '台所を清掃し',     f: pick(map, '清掃_台所',   '台所を清掃しました') });
  else if (f.cleanBath)    hk.push({ c: '浴室を清掃し',     f: pick(map, '清掃_浴室',   '浴室を清掃しました') });
  if (f.garbageOut) hk.push({ c: 'ゴミ出しをし', f: pick(map, 'ゴミ出し', 'ゴミ出しをしました') });
  if (f.laundry)    hk.push({ c: '洗濯をし',     f: pick(map, '洗濯',     '洗濯をしました') });
  if (hk.length >= 2) addC([...hk.slice(0, -1).map(h => h.c), hk[hk.length - 1].f].join('、'));
  else if (hk.length === 1) addC(hk[0].f);

  // ── 食事 ──
  if (f.cooking && f.serving && f.medicationCheck) {
    addC(oneOf([
      '調理・配膳し、食後に下膳と服薬確認を済ませました',
      '献立をご相談して調理・配膳しました。食後に下膳をし、服薬確認済みです',
    ]));
    use('cooking', 'serving', 'medicationCheck');
  } else if (f.cooking && f.serving) {
    addC(oneOf([
      '調理・配膳し、食後に下膳をしました',
      '献立をご相談して調理・配膳し、食後に下膳と片付けをしました',
    ]));
    use('cooking', 'serving');
  } else if (f.serving && f.medicationCheck) {
    addC(oneOf(['配膳し、食後に下膳をし服薬確認済みです', '配膳・下膳をし、服薬確認済みです']));
    use('serving', 'medicationCheck');
  } else {
    if (f.cooking) addC(pick(map, '調理',   '調理をしました'));
    if (f.serving) addC(pick(map, '配下膳', '配膳・下膳をしました'));
  }

  if (f.servingOnly) addC(pick(map, '配膳のみ', '配膳をしました'));
  if (f.shopping)    addC(pick(map, '買物',     '日用品の買い物をしました'));

  // ── 退室 ──
  const exitItems: string[] = [];
  if (f.fireCheck)     exitItems.push('火元');
  if (f.electricCheck) exitItems.push('電気');
  if (f.waterCheck)    exitItems.push('水道');
  if (f.lockCheck)     exitItems.push('戸締り');
  const med = f.medicationCheck && avail('medicationCheck');
  if (med && exitItems.length > 0) {
    add(`服薬を確認し、${exitItems.join('・')}を確認して退室しました`);
  } else if (exitItems.length > 0) {
    add(`${exitItems.join('・')}を確認して退室しました`);
  } else if (med) {
    add('服薬確認済みです');
  }

  if (prefix) segs.push('挨拶して入室しました');
  if (f.closingNote.trim()) segs.push(f.closingNote.trim());

  return segs.length > 0 ? segs.join('。') + '。' : '';
}

// ── UIコンポーネント ──

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-full text-base font-semibold transition-all duration-100 select-none border-2 ${
        active
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500 active:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}

function RadioChip({ label, value, current, onChange }: {
  label: string; value: string; current: string; onChange: (v: string) => void;
}) {
  const active = current === value;
  return (
    <button
      onClick={() => onChange(active ? '' : value)}
      className={`px-4 py-2.5 rounded-full text-base font-semibold transition-all duration-100 select-none border-2 ${
        active
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500 active:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-bold text-gray-400 mb-2">{title}</p>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-5 bg-gray-800 rounded-full" />
      <h2 className="text-base font-bold text-gray-800">{label}</h2>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      sessionStorage.setItem('auth', '1');
      onLogin();
    } else {
      setError(true);
      setPw('');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#FFE2E2' }}>
      <div className="bg-white rounded-3xl shadow-md p-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">日報入力</h1>
          <p className="text-gray-400 mt-1 text-sm">パスワードを入力してください</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="パスワード"
            autoFocus
            className="border-2 border-gray-200 rounded-xl px-4 py-3 text-xl focus:outline-none focus:border-gray-400 transition-colors text-center tracking-widest"
          />
          {error && (
            <p className="text-red-500 text-sm text-center">パスワードが違います</p>
          )}
          <button
            type="submit"
            disabled={pw.length === 0}
            className="bg-gray-900 hover:bg-gray-700 active:bg-black disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-xl text-xl transition-all duration-100"
          >
            ログイン
          </button>
        </form>
      </div>
    </main>
  );
}

export default function DailyReportPage() {
  const [authed, setAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [form, setForm] = useState<FormState>(initial);
  const [templateMap, setTemplateMap] = useState<Map<string, string[]>>(new Map());
  const [copiedText, setCopiedText] = useState('');
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('auth') === '1') setAuthed(true);
    setAuthChecked(true);
    fetch('/api/templates')
      .then(r => r.json())
      .then(data => { if (data.categories) setTemplateMap(buildMap(data.categories)); })
      .catch(() => {});
  }, []);

  const toggle = useCallback((k: keyof FormState) =>
    setForm(p => ({ ...p, [k]: !p[k] })), []);

  const setStr = useCallback((k: keyof FormState, v: string) =>
    setForm(p => ({ ...p, [k]: v })), []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToast(true);
    setTimeout(() => setToast(false), 2000);
  }, []);

  const clipCopy = useCallback(async (text: string) => {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el); el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  }, []);

  const handleCopy = useCallback(async () => {
    const text = generateReport(form, templateMap);
    await clipCopy(text);
    setCopiedText(text);
    showToast('コピーしました！');
  }, [form, templateMap, clipCopy, showToast]);

  const handleCodeCopy = useCallback(async (code: string) => {
    await clipCopy(code);
    showToast(`"${code}" をコピーしました`);
  }, [clipCopy, showToast]);

  if (!authChecked) return null;
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <main className="min-h-screen px-3 py-6" style={{ backgroundColor: '#FFE2E2' }}>

      {/* ヘッダー */}
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-5">
        <h1 className="text-2xl font-bold text-gray-900">日報入力</h1>
        <Link
          href="/help"
          className="bg-white border border-gray-300 text-gray-600 font-medium px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-all"
        >
          使い方
        </Link>
      </div>

      <div className="flex gap-3 max-w-4xl mx-auto items-start">

        {/* ── 左：フォーム ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* ① 入室 */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <SectionLabel label="① 入室" />
            <div className="flex flex-wrap gap-2.5 mb-4">
              <Chip label="挨拶" active={form.aisatsu} onClick={() => toggle('aisatsu')} />
              <Chip label="健康管理" active={form.healthManagement} onClick={() => toggle('healthManagement')} />
            </div>
            <textarea
              value={form.userState}
              onChange={e => setForm(prev => ({ ...prev, userState: e.target.value }))}
              placeholder="ご本人の様子（例：「よく眠れた」と笑顔でお話しされる）"
              rows={2}
              className="w-full text-base border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-gray-400 text-gray-700 placeholder-gray-300"
            />
          </div>

          {/* ② 身体介護 */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <SectionLabel label="② 身体介護" />
            <div className="flex flex-col gap-5">
              <Group title="排泄">
                <Chip label="トイレ介助" active={form.toiletAssist} onClick={() => toggle('toiletAssist')} />
                <Chip label="トイレ誘導" active={form.toiletGuide}  onClick={() => toggle('toiletGuide')} />
              </Group>
              <Group title="清拭">
                <RadioChip label="全身清拭" value="全身清拭" current={form.senshoku} onChange={v => setStr('senshoku', v)} />
                <RadioChip label="部分清拭" value="部分清拭" current={form.senshoku} onChange={v => setStr('senshoku', v)} />
              </Group>
              <Group title="入浴">
                <RadioChip label="一般浴"    value="一般浴"    current={form.zenshinyoku} onChange={v => setStr('zenshinyoku', v)} />
                <RadioChip label="シャワー浴" value="シャワー浴" current={form.zenshinyoku} onChange={v => setStr('zenshinyoku', v)} />
              </Group>
              <Group title="整容">
                <Chip label="洗面"    active={form.facialCare}  onClick={() => toggle('facialCare')} />
                <Chip label="口腔ケア" active={form.oralCare}   onClick={() => toggle('oralCare')} />
                <Chip label="更衣介助" active={form.dressing}   onClick={() => toggle('dressing')} />
              </Group>
              <Group title="移動・起床就寝">
                <Chip label="移動介助" active={form.movementAssist} onClick={() => toggle('movementAssist')} />
                <Chip label="起床介助" active={form.wakeAssist}     onClick={() => toggle('wakeAssist')} />
                <Chip label="就寝介助" active={form.sleepAssist}    onClick={() => toggle('sleepAssist')} />
              </Group>
              <Group title="その他">
                <Chip label="服薬確認" active={form.medicationCheck} onClick={() => toggle('medicationCheck')} />
                <Chip label="安全確保" active={form.safeguard}       onClick={() => toggle('safeguard')} />
              </Group>
            </div>
          </div>

          {/* ③ 生活援助 */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <SectionLabel label="③ 生活援助" />
            <div className="flex flex-col gap-5">
              <Group title="清掃">
                <Chip label="居室"    active={form.cleanRoom}    onClick={() => toggle('cleanRoom')} />
                <Chip label="トイレ"  active={form.cleanToilet}  onClick={() => toggle('cleanToilet')} />
                <Chip label="ベッド"  active={form.cleanBed}     onClick={() => toggle('cleanBed')} />
                <Chip label="台所"    active={form.cleanKitchen} onClick={() => toggle('cleanKitchen')} />
                <Chip label="浴室"    active={form.cleanBath}    onClick={() => toggle('cleanBath')} />
                <Chip label="ゴミ出し" active={form.garbageOut}  onClick={() => toggle('garbageOut')} />
              </Group>
              <Group title="家事">
                <Chip label="洗濯"       active={form.laundry}     onClick={() => toggle('laundry')} />
                <Chip label="調理"       active={form.cooking}     onClick={() => toggle('cooking')} />
                <Chip label="配膳・下膳" active={form.serving}     onClick={() => toggle('serving')} />
                <Chip label="配膳のみ"   active={form.servingOnly} onClick={() => toggle('servingOnly')} />
                <Chip label="買い物"     active={form.shopping}    onClick={() => toggle('shopping')} />
              </Group>
            </div>
          </div>

          {/* ④ 退室確認 */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <SectionLabel label="④ 退室確認" />
            <div className="flex flex-wrap gap-2.5 mb-4">
              <Chip label="火元"   active={form.fireCheck}     onClick={() => toggle('fireCheck')} />
              <Chip label="電気"   active={form.electricCheck} onClick={() => toggle('electricCheck')} />
              <Chip label="水道"   active={form.waterCheck}    onClick={() => toggle('waterCheck')} />
              <Chip label="戸締り" active={form.lockCheck}     onClick={() => toggle('lockCheck')} />
            </div>
            <textarea
              value={form.closingNote}
              onChange={e => setForm(prev => ({ ...prev, closingNote: e.target.value }))}
              placeholder="退室時の様子・締め（例：「ありがとう」とお言葉をいただき退出）"
              rows={2}
              className="w-full text-base border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-gray-400 text-gray-700 placeholder-gray-300"
            />
          </div>

          {/* ⑤ ボタン */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleCopy}
              className="w-full bg-gray-900 hover:bg-gray-700 active:bg-black text-white font-bold py-5 rounded-2xl text-xl transition-all duration-100 shadow-sm"
            >
              レポートをコピー
            </button>
            <button
              onClick={() => { setForm(initial); setCopiedText(''); }}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-400 font-medium py-3 rounded-xl text-sm transition-all duration-100"
            >
              リセット（全部クリア）
            </button>
          </div>

          {/* コピーした文章プレビュー */}
          {copiedText && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-400 mb-2">コピーした内容</p>
              <p className="text-base text-gray-800 whitespace-pre-line leading-relaxed">{copiedText}</p>
            </div>
          )}
        </div>

        {/* ── 右：スプシ用コード ── */}
        <div className="w-36 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-3 sticky top-4">
            <p className="text-xs font-bold text-gray-500 mb-2 text-center">スプシ用コード</p>
            <div className="flex flex-col gap-1.5">
              {SHEET_CODES.map(({ code, hint }) => (
                <button key={code} onClick={() => handleCodeCopy(code)}
                  className="text-left bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-200 rounded-lg px-2 py-1.5 transition-all">
                  <span className="block text-xs text-gray-400 leading-none mb-0.5">{hint}</span>
                  <span className="font-mono text-xs font-bold text-gray-700 break-all">{code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* トースト */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-2xl text-base font-bold shadow-xl transition-all duration-300 whitespace-nowrap ${
        toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
        {toastMsg}
      </div>
    </main>
  );
}
