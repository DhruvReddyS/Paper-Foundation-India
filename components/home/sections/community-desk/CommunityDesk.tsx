"use client";

import { ArrowRight, Building2, Flag, Mail, Users } from "lucide-react";
import Link from "next/link";
import styles from "./CommunityDesk.module.css";

const doors = [
  { href: "/about", note: "Understand the organisation", label: "About the Foundation", icon: Building2 },
  { href: "/join", note: "Membership application", label: "Join the Foundation", icon: Users },
  { href: "/contact", note: "Questions and partnerships", label: "Contact us", icon: Mail },
  { href: "/report", note: "Submit a claim for review", label: "Report misinformation", icon: Flag },
] as const;

export default function CommunityDesk() {
  return (
    <section className={styles.section} aria-labelledby="community-title">
      <div className={styles.join} data-reveal="left">
        <div className={styles.treeSeal}><Users /><i /><i /></div>
        <p>Join the initiative</p>
        <h2 id="community-title">Help write paper&apos;s <em>next chapter.</em></h2>
        <span>Membership has no fee or financial commitment. It is a promise to support responsible use, challenge greenwashing and promote evidence-led understanding.</span>
        <Link href="/join">Open the membership application <ArrowRight /></Link>
        <div className={styles.letter}><small>Paper Foundation India · Open invitation</small><p>Love paper. Use paper responsibly. Ask better questions.</p><i /></div>
      </div>
      <div className={`${styles.contact} foundation-directory`} data-reveal="right">
        <header><div><Mail /><span>Foundation directory</span></div><small>Choose a desk</small></header>
        <div className="foundation-directory-intro">
          <p>One foundation.<br /><em>Four clear doors.</em></p>
          <span>Applications, questions, evidence reports and information about our mission each have their own dedicated page.</span>
        </div>
        <nav aria-label="Foundation pages">
          {doors.map(({ href, note, label, icon: Icon }) => (
            <Link href={href} key={href}><Icon /><span><small>{note}</small><strong>{label}</strong></span><ArrowRight /></Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
