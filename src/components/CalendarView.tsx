"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCalendar, type CalendarEventItem } from "@/features/calendar/useCalendar";
import { CalendarEventModal } from "@/components/CalendarEventModal";

const TYPE_LABEL: Record<CalendarEventItem["type"], string> = {
  meeting: "회의",
  milestone: "마일스톤",
  deadline: "마감",
  regular: "일정",
};

const TYPE_COLOR: Record<CalendarEventItem["type"], string> = {
  meeting: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  milestone: "bg-accent/20 text-accent border-accent/30",
  deadline: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  regular: "bg-white/10 text-text-secondary border-border",
};

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: (number | null)[] = [];
  const startPad = first.getDay();
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

export function CalendarView() {
  const { events, createEvent, updateEvent, deleteEvent } = useCalendar();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEventItem | null>(null);
  const [initialDate, setInitialDate] = useState<string | undefined>();
  const [current, setCurrent] = useState(() => ({
    year: 2025,
    month: 1, // Feb = 1
  }));

  const days = getDaysInMonth(current.year, current.month);

  const eventsByDay: Record<string, CalendarEventItem[]> = {};
  events.forEach((ev) => {
    const [y, m, d] = ev.date.split("-");
    if (Number(m) === current.month + 1 && Number(y) === current.year) {
      const key = `${d}`;
      if (!eventsByDay[key]) eventsByDay[key] = [];
      eventsByDay[key].push(ev);
    }
  });

  function prevMonth() {
    setCurrent((c) =>
      c.month === 0
        ? { year: c.year - 1, month: 11 }
        : { ...c, month: c.month - 1 }
    );
  }
  function nextMonth() {
    setCurrent((c) =>
      c.month === 11
        ? { year: c.year + 1, month: 0 }
        : { ...c, month: c.month + 1 }
    );
  }

  const monthNames = "1월 2월 3월 4월 5월 6월 7월 8월 9월 10월 11월 12월".split(" ");

  const openCreate = (dateStr?: string) => {
    setEditingEvent(null);
    setInitialDate(dateStr);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">
          {current.year}년 {monthNames[current.month]}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openCreate()}
            className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-[#0a0a0a] hover:bg-accent/90"
          >
            일정 추가
          </button>
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-white/5"
          >
            이전
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary hover:bg-white/5"
          >
            다음
          </button>
        </div>
      </div>

      <div className="glass-panel overflow-hidden rounded-xl border border-border">
        <div className="grid grid-cols-7 border-b border-border text-center text-xs font-medium text-text-tertiary">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d} className="border-r border-border py-2 last:border-r-0">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => (
            <div
              key={i}
              className={cn(
                "min-h-[80px] border-b border-r border-border p-1.5 last:border-r-0",
                !d && "bg-white/[0.02]"
              )}
            >
              {d != null && (
                <>
                  <span className="text-sm text-text-secondary">{d}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const y = current.year;
                      const m = String(current.month + 1).padStart(2, "0");
                      const day = String(d).padStart(2, "0");
                      openCreate(`${y}-${m}-${day}`);
                    }}
                    className="mt-0.5 text-xs text-text-tertiary hover:text-accent"
                  >
                    + 추가
                  </button>
                  <ul className="mt-1 space-y-0.5">
                    {(eventsByDay[String(d)] ?? []).slice(0, 3).map((ev) => (
                      <li
                        key={ev.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setEditingEvent(ev);
                          setModalOpen(true);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && (setEditingEvent(ev), setModalOpen(true))}
                        className={cn(
                          "rounded border px-1.5 py-0.5 text-xs cursor-pointer hover:opacity-90",
                          TYPE_COLOR[ev.type]
                        )}
                        title={ev.description}
                      >
                        {ev.title}
                      </li>
                    ))}
                    {(eventsByDay[String(d)] ?? []).length > 3 && (
                      <li className="text-xs text-text-tertiary">
                        +{(eventsByDay[String(d)] ?? []).length - 3}건
                      </li>
                    )}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["meeting", "milestone", "deadline"] as const).map((type) => (
          <span
            key={type}
            className={cn(
              "rounded-full px-2 py-0.5 text-xs",
              TYPE_COLOR[type]
            )}
          >
            {TYPE_LABEL[type]}
          </span>
        ))}
      </div>

      <CalendarEventModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        initialDate={initialDate}
        onSubmit={async (p) =>
          editingEvent
            ? updateEvent(editingEvent.id, p)
            : createEvent(p)
        }
        onDelete={editingEvent ? (id) => deleteEvent(id) : undefined}
      />
    </div>
  );
}
