"use client";

import { Check, Copy, ImagePlus, RefreshCw, Search, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Media = { _id?: string; publicId: string; secureUrl: string; resourceType: string; format?: string; bytes?: number; width?: number; height?: number; originalFilename?: string; alt?: string; usage?: unknown[] };

export default function AdminMedia() {
  const [items, setItems] = useState<Media[]>([]);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState(false);
  const load = useCallback(async () => { const response = await fetch(`/api/media?q=${encodeURIComponent(query)}`); const data = await response.json(); setItems(data.items ?? []); }, [query]);
  useEffect(() => { void load(); }, [load]);
  async function upload(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setUploading(true); const data = new FormData(event.currentTarget); const response = await fetch("/api/upload", { method: "POST", body: data }); const result = await response.json(); setNotice(response.ok ? "Asset uploaded and added to the library." : result.error); if (response.ok) { event.currentTarget.reset(); await load(); } setUploading(false); }
  async function remove(item: Media) { if (!item._id || !confirm("Delete this unused asset permanently?")) return; const response = await fetch(`/api/media?id=${item._id}`, { method: "DELETE" }); const result = await response.json(); setNotice(response.ok ? "Asset deleted." : result.error); if (response.ok) await load(); }
  return <div>
    <header className="admin-workspace-heading"><div><p>Cloudinary asset library</p><h1>Media</h1></div><div><button className="admin-action" onClick={() => void load()}><RefreshCw /> Refresh</button></div></header>
    <form className="admin-upload-panel" onSubmit={upload}><div><UploadCloud /><span><strong>Upload images, PDFs or supporting files</strong><small>Files are stored in Cloudinary. Asset references and usage remain in MongoDB.</small></span></div><label><input required type="file" name="file" accept="image/*,.pdf,.doc,.docx" /><span><ImagePlus /> Choose file</span></label><input name="alt" placeholder="Alternative text" /><input name="tags" placeholder="Tags, comma separated" /><button disabled={uploading}>{uploading ? "Uploading..." : "Upload asset"}</button></form>
    {notice && <div className="admin-notice"><Check /> {notice}</div>}
    <div className="admin-toolbar"><label><Search /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search media by file name, alt text or tag" /></label><span>{items.length} assets</span></div>
    {items.length ? <div className="admin-media-grid">{items.map(item => <article key={item.publicId}><div>{item.resourceType === "image" ? <Image src={item.secureUrl} alt={item.alt ?? ""} fill sizes="240px" /> : <span>{item.format?.toUpperCase() ?? "FILE"}</span>}</div><strong>{item.originalFilename ?? item.publicId.split("/").at(-1)}</strong><small>{item.width && item.height ? `${item.width} × ${item.height}` : item.format} / {item.bytes ? `${Math.round(item.bytes / 1024)} KB` : "size unavailable"}</small><p>{item.alt || "Alternative text not added"}</p><footer><button onClick={() => { void navigator.clipboard.writeText(item.secureUrl); setNotice("Asset URL copied."); }}><Copy /> Copy URL</button><button disabled={Boolean(item.usage?.length)} onClick={() => void remove(item)}><Trash2 /></button></footer></article>)}</div> : <div className="admin-empty"><i /><p>Connect Cloudinary and upload the first reusable asset.</p></div>}
  </div>;
}
