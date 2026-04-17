// UI表示用ラベル（カスタマイズ対象）
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

// Status Keys（内部用）
export const STATUS_KEYS = {
  COMPLETED: "completed",
  NEW: "new",
  IN_PROGRESS: "in_progress",
  INVESTIGATING: "investigating",
  ON_HOLD: "on_hold",
  RESEARCHING: "researching",
} as const;

export type StatusKey = (typeof STATUS_KEYS)[keyof typeof STATUS_KEYS];

// CSVの値 → 内部Key変換
export const STATUS_FROM_CSV: Record<string, StatusKey> = {
  完了: STATUS_KEYS.COMPLETED,
  "新規/未着手": STATUS_KEYS.NEW,
  "修正中/対応中": STATUS_KEYS.IN_PROGRESS,
  "確認中/検証中": STATUS_KEYS.INVESTIGATING,
  調査中: STATUS_KEYS.RESEARCHING,
  保留: STATUS_KEYS.ON_HOLD,
};

// 表示名
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

// 集計用グループ
export const STATUS_GROUP = {
  INCOMPLETE: [
    STATUS_KEYS.IN_PROGRESS,
    STATUS_KEYS.INVESTIGATING,
    STATUS_KEYS.RESEARCHING,
    STATUS_KEYS.ON_HOLD,
  ],
};

// Team Definition
export const TEAM_COLOR_MAP = {
  JPB: "var(--chart-1)",
  MJR: "var(--chart-2)",
  PKG: "var(--chart-3)",
  RLB: "var(--chart-4)",
  SKB: "var(--chart-5)",
  SMT: "var(--chart-6)",
} as const;

export type TeamName = keyof typeof TEAM_COLOR_MAP;

// Status Definition
export type StatusLegendKey = "completed" | "new" | "incomplete" | "total";

export const STATUS_COLOR_MAP: Record<
  StatusLegendKey | "total" | "incomplete",
  string
> = {
  completed: "var(--status-completed)",
  new: "var(--status-new)",
  incomplete: "var(--status-incomplete)",
  total: "var(--status-total)",
} as const;
