"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Download, Film, Share2 } from "@/components/paper-ui/icons";
import { captionFor, SHARE_PLATFORMS, shareHref, type SharePlatform, type ShareSubject } from "@/lib/share";

type Props = {
  subject: ShareSubject;
  /** Supplies a scorecard image. Omitted where there is nothing to picture. */
  buildImage?: () => Promise<HTMLCanvasElement>;
  /**
   * Supplies an animated version of the same card. Offered only where the
   * browser can record one; the still image remains the reliable default
   * because every platform accepts it.
   */
  buildAnimation?: () => Promise<{ blob: Blob; extension: string } | null>;
  imageName?: string;
  className?: string;
};

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("The image could not be created."))), "image/png");
  });
}

function saveCanvas(canvas: HTMLCanvasElement, name: string) {
  const link = document.createElement("a");
  link.download = name;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export default function ShareRow({
  subject,
  buildImage,
  buildAnimation,
  imageName = "paper-foundation.png",
  className = "",
}: Props) {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const noteTimer = useRef<number | null>(null);
  // Recording support varies by browser, so the control only appears once we
  // know this one can produce a file.
  const [canAnimate, setCanAnimate] = useState(false);

  useEffect(() => {
    if (!buildAnimation) return;
    const supported =
      typeof MediaRecorder !== "undefined" &&
      typeof document.createElement("canvas").captureStream === "function" &&
      ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm"].some(
        (type) => MediaRecorder.isTypeSupported?.(type)
      );
    setCanAnimate(supported);
  }, [buildAnimation]);

  const flash = useCallback((message: string) => {
    setNote(message);
    if (noteTimer.current) window.clearTimeout(noteTimer.current);
    noteTimer.current = window.setTimeout(() => setNote(""), 2600);
  }, []);

  const copy = useCallback(
    async (platform: SharePlatform, confirmation: string) => {
      const text = captionFor(platform, subject);
      try {
        await navigator.clipboard.writeText(text);
        flash(confirmation);
        return true;
      } catch {
        // Clipboard access is refused in some embedded and insecure contexts.
        flash("Copying was blocked. Select the caption and copy it by hand.");
        return false;
      }
    },
    [flash, subject]
  );

  /** The one action that carries both the picture and the words on a phone. */
  async function nativeShare() {
    if (busy) return;
    setBusy(true);
    try {
      let file: File | undefined;
      if (buildImage) {
        const blob = await canvasToBlob(await buildImage());
        file = new File([blob], imageName, { type: "image/png" });
      }

      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: subject.title, text: subject.summary, url: subject.url, files: [file] });
      } else if (navigator.share) {
        await navigator.share({ title: subject.title, text: subject.summary, url: subject.url });
      } else if (buildImage) {
        saveCanvas(await buildImage(), imageName);
        await copy("whatsapp", "Image saved and caption copied.");
      } else {
        await copy("whatsapp", "Caption and link copied.");
      }
    } catch (error) {
      // A cancelled share sheet is a normal outcome, not a failure.
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        flash("That could not be shared. The caption has been copied instead.");
        void copy("whatsapp", "Caption and link copied.");
      }
    } finally {
      setBusy(false);
    }
  }

  function saveBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Revoked on the next tick so the download has started.
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  async function downloadAnimation() {
    if (!buildAnimation || busy) return;
    setBusy(true);
    flash("Recording the card, a few seconds.");
    try {
      const result = await buildAnimation();
      if (!result) {
        flash("This browser cannot record the animation. Saving the image instead.");
        if (buildImage) saveCanvas(await buildImage(), imageName);
        return;
      }
      saveBlob(result.blob, imageName.replace(/\.png$/, "") + "." + result.extension);
      await copy("instagram", `Animation saved as .${result.extension}, caption copied.`);
    } catch {
      flash("The animation could not be created. Try the still image.");
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    if (!buildImage || busy) return;
    setBusy(true);
    try {
      saveCanvas(await buildImage(), imageName);
      flash("Image saved.");
    } catch {
      flash("The image could not be created.");
    } finally {
      setBusy(false);
    }
  }

  /** Instagram has no web composer, so the post is assembled by hand. */
  async function instagram() {
    setBusy(true);
    try {
      if (buildImage) saveCanvas(await buildImage(), imageName);
      await copy("instagram", buildImage ? "Image saved and Instagram caption copied." : "Instagram caption copied.");
    } catch {
      flash("The image could not be created. The caption has been copied.");
      await copy("instagram", "Instagram caption copied.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`share-row ${className}`}>
      <div className="share-row-primary">
        <button type="button" onClick={nativeShare} disabled={busy} className="share-primary">
          <Share2 size={16} /> {busy ? "Preparing" : buildImage ? "Share image and caption" : "Share"}
        </button>
        {buildImage && (
          <button type="button" onClick={download} disabled={busy}>
            <Download size={16} /> Save image
          </button>
        )}
        {canAnimate && (
          <button type="button" onClick={downloadAnimation} disabled={busy}>
            <Film size={16} /> Save animation
          </button>
        )}
        <button type="button" onClick={() => copy("whatsapp", "Caption and link copied.")}>
          <Copy size={16} /> Copy caption
        </button>
      </div>

      <ul className="share-row-platforms">
        {SHARE_PLATFORMS.map((platform) => {
          const href = shareHref(platform.id, subject);
          if (platform.id === "instagram" || !href) {
            return (
              <li key={platform.id}>
                <button type="button" onClick={instagram} disabled={busy}>
                  {platform.label}
                </button>
              </li>
            );
          }
          return (
            <li key={platform.id}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Share on ${platform.label}`}
                onClick={() => {
                  // Facebook renders the page's own card and ignores prefilled
                  // text, so the written caption is put on the clipboard ready
                  // to paste into the composer.
                  if (platform.id === "facebook") void copy("facebook", "Caption copied, ready to paste.");
                }}
              >
                {platform.label}
              </a>
            </li>
          );
        })}
      </ul>

      <p className="share-row-note" role="status" aria-live="polite">
        {note && <><Check size={13} /> {note}</>}
      </p>
    </div>
  );
}
