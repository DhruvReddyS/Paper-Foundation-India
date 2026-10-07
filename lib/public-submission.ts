export type PublicSubmissionSignals = { _website?: unknown; formStartedAt?: unknown };

export function publicSubmissionIsSpam(payload: PublicSubmissionSignals, now = Date.now()) {
  if (typeof payload._website === "string" && payload._website.trim()) return true;
  const started = Number(payload.formStartedAt);
  return Number.isFinite(started) && started > 0 && now - started < 1_200;
}
