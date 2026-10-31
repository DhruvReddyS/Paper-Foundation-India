/**
 * Emits schema.org JSON-LD for a page.
 *
 * The payload is serialised server-side and the closing-tag sequence is
 * escaped, so editorial text containing markup cannot break out of the script
 * element. This is a server component on purpose: structured data must be in
 * the initial HTML for a crawler to see it.
 */
export default function StructuredData({ schema }: { schema: Record<string, unknown> | Record<string, unknown>[] }) {
  const payload = JSON.stringify(Array.isArray(schema) && schema.length === 1 ? schema[0] : schema).replace(
    /</g,
    "\\u003c"
  );

  return (
    <script
      type="application/ld+json"
      // The content is generated from our own data and fully escaped above.
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}
