/**
 * =========================================
 * 1. 表示用設定（UIラベル・表示文言）
 * =========================================
 */

// UI表示用ラベル
export const UI_LABEL = {
  // for topbar
  topbar: {
    title: "Project Name", // Topbar用（例：プロジェクト名）
  },

  // for donut-chart
  donut_chart: {
    issueTitle: "Issues", // CardTitle用
    issueUnit: "Issues", // 中央ラベル用 (例: 件, チケット, ...)
  },

  // for summary
  summary: {
    summaryTitle: "Summary",

    unit: "件",

    header: {
      status: "ステータス",
      current: "今回",
      diff: "前回差",
      previous: "前回",
    },

    footer: {
      current: "今回",
      previous: "前回",
    },
  },

  // for line-chart
  line_chart: {
    title: "Weekly Issue Trend", // CardTitle用
  },
} as const;

/**
 * =========================================
 * 2. CSVファイル値 定義
 * =========================================
 */

/**
 * -----------------------------------------
 * 2-1. Status（ステータス）定義
 * -----------------------------------------
 */

// 内部Key
export const STATUS_KEYS = {
  COMPLETED: "completed",
  NEW: "new",
  IN_PROGRESS: "in_progress",
  INVESTIGATING: "investigating",
  ON_HOLD: "on_hold",
  RESEARCHING: "researching",
} as const;

export type StatusKey = (typeof STATUS_KEYS)[keyof typeof STATUS_KEYS];

// CSV値 → 内部Key変換
// CSVのstatus値に応じて、ここの定義値を変更する
export const STATUS_FROM_CSV: Record<string, StatusKey> = {
  完了: STATUS_KEYS.COMPLETED,
  "新規/未着手": STATUS_KEYS.NEW,
  "修正中/対応中": STATUS_KEYS.IN_PROGRESS,
  "確認中/検証中": STATUS_KEYS.INVESTIGATING,
  調査中: STATUS_KEYS.RESEARCHING,
  保留: STATUS_KEYS.ON_HOLD,
};

// 表示名
// CSVのstatus値をそのまま表示したくない場合、ここの定義値を変更する
export const STATUS_LABEL: Record<StatusKey | "total" | "incomplete", string> =
  {
    completed: "完了",
    new: "新規/未着手",
    in_progress: "修正中/対応中",
    investigating: "確認中/検証中",
    researching: "調査中",
    on_hold: "保留",

    total: "総数",
    incomplete: "未完了",
  };

// 集計用グループ（"未完了"の定義）
export const STATUS_GROUP: {
  INCOMPLETE: StatusKey[];
} = {
  INCOMPLETE: [
    STATUS_KEYS.IN_PROGRESS,
    STATUS_KEYS.INVESTIGATING,
    STATUS_KEYS.RESEARCHING,
    STATUS_KEYS.ON_HOLD,
  ],
};

// ステータス折れ線グラフ凡例用キー
export type StatusLegendKey = "completed" | "new" | "incomplete" | "total";

// ステータス毎の色定義
export const STATUS_COLOR_MAP: Record<
  StatusLegendKey | "total" | "incomplete",
  string
> = {
  completed: "var(--status-completed)",
  new: "var(--status-new)",
  incomplete: "var(--status-incomplete)",
  total: "var(--status-total)",
} as const;

/**
 * -----------------------------------------
 * 2-2. Team（チーム）定義
 * -----------------------------------------
 */

// 内部Key
export const TEAM_KEYS = {
  BLUEBERRY: "BLUEBERRY",
  GREENAPPLE: "GREENAPPLE",
  LEMON: "LEMON",
  ORANGE: "ORANGE",
  STRAWBERRY: "STRAWBERRY",
  GRAPES: "GRAPES",
  CHESTNUT: "CHESTNUT",
  PEACH: "PEACH",
  KIWI: "KIWI",
  OLIVE: "OLIVE",
} as const;

export type TeamKey = keyof typeof TEAM_KEYS;

// CSV値 → 内部Key変換
// CSVのteam値（文字列）に応じて、ここの定義値を変更する
export const TEAM_FROM_CSV: Record<string, TeamKey> = {
  JPB: TEAM_KEYS.BLUEBERRY,
  MJR: TEAM_KEYS.GREENAPPLE,
  PKG: TEAM_KEYS.LEMON,
  RLB: TEAM_KEYS.ORANGE,
  SKB: TEAM_KEYS.STRAWBERRY,
  SMT: TEAM_KEYS.GRAPES,

  // チーム追加する場合、ここに追加する
  // (例) ABC: TEAM_KEYS.CHESTNUT,
};

// TeamMetaオブジェクトの型定義
export type TeamMeta = {
  label: string;
  color: string;
  emoji: string;
};

// TeamMetaオブジェクト定義
export const TEAM_META: Record<TeamKey, TeamMeta> = {
  BLUEBERRY: {
    label: "JPBチーム",
    color: "var(--chart-1)",
    emoji: "🫐",
  },
  GREENAPPLE: {
    label: "MJRチーム",
    color: "var(--chart-2)",
    emoji: "🍏",
  },
  LEMON: {
    label: "PKGチーム",
    color: "var(--chart-3)",
    emoji: "🍋",
  },
  ORANGE: {
    label: "RLBチーム",
    color: "var(--chart-4)",
    emoji: "🍊",
  },
  STRAWBERRY: {
    label: "SKBチーム",
    color: "var(--chart-5)",
    emoji: "🍓",
  },
  GRAPES: {
    label: "SMTチーム",
    color: "var(--chart-6)",
    emoji: "🍇",
  },

  // 予備枠（将来用）
  CHESTNUT: {
    label: "未使用",
    color: "var(--chart-7)",
    emoji: "🌰",
  },
  PEACH: {
    label: "未使用",
    color: "var(--chart-8)",
    emoji: "🍑",
  },
  KIWI: {
    label: "未使用",
    color: "var(--chart-9)",
    emoji: "🥝",
  },
  OLIVE: {
    label: "未使用",
    color: "var(--chart-10)",
    emoji: "🫒",
  },
};

/**
 * -----------------------------------------
 * 2-3. CSV Column （列名）定義
 * -----------------------------------------
 */

// IssueKey定義
export type IssueKey = keyof import("./table/types").Issue;

// CSV列名 → 内部Key
export const COLUMN_FROM_CSV: Record<string, IssueKey> = {
  issueID: "issueID",
  createdAt: "createdAt",
  createdBy: "createdBy",
  title: "title",
  category: "category",
  team: "team",
  status: "status",
  description: "description",
  resolutionStatus: "resolutionStatus",
  completedAt: "completedAt",
};

// 表示名（UI用）
export const COLUMN_LABEL: Record<IssueKey, string> = {
  issueID: "Issue ID",
  createdAt: "作成日",
  createdBy: "作成者",
  title: "タイトル",
  category: "カテゴリ",
  team: "チーム",
  status: "ステータス",
  description: "内容",
  resolutionStatus: "対応内容",
  completedAt: "完了日",
};
