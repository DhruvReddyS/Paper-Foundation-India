"use client";

import { Check, Copy, Edit3, ImagePlus, RefreshCw, Save, Search, Trash2, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAdminAccess } from "./AdminShell";

type Media = { _id?: string; publicId: string; secureUrl: string; resourceType: string; format?: string; bytes?: number; width?: number; height?: number; originalFilename?: string; alt?: string; caption?: string; tags?: string[]; usage?: unknown[] };

export default function AdminMedia() {
  const { canEdit } = useAdminAccess();
  const [items, setItems] = useState<Media[]>([]);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Media | null>(null);
  const load = useCallback(async () => { const response = await fetch(`/api/media?q=${encodeURIComponent(query)}`); const data = await response.json(); setItems(data.items ?? []); }, [query]);
  useEffect(() => { void load(); }, [load]);
  async function upload(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setUploading(true); const data = new FormData(event.currentTarget); const response = await fetch("/api/upload", { method: "POST", body: data }); const result = await response.json(); setNotice(response.ok ? "Asset uploaded and added to the library." : result.error); if (response.ok) { event.currentTarget.reset(); await load(); } setUploading(false); }
  async function remove(item: Media) { if (!item._id || !confirm("Delete this unused asset permanently?")) return; const response = await fetch(`/api/media?id=${item._id}`, { method: "DELETE" }); const result = await response.json(); setNotice(response.ok ? "Asset deleted." : result.error); if (response.ok) await load(); }
  async function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!editing?._id) return; const form = new FormData(event.currentTarget); const response = await fetch("/api/media", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing._id, alt: form.get("alt"), caption: form.get("caption"), tags: String(form.get("tags") || "").split(",").map(tag => tag.trim()).filter(Boolean) }) }); const result = await response.json(); setNotice(response.ok ? "Asset details updated." : result.error); if (response.ok) { setEditing(null); await load(); } }
  return <div>
    <header className="admin-workspace-heading"><div><p>Cloudinary asset library</p><h1>Media</h1></div><div><button className="admin-action" onClick={() => void load()}><RefreshCw /> Refresh</button></div></header>
    {canEdit && <form className="admin-upload-panel" onSubmit={upload}><div><UploadCloud /><span><strong>Upload images, PDFs or supporting files</strong><small>Files are stored in Cloudinary. Asset references and usage remain in MongoDB.</small></span></div><label><input required type="file" name="file" accept="image/*,.pdf,.doc,.docx" /><span><ImagePlus /> Choose file</span></label><input name="alt" placeholder="Alternative text" /><input name="tags" placeholder="Tags, comma separated" /><button disabled={uploading}>{uploading ? "Uploading..." : "Upload asset"}</button></form>}
    {notice && <div className="admin-notice"><Check /> {notice}</div>}
    <div className="admin-toolbar"><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search media by file name, alt text or tag" /></label><span>{items.length} assets</span></div>
    {items.length ? <div className="admin-media-grid">{items.map(item => <article key={item.publicId}><div>{item.resourceType === "image" ? <Image src={item.secureUrl} alt={item.alt ?? ""} fill sizes="240px" /> : <span>{item.format?.toUpperCase() ?? "FILE"}</span>}</div><strong>{item.originalFilename ?? item.publicId.split("/").at(-1)}</strong><small>{item.width && item.height ? `${item.width} × ${item.height}` : item.format} / {item.bytes ? `${Math.round(item.bytes / 1024)} KB` : "size unavailable"}</small><p>{item.alt || "Alternative text not added"}</p><footer><button onClick={() => { void navigator.clipboard.writeText(item.secureUrl); setNotice("Asset URL copied."); }}><Copy /> Copy URL</button>{canEdit && <button onClick={() => setEditing(item)} title="Edit metadata"><Edit3 /></button>}{canEdit && <button disabled={Boolean(item.usage?.length)} onClick={() => void remove(item)} title="Delete unused asset"><Trash2 /></button>}</footer></article>)}</div> : <div className="admin-empty"><i /><p>Connect Cloudinary and upload the first reusable asset.</p></div>}
    {editing && <div className="admin-drawer-backdrop"><section className="admin-drawer"><header><div><p>ASSET DETAILS</p><h2>{editing.originalFilename || editing.publicId}</h2></div><button onClick={() => setEditing(null)}><X /></button></header><form className="admin-form" onSubmit={save}><label className="full"><span>Alternative text</span><textarea name="alt" rows={3} defaultValue={editing.alt} /></label><label className="full"><span>Caption</span><textarea name="caption" rows={3} defaultValue={editing.caption} /></label><label className="full"><span>Tags, comma separated</span><input name="tags" defaultValue={editing.tags?.join(", ")} /></label><footer><button type="button" onClick={() => setEditing(null)}>Cancel</button><button className="primary"><Save /> Save details</button></footer></form></section></div>}
  </div>;
}
