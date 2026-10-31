import type { ReactNode, SVGProps } from "react";

/**
 * The Foundation's own icon set.
 *
 * These are drawn for this project rather than pulled from a general-purpose
 * library, so the marks carry the same hand as the rest of the site: a single
 * nib weight, open terminals, and geometry that is deliberately a little off
 * true. Nothing here is a sparkle, a gradient or a glow.
 *
 * The props match the shape the components already pass, so a call site reads
 * the same as before: <Check size={18} />, <Icon size={25} strokeWidth={1.7} />.
 */

export type PaperIconProps = Omit<SVGProps<SVGSVGElement>, "ref"> & {
  size?: number | string;
  /** Kept for API compatibility; the nib weight is uniform by design. */
  absoluteStrokeWidth?: boolean;
};

export type PaperIcon = (props: PaperIconProps) => ReactNode;

/** Alias so files that typed a prop as LucideIcon keep compiling unchanged. */
export type LucideIcon = PaperIcon;

const NIB = 1.6;

function make(draw: ReactNode, viewBox = "0 0 24 24"): PaperIcon {
  function Icon({ size = 20, strokeWidth = NIB, absoluteStrokeWidth, ...props }: PaperIconProps) {
    void absoluteStrokeWidth;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={props["aria-label"] ? undefined : true}
        focusable="false"
        {...props}
      >
        {draw}
      </svg>
    );
  }
  return Icon;
}

/* ───────────────────────── direction and movement ───────────────────────── */

export const ArrowRight = make(<><path d="M3.6 12h16.2" /><path d="m14.1 6.1 5.7 5.9-5.7 5.9" /></>);
export const ArrowLeft = make(<><path d="M20.4 12H4.2" /><path d="m9.9 6.1-5.7 5.9 5.7 5.9" /></>);
export const ArrowUp = make(<><path d="M12 20.3V4.1" /><path d="m6.1 9.8 5.9-5.7 5.9 5.7" /></>);
export const ArrowDown = make(<><path d="M12 3.7v16.2" /><path d="m6.1 14.1 5.9 5.7 5.9-5.7" /></>);
export const ArrowUpRight = make(<><path d="M6.4 17.7 17.8 6.2" /><path d="M8.6 6.1h9.2v9.2" /></>);
export const ArrowDownToLine = make(<><path d="M12 3.4v11.4" /><path d="m7.2 10.1 4.8 4.7 4.8-4.7" /><path d="M4.8 20.2h14.4" /></>);
export const ChevronRight = make(<path d="m9.1 5.3 7 6.7-7 6.7" />);
export const ChevronLeft = make(<path d="m14.9 5.3-7 6.7 7 6.7" />);
export const ChevronUp = make(<path d="m5.3 14.9 6.7-7 6.7 7" />);
export const ChevronDown = make(<path d="m5.3 9.1 6.7 7 6.7-7" />);
export const CornerDownRight = make(<><path d="M4.6 4.2v7.6a3 3 0 0 0 3 3h11.8" /><path d="m15.1 10.5 4.3 4.3-4.3 4.3" /></>);
export const MoveHorizontal = make(<><path d="M4.1 12h15.8" /><path d="m7.3 8.6-3.4 3.4 3.4 3.4" /><path d="m16.7 8.6 3.4 3.4-3.4 3.4" /></>);
export const MousePointer2 = make(<><path d="m4.8 3.6 5.1 16.2 2.6-6.4 6.6-2.3z" /><path d="m13.3 13.1 5.4 5.6" /></>);
export const Rotate3D = make(<><ellipse cx="12" cy="12" rx="8.6" ry="4" transform="rotate(-28 12 12)" /><path d="M12 4.3v15.4" /><path d="m9.3 6.7 2.7-2.6 2.7 2.6" /></>);
export const RotateCcw = make(<><path d="M3.9 5.1v5.2h5.2" /><path d="M4.4 10.3a8 8 0 1 1 1.3 6.4" /></>);
export const RefreshCw = make(<><path d="M20.3 5.4v5.1h-5.1" /><path d="M3.7 18.6v-5.1h5.1" /><path d="M19.6 10.4a7.9 7.9 0 0 0-13.3-3.3L3.7 9.6" /><path d="M4.4 13.6a7.9 7.9 0 0 0 13.3 3.3l2.6-2.5" /></>);
export const TrendingUp = make(<><path d="m3.6 16.4 5.5-5.6 3.4 3.4 7.9-8" /><path d="M14.9 6.2h5.5v5.5" /></>);
export const Play = make(<path d="M7.4 4.6 19 12 7.4 19.4z" />);
export const Pause = make(<><path d="M9.1 4.6v14.8" /><path d="M15 4.6v14.8" /></>);

/* ───────────────────────────── marks and status ─────────────────────────── */

export const Check = make(<path d="m4.3 12.6 5 5.2L19.8 6.4" />);
export const CheckCircle2 = make(<><circle cx="12" cy="12" r="8.6" /><path d="m7.9 12.3 2.7 2.8 5.6-6" /></>);
export const X = make(<><path d="m5.4 5.2 13.3 13.6" /><path d="M18.7 5.2 5.4 18.8" /></>);
export const Plus = make(<><path d="M12 4.6v14.8" /><path d="M4.6 12h14.8" /></>);
export const Minus = make(<path d="M4.6 12h14.8" />);
export const AlertCircle = make(<><circle cx="12" cy="12" r="8.6" /><path d="M12 7.4v5.4" /><path d="M12 16.3h.01" /></>);
export const AlertTriangle = make(<><path d="M12 3.9 21 19.6H3z" /><path d="M12 9.6v4.2" /><path d="M12 16.9h.01" /></>);
export const HelpCircle = make(<><circle cx="12" cy="12" r="8.6" /><path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.4c-.6.3-.9.8-.9 1.5v.5" /><path d="M12 16.9h.01" /></>);
export const Info = make(<><circle cx="12" cy="12" r="8.6" /><path d="M12 11.2v5.1" /><path d="M12 7.7h.01" /></>);
export const LoaderCircle = make(<path d="M20.4 12a8.4 8.4 0 1 1-2.6-6" />);
export const Activity = make(<path d="M3.5 12.2h4L9.8 5l4.1 13.6 2.4-6.4h4.2" />);
export const Target = make(<><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.6" /><circle cx="12" cy="12" r=".9" /></>);

/* ───────────────────────────── paper and print ──────────────────────────── */

export const FileText = make(<><path d="M6 3.3h7.3l4.8 4.9v12.5H6z" /><path d="M13.2 3.4v4.8h4.8" /><path d="M8.7 12.6h6.7" /><path d="M8.7 16.1h4.9" /></>);
export const FileCheck2 = make(<><path d="M6 3.3h7.3l4.8 4.9v12.5H6z" /><path d="M13.2 3.4v4.8h4.8" /><path d="m8.9 14.6 2.2 2.3 4.1-4.4" /></>);
export const FilePlus2 = make(<><path d="M6 3.3h7.3l4.8 4.9v12.5H6z" /><path d="M13.2 3.4v4.8h4.8" /><path d="M12 11.9v5" /><path d="M9.5 14.4h5" /></>);
export const FileDown = make(<><path d="M6 3.3h7.3l4.8 4.9v12.5H6z" /><path d="M13.2 3.4v4.8h4.8" /><path d="M12 11.5v5.2" /><path d="m9.6 14.4 2.4 2.3 2.4-2.3" /></>);
export const FileSearch = make(<><path d="M6 3.3h7.3l4.8 4.9v4" /><path d="M13.2 3.4v4.8h4.8" /><path d="M6 12.4v8.3h5.2" /><circle cx="15.8" cy="16.4" r="3.4" /><path d="m18.3 18.9 2.3 2.2" /></>);
export const FolderOpen = make(<><path d="M3.6 8.2V5.4h5.3l2 2.4h7.1v2.4" /><path d="m3.6 8.2 2 10.6h13.1l2-8.2H5.3z" /></>);
export const Quote = make(<><path d="M9.4 6.6c-2.7 1-4 3-4 6.1v4.7h5.2v-5.1H7.8c0-2.1.6-3.5 1.9-4.2z" /><path d="M18.4 6.6c-2.7 1-4 3-4 6.1v4.7h5.2v-5.1h-2.8c0-2.1.6-3.5 1.9-4.2z" /></>);
export const BookOpen = make(<><path d="M12 6.4C10.3 5 8.2 4.3 5.1 4.3v12.8c3.1 0 5.2.7 6.9 2.1 1.7-1.4 3.8-2.1 6.9-2.1V4.3c-3.1 0-5.2.7-6.9 2.1z" /><path d="M12 6.4v13" /></>);
export const BookOpenCheck = make(<><path d="M12 6.4C10.3 5 8.2 4.3 5.1 4.3v12.8c3.1 0 5.2.7 6.9 2.1" /><path d="M18.9 4.3c-2.4 0-4.2.4-5.7 1.3" /><path d="M12 6.4v13" /><path d="m14.6 14.9 2.1 2.2 4-4.3" /></>);
export const BookOpenText = make(<><path d="M12 6.4C10.3 5 8.2 4.3 5.1 4.3v12.8c3.1 0 5.2.7 6.9 2.1 1.7-1.4 3.8-2.1 6.9-2.1V4.3c-3.1 0-5.2.7-6.9 2.1z" /><path d="M12 6.4v13" /><path d="M7.6 8.6h2.1" /><path d="M14.4 8.6h2.1" /><path d="M7.6 11.8h2.1" /><path d="M14.4 11.8h2.1" /></>);
export const BookMarked = make(<><path d="M6.1 3.4h11.8v17.2L12 17.1l-5.9 3.5z" /><path d="M9.7 3.5v6.1l2.3-1.4 2.3 1.4V3.5" /></>);
export const Library = make(<><path d="M4.4 4.6v14.8" /><path d="M8.2 4.2v15.2" /><path d="m12.2 4.9 5.1 14.1" /><path d="M20.1 19.4H3.4" /></>);
export const Layers3 = make(<><path d="m12 3.6 8.3 4.1L12 11.9 3.7 7.7z" /><path d="m3.7 12 8.3 4.1 8.3-4.1" /><path d="m3.7 16.3 8.3 4.1 8.3-4.1" /></>);
export const LayoutTemplate = make(<><path d="M3.6 4.4h16.8v4.9H3.6z" /><path d="M3.6 12.2h7v7.4h-7z" /><path d="M13.4 12.2h7v7.4h-7z" /></>);
export const LayoutDashboard = make(<><path d="M3.8 3.9h6.6v7.2H3.8z" /><path d="M13.6 3.9h6.6v4.4h-6.6z" /><path d="M13.6 11.3h6.6v8.8h-6.6z" /><path d="M3.8 14h6.6v6.1H3.8z" /></>);
export const Grid3X3 = make(<><path d="M3.7 3.8h16.6v16.4H3.7z" /><path d="M3.8 9.3h16.4" /><path d="M3.8 14.8h16.4" /><path d="M9.3 3.9v16.2" /><path d="M14.8 3.9v16.2" /></>);
export const Boxes = make(<><path d="M7.9 3.7h8.2v5.1H7.9z" /><path d="M3.6 11.6h8.2v5.1H3.6z" /><path d="M12.4 11.6h8v5.1h-8z" /><path d="M12 8.9v2.6" /></>);
export const PackageOpen = make(<><path d="m3.7 7.6 8.3-3.3 8.3 3.3-8.3 3.3z" /><path d="M3.7 7.7v8.6l8.3 3.4 8.3-3.4V7.7" /><path d="M12 11v8.6" /></>);
export const PackageCheck = make(<><path d="M4.1 7.9 12 4.4l7.9 3.5v8.2L12 19.6l-7.9-3.5z" /><path d="m8.8 12 2.2 2.2 4.3-4.5" /></>);
export const ImagePlus = make(<><path d="M20.3 12.8V5.1H3.7v13.8h10.1" /><circle cx="8.6" cy="9.4" r="1.6" /><path d="m3.9 16.4 4.4-4.1 3.6 3.3" /><path d="M17.9 15.1v5.2" /><path d="M15.3 17.7h5.2" /></>);
export const Image = make(<><path d="M3.7 5.1h16.6v13.8H3.7z" /><circle cx="8.6" cy="9.5" r="1.6" /><path d="m3.9 16.6 4.6-4.3 4 3.6 3.1-2.6 4.5 3.9" /></>);
export const Paperclip = make(<path d="M19.2 11.1 11.5 19a4.4 4.4 0 0 1-6.3-6.1l8-8.2a2.9 2.9 0 1 1 4.2 4.1l-7.9 8.1a1.4 1.4 0 0 1-2.1-2l7.3-7.5" />);
export const Scissors = make(<><circle cx="6.3" cy="6.4" r="2.6" /><circle cx="6.3" cy="17.6" r="2.6" /><path d="M8.3 8.2 19.6 18.4" /><path d="M19.6 5.6 8.3 15.8" /></>);
export const Stamp = make(<><path d="M9 4.2h6a2.4 2.4 0 0 1 2.3 3l-1.1 4.3H7.8L6.7 7.2a2.4 2.4 0 0 1 2.3-3z" /><path d="M5.1 14.1h13.8v2.6H5.1z" /><path d="M4.1 19.9h15.8" /></>);
export const Feather = make(<><path d="M19.4 4.6a5.6 5.6 0 0 0-7.9 0L5.2 11v6.2h6.3l6.3-6.4a5.6 5.6 0 0 0 1.6-6.2z" /><path d="M4.1 19.9 11.4 12.5" /><path d="M14.3 9.6H9.2" /></>);

/* ───────────────────────── fibre, forest and process ────────────────────── */

export const Trees = make(<><path d="M8.3 3.8 12.6 10H9.9l3.1 4.6H3.6L6.7 10H4z" /><path d="M8.3 14.7v5.5" /><path d="m17.2 6.4 3.3 5h-6.6z" /><path d="m17.2 10.6 3.3 5.1h-6.6z" /><path d="M17.2 15.8v4.4" /></>);
export const Sprout = make(<><path d="M12 20.2v-7.4" /><path d="M12 12.8C12 9.6 9.5 7.3 5.8 7.1c0 3.4 2.5 5.7 6.2 5.7z" /><path d="M12 12.8c0-2.8 2.2-4.9 5.5-5 0 3-2.2 5-5.5 5z" /><path d="M8.8 20.2h6.4" /></>);
export const Leaf = make(<><path d="M4.6 19.4C3 15.1 5.1 9 9.7 6.6c3-1.6 6.6-1.5 10.1-1.3.3 3.7.2 7.4-1.6 10.4-2.7 4.5-9 6.1-13.6 3.7z" /><path d="M19.2 5.6 6.1 18.9" /></>);
export const Recycle = make(<><path d="m7.8 10.1-2.6 4.4 3.9 2.3" /><path d="m13.4 5.9 2.6 4.4 3.9-2.2" /><path d="m14.9 18.1-5.1.1" /><path d="M9.2 16.8 5.5 17a1.9 1.9 0 0 1-1.6-2.9l1.9-3.3" /><path d="m9.3 7.2 1.9-3.2a1.9 1.9 0 0 1 3.3 0l1.9 3.3" /><path d="m19.9 8.1 1.8 3.2a1.9 1.9 0 0 1-1.6 2.9h-3.8" /></>);
export const Droplets = make(<><path d="M8.3 14.6c0 1.8-1.4 3.2-3.1 3.2s-3.1-1.4-3.1-3.2c0-2.2 3.1-5.3 3.1-5.3s3.1 3.1 3.1 5.3z" /><path d="M21.9 11.5c0 3.1-2.5 5.6-5.4 5.6s-5.4-2.5-5.4-5.6c0-3.8 5.4-9.2 5.4-9.2s5.4 5.4 5.4 9.2z" /></>);
export const Waves = make(<><path d="M2.6 7.4c1.6 0 1.6 1.6 3.2 1.6s1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6 1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6 1.6-1.6 3-1.6" /><path d="M2.6 12.4c1.6 0 1.6 1.6 3.2 1.6s1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6 1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6 1.6-1.6 3-1.6" /><path d="M2.6 17.4c1.6 0 1.6 1.6 3.2 1.6s1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6 1.6-1.6 3.2-1.6 1.6 1.6 3.2 1.6 1.6-1.6 3-1.6" /></>);
export const Wind = make(<><path d="M3.4 8.6h9.1a2.6 2.6 0 1 0-2.6-2.7" /><path d="M3.4 15.4h12.8a2.6 2.6 0 1 1-2.6 2.7" /><path d="M3.4 12h16.1" /></>);
export const Factory = make(<><path d="M3.6 20.2V9.4l5 3.3V9.4l5 3.3V7.9l6.8 4.5v7.8z" /><path d="M4.6 5.1h3.8" /><path d="M8.2 16.6h2.4" /><path d="M14.1 16.6h2.4" /></>);
export const Filter = make(<path d="M3.9 4.6h16.2l-6.3 7.5v7l-3.7 1.9v-8.9z" />);
export const Scale = make(<><path d="M12 4.1v16.1" /><path d="M7.4 20.2h9.2" /><path d="m5.6 6.6 12.8-1.4" /><path d="m5.6 6.6-3 6.6h6z" /><path d="m18.4 5.2-3 6.6h6z" /></>);

/* ───────────────────────── people, place and body ───────────────────────── */

export const Users = make(<><path d="M15.5 20v-1.9a3.9 3.9 0 0 0-3.9-3.9H6.4a3.9 3.9 0 0 0-3.9 3.9V20" /><circle cx="9" cy="7.8" r="3.7" /><path d="M21.5 20v-1.9a3.9 3.9 0 0 0-2.9-3.8" /><path d="M15.6 4.3a3.9 3.9 0 0 1 0 7.5" /></>);
export const UsersRound = make(<><path d="M17.6 20a5.8 5.8 0 0 0-11.2 0" /><circle cx="12" cy="8.1" r="3.9" /><path d="M21.4 18.5a4.9 4.9 0 0 0-3.6-3.6" /><path d="M17.2 5a3.6 3.6 0 0 1 0 6.6" /></>);
export const UserRound = make(<><circle cx="12" cy="7.9" r="4.1" /><path d="M4.6 20.1a7.5 7.5 0 0 1 14.8 0" /></>);
export const UserCog = make(<><circle cx="9.6" cy="7.6" r="3.9" /><path d="M3.3 19.9a6.5 6.5 0 0 1 9.4-5.4" /><circle cx="17.6" cy="17.3" r="2.6" /><path d="M17.6 13.3v1.1" /><path d="M17.6 20.2v1.1" /><path d="m21 15.3-.9.6" /><path d="m15.1 18.7-.9.6" /></>);
export const HeartHandshake = make(<><path d="M12 19.9 4.6 12.6a4.5 4.5 0 0 1 6.3-6.4l1.1 1 1.1-1a4.5 4.5 0 0 1 6.3 6.4z" /><path d="m9.4 11.4 2 1.9a1.4 1.4 0 0 0 2-2l-1.8-1.8" /></>);
export const GraduationCap = make(<><path d="m12 4.2 9.3 4-9.3 4-9.3-4z" /><path d="M6.4 10.4v4.9c0 1.7 2.5 3 5.6 3s5.6-1.3 5.6-3v-4.9" /><path d="M21.3 8.2v5.6" /></>);
export const BriefcaseBusiness = make(<><path d="M3.6 7.9h16.8v11.4H3.6z" /><path d="M8.8 7.8V5.6a1.4 1.4 0 0 1 1.4-1.4h3.6a1.4 1.4 0 0 1 1.4 1.4v2.2" /><path d="M3.7 12.9c2.6 1.1 5.4 1.7 8.3 1.7s5.7-.6 8.3-1.7" /><path d="M12 13.9v1.8" /></>);
export const Building2 = make(<><path d="M4.3 20.1V4.6h8.2v15.5" /><path d="M12.6 20.1V9.8h7.1v10.3" /><path d="M7 8.1h2.5" /><path d="M7 12.1h2.5" /><path d="M7 16.1h2.5" /><path d="M15.3 13.1h1.9" /><path d="M15.3 16.5h1.9" /><path d="M3.2 20.2h17.6" /></>);
export const MapPin = make(<><path d="M12 21c4-4.2 6-7.6 6-10.3a6 6 0 0 0-12 0C6 13.4 8 16.8 12 21z" /><circle cx="12" cy="10.4" r="2.4" /></>);
export const MapPinned = make(<><path d="M12 14.6c2.7-3 4-5.4 4-7.3a4 4 0 1 0-8 0c0 1.9 1.3 4.3 4 7.3z" /><circle cx="12" cy="7.2" r="1.7" /><path d="m7.1 13.6-3.6 6.6h17l-3.6-6.6" /></>);
export const Flag = make(<><path d="M4.9 20.2V4.4" /><path d="M4.9 5.1c4.7-1.9 9.5 1.9 14.2 0v8.6c-4.7 1.9-9.5-1.9-14.2 0z" /></>);

/* ───────────────────────── search, sight and review ─────────────────────── */

export const Search = make(<><circle cx="10.8" cy="10.7" r="6.9" /><path d="m15.9 15.9 4.5 4.6" /></>);
export const SearchCheck = make(<><circle cx="10.8" cy="10.7" r="6.9" /><path d="m15.9 15.9 4.5 4.6" /><path d="m7.9 10.8 2.1 2.2 3.9-4.2" /></>);
export const ScanSearch = make(<><path d="M3.6 7.8V4.3h3.6" /><path d="M20.4 7.8V4.3h-3.6" /><path d="M3.6 16.2v3.5h3.6" /><path d="M20.4 16.2v3.5h-3.6" /><circle cx="11.6" cy="11.7" r="3.3" /><path d="m14.1 14.2 2.4 2.4" /></>);
export const ZoomIn = make(<><circle cx="10.8" cy="10.7" r="6.9" /><path d="m15.9 15.9 4.5 4.6" /><path d="M10.8 8.1v5.2" /><path d="M8.2 10.7h5.2" /></>);
export const Eye = make(<><path d="M1.9 12.1C4.4 7.9 8 5.8 12 5.8s7.6 2.1 10.1 6.3c-2.5 4.1-6.1 6.1-10.1 6.1s-7.6-2-10.1-6.1z" /><circle cx="12" cy="12" r="3.1" /></>);
export const EyeOff = make(<><path d="M9.4 6.2a9.6 9.6 0 0 1 2.6-.4c4 0 7.6 2.1 10.1 6.3a16 16 0 0 1-3.2 3.8" /><path d="M6 7.9a16.5 16.5 0 0 0-4.1 4.2c2.5 4.1 6.1 6.1 10.1 6.1 1.6 0 3.1-.3 4.5-1" /><path d="m3.4 3.4 17.2 17.2" /><path d="M9.9 9.9a3.1 3.1 0 0 0 4.2 4.3" /></>);
export const Lightbulb = make(<><path d="M9 17.1a6 6 0 1 1 6 0v1.4H9z" /><path d="M9.8 20.6h4.4" /><path d="M12 9.4v4.4" /></>);
export const Clock = make(<><circle cx="12" cy="12" r="8.6" /><path d="M12 6.9V12l3.4 2.1" /></>);
export const Clock3 = make(<><circle cx="12" cy="12" r="8.6" /><path d="M12 6.9V12h4.2" /></>);
export const CalendarDays = make(<><path d="M3.8 6.3h16.4v13.9H3.8z" /><path d="M7.9 3.8v4.6" /><path d="M16.1 3.8v4.6" /><path d="M3.9 11.2h16.2" /><path d="M8.1 14.7h.01" /><path d="M12 14.7h.01" /><path d="M15.9 14.7h.01" /><path d="M8.1 17.8h.01" /><path d="M12 17.8h.01" /></>);
export const History = make(<><path d="M3.6 5.4v5.1h5.1" /><path d="M4.2 10.4a8 8 0 1 1 1.1 6.8" /><path d="M12 7.6v4.6l3.2 1.9" /></>);
export const SlidersHorizontal = make(<><path d="M3.6 7.4h5.1" /><path d="M12.9 7.4h7.5" /><path d="M3.6 16.6h7.5" /><path d="M15.3 16.6h5.1" /><circle cx="10.8" cy="7.4" r="2.1" /><circle cx="13.2" cy="16.6" r="2.1" /></>);
export const ClipboardCheck = make(<><path d="M9 4.4H6.4v15.8h11.2V4.4H15" /><path d="M9 3.2h6v2.9H9z" /><path d="m9.1 12.4 2.1 2.2 3.8-4.1" /></>);
export const Wrench = make(<path d="M14.1 7.4a4.6 4.6 0 0 1 6.1-5.9l-3 3 .4 3.2 3.2.4 3-3a4.6 4.6 0 0 1-5.9 6.1L6.5 21.1a2.1 2.1 0 1 1-3-3z" />);
export const Settings = make(<><circle cx="12" cy="12" r="3.1" /><path d="M19.1 14.6a1.6 1.6 0 0 0 .3 1.8l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.2a1.9 1.9 0 1 1-3.8 0v-.1a1.6 1.6 0 0 0-2.8-1.1l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1.6 1.6 0 0 0-1.1-2.7h-.2a1.9 1.9 0 1 1 0-3.8h.1a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a1.9 1.9 0 1 1 2.7-2.7l.1.1a1.6 1.6 0 0 0 2.7-1.1v-.2a1.9 1.9 0 1 1 3.8 0v.1a1.6 1.6 0 0 0 2.8 1.1l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.2a1.9 1.9 0 1 1 0 3.8h-.1a1.6 1.6 0 0 0-1.5 1z" /></>);

/* ───────────────────────── security and access ──────────────────────────── */

export const ShieldCheck = make(<><path d="M12 20.8c4.4-1.8 7-5.1 7-9.3V5.6L12 3.2 5 5.6v5.9c0 4.2 2.6 7.5 7 9.3z" /><path d="m8.8 11.8 2.3 2.4 4.3-4.6" /></>);
export const Shield = make(<path d="M12 20.8c4.4-1.8 7-5.1 7-9.3V5.6L12 3.2 5 5.6v5.9c0 4.2 2.6 7.5 7 9.3z" />);
export const ShieldOff = make(<><path d="M19 11.5V5.6L12 3.2 8.4 4.4" /><path d="M5 7.1v4.4c0 4.2 2.6 7.5 7 9.3 1.8-.8 3.3-1.8 4.4-3.1" /><path d="m3.4 3.4 17.2 17.2" /></>);
export const KeyRound = make(<><circle cx="8.1" cy="8.2" r="4.6" /><path d="m11.4 11.5 9 9.1" /><path d="m17.8 17.9 2.1-2.2" /><path d="m15 15.1 2.1-2.1" /></>);
export const LockKeyhole = make(<><path d="M4.9 10.4h14.2v9.8H4.9z" /><path d="M8.2 10.3V7.6a3.8 3.8 0 0 1 7.6 0v2.7" /><circle cx="12" cy="14.3" r="1.5" /><path d="M12 15.8v1.9" /></>);
export const LogOut = make(<><path d="M9.6 20.2H4.7V3.8h4.9" /><path d="M14.9 16.4 19.4 12l-4.5-4.4" /><path d="M19.3 12H8.4" /></>);
export const Database = make(<><ellipse cx="12" cy="5.9" rx="7.6" ry="2.9" /><path d="M4.4 5.9v12.2c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9V5.9" /><path d="M4.4 12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9" /></>);

/* ───────────────────────── mail and messaging ───────────────────────────── */

export const Mail = make(<><path d="M3.6 5.6h16.8v12.8H3.6z" /><path d="m3.8 6.2 8.2 6.3 8.2-6.3" /></>);
export const MailPlus = make(<><path d="M20.4 11.6V5.6H3.6v12.8h9.3" /><path d="m3.8 6.2 8.2 6.3 8.2-6.3" /><path d="M17.6 14.2v5.4" /><path d="M14.9 16.9h5.4" /></>);
export const MailX = make(<><path d="M20.4 11.6V5.6H3.6v12.8h9.3" /><path d="m3.8 6.2 8.2 6.3 8.2-6.3" /><path d="m15.4 14.9 4.9 4.9" /><path d="m20.3 14.9-4.9 4.9" /></>);
export const Inbox = make(<><path d="M3.6 12.6h4.6l1.5 2.6h4.6l1.5-2.6h4.6" /><path d="M6.1 4.6h11.8l2.5 8v6.8H3.6v-6.8z" /></>);
export const Send = make(<><path d="M20.8 3.4 10.6 13.7" /><path d="m20.8 3.4-6.4 17.2-3.8-6.9-6.9-3.8z" /></>);
export const MessageCircle = make(<path d="M20.4 11.6a8 8 0 0 1-11.6 7.2l-5.2 1.4 1.4-5A8 8 0 1 1 20.4 11.6z" />);
export const MessageSquare = make(<path d="M20.4 15.6a2 2 0 0 1-2 2H7.6l-4 3.4V5.4a2 2 0 0 1 2-2h12.8a2 2 0 0 1 2 2z" />);
export const Share2 = make(<><circle cx="17.9" cy="5.6" r="2.7" /><circle cx="6.1" cy="12" r="2.7" /><circle cx="17.9" cy="18.4" r="2.7" /><path d="m8.5 10.7 7-3.8" /><path d="m8.5 13.3 7 3.8" /></>);
export const Copy = make(<><path d="M8.6 8.6h11.1v11.3H8.6z" /><path d="M15.4 8.5V4.1H4.3v11.3h4.3" /></>);
export const Download = make(<><path d="M12 3.6v11.2" /><path d="m7.4 10.4 4.6 4.5 4.6-4.5" /><path d="M4.3 19.9h15.4" /></>);
export const UploadCloud = make(<><path d="M6.8 18.3a4.6 4.6 0 0 1-.6-9.1 6.2 6.2 0 0 1 11.8 1.5 3.9 3.9 0 0 1-.6 7.6" /><path d="M12 11.9v8.3" /><path d="m9.2 14.5 2.8-2.7 2.8 2.7" /></>);
export const Save = make(<><path d="M4.4 4.4h12.3l3 3v12.2H4.4z" /><path d="M8 4.5v5h7v-5" /><path d="M7.4 13.1h9.2v6.4H7.4z" /></>);
export const Trash2 = make(<><path d="M3.9 6.3h16.2" /><path d="M8.6 6.2V4.1h6.8v2.1" /><path d="M6 6.4 7 20.1h10l1-13.7" /><path d="M10.3 10v6" /><path d="M13.7 10v6" /></>);
export const Edit3 = make(<><path d="M11.4 4.6H4.3v15.3h15.4v-7.2" /><path d="M17.8 3.3 20.8 6.3 12.2 15l-3.9.9.9-3.9z" /></>);
export const ExternalLink = make(<><path d="M12.6 4.4H4.5v15.2h15.1v-8.1" /><path d="M14.4 3.4h6.2v6.2" /><path d="m20.4 3.6-8.6 8.6" /></>);
export const Gamepad2 = make(<><path d="M7.2 8.2h9.6a4.8 4.8 0 0 1 4.6 6.1l-.7 2.5a2.4 2.4 0 0 1-4.1 1l-1.9-2H9.3l-1.9 2a2.4 2.4 0 0 1-4.1-1l-.7-2.5a4.8 4.8 0 0 1 4.6-6.1z" /><path d="M7.5 11.4v2.6" /><path d="M6.2 12.7h2.6" /><path d="M15.6 12.1h.01" /><path d="M17.9 14.1h.01" /></>);
export const BarChart3 = make(<><path d="M3.8 20.2V3.9" /><path d="M3.9 20.1h16.3" /><path d="M7.9 16.8v-6.3" /><path d="M12.3 16.8V6.7" /><path d="M16.7 16.8v-4.1" /></>);
export const Menu = make(<><path d="M3.8 6.6h16.4" /><path d="M3.8 12h16.4" /><path d="M3.8 17.4h16.4" /></>);
export const GripVertical = make(<><path d="M9.4 5.9h.01" /><path d="M9.4 9.9h.01" /><path d="M9.4 13.9h.01" /><path d="M9.4 17.9h.01" /><path d="M14.6 5.9h.01" /><path d="M14.6 9.9h.01" /><path d="M14.6 13.9h.01" /><path d="M14.6 17.9h.01" /></>);
export const Volume2 = make(<><path d="M10.9 4.6 6.2 8.7H2.9v6.6h3.3l4.7 4.1z" /><path d="M15.1 9a4.3 4.3 0 0 1 0 6" /><path d="M18 6.3a8.1 8.1 0 0 1 0 11.4" /></>);
export const VolumeX = make(<><path d="M10.9 4.6 6.2 8.7H2.9v6.6h3.3l4.7 4.1z" /><path d="m15.4 9.6 5.2 4.8" /><path d="m20.6 9.6-5.2 4.8" /></>);

/* ──────────────────────────── alias marks ───────────────────────────────── */

/**
 * The library this replaced had a sparkle. The Foundation does not: emphasis
 * here is a registration mark, the printer's symbol for things lining up.
 */
export const Sparkles = make(<><circle cx="12" cy="12" r="5.4" /><path d="M12 2.9v5" /><path d="M12 16.1v5" /><path d="M2.9 12h5" /><path d="M16.1 12h5" /></>);

export const Film = make(<><path d="M3.6 4.6h16.8v14.8H3.6z" /><path d="M8.1 4.7v14.6" /><path d="M15.9 4.7v14.6" /><path d="M3.7 12h16.6" /><path d="M3.7 8.3h4.3" /><path d="M3.7 15.7h4.3" /><path d="M16 8.3h4.3" /><path d="M16 15.7h4.3" /></>);

export const Plus2 = Plus;
