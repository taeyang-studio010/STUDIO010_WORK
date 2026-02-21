-- Allow any authenticated user to read/write collaboration data (exec-only remains for KPI, exec_invites, audit)

create policy "tasks_authenticated_rw"
on public.tasks for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "task_comments_authenticated_rw"
on public.task_comments for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "inbox_requests_authenticated_rw"
on public.inbox_requests for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "calendar_events_authenticated_rw"
on public.calendar_events for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "knowledge_items_authenticated_rw"
on public.knowledge_items for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "asset_items_authenticated_rw"
on public.asset_items for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "budget_projects_authenticated_rw"
on public.budget_projects for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "budget_entries_authenticated_rw"
on public.budget_entries for all
using (auth.uid() is not null)
with check (auth.uid() is not null);

-- Allow authenticated users to read audit_logs (optional; keep exec-only if you prefer)
create policy "audit_logs_authenticated_read"
on public.audit_logs for select
using (auth.uid() is not null);
