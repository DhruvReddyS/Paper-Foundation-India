import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { playableGames } from "./games";
import styles from "./PlayableEdition.module.css";

export default function PlayableEdition() {
  return (
    <section id="playable-edition" className={styles.section} aria-labelledby="playable-edition-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.kicker}>The playable edition</p>
          <h1 id="playable-edition-title">
            Learn with your<br /><em>hands on the idea.</em>
          </h1>
        </div>
        <div className={styles.introduction}>
          <p>
            Five short, replayable games built for curious people of every age. Every result can become a shareable proof of what you learned.
          </p>
          <Link href="/games">View the games hub <ArrowRight aria-hidden="true" /></Link>
        </div>
      </div>

      <div className={styles.gameGrid}>
        {playableGames.map((game, index) => {
          const Icon = game.icon;
          return (
            <Link href={game.href} className={`${styles.ticket} ${styles[`ticket${index + 1}`]}`} key={game.title}>
              <header>
                <span>Game {game.number}</span>
                <small>{game.format}</small>
              </header>
              <div className={styles.visual} aria-hidden="true">
                <Icon />
                <i />
                <i />
              </div>
              <div className={styles.body}>
                <h2>{game.title}</h2>
                <p>{game.note}</p>
              </div>
              <footer>
                <span>{game.interaction}</span>
                <b>Play <ArrowRight aria-hidden="true" /></b>
              </footer>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
