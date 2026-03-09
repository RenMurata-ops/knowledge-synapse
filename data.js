// Knowledge Synapse — Graph Data
// Generated from meeting minutes, memos, and business documents

const CATEGORIES = {
  meeting: { label: '議事録・MTG', color: '#00f0ff', icon: '📋' },
  strategy: { label: '戦略・構想', color: '#a855f7', icon: '🎯' },
  product: { label: 'プロダクト', color: '#f472b6', icon: '🚀' },
  finance: { label: '財務・税務', color: '#34d399', icon: '💰' },
  person: { label: '人物', color: '#fb923c', icon: '👤' },
  organization: { label: '組織・チーム', color: '#60a5fa', icon: '🏢' },
  concept: { label: 'コンセプト', color: '#fbbf24', icon: '💡' },
  decision: { label: '意思決定', color: '#f87171', icon: '⚡' },
};

const GRAPH_DATA = {
  nodes: [
    // ===== 議事録・MTG =====
    {
      id: 'mtg-ai-studio-hearing',
      label: 'AI編集スタジオ ヒアリング',
      category: 'meeting',
      date: '2025-01',
      description: 'AI編集スタジオとの初回ヒアリング。議事録からのタスク抽出・担当者振り分け・進捗管理の自動化について議論。現在月額20万円の秘書コストを置き換える構想。',
      keypoints: [
        '議事録→タスク抽出＋担当者→承認→送付の自動化フロー',
        '進捗確認の自動リマインダー（締切日の30%時点）',
        'ダッシュボードでの進捗確認',
        '現在の秘書コスト月額20万円の代替',
        '社長の「痒い所に手が届く」自動化'
      ],
      source: 'AI秘書/AI編集スタジオ ヒアリング.md',
      size: 14,
    },
    {
      id: 'mtg-ai-studio-pj',
      label: 'AI編集スタジオ×ポケットジャーニー MTG',
      category: 'meeting',
      date: '2025-01-20',
      description: '2025年1月20日。AI秘書事業の協業体制・法人設立・事業展開方針を議論。CEO人事、資本構成、秘書養成プログラム、toB/toC両面展開を決定。',
      keypoints: [
        '役割分担：村田=開発(COO/CFO/CTO)、ゆうきさん=マーケ(CMO)、礼雄さん=CEO',
        'Adobeのようなログインポータル構想',
        'kintone的な自由度のダッシュボード設計',
        '最短5月・最長8月リリース目標',
        'toB=営業チーム必要、toC=同時並行で進行',
        '設立費用は村田・ゆうきさんで折半'
      ],
      source: 'AI秘書/2025.1.20 16時 AI編集スタジオ×ポケットジャーニー.md',
      size: 16,
    },
    {
      id: 'mtg-yuki-call',
      label: 'ゆうきさんとの通話メモ',
      category: 'meeting',
      date: '2025-12-09',
      description: '担当者連携による自動運用・マージンモデル、TJ(Tribe Journey)とスクールの二層構造、財務・税務の知識ギャップと学習ニーズについて議論。',
      keypoints: [
        '担当者を繋いで自動運用→売上からマージン',
        'TJ=コミュニティ動画(基礎)、スクール=本格動画(応用)',
        'アップセル→コンサル等への導線設計',
        '財務諸表の理解が課題',
        '動画20本編集済→サイト埋め込み準備',
        '相互マージン40%の報酬体系',
        '財務コンサル獲得の必要性'
      ],
      source: '雑多なメモ/2025.12.9 20時30分 メモ.md',
      size: 14,
    },
    {
      id: 'mtg-requirements',
      label: '要件定義メモ（高市内閣の情報共有モデル）',
      category: 'meeting',
      date: '2025-12-08',
      description: '情報共有の理想モデルとして高市内閣の災害対応フローを分析。目的定義→KPI定義→要件定義→情報伝達という構造化プロセスを抽出。',
      keypoints: [
        '目的定義→KPI(必須条件)定義→KPI内包条件定義',
        '具体的な各所の対処要件への落とし込み',
        '情報伝達手法の事前定義の重要性',
        'トップダウンの構造的意思決定フロー'
      ],
      source: '雑多なメモ/【要件定義関連】2025.12.8 0時34分メモ.md',
      size: 10,
    },

    // ===== 戦略・構想 =====
    {
      id: 'strategy-ai-biz',
      label: 'AI事業 海外→日本ローカライズ戦略',
      category: 'strategy',
      date: '2026',
      description: '日本のAI実務利用率28.4%（米国45.2%）のギャップをビジネスチャンスと捉え、海外で実証済みのAI事業を日本にローカライズする戦略。',
      keypoints: [
        '医療AI（カルテ自動作成）→日本の電子カルテ現場への導入',
        '法務AI（契約リスク診断）→中小M&A市場',
        '物流AI→改正物流効率化法（2026年4月）対応需要',
        '教育AI→資格試験特化型の市場',
        '日本版AIエージェント→規制クリアした者が全市場獲得',
        '「先行者利益」を取りに行く方針'
      ],
      source: 'めも.md',
      size: 18,
    },
    {
      id: 'strategy-management',
      label: '経営ノウハウ体系（時間効率の最大化）',
      category: 'strategy',
      date: '2024',
      description: '経営の良し悪しは社長の時間効率で全て決まるという原則のもと、情報収集・思考・伝達・作業の4軸バランスと仕組み化について体系的にまとめた経営哲学。',
      keypoints: [
        '超大前提：経営の良し悪しは社長の時間効率で決まる',
        '時間量(2.5倍)より時間効率(無限)にレバレッジ',
        '「情報収集」「思考」「伝える」「作業」の4軸バランス',
        '作業は最悪の状態→光の速さで終わらせて人に渡す',
        '組織全体の効率を高める最強ツール=文化',
        '文化は価値観とプロセスの組み合わせ',
        '経営基盤の仕組み化が社長の仕事'
      ],
      source: 'めも2.md',
      size: 20,
    },
    {
      id: 'strategy-agiai',
      label: 'AGI時代への備え・発信戦略',
      category: 'strategy',
      date: '2025',
      description: 'AGI出現に備えた人類のバリュー定義と、そこに至る顧客育成型の発信戦略。AIを知る→使いこなす→組織する→全委任→AGI共存の段階設計。',
      keypoints: [
        '人類のバリュー：責任(社会的)・監査・ビジョン(エゴ)',
        'AGI到達時に即座にバリューが出せる仕組みづくり',
        '発信ステップ：知る→使う→組み合わせる→任せる→AGI共存',
        '顧客育成型のコンテンツ発信',
        '壮大なビジョンの設計と監査の仕組み'
      ],
      source: 'ZeroBoard：Project M4NTR4/めも.md',
      size: 14,
    },
    {
      id: 'strategy-tanaka',
      label: '田中暁成さん 全体構想',
      category: 'strategy',
      date: '2025',
      description: 'SNS自動運用・議事録蓄積・アプリ開発を柱とするクライアント管理システムの全体構想。',
      keypoints: [
        'X/Threads/Instagram自動運用→管理UIから一括管理',
        'Zoom/Google Meets議事録の自動蓄積・クライアント別管理',
        '図解機能（Miro的）で議事録を視覚化',
        '項目別×時系列の二軸検索',
        '「今回話すべき事案」が一目でわかるUI'
      ],
      source: '田中暁成さん/【全体構想ログ】.md',
      size: 14,
    },

    // ===== プロダクト =====
    {
      id: 'product-ai-secretary',
      label: 'AI秘書プロダクト',
      category: 'product',
      date: '2025-01',
      description: 'AIによるスケジュール調整・リマインド・タスク管理・ガントチャート・WBS機能を統合した秘書サービス。LINEグループに参加させる形で運用。',
      keypoints: [
        'AIスケジュール調整',
        'LINEリマインドメッセージ',
        'タスク管理・ガントチャート・WBS',
        '未完了タスクへの自動追いLINE',
        'LINEグループに入れる運用形態'
      ],
      source: 'Tribe Journey関連/AI秘書 構想.md',
      size: 16,
    },
    {
      id: 'product-portal',
      label: 'AI関連ポータル（Adobeモデル）',
      category: 'product',
      date: '2025-01',
      description: 'Adobeのようなログインポータルとして、スクール（AI使い方講義）とツール（業務効率化×AI）を統合。kintone的なカスタマイズ可能ダッシュボード。',
      keypoints: [
        'スクール：最低限のAI使い方講義',
        'ツール：タスク管理・スケジュール管理・プロジェクト管理',
        'オプション：チェックボックスで自在に追加',
        'kintone的な自分でダッシュボード設計',
        'AI情報特化メディアの立ち上げ'
      ],
      source: 'AI秘書/2025.1.20 16時 AI編集スタジオ×ポケットジャーニー.md',
      size: 14,
    },
    {
      id: 'product-lms',
      label: 'LMS（学習管理サイト）',
      category: 'product',
      date: '2025-12',
      description: '動画コンテンツを埋め込んだ学習管理サイト。TJ動画とスクール動画を分離し、購入者にシリアルナンバーで権限付与。',
      keypoints: [
        '動画20本の編集完了→サイト埋め込み',
        'TJ動画とスクール動画の分離管理',
        'シリアルナンバー（コード）での権限付与',
        'LP=文章もらって3日で完成可能'
      ],
      source: '雑多なメモ/2025.12.9 20時30分 メモ.md',
      size: 12,
    },
    {
      id: 'product-sns-auto',
      label: 'SNS自動運用システム',
      category: 'product',
      date: '2025',
      description: 'X、Threads、Instagramの自動運用を管理UIから一括管理。アカウント定義を入力し、各プラットフォーム用にコンテンツを自動生成。',
      keypoints: [
        '管理UIからアカウント定義入力',
        'Web→iOS&Androidで一括管理',
        'プラットフォーム別＋統合管理マスター版',
      ],
      source: '田中暁成さん/【全体構想ログ】.md',
      size: 12,
    },
    {
      id: 'product-minutes-system',
      label: '議事録自動蓄積システム',
      category: 'product',
      date: '2025',
      description: 'Zoom/Google Meetsの議事録をクライアントごとに自動蓄積。録音→議事録作成→図解→時系列整理の一気通貫フロー。',
      keypoints: [
        '録音→議事録作成→図解の自動化',
        'Miro的なシンプル図形と矢印での整理',
        'クライアント別×時系列の二軸管理',
        '「今回話すべき事案」の可視化'
      ],
      source: '田中暁成さん/【全体構想ログ】.md',
      size: 13,
    },

    // ===== 財務・税務 =====
    {
      id: 'finance-course',
      label: '財務・税務・法務講座（全10部構成）',
      category: 'finance',
      date: '2025',
      description: '個人事業主〜零細企業向けの超詳細な財務・税務・法務講座。Web無形商材販売に特化。全10部構成で体系的にカバー。',
      keypoints: [
        '第1部：事業形態と基礎設計',
        '第2部：個人事業主の税務（青色/白色申告）',
        '第3部：法人の税務（役員報酬・消費税戦略）',
        '第4部：源泉徴収の実務',
        '第5部：会計・帳簿の実務',
        '第6部：資金調達と銀行取引',
        '第7部：資産形成と節税（現金の資産化戦略）',
        '第8部：社会保険と労務',
        '第9部：法務基礎（特商法・景表法・個人情報保護）',
        '第10部：体制構築と税務調査対策'
      ],
      source: 'Tribe Journey関連/財務・税務・法務講座/アウトライン壁打ち（with Claude）.md',
      size: 18,
    },
    {
      id: 'finance-consulting',
      label: '財務コンサル獲得計画',
      category: 'finance',
      date: '2025-12',
      description: 'スタートアップ・ベンチャーの最善を見つけるための財務コンサルティング獲得。保険・資産形成（毎年1000万円規模）を含む。',
      keypoints: [
        '最低限の財務コンサルを確保',
        'スタートアップ・ベンチャーの最善を追求',
        '保険の見直し',
        '資産形成：毎年1000万円投入計画'
      ],
      source: '雑多なメモ/2025.12.9 20時30分 メモ.md',
      size: 10,
    },

    // ===== 人物 =====
    {
      id: 'person-murata',
      label: '村田（自分）',
      category: 'person',
      description: 'COO/CFO/CTO。開発全般を担当。技術・経営・財務を横断的にカバー。',
      keypoints: ['開発担当', 'COO/CFO/CTO', '設立費用折半'],
      size: 16,
    },
    {
      id: 'person-yuki',
      label: 'ゆうきさん',
      category: 'person',
      description: 'CMO。マーケティング担当。動画コンテンツ制作・事業開発にも関与。',
      keypoints: ['マーケティング担当', 'CMO', '設立費用折半', '動画コンテンツ関連'],
      size: 14,
    },
    {
      id: 'person-reo',
      label: '礼雄さん',
      category: 'person',
      description: 'CEO候補。代表として組織の顔となる役割。設立費用負担なし。',
      keypoints: ['CEO候補', '代表就任予定', '設立費用負担なし'],
      size: 12,
    },
    {
      id: 'person-ebara',
      label: '江原さん',
      category: 'person',
      description: '秘書業務の効率化対象。月20万円で秘書を雇用中。タスク管理の自動化ニーズあり。',
      keypoints: ['月20万円で秘書雇用中', 'タスク管理自動化ニーズ'],
      size: 10,
    },
    {
      id: 'person-itabashi',
      label: '板橋さん',
      category: 'person',
      description: 'AI秘書の名称に違和感ありとフィードバック。Y\'sグループの要望を代弁。',
      keypoints: ['AI秘書の名称に違和感あり', 'Y\'sグループの要望'],
      size: 8,
    },
    {
      id: 'person-tanaka',
      label: '田中暁成さん',
      category: 'person',
      description: 'SNS自動運用・議事録蓄積システムの全体構想を共有。アプリアイデアの積極提案者。',
      keypoints: ['全体構想ログの提供者', 'アプリアイデア提案'],
      size: 10,
    },

    // ===== 組織・チーム =====
    {
      id: 'org-new-company',
      label: '新法人（設立予定）',
      category: 'organization',
      date: '2025',
      description: 'AI秘書/ポータル事業のための新法人設立計画。株主=村田&ゆうき、CEO=礼雄。',
      keypoints: [
        '株主：村田＆ゆうきさん',
        'CEO：礼雄さん',
        '設立費用：村田＆ゆうきで折半',
        'toB×toCの同時展開'
      ],
      size: 14,
    },
    {
      id: 'org-ys-group',
      label: 'Y\'sグループ',
      category: 'organization',
      description: '育成コスト削減の要望あり。AI活用による業務効率化に関心。',
      keypoints: ['育成コスト削減が最大の要望'],
      size: 10,
    },
    {
      id: 'org-tribe-journey',
      label: 'Tribe Journey',
      category: 'organization',
      description: 'コミュニティ動画（基礎・重要な視点）を提供するプラットフォーム。スクールとの二層構造。',
      keypoints: [
        'コミュニティ動画=基礎コンテンツ',
        'スクール=応用コンテンツ',
        'アップセル・クロスセルでコンサルへ導線'
      ],
      size: 14,
    },
    {
      id: 'org-anonymous-animals',
      label: 'Anonymous Animals',
      category: 'organization',
      description: 'チーム全体フロードキュメントが存在するプロジェクトチーム。',
      keypoints: ['チーム全体フローを管理'],
      size: 8,
    },

    // ===== コンセプト =====
    {
      id: 'concept-time-efficiency',
      label: '社長の時間効率',
      category: 'concept',
      description: '経営の良し悪しを決める根本原理。2.6万時間（3年）を1億円にするか100億円にするかは時間効率で決まる。',
      keypoints: [
        '量は効率を上げるためのツール',
        '効率は無限に高められる',
        '時間の資源配分が全て'
      ],
      size: 16,
    },
    {
      id: 'concept-4axes',
      label: '4軸バランス（情報収集・思考・伝達・作業）',
      category: 'concept',
      description: '社長の時間配分の4軸。流動的な経営の中で常にバランスを取り、渋滞状態を防ぐ。仕組み化が鍵。',
      keypoints: [
        '情報収集：一目瞭然で見れる仕組み',
        '思考：暇さえあれば考える癖',
        '伝達：短く結論から',
        '作業：光の速さで終わらせる'
      ],
      size: 14,
    },
    {
      id: 'concept-culture',
      label: '組織文化の形成',
      category: 'concept',
      description: '組織全体の効率を高める最強ツール。価値観とプロセスの組み合わせで形成される。社長の行動とフィードバックが最大要素。',
      keypoints: [
        '文化=価値観+プロセス',
        '口だけでは形成されない',
        '行動とフィードバックで形成',
        '社長の態度が最大の要素'
      ],
      size: 12,
    },
    {
      id: 'concept-secretarial-automation',
      label: '秘書業務の完全自動化',
      category: 'concept',
      description: '「秘書＝APIとして活用する」という発想。指示のめんどくささとキャパの限界を解決し、細かいミニマムタスクを徹底的に拾う。',
      keypoints: [
        '秘書＝APIとしての活用',
        '指示コスト・キャパ限界の解消',
        'ミニマムタスクの自動的な拾い上げ'
      ],
      size: 12,
    },
    {
      id: 'concept-info-structure',
      label: '構造化された情報伝達',
      category: 'concept',
      description: '目的定義→KPI→要件定義→情報伝達の構造的フロー。高市内閣の災害対応モデルに学ぶ。',
      keypoints: [
        '目的定義からの逆算',
        'KPI→要件定義→伝達の一気通貫',
        '伝達手法の事前定義'
      ],
      size: 10,
    },
    {
      id: 'concept-localize',
      label: '海外AI事業の日本ローカライズ',
      category: 'concept',
      description: '海外で実証済みのAI事業を日本向けにローカライズするだけで大金を掴むというコンセプト。先行者利益の重要性。',
      keypoints: [
        '日本のAI利用率の低さ=ボーナスタイム',
        '「すでに収益化」「実績あり」「手間を消す」の3条件',
        '先行者利益が全て'
      ],
      size: 14,
    },
    {
      id: 'concept-revenue-model',
      label: '相互マージンモデル（40%）',
      category: 'concept',
      description: '成約時に互いに40%をマージンとして支払う報酬体系。担当者を繋いで自動運用する仕組み。',
      keypoints: [
        '100万円成約→40万円マージン',
        '双方向のマージン支払い',
        '担当者を繋ぐ→自動運用→マージン'
      ],
      size: 10,
    },

    // ===== 意思決定 =====
    {
      id: 'decision-ceo',
      label: 'CEO人事決定：礼雄さん',
      category: 'decision',
      date: '2025-01-20',
      description: '礼雄さんをCEO（代表）に据え、村田・ゆうきが株主として経営に参画する体制を決定。',
      keypoints: [
        '礼雄さん=CEO（代表）',
        '村田=COO/CFO/CTO',
        'ゆうきさん=CMO',
        '設立費用=村田&ゆうき折半（礼雄さん負担なし）'
      ],
      size: 12,
    },
    {
      id: 'decision-tob-toc',
      label: 'toB×toC同時展開方針',
      category: 'decision',
      date: '2025-01-20',
      description: 'toBとtoCを両方一気に進めていく事業展開方針を決定。toB=営業チーム確保、toC=並行進行。',
      keypoints: [
        'toB：成果報酬型営業チーム',
        'toC：同時並行',
        '最短5月・最長8月リリース'
      ],
      size: 10,
    },
    {
      id: 'decision-naming',
      label: '「AI秘書」名称の再検討',
      category: 'decision',
      date: '2025-01-20',
      description: '板橋さんから「AI秘書」の名称に違和感ありとフィードバック。ブランディング見直しの検討。',
      keypoints: [
        '板橋さんからの違和感フィードバック',
        'Y\'sグループの要望との整合性検討'
      ],
      size: 8,
    },
  ],

  links: [
    // MTG → 関連ノード
    { source: 'mtg-ai-studio-hearing', target: 'product-ai-secretary', label: '構想', strength: 0.9 },
    { source: 'mtg-ai-studio-hearing', target: 'person-ebara', label: 'タスク対象', strength: 0.7 },
    { source: 'mtg-ai-studio-hearing', target: 'concept-secretarial-automation', label: 'コンセプト', strength: 0.8 },

    { source: 'mtg-ai-studio-pj', target: 'decision-ceo', label: '決定事項', strength: 0.9 },
    { source: 'mtg-ai-studio-pj', target: 'decision-tob-toc', label: '決定事項', strength: 0.9 },
    { source: 'mtg-ai-studio-pj', target: 'decision-naming', label: '決定事項', strength: 0.7 },
    { source: 'mtg-ai-studio-pj', target: 'product-portal', label: '構想', strength: 0.9 },
    { source: 'mtg-ai-studio-pj', target: 'org-new-company', label: '設立決定', strength: 0.9 },
    { source: 'mtg-ai-studio-pj', target: 'person-murata', label: '参加者', strength: 0.6 },
    { source: 'mtg-ai-studio-pj', target: 'person-yuki', label: '参加者', strength: 0.6 },
    { source: 'mtg-ai-studio-pj', target: 'person-reo', label: '参加者', strength: 0.6 },
    { source: 'mtg-ai-studio-pj', target: 'person-itabashi', label: 'フィードバック', strength: 0.5 },

    { source: 'mtg-yuki-call', target: 'org-tribe-journey', label: '議論対象', strength: 0.8 },
    { source: 'mtg-yuki-call', target: 'product-lms', label: '議論対象', strength: 0.8 },
    { source: 'mtg-yuki-call', target: 'finance-consulting', label: '課題認識', strength: 0.7 },
    { source: 'mtg-yuki-call', target: 'concept-revenue-model', label: '決定', strength: 0.8 },
    { source: 'mtg-yuki-call', target: 'person-yuki', label: '通話相手', strength: 0.7 },

    { source: 'mtg-requirements', target: 'concept-info-structure', label: '着想', strength: 0.9 },

    // 戦略 → 関連ノード
    { source: 'strategy-ai-biz', target: 'concept-localize', label: '基本方針', strength: 0.9 },
    { source: 'strategy-ai-biz', target: 'product-ai-secretary', label: '医療/法務AI展開', strength: 0.5 },

    { source: 'strategy-management', target: 'concept-time-efficiency', label: '核心概念', strength: 1.0 },
    { source: 'strategy-management', target: 'concept-4axes', label: '実践方法', strength: 0.9 },
    { source: 'strategy-management', target: 'concept-culture', label: '組織論', strength: 0.8 },

    { source: 'strategy-agiai', target: 'strategy-ai-biz', label: '上位戦略', strength: 0.6 },

    { source: 'strategy-tanaka', target: 'product-sns-auto', label: '構想→プロダクト', strength: 0.9 },
    { source: 'strategy-tanaka', target: 'product-minutes-system', label: '構想→プロダクト', strength: 0.9 },
    { source: 'strategy-tanaka', target: 'person-tanaka', label: '起案者', strength: 0.8 },

    // プロダクト間の関連
    { source: 'product-ai-secretary', target: 'product-portal', label: 'ツール統合', strength: 0.7 },
    { source: 'product-ai-secretary', target: 'concept-secretarial-automation', label: '実装', strength: 0.9 },
    { source: 'product-portal', target: 'product-lms', label: 'コンテンツ統合', strength: 0.6 },
    { source: 'product-minutes-system', target: 'product-ai-secretary', label: '議事録→タスク連携', strength: 0.7 },

    // 人物 → 組織
    { source: 'person-murata', target: 'org-new-company', label: 'COO/CFO/CTO', strength: 0.9 },
    { source: 'person-yuki', target: 'org-new-company', label: 'CMO', strength: 0.9 },
    { source: 'person-reo', target: 'org-new-company', label: 'CEO', strength: 0.9 },
    { source: 'person-reo', target: 'decision-ceo', label: '対象者', strength: 0.9 },
    { source: 'person-itabashi', target: 'org-ys-group', label: '所属', strength: 0.7 },
    { source: 'person-itabashi', target: 'decision-naming', label: '提起者', strength: 0.8 },
    { source: 'person-ebara', target: 'product-ai-secretary', label: '利用想定', strength: 0.7 },

    // 財務関連
    { source: 'finance-course', target: 'org-tribe-journey', label: '提供先', strength: 0.8 },
    { source: 'finance-course', target: 'product-lms', label: '掲載先', strength: 0.7 },
    { source: 'finance-consulting', target: 'finance-course', label: '知見活用', strength: 0.6 },
    { source: 'finance-consulting', target: 'person-murata', label: '必要性認識', strength: 0.5 },

    // コンセプト間
    { source: 'concept-time-efficiency', target: 'concept-4axes', label: '実践方法', strength: 0.9 },
    { source: 'concept-time-efficiency', target: 'concept-secretarial-automation', label: '効率化手段', strength: 0.7 },
    { source: 'concept-4axes', target: 'concept-culture', label: '組織への展開', strength: 0.7 },
    { source: 'concept-info-structure', target: 'product-minutes-system', label: '実装方針', strength: 0.6 },
    { source: 'concept-localize', target: 'strategy-agiai', label: 'AGI文脈', strength: 0.4 },

    // 組織間
    { source: 'org-new-company', target: 'decision-tob-toc', label: '事業方針', strength: 0.8 },
    { source: 'org-ys-group', target: 'org-new-company', label: '顧客候補', strength: 0.5 },
    { source: 'org-tribe-journey', target: 'concept-revenue-model', label: '収益構造', strength: 0.7 },
  ]
};
