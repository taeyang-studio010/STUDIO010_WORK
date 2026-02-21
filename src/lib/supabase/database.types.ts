export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TableShape<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type KpiScope = "main" | "monthly" | "weekly";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TrackId = "studio010" | "letscomfy";
export type InboxStatus = "pending" | "accepted" | "rejected";
export type CalendarType = "meeting" | "milestone" | "deadline" | "regular";
export type KnowledgeType = "reference" | "webinar" | "meeting";
export type AssetType = "logo" | "color" | "font" | "document";
export type ExecInviteStatus = "pending" | "accepted" | "expired" | "cancelled";
export type AuditAction = "insert" | "update" | "delete";

export interface Database {
  public: {
    Tables: {
      profiles: TableShape<
        {
          id: string;
          email: string | null;
          name: string | null;
          role: string | null;
          is_exec: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          email?: string | null;
          name?: string | null;
          role?: string | null;
          is_exec?: boolean;
          created_at?: string;
          updated_at?: string;
        },
        {
          email?: string | null;
          name?: string | null;
          role?: string | null;
          is_exec?: boolean;
          updated_at?: string;
        }
      >;
      kpi_sets: TableShape<
        {
          id: string;
          scope: KpiScope;
          title: string;
          created_by: string | null;
          updated_by: string | null;
          last_updated_at: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          scope: KpiScope;
          title: string;
          created_by?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          title?: string;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          updated_at?: string;
        }
      >;
      kpi_items: TableShape<
        {
          id: string;
          kpi_set_id: string;
          label: string;
          checked: boolean;
          position: number;
          created_by: string | null;
          updated_by: string | null;
          last_updated_at: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          kpi_set_id: string;
          label: string;
          checked?: boolean;
          position?: number;
          created_by?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          label?: string;
          checked?: boolean;
          position?: number;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          updated_at?: string;
        }
      >;
      tasks: TableShape<
        {
          id: string;
          track: TrackId;
          title: string;
          description: string | null;
          status: TaskStatus;
          assignee: string | null;
          created_by: string | null;
          updated_by: string | null;
          last_updated_at: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          track: TrackId;
          title: string;
          description?: string | null;
          status?: TaskStatus;
          assignee?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          title?: string;
          description?: string | null;
          status?: TaskStatus;
          assignee?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          updated_at?: string;
        }
      >;
      task_comments: TableShape<
        {
          id: string;
          task_id: string;
          body: string;
          created_by: string | null;
          updated_by: string | null;
          last_updated_at: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          task_id: string;
          body: string;
          created_by?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          body?: string;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          updated_at?: string;
        }
      >;
      inbox_requests: TableShape<
        {
          id: string;
          from_name: string;
          to_name: string;
          title: string;
          message: string | null;
          status: InboxStatus;
          created_by: string | null;
          updated_by: string | null;
          last_updated_at: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          from_name: string;
          to_name: string;
          title: string;
          message?: string | null;
          status?: InboxStatus;
          created_by?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          from_name?: string;
          to_name?: string;
          title?: string;
          message?: string | null;
          status?: InboxStatus;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          updated_at?: string;
        }
      >;
      calendar_events: TableShape<
        {
          id: string;
          title: string;
          date: string;
          type: CalendarType;
          description: string | null;
          all_day: boolean;
          created_by: string | null;
          updated_by: string | null;
          last_updated_at: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          title: string;
          date: string;
          type?: CalendarType;
          description?: string | null;
          all_day?: boolean;
          created_by?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          title?: string;
          date?: string;
          type?: CalendarType;
          description?: string | null;
          all_day?: boolean;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          updated_at?: string;
        }
      >;
      knowledge_items: TableShape<
        {
          id: string;
          title: string;
          type: KnowledgeType;
          description: string | null;
          link: string | null;
          date: string | null;
          created_by: string | null;
          updated_by: string | null;
          last_updated_at: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          title: string;
          type: KnowledgeType;
          description?: string | null;
          link?: string | null;
          date?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          title?: string;
          type?: KnowledgeType;
          description?: string | null;
          link?: string | null;
          date?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          updated_at?: string;
        }
      >;
      asset_items: TableShape<
        {
          id: string;
          name: string;
          type: AssetType;
          value: string | null;
          description: string | null;
          created_by: string | null;
          updated_by: string | null;
          last_updated_at: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          name: string;
          type: AssetType;
          value?: string | null;
          description?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          name?: string;
          type?: AssetType;
          value?: string | null;
          description?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          updated_at?: string;
        }
      >;
      budget_projects: TableShape<
        {
          id: string;
          name: string;
          total: number;
          spent: number;
          is_government: boolean;
          created_by: string | null;
          updated_by: string | null;
          last_updated_at: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          name: string;
          total: number;
          spent?: number;
          is_government?: boolean;
          created_by?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          name?: string;
          total?: number;
          spent?: number;
          is_government?: boolean;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          updated_at?: string;
        }
      >;
      budget_entries: TableShape<
        {
          id: string;
          budget_project_id: string;
          amount: number;
          note: string | null;
          spent_at: string;
          created_by: string | null;
          updated_by: string | null;
          last_updated_at: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          budget_project_id: string;
          amount: number;
          note?: string | null;
          spent_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          amount?: number;
          note?: string | null;
          spent_at?: string;
          updated_by?: string | null;
          last_updated_at?: string;
          deleted_at?: string | null;
          updated_at?: string;
        }
      >;
      exec_invites: TableShape<
        {
          id: string;
          email: string;
          name: string | null;
          role: string | null;
          invited_by: string | null;
          invited_at: string;
          expires_at: string;
          status: ExecInviteStatus;
          accepted_at: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          email: string;
          name?: string | null;
          role?: string | null;
          invited_by?: string | null;
          invited_at?: string;
          expires_at?: string;
          status?: ExecInviteStatus;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        },
        {
          name?: string | null;
          role?: string | null;
          status?: ExecInviteStatus;
          accepted_at?: string | null;
          updated_at?: string;
        }
      >;
      audit_logs: TableShape<
        {
          id: string;
          table_name: string;
          row_id: string | null;
          action: AuditAction;
          actor_id: string | null;
          before_data: Json | null;
          after_data: Json | null;
          created_at: string;
        },
        {
          id?: string;
          table_name: string;
          row_id?: string | null;
          action: AuditAction;
          actor_id?: string | null;
          before_data?: Json | null;
          after_data?: Json | null;
          created_at?: string;
        },
        {
          before_data?: Json | null;
          after_data?: Json | null;
        }
      >;
      chat_rooms: TableShape<
        { id: string; name: string; created_at: string },
        { id?: string; name?: string; created_at?: string },
        { name?: string }
      >;
      chat_messages: TableShape<
        { id: string; room_id: string; sender_id: string | null; body: string; created_at: string },
        { id?: string; room_id: string; sender_id?: string | null; body: string; created_at?: string },
        { body?: string }
      >;
      one_four_ten: TableShape<
        { id: string; step: string; title: string; description: string | null; position: number; created_at: string; updated_at: string },
        { id?: string; step: string; title: string; description?: string | null; position?: number; created_at?: string; updated_at?: string },
        { step?: string; title?: string; description?: string | null; position?: number; updated_at?: string }
      >;
      team_members: TableShape<
        { id: string; name: string; role: string | null; status: string; location: string; created_at: string; updated_at: string },
        { id?: string; name: string; role?: string | null; status?: string; location?: string; created_at?: string; updated_at?: string },
        { name?: string; role?: string | null; status?: string; location?: string; updated_at?: string }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      kpi_scope: KpiScope;
      task_status: TaskStatus;
      track_id: TrackId;
      inbox_status: InboxStatus;
      calendar_type: CalendarType;
      knowledge_type: KnowledgeType;
      asset_type: AssetType;
      exec_invite_status: ExecInviteStatus;
      audit_action: AuditAction;
    };
  };
}
