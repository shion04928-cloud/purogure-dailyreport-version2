import Link from 'next/link';

// ── モックアップ用コンポーネント ──

function MockChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${
      active
        ? 'bg-[#FFE2E2] text-gray-900 border-[#FFB0B0]'
        : 'bg-white text-gray-600 border-gray-200'
    }`}>{label}</span>
  );
}

function MockSectionLabel({ label }: { label: string }) {
  return (
    <div className="bg-[#FFE2E2] rounded-lg px-3 py-2 mb-3">
      <span className="text-sm font-bold text-gray-800">{label}</span>
    </div>
  );
}

function MockTextArea({ placeholder }: { placeholder: string }) {
  return (
    <div className="border border-gray-200 rounded-xl px-3 py-2 bg-white">
      <span className="text-sm text-gray-300">{placeholder}</span>
    </div>
  );
}

function MockCopyButton() {
  return (
    <div className="bg-gray-900 rounded-xl px-4 py-3 text-center">
      <span className="text-base font-bold text-white">レポートをコピー</span>
    </div>
  );
}

function MockScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mt-3">
      {children}
    </div>
  );
}

function StepBadge({ n }: { n: number }) {
  return (
    <div className="w-10 h-10 rounded-full bg-[#FFE2E2] border-2 border-[#FFB0B0] text-gray-900 flex items-center justify-center font-bold text-lg shrink-0">
      {n}
    </div>
  );
}

function SpreadsheetCell({ children, header }: { children: React.ReactNode; header?: boolean }) {
  return (
    <div className={`border border-gray-300 px-3 py-2 text-sm ${header ? 'bg-gray-100 font-bold text-gray-600' : 'bg-white text-gray-700'}`}>
      {children}
    </div>
  );
}

// ── ページ本体 ──

export default function HelpPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* ヘッダー */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/daily"
            className="bg-white border border-gray-200 text-gray-500 font-medium px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-all"
          >
            ← もどる
          </Link>
          <div className="bg-[#FFE2E2] rounded-xl px-5 py-2.5">
            <h1 className="text-xl font-bold text-gray-900">使い方ガイド</h1>
          </div>
        </div>

        {/* ============================
            第１章：日報の作り方
        ============================= */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100">
            日報の作り方
          </h2>

          <div className="flex flex-col gap-8">

            {/* 手順1 */}
            <div className="flex gap-4">
              <StepBadge n={1} />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-base mb-1">パスワードを入力してログインする</p>
                <p className="text-sm text-gray-500 mb-3">アプリを開いたら、パスワードを入力して「ログイン」ボタンを押します。</p>
                <MockScreen>
                  <div className="bg-white rounded-2xl p-5 max-w-xs mx-auto border border-gray-100 shadow-sm">
                    <div className="bg-[#FFE2E2] rounded-xl px-4 py-3 text-center mb-4">
                      <p className="font-bold text-gray-900 text-sm">日報入力</p>
                    </div>
                    <p className="text-xs text-gray-400 text-center mb-3">パスワードを入力してください</p>
                    <div className="border-2 border-[#FFB0B0] rounded-xl px-3 py-2 text-center text-sm text-gray-400 mb-3 bg-[#FFF5F5]">
                      ••••••••••
                    </div>
                    <div className="bg-gray-900 rounded-xl px-4 py-2 text-center">
                      <span className="text-sm font-bold text-white">ログイン</span>
                    </div>
                  </div>
                </MockScreen>
              </div>
            </div>

            {/* 手順2 */}
            <div className="flex gap-4">
              <StepBadge n={2} />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-base mb-1">「挨拶」「健康管理」をタップする</p>
                <p className="text-sm text-gray-500 mb-3">入室時に行ったことをタップします。選んだボタンは<span className="font-bold text-gray-800">ピンク色</span>に変わります。</p>
                <MockScreen>
                  <MockSectionLabel label="① 入室" />
                  <div className="flex flex-wrap gap-2">
                    <MockChip label="挨拶" active />
                    <MockChip label="健康管理" active />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">← ピンクになったら選択済みです</p>
                </MockScreen>
              </div>
            </div>

            {/* 手順3 */}
            <div className="flex gap-4">
              <StepBadge n={3} />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-base mb-1">ご本人の様子を入力する（任意）</p>
                <p className="text-sm text-gray-500 mb-3">利用者さんが話されたことや気になる様子などを自由に入力できます。入力しなくても大丈夫です。</p>
                <MockScreen>
                  <div className="border border-gray-200 rounded-xl px-4 py-3 bg-white">
                    <span className="text-sm text-gray-700">「よく眠れた」と笑顔でお話しされる</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">↑ このように自由に書けます</p>
                </MockScreen>
              </div>
            </div>

            {/* 手順4 */}
            <div className="flex gap-4">
              <StepBadge n={4} />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-base mb-1">行ったサービスをタップして選ぶ</p>
                <p className="text-sm text-gray-500 mb-3">「② 身体介護」「③ 生活援助」の中から、この日に行ったサービスをすべて選びます。複数タップできます。</p>
                <MockScreen>
                  <div className="flex flex-col gap-3">
                    <div>
                      <MockSectionLabel label="② 身体介護" />
                      <p className="text-xs text-gray-400 mb-1.5">整容</p>
                      <div className="flex flex-wrap gap-2">
                        <MockChip label="洗面" active />
                        <MockChip label="口腔ケア" active />
                        <MockChip label="更衣介助" />
                      </div>
                    </div>
                    <div>
                      <MockSectionLabel label="③ 生活援助" />
                      <p className="text-xs text-gray-400 mb-1.5">清掃</p>
                      <div className="flex flex-wrap gap-2">
                        <MockChip label="居室" active />
                        <MockChip label="台所" active />
                        <MockChip label="浴室" />
                      </div>
                    </div>
                  </div>
                </MockScreen>
              </div>
            </div>

            {/* 手順5 */}
            <div className="flex gap-4">
              <StepBadge n={5} />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-base mb-1">退室確認をタップする</p>
                <p className="text-sm text-gray-500 mb-3">「④ 退室確認」で確認した項目をタップします。退室時の様子も書けます。</p>
                <MockScreen>
                  <MockSectionLabel label="④ 退室確認" />
                  <div className="flex flex-wrap gap-2">
                    <MockChip label="火元" active />
                    <MockChip label="電気" active />
                    <MockChip label="水道" />
                    <MockChip label="戸締り" active />
                  </div>
                  <div className="mt-3">
                    <MockTextArea placeholder="退室時の様子・締め（任意）" />
                  </div>
                </MockScreen>
              </div>
            </div>

            {/* 手順6 */}
            <div className="flex gap-4">
              <StepBadge n={6} />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-base mb-1">「レポートをコピー」ボタンを押す</p>
                <p className="text-sm text-gray-500 mb-3">黒いボタンを押すと、日報の文章が自動的に作られてコピーされます。</p>
                <MockScreen>
                  <MockCopyButton />
                  <div className="mt-3 bg-[#FFF5F5] border border-[#FFD0D0] rounded-xl p-3">
                    <p className="text-xs text-[#FF9090] font-bold mb-1">コピーした内容</p>
                    <p className="text-xs text-gray-700 leading-relaxed">挨拶して入室し、体調をお変わりないかご確認しました。「よく眠れた」と笑顔でお話しされる。続いて、洗面のお手伝いをし、口腔ケアをしました。居室・台所を清掃しました。火元・電気・戸締りを確認して退室しました。</p>
                  </div>
                </MockScreen>
              </div>
            </div>

            {/* 手順7 */}
            <div className="flex gap-4">
              <StepBadge n={7} />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-base mb-1">日報システムに貼り付ける</p>
                <p className="text-sm text-gray-500">日報記入欄を開き、<span className="font-bold">長押しして「貼り付け」</span>を選ぶと、コピーした文章が入力されます。</p>
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 font-bold mb-2">貼り付けのやり方</p>
                  <ul className="text-sm text-gray-500 flex flex-col gap-1">
                    <li>スマホ・タブレット → 入力欄を長押し →「貼り付け」</li>
                    <li>パソコン → 入力欄をクリック → Ctrl+V</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ============================
            第２章：スプレッドシートへのテンプレ追加
        ============================= */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 pb-3 border-b border-gray-100">
            スプレッドシートへのテンプレ追加
          </h2>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">テンプレを変更・追加したいときは、Googleスプレッドシートに直接入力するだけです。特別な操作は必要ありません。</p>
          </div>

          <div className="flex flex-col gap-8">

            {/* 手順1 */}
            <div className="flex gap-4">
              <StepBadge n={1} />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-base mb-1">Googleスプレッドシートを開く</p>
                <p className="text-sm text-gray-500">担当者から共有されたスプレッドシートのURLを開きます。</p>
              </div>
            </div>

            {/* 手順2 */}
            <div className="flex gap-4">
              <StepBadge n={2} />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-base mb-1">A列にコードを入力する</p>
                <p className="text-sm text-gray-500 mb-3">アプリ右側の「スプシ用コード」から使いたいコードをコピーして、A列に貼り付けます。</p>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-1.5">
                      <span className="text-xs text-gray-400">hint</span>
                      <span className="font-mono text-sm font-bold text-gray-700 ml-1">挨拶</span>
                    </div>
                    <span className="text-sm text-gray-500">← 右のリストを押してコピー</span>
                  </div>
                </div>
                <MockScreen>
                  <div className="overflow-hidden rounded-xl border border-gray-300">
                    <div className="grid grid-cols-2">
                      <SpreadsheetCell header>A列（コード）</SpreadsheetCell>
                      <SpreadsheetCell header>B列（テンプレ文章）</SpreadsheetCell>
                      <SpreadsheetCell>
                        <span className="font-bold text-gray-800">挨拶</span>
                      </SpreadsheetCell>
                      <SpreadsheetCell>（B列に文章を入力）</SpreadsheetCell>
                      <SpreadsheetCell>
                        <span className="font-bold text-gray-800">健康管理</span>
                      </SpreadsheetCell>
                      <SpreadsheetCell>（B列に文章を入力）</SpreadsheetCell>
                      <SpreadsheetCell>
                        <span className="font-bold text-gray-800">トイレ介助</span>
                      </SpreadsheetCell>
                      <SpreadsheetCell>（B列に文章を入力）</SpreadsheetCell>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">← A列には右サイドのコードをそのままコピー</p>
                </MockScreen>
              </div>
            </div>

            {/* 手順3 */}
            <div className="flex gap-4">
              <StepBadge n={3} />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-base mb-1">B列にテンプレ文章を入力する</p>
                <p className="text-sm text-gray-500 mb-3">B列に使いたい文章を入力します。同じコードで複数のテンプレを登録すると、ランダムで選ばれます。</p>
                <MockScreen>
                  <div className="overflow-hidden rounded-xl border border-gray-300">
                    <div className="grid grid-cols-2">
                      <SpreadsheetCell header>A列（コード）</SpreadsheetCell>
                      <SpreadsheetCell header>B列（テンプレ文章）</SpreadsheetCell>
                      <SpreadsheetCell>挨拶</SpreadsheetCell>
                      <SpreadsheetCell>挨拶して入室しました</SpreadsheetCell>
                      <SpreadsheetCell>挨拶</SpreadsheetCell>
                      <SpreadsheetCell>チャイムを鳴らし入室しました</SpreadsheetCell>
                      <SpreadsheetCell>健康管理</SpreadsheetCell>
                      <SpreadsheetCell>体調をご確認しました</SpreadsheetCell>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">同じコードを2行入れると、どちらかがランダムで使われます</p>
                </MockScreen>
              </div>
            </div>

            {/* 手順4 */}
            <div className="flex gap-4">
              <StepBadge n={4} />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-base mb-1">保存すると自動的に反映される</p>
                <p className="text-sm text-gray-500">入力が終わったら保存するだけです。次にアプリを開くと、新しいテンプレが使われます。</p>
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700 font-bold">反映されないときは</p>
                  <p className="text-sm text-gray-500 mt-1">アプリのページを再読み込みしてください（ブラウザの更新ボタンを押す）</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ============================
            使えるコード一覧
        ============================= */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b border-gray-100">
            使えるコード一覧
          </h2>
          <p className="text-sm text-gray-500 mb-4">スプレッドシートのA列には、以下のコードをそのまま入力してください。</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              '挨拶', '健康管理', 'トイレ介助', 'トイレ誘導',
              '全身清拭', '部分清拭', '洗髪', '一般浴', 'シャワー浴', '機械浴',
              '洗面', '口腔ケア', '更衣介助', '移動介助', '起床介助', '就寝介助',
              '服薬確認', '安全確保',
              '清掃_居室', '清掃_トイレ', '清掃_ベッド', '清掃_台所', '清掃_浴室',
              'ゴミ出し', '洗濯', '調理', '配下膳', '配膳のみ', '買物',
            ].map(code => (
              <div
                key={code}
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
              >
                <span className="font-mono text-sm font-bold text-gray-700">{code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* フッター */}
        <div className="text-center py-4">
          <Link
            href="/daily"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-sm"
          >
            日報入力にもどる
          </Link>
        </div>

      </div>
    </main>
  );
}
