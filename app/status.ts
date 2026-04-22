import {
  STATUS_FROM_CSV,
  STATUS_GROUP,
  STATUS_KEYS,
  StatusKey,
} from "./app-config";

// CSV -> Internal Key
export const csvToStatusKey = (csv: string): StatusKey | null => {
  return STATUS_FROM_CSV[csv] ?? null;
};

export const isIncomplete = (status: StatusKey): boolean => {
  return STATUS_GROUP.INCOMPLETE.includes(status);
};

export const summarizeStatuses = (statuses: StatusKey[]) => {
  const result = {
    total: statuses.length,
    new: 0,
    completed: 0,
    incomplete: 0,
  };

  statuses.forEach((status) => {
    if (status === STATUS_KEYS.NEW) {
      result.new++;
    } else if (status === STATUS_KEYS.COMPLETED) {
      result.completed++;
    } else if (isIncomplete(status)) {
      result.incomplete++;
    }
  });

  return result;
};
