import Link from "next/link";

/**
 * The 404 page, shared by the root handler and the site-group handler.
 *
 * It is framed as a misfiled sheet rather than an error screen: the reader
 * came looking for something, so the page spends its space on where that
 * something probably is.
 */
export default function MisfiledSheet({ standalone = false }: { standalone?: boolean }) {
  const destinations = [
    { href: "/knowledge", label: "Knowledge Studio", note: "Long-form articles, each with its sources listed" },
    { href: "/myths", label: "Myths vs Facts", note: "Sixty claims stamped against the evidence" },
    { href: "/discover", label: "The Game Lab", note: "Five short experiments in fibre and evidence" },
    { href: "/everyday-paper", label: "Everyday Paper", note: "Nine familiar objects, examined" },
    { href: "/india-map", label: "India Fibre Atlas", note: "Mills, demand and recovery by state" },
    { href: "/contact", label: "Contact the desk", note: "Tell us what you expected to find here" },
  ];

  return (
    <main className={`misfiled ${standalone ? "misfiled-standalone" : ""}`}>
      <div className="misfiled-shell">
        <header className="misfiled-head">
          <p className="misfiled-stamp">FILE NOT FOUND / 404</p>
          <h1>
            This sheet was
            <em>misfiled.</em>
          </h1>
          <p className="misfiled-deck">
            The address you followed does not match anything in the archive. It may have been
            renamed, or the link may have been copied incompletely.
          </p>
        </header>

        <nav className="misfiled-index" aria-label="Where to go instead">
          <p className="misfiled-index-label">The archive, from the top</p>
          <ul>
            {destinations.map((item, index) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <strong>{item.label}</strong>
                  <small>{item.note}</small>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <footer className="misfiled-foot">
          <Link href="/" className="misfiled-home">Return to the front page</Link>
          <span>PAPER FOUNDATION INDIA</span>
        </footer>
      </div>
    </main>
  );
}
