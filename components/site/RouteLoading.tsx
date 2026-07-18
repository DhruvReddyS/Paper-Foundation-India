export default function RouteLoading() {
  return (
    <div className="route-loading-screen" role="status" aria-live="polite">
      <div className="route-loading-sheet">
        <header>
          <span>PREPARING THE PAGE</span>
          <small>Preparing the next page</small>
        </header>
        <div className="route-loading-signature" aria-hidden="true">
          <span>P</span>
          <i />
          <i />
          <i />
        </div>
        <div className="route-loading-copy">
          <strong>Paper Foundation India</strong>
          <p>Gathering the text, images and evidence.</p>
        </div>
        <div className="route-loading-lines" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
        <footer>
          <span>READ</span><i /><span>UNDERSTAND</span><i /><span>SHARE CONTEXT</span>
        </footer>
      </div>
      <span className="sr-only">Loading page</span>
    </div>
  );
}
