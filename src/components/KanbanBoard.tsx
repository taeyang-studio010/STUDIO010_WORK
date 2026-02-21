"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { TaskStatus, TrackId } from "@/types/task";
import { useKanban, type KanbanTask } from "@/features/tasks/useKanban";
import { TaskModal } from "@/components/TaskModal";

const TRACKS: { id: TrackId; label: string }[] = [
  { id: "studio010", label: "STUDIO 010" },
  { id: "letscomfy", label: "Let's Comfy" },
];

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "To Do" },
  { status: "in_progress", label: "In Progress" },
  { status: "review", label: "Review" },
  { status: "done", label: "Done" },
];

function SingleTrackKanban({
  trackId,
  trackLabel,
  tasks,
  onMoveTask,
  onEditTask,
}: {
  trackId: TrackId;
  trackLabel: string;
  tasks: KanbanTask[];
  onMoveTask: (taskId: string, newStatus: TaskStatus) => void;
  onEditTask: (task: KanbanTask) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-text-secondary">{trackLabel}</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {COLUMNS.map((col) => (
          <div
            key={col.status}
            className="glass-panel flex min-w-[240px] flex-1 flex-col rounded-xl border border-border p-3 transition-fluid"
          >
            <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-text-tertiary">
              {col.label}
            </h4>
            <div className="flex min-h-[100px] flex-col gap-2">
              {tasks
                .filter((t) => t.status === col.status)
                .map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("taskId", task.id);
                      e.dataTransfer.setData("status", col.status);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const id = e.dataTransfer.getData("taskId");
                      if (id) onMoveTask(id, col.status);
                    }}
                    onClick={() => onEditTask(task)}
                    className={cn(
                      "cursor-grab rounded-lg border border-border bg-white/[0.04] p-3 transition-fluid hover:border-border-strong hover:bg-white/[0.06] active:cursor-grabbing"
                    )}
                  >
                    <p className="text-sm font-medium text-white">
                      {task.title}
                    </p>
                    {task.assignee && (
                      <p className="mt-1 text-xs text-text-tertiary">
                        {task.assignee}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {COLUMNS.filter((c) => c.status !== col.status).map(
                        (c) => (
                          <button
                            key={c.status}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMoveTask(task.id, c.status);
                            }}
                            className="rounded bg-white/5 px-2 py-0.5 text-xs text-text-secondary hover:bg-white/10 hover:text-white"
                          >
                            → {c.label}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const { tasks, moveTask, createTask, updateTask } = useKanban();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);

  const handleSubmit = async (payload: {
    track: TrackId;
    title: string;
    description?: string;
    assignee?: string;
    status?: TaskStatus;
  }) => {
    if (editingTask) {
      return updateTask(editingTask.id, payload);
    }
    const { error } = await createTask(payload);
    return { error };
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-[#0a0a0a] hover:bg-accent/90"
        >
          작업 추가
        </button>
      </div>
      {TRACKS.map((track) => (
        <div
          key={track.id}
          className="glass-panel rounded-xl border border-border p-4 transition-fluid"
        >
          <SingleTrackKanban
            trackId={track.id}
            trackLabel={track.label}
            tasks={tasks.filter((t) => t.track === track.id)}
            onMoveTask={moveTask}
            onEditTask={(task) => {
              setEditingTask(task);
              setModalOpen(true);
            }}
          />
        </div>
      ))}
      <TaskModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
