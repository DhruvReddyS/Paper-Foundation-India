"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, MessageSquare, Plus, RefreshCw, Users } from "lucide-react";
import AdminDrawer from "@/components/admin/AdminDrawer";
import { useAdminAccess } from "@/components/admin/AdminShell";

type User = { _id: string; name: string; username: string; role: string };
type Resource = { resourceType: string; resourceId: string; resourceLabel: string };
type Comment = { body: string; authorName: string; createdAt: string };
type WorkItem = Resource & { _id: string; description: string; status: string; priority: string; assigneeId: string; assigneeName: string; reviewerId: string; reviewerName: string; dueAt?: string | null; comments: Comment[]; version: number };

const statuses = ["backlog", "in_progress", "in_review", "changes_requested", "approved", "done"];
const labels: Record<string, string> = { backlog: "Backlog", in_progress: "In progress", in_review: "In review", changes_requested: "Changes requested", approved: "Approved", done: "Done" };
const emptyForm = { resourceKey: "", description: "", priority: "normal", assigneeId: "", reviewerId: "", dueAt: "" };

export default function AdminWorkflow() {
  const access = useAdminAccess();
  const [items, setItems] = useState<WorkItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<WorkItem | null>(null);
  const [comment, setComment] = useState("");
  const [form, setForm] = useState(emptyForm);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/workflow", { cache: "no-store" });
    const data = await response.json();
    if (response.ok) { setItems(data.items || []); setUsers(data.users || []); setResources(data.resources || []); setConfigured(data.configured !== false); }
    else setMessage(data.error || "Could not load workflow");
    setLoading(false);
  }
  useEffect(() => { void load(); }, []);

  const stats = useMemo(() => ({
    open: items.filter(item => item.status !== "done").length,
    review: items.filter(item => item.status === "in_review" || item.status === "changes_requested").length,
    overdue: items.filter(item => item.dueAt && new Date(item.dueAt) < new Date() && item.status !== "done").length,
  }), [items]);

  async function createItem(event: React.FormEvent) {
    event.preventDefault();
    const resource = resources.find(entry => entry.resourceType + ":" + entry.resourceId === form.resourceKey);
    if (!resource) return setMessage("Choose content to assign");
    setBusy(true); setMessage("");
    const response = await fetch("/api/admin/workflow", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...resource, description: form.description, priority: form.priority, assigneeId: form.assigneeId, reviewerId: form.reviewerId, dueAt: form.dueAt ? new Date(form.dueAt).toISOString() : undefined }) });
    const data = await response.json();
    if (response.ok) { setCreating(false); setForm(emptyForm); setMessage("Assignment saved"); await load(); }
    else setMessage(data.error || "Could not save assignment");
    setBusy(false);
  }

  async function update(item: WorkItem, changes: Record<string, unknown>) {
    if (!access.canEdit) return;
    setBusy(true); setMessage("");
    const response = await fetch("/api/admin/workflow", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item._id, expectedVersion: item.version, ...changes }) });
    const data = await response.json();
    if (response.ok) {
      setItems(current => current.map(entry => entry._id === item._id ? data.item : entry));
      if (selected?._id === item._id) setSelected(data.item);
      setComment("");
    } else { setMessage(data.error || "Could not update assignment"); if (data.conflict) await load(); }
    setBusy(false);
  }

  return <section className="admin-page admin-workflow">
    <header className="admin-page-heading"><div><p className="admin-eyebrow">Editorial operations</p><h1>Team workflow</h1><span>Assign, review and approve work without losing ownership or context.</span></div><div className="admin-heading-actions"><button className="admin-button secondary" onClick={() => void load()}><RefreshCw /> Refresh</button>{access.canEdit && <button className="admin-button" disabled={!configured} onClick={() => setCreating(true)}><Plus /> New assignment</button>}</div></header>
    {message && <div className="admin-notice">{message}</div>}
    {!configured && <div className="admin-empty"><strong>Connect MongoDB to activate team workflow.</strong><span>The preview stays read-only until the production database is available.</span></div>}
    <div className="admin-stat-grid admin-workflow-stats"><article><Users /><div><strong>{stats.open}</strong><span>Open assignments</span></div></article><article><MessageSquare /><div><strong>{stats.review}</strong><span>Awaiting review</span></div></article><article><CalendarDays /><div><strong>{stats.overdue}</strong><span>Overdue</span></div></article><article><CheckCircle2 /><div><strong>{items.filter(item => item.status === "done").length}</strong><span>Completed</span></div></article></div>
    {loading ? <div className="admin-empty">Loading workflow…</div> : <div className="admin-workflow-board">{statuses.map(status => <section className="admin-workflow-column" key={status}><header><strong>{labels[status]}</strong><span>{items.filter(item => item.status === status).length}</span></header><div>{items.filter(item => item.status === status).map(item => <article className={"priority-" + item.priority} key={item._id}><button className="admin-workflow-card-title" onClick={() => setSelected(item)}><small>{item.resourceType}</small><strong>{item.resourceLabel}</strong></button><p>{item.description || "No brief added yet."}</p><footer><span>{item.assigneeName || "Unassigned"}</span>{item.dueAt && <time className={new Date(item.dueAt) < new Date() && item.status !== "done" ? "is-overdue" : ""}>{new Date(item.dueAt).toLocaleDateString()}</time>}</footer>{access.canEdit && <select aria-label={"Move " + item.resourceLabel} disabled={busy} value={item.status} onChange={event => void update(item, { status: event.target.value })}>{statuses.map(option => <option value={option} key={option}>{labels[option]}</option>)}</select>}</article>)}</div></section>)}</div>}

    <AdminDrawer open={creating} title="New assignment" onClose={() => setCreating(false)}><form className="admin-form" onSubmit={createItem}><label>Content<select required value={form.resourceKey} onChange={event => setForm({ ...form, resourceKey: event.target.value })}><option value="">Choose content</option>{resources.map(resource => <option key={resource.resourceType + ":" + resource.resourceId} value={resource.resourceType + ":" + resource.resourceId}>{resource.resourceType} — {resource.resourceLabel}</option>)}</select></label><label>Brief<textarea rows={4} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /></label><div className="admin-form-grid"><label>Owner<select value={form.assigneeId} onChange={event => setForm({ ...form, assigneeId: event.target.value })}><option value="">Unassigned</option>{users.map(user => <option value={user._id} key={user._id}>{user.name} · {user.role}</option>)}</select></label><label>Reviewer<select value={form.reviewerId} onChange={event => setForm({ ...form, reviewerId: event.target.value })}><option value="">No reviewer</option>{users.map(user => <option value={user._id} key={user._id}>{user.name} · {user.role}</option>)}</select></label><label>Priority<select value={form.priority} onChange={event => setForm({ ...form, priority: event.target.value })}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label><label>Due date<input type="date" value={form.dueAt} onChange={event => setForm({ ...form, dueAt: event.target.value })} /></label></div><button className="admin-button" disabled={busy}>{busy ? "Saving…" : "Create assignment"}</button></form></AdminDrawer>

    <AdminDrawer open={Boolean(selected)} title={selected?.resourceLabel || "Assignment"} onClose={() => setSelected(null)}>{selected && <div className="admin-workflow-detail"><p className="admin-eyebrow">{selected.resourceType} · {selected.priority} priority</p><p>{selected.description || "No brief added yet."}</p><div className="admin-form-grid"><label>Owner<select disabled={!access.canEdit || busy} value={selected.assigneeId || ""} onChange={event => void update(selected, { assigneeId: event.target.value })}><option value="">Unassigned</option>{users.map(user => <option value={user._id} key={user._id}>{user.name}</option>)}</select></label><label>Reviewer<select disabled={!access.canEdit || busy} value={selected.reviewerId || ""} onChange={event => void update(selected, { reviewerId: event.target.value })}><option value="">No reviewer</option>{users.map(user => <option value={user._id} key={user._id}>{user.name}</option>)}</select></label></div><h3>Discussion</h3><div className="admin-workflow-comments">{selected.comments?.length ? selected.comments.map(entry => <article key={entry.authorName + "-" + entry.createdAt}><strong>{entry.authorName}</strong><time>{new Date(entry.createdAt).toLocaleString()}</time><p>{entry.body}</p></article>) : <p>No comments yet.</p>}</div>{access.canEdit && <form onSubmit={event => { event.preventDefault(); void update(selected, { comment }); }}><textarea required rows={3} value={comment} onChange={event => setComment(event.target.value)} placeholder="Add review notes or handoff context…" /><button className="admin-button" disabled={busy}>{busy ? "Posting…" : "Post comment"}</button></form>}</div>}</AdminDrawer>
  </section>;
}
