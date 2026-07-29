"use client";

import { Check, KeyRound, LoaderCircle, Plus, Shield, ShieldCheck, Trash2, UserRound, UsersRound, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Role = "owner" | "editor" | "analyst";
type Admin = {
  _id: string;
  username: string;
  name: string;
  role: Role;
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
};

const emptyForm = { username: "", name: "", password: "", role: "editor" as Role };

export default function AdminUsers() {
  const [users, setUsers] = useState<Admin[]>([]);
  const [currentId, setCurrentId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/admin/users", { cache: "no-store" });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) { setError(data.error || "Could not load administrators"); return; }
    setUsers(data.users);
    setCurrentId(data.currentAdminId);
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true); setError(""); setNotice("");
    const response = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    setSaving(false);
    if (!response.ok) { setError(data.error || "Could not create administrator"); return; }
    setForm(emptyForm);
    setNotice(`${data.user.name} can now sign in.`);
    await load();
  }

  async function update(id: string, update: Partial<Admin> & { password?: string }) {
    setError(""); setNotice("");
    const response = await fetch("/api/admin/users", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...update }) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Could not update administrator"); return; }
    setNotice("Administrator updated.");
    await load();
  }

  async function resetPassword(user: Admin) {
    const password = window.prompt(`Set a new password for ${user.name}. Use at least 10 characters.`);
    if (!password) return;
    await update(user._id, { password });
  }

  async function remove(user: Admin) {
    if (!window.confirm(`Remove ${user.name} from the admin workspace?`)) return;
    const response = await fetch(`/api/admin/users?id=${encodeURIComponent(user._id)}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) { setError(data.error || "Could not remove administrator"); return; }
    setNotice("Administrator removed.");
    await load();
  }

  return <div className="admin-users-page">
    <header className="admin-workspace-heading"><div><p>Access and responsibility</p><h1>Administrators</h1></div><span className="admin-users-count"><UsersRound /> {users.length} accounts</span></header>
    <section className="admin-users-intro"><ShieldCheck /><div><strong>Simple access, proper safeguards.</strong><p>Owners manage accounts. Editors and analysts can use the website workspace. Passwords are encrypted and never shown here.</p></div></section>
    {(notice || error) && <div className={`admin-users-notice ${error ? "is-error" : ""}`}>{error ? <X /> : <Check />} {error || notice}</div>}
    <div className="admin-users-layout">
      <section className="admin-users-list">
        <header><span>Current team</span><small>{loading ? "Loading..." : "Live MongoDB accounts"}</small></header>
        {loading ? <div className="admin-users-loading"><LoaderCircle className="is-spinning" /> Reading secure accounts</div> : users.map(user => <article key={user._id} className={!user.active ? "is-disabled" : ""}>
          <div className="admin-user-avatar">{user.name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase()}</div>
          <div className="admin-user-identity"><strong>{user.name}{user._id === currentId && <em>You</em>}</strong><span>{user.username}</span><small>{user.lastLoginAt ? `Last login ${new Date(user.lastLoginAt).toLocaleString()}` : "Not signed in yet"}</small></div>
          <label><span>Role</span><select value={user.role} onChange={event => void update(user._id, { role: event.target.value as Role })}><option value="owner">Owner</option><option value="editor">Editor</option><option value="analyst">Analyst</option></select></label>
          <button className={`admin-user-state ${user.active ? "is-active" : ""}`} onClick={() => void update(user._id, { active: !user.active })}>{user.active ? "Active" : "Disabled"}</button>
          <button className="admin-user-icon" onClick={() => void resetPassword(user)} title="Reset password"><KeyRound /></button>
          <button className="admin-user-icon is-danger" onClick={() => void remove(user)} title="Remove administrator" disabled={user._id === currentId}><Trash2 /></button>
        </article>)}
      </section>
      <form className="admin-user-create" onSubmit={create}>
        <header><span><Plus /></span><div><strong>Add an administrator</strong><small>Access works immediately after creation</small></div></header>
        <label><span>Full name</span><div><UserRound /><input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Editorial team member" required minLength={2} /></div></label>
        <label><span>User ID</span><div><Shield /><input value={form.username} onChange={event => setForm({ ...form, username: event.target.value.toLowerCase().replace(/\s+/g, "") })} placeholder="name@paperfoundation.in" required minLength={3} /></div></label>
        <label><span>Temporary password</span><div><KeyRound /><input type="password" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} placeholder="Minimum 10 characters" required minLength={10} /></div></label>
        <label><span>Access level</span><select value={form.role} onChange={event => setForm({ ...form, role: event.target.value as Role })}><option value="editor">Editor · workspace access</option><option value="analyst">Analyst · workspace access</option><option value="owner">Owner · accounts and workspace</option></select></label>
        <button className="admin-action" disabled={saving}>{saving ? <LoaderCircle className="is-spinning" /> : <Plus />} {saving ? "Creating account..." : "Create administrator"}</button>
      </form>
    </div>
  </div>;
}
