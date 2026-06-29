'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

type Category = {
  name: string;
  templates: string[];
};

type ApiResponse = {
  categories?: Category[];
  error?: string;
};

const LABEL_MAP: Record<string, string> = {
  '身1_整容':   '身１（整容）',
  '身1_食事':   '身１（食事）',
  '身2_入浴':   '身２（入浴）',
  '身2_移乗':   '身２（移乗）',
  '家1':        '家１',
  '家2_買物':   '家２（買い物）',
  '家2_調理':   '家２（調理）',
  '身体1生活1': '身体１生活１',
};

const DESC_MAP: Record<string, string> = {
  '身1_整容':   '洗面・口腔ケア・更衣',
  '身1_食事':   '朝食・昼食準備・配膳',
  '身2_入浴':   '入浴介助メイン',
  '身2_移乗':   'ベッド↔車椅子など',
  '家1':        '掃除・洗濯',
  '家2':        '調理',
  '身体1生活1': '身体介護＋生活援助',
};

const COLORS = [
  { card: 'border-blue-300 bg-blue-50 hover:bg-blue-100',     badge: 'bg-blue-500' },
  { card: 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100', badge: 'bg-indigo-500' },
  { card: 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100', badge: 'bg-emerald-500' },
  { card: 'border-teal-300 bg-teal-50 hover:bg-teal-100',     badge: 'bg-teal-500' },
  { card: 'border-orange-300 bg-orange-50 hover:bg-orange-100', badge: 'bg-orange-500' },
  { card: 'border-purple-300 bg-purple-50 hover:bg-purple-100', badge: 'bg-purple-500' },
  { card: 'border-rose-300 bg-rose-50 hover:bg-rose-100',     badge: 'bg-rose-500' },
];

const CODES = Object.keys(LABEL_MAP);

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      sessionStorage.setItem('auth', '1');
      onLogin();
    } else {
      setError(true);
      setPw('');
      inputRef.current?.focus();
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-md p-10 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-700 mb-2 text-center">日報テンプレート</h1>
        <p className="text-sm text-gray-400 mb-8 text-center">パスワードを入力してください</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={inputRef}
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="パスワード"
            className="border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-400 transition-colors"
          />
          {error && (
            <p className="text-red-500 text-sm text-center">パスワードが違います</p>
          )}
          <button
            type="submit"
            disabled={pw.length === 0}
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl text-lg transition-all duration-100"
          >
            ログイン
          </button>
        </form>
      </div>
    </main>
  );
}

export default function Home() {
  const [authed, setAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('auth') === '1') setAuthed(true);
    setAuthChecked(true);
    // ログイン前からバックグラウンドでデータ取得開始
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        if (data.error) setError(data.error);
        else if (data.categories) setCategories(data.categories);
      })
      .catch(() => setError('データの取得に失敗しました'))
      .finally(() => setLoading(false));
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  };

  const handleCopy = useCallback(async (category: Category) => {
    if (category.templates.length === 0) return;
    const text = category.templates[Math.floor(Math.random() * category.templates.length)];
    await copyToClipboard(text);
    setCopiedText(text);
    setToastMsg('✓ コピーしました');
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }, []);

  const handleCodeCopy = useCallback(async (code: string) => {
    await copyToClipboard(code);
    setToastMsg(`✓ "${code}" をコピー`);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }, []);

  if (!authChecked) return null;
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center px-6 py-10 gap-6">

      <h1 className="text-3xl font-bold text-gray-700">日報テンプレート</h1>

      {loading && (
        <div className="flex items-center gap-3 text-gray-500 text-lg">
          <div className="w-5 h-5 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          読み込み中...
        </div>
      )}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-700 rounded-2xl px-6 py-4 text-base font-medium">
          ⚠ {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── コピーした内容 ── */}
          <div className={`w-full max-w-2xl transition-all duration-300 ${copiedText ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-green-50 border-2 border-green-400 rounded-3xl px-6 py-5 shadow-sm">
              <p className="text-sm font-bold text-green-600 mb-2">✓ コピーした内容</p>
              <p className="text-lg text-gray-800 leading-relaxed">{copiedText ?? '　'}</p>
            </div>
          </div>

          {/* ── 日報コピーカード ── */}
          <div className="w-full max-w-2xl">
            <p className="text-sm font-semibold text-gray-400 mb-3 tracking-wide">日報テンプレートをコピー</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categories.map((cat, i) => {
                const color = COLORS[i % COLORS.length];
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCopy(cat)}
                    className={`${color.card} border-2 rounded-2xl p-4 text-left transition-all duration-100 active:brightness-90 select-none`}
                  >
                    <span className={`inline-block text-white text-xs font-bold px-2 py-0.5 rounded-md mb-2 ${color.badge}`}>
                      コピー
                    </span>
                    <p className="font-bold text-gray-800 text-base leading-snug">
                      {LABEL_MAP[cat.name] ?? cat.name}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {DESC_MAP[cat.name] ?? ''}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 区切り ── */}
          <div className="w-full max-w-2xl border-t-2 border-dashed border-gray-300" />

          {/* ── スプレッドシートコードエリア ── */}
          <div className="w-full max-w-2xl">
            <p className="text-sm font-semibold text-gray-400 mb-3 tracking-wide">スプレッドシート入力用（A列コード）</p>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CODES.map((code) => (
                  <button
                    key={code}
                    onClick={() => handleCodeCopy(code)}
                    className="bg-gray-50 hover:bg-gray-100 active:bg-gray-200 border border-gray-300 text-gray-700 font-mono font-semibold text-sm px-4 py-3 rounded-xl transition-all duration-100 select-none text-left"
                  >
                    <span className="block text-xs text-gray-400 mb-0.5">コピー</span>
                    {code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* トースト */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl transition-all duration-300 whitespace-nowrap ${
          toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        {toastMsg}
      </div>
    </main>
  );
}
