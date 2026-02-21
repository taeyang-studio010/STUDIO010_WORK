export type TrackId = "studio010" | "letscomfy";

export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export interface Task {
  id: string;
  track: TrackId;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: string;
  createdAt: string;
}

export interface InboxRequest {
  id: string;
  from: string;
  to: string;
  title: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
