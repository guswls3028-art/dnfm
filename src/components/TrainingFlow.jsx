import Link from "next/link";

function isExternal(href) {
  return Boolean(href) && /^https?:\/\//i.test(href);
}

function Action({ action, primary }) {
  if (!action?.href) return null;
  const className = primary ? "btn btn--primary btn--sm" : "btn btn--secondary btn--sm";

  if (isExternal(action.href)) {
    return (
      <a className={className} href={action.href} target="_blank" rel="noreferrer">
        {action.label} →
      </a>
    );
  }

  return (
    <Link className={className} href={action.href}>
      {action.label} →
    </Link>
  );
}

export default function TrainingFlow({ steps }) {
  return (
    <section className="section section--entry-flow" id="training-flow" aria-labelledby="training-flow-title">
      <div className="content-wrap">
        <header className="section__head">
          <div>
            <span className="section__kicker">START ROUTE</span>
            <h2 id="training-flow-title" className="section__title">
              입소 동선
            </h2>
          </div>
          <Link className="section__more" href="/guide">
            전체 가이드 →
          </Link>
        </header>

        <ol className="entry-flow" aria-label="뉴비 훈련소 시작 순서">
          {steps.map((step) => (
            <li className="entry-flow__card" data-tone={step.tone} key={step.step}>
              <span className="entry-flow__num">{step.step}</span>
              <div className="entry-flow__copy">
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </div>
              <div className="entry-flow__actions">
                <Action action={step.primary} primary />
                <Action action={step.secondary} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
