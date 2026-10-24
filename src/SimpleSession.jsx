import { useEffect, useRef, useState } from "react";
import {
  simpleSlides,
  simpleTimings,
  businessCase,
  feedbackMessages,
  feedbackAnalysis,
  improvementCosts,
} from "./simpleSession.js";
import "./simple.css";

export default function SimpleSession({ onFull }) {
  const [index, setIndex] = useState(0);
  const [minutes, setMinutes] = useState(7);
  const [notes, setNotes] = useState(true);
  const [presenting, setPresenting] = useState(false);
  const stage = useRef(null);
  const slide = simpleSlides[index];
  const seconds = simpleTimings[minutes][index];
  const lastIndex = simpleSlides.length - 1;
  const amount = (value) =>
    value >= 100000
      ? `₹${Number((value / 100000).toFixed(2))} lakh`
      : new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 0,
        }).format(value);
  useEffect(() => {
    stage.current?.scrollTo({ top: 0 });
    stage.current?.focus({ preventScroll: true });
  }, [index]);
  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") {
        setPresenting(false);
        return;
      }
      if (
        event.target.closest("input, select, textarea, button, a") ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      )
        return;
      if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        setIndex((value) => Math.min(simpleSlides.length - 1, value + 1));
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((value) => Math.max(0, value - 1));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const comparison = (reveal, after = false) => (
    <div className="simple-businesses">
      {Object.values(businessCase).map((business) => (
        <article key={business.letter}>
          <span className="simple-business-letter">{business.letter}</span>
          <h2>{business.name}</h2>
          <p>Fictional coffee subscription business</p>
          <dl>
            <div>
              <dt>Monthly sales</dt>
              <dd>{amount(business.sales)}</dd>
            </div>
            {reveal && (
              <>
                <div>
                  <dt>Direct costs</dt>
                  <dd>
                    {amount(after ? business.afterCosts : business.beforeCosts)}
                  </dd>
                </div>
                <div className="simple-profit">
                  <dt>Gross profit</dt>
                  <dd>
                    {amount(
                      after ? business.afterProfit : business.beforeProfit,
                    )}
                  </dd>
                </div>
                {after && (
                  <div>
                    <dt>Gross margin</dt>
                    <dd className="simple-small-metric">
                      {Math.round(
                        (business.afterProfit / business.sales) * 100,
                      )}
                      %
                    </dd>
                  </div>
                )}
              </>
            )}
          </dl>
        </article>
      ))}
    </div>
  );
  return (
    <div className={`simple-app ${presenting ? "simple-presenting" : ""}`}>
      <header className="simple-header">
        <span className="simple-logo">
          Millenia <span>Events</span>
        </span>
        {!presenting && (
          <label className="simple-duration">
            Talk length
            <select
              aria-label="Talk length"
              value={minutes}
              onChange={(event) => setMinutes(Number(event.target.value))}
            >
              <option value={5}>5 minutes</option>
              <option value={7}>7 minutes</option>
              <option value={10}>10 minutes</option>
            </select>
          </label>
        )}
        <button
          className="primary-button"
          onClick={() => setPresenting((value) => !value)}
        >
          {presenting ? "Exit presentation" : "Present to audience"}
        </button>
      </header>
      <main className="simple-scroll" ref={stage} tabIndex={-1}>
        {!presenting && (
          <div className="simple-start-hint">
            Choose a business. Analyse feedback. See the assumed improvement.
            Choose again.
          </div>
        )}
        <section
          className={`simple-slide simple-kind-${slide.kind}`}
          aria-label={`Slide ${index + 1}: ${slide.title}`}
        >
          <div className="eyebrow">{slide.label}</div>
          <h1>{slide.title}</h1>
          {slide.kind === "cover" && (
            <div className="simple-photo-cover">
              <div>
                <p className="simple-cover-line">
                  Customer feedback, a business change,
                  <br />
                  and a better informed decision.
                </p>
                <div className="simple-presenter">
                  Manoj<span>Data Analyst & AI Engineer</span>
                </div>
                <p className="simple-audience-line">
                  Fictional case study with a show of hands at each decision
                </p>
              </div>
              <figure className="simple-cover-photo">
                <img
                  src="/images/event-opening.webp"
                  alt="Guests together at a past Millennia Events networking event"
                  width="854"
                  height="1600"
                />
                <figcaption>From the organiser’s past event</figcaption>
              </figure>
            </div>
          )}
          {slide.kind === "lesson" && (
            <div className="simple-statements">
              {slide.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          )}
          {slide.kind === "choice" && (
            <>
              {comparison(false)}
              <div className="simple-audience-prompt">
                Raise your hand for A, B, or “I need more information”.
              </div>
              <p className="simple-disclosure">
                Fictional example. Monthly figures for the same period.
              </p>
            </>
          )}
          {slide.kind === "question" && (
            <>
              <p className="simple-question">{slide.lines[0]}</p>
              <p className="simple-pause">Take five seconds to think.</p>
            </>
          )}
          {slide.kind === "reveal" && (
            <>
              {comparison(true)}
              <p className="simple-audience-prompt">
                Would you change your choice now?
              </p>
              <p className="simple-disclosure">
                Gross profit = sales − direct costs, before other expenses.
                DailyCup has more gross profit in this example. Further
                information is needed for an investment decision.
              </p>
            </>
          )}
          {slide.kind === "feedback" && (
            <>
              <div className="simple-feedback-grid">
                {feedbackMessages.map((message) => (
                  <article key={message.id}>
                    <span>MESSAGE {String(message.id).padStart(2, "0")}</span>
                    <p>“{message.text}”</p>
                  </article>
                ))}
              </div>
              <p className="simple-audience-prompt">
                Which issue appears most often: delivery, packaging or billing?
              </p>
              <p className="simple-disclosure">
                Eight selected fictional complaints. Cite a message to support
                your answer.
              </p>
            </>
          )}
          {slide.kind === "analysis" && (
            <>
              <div className="simple-analysis">
                {feedbackAnalysis.map((item) => (
                  <div key={item.theme}>
                    <div>
                      <b>{item.theme}</b>
                      <span>
                        {item.count} of {feedbackMessages.length} messages
                      </span>
                    </div>
                    <div className="simple-analysis-track">
                      <span
                        style={{
                          width: `${(item.count / feedbackMessages.length) * 100}%`,
                        }}
                      />
                    </div>
                    <p>
                      Message IDs:{" "}
                      {item.ids
                        .map((id) => String(id).padStart(2, "0"))
                        .join(", ")}
                    </p>
                  </div>
                ))}
              </div>
              <p className="simple-audience-prompt">
                Next: check delivery records and the costs of replacements.
              </p>
              <p className="simple-disclosure">
                Prepared answer key. The most frequent complaint gives a clue to
                investigate. It does not establish the root cause or the
                experience of all customers.
              </p>
            </>
          )}
          {["process", "ai"].includes(slide.kind) && (
            <div className="simple-method">
              {slide.lines.map(([title, text], number) => (
                <div key={title}>
                  <span>{String(number + 1).padStart(2, "0")}</span>
                  <div>
                    <h2>{title}</h2>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {slide.kind === "change" && (
            <div className="simple-change-layout">
              <div className="simple-method">
                {slide.lines.map(([title, text], number) => (
                  <div key={title}>
                    <span>{String(number + 1).padStart(2, "0")}</span>
                    <div>
                      <h2>{title}</h2>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <figure className="simple-change-photo">
                <img
                  src="/images/coffee-packaging.webp"
                  alt="Illustrative coffee pouches in a sturdy shipping box with protective paper packaging"
                  width="1000"
                  height="667"
                  loading="lazy"
                />
                <figcaption>
                  Illustrative packaging for the fictional case · AI-generated
                </figcaption>
              </figure>
            </div>
          )}
          {slide.kind === "change" && (
            <p className="simple-disclosure">
              For this fictional scenario, assume the records confirm that
              delivery and packaging failures create extra fulfilment costs.
            </p>
          )}
          {slide.kind === "impact" && (
            <>
              <p className="simple-impact-sales">
                BrewBox monthly sales stay at{" "}
                <b>{amount(businessCase.a.sales)}</b>
              </p>
              <table className="simple-impact-table">
                <thead>
                  <tr>
                    <th>Monthly figures</th>
                    <th>Before</th>
                    <th>After</th>
                  </tr>
                </thead>
                <tbody>
                  {improvementCosts.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td>{amount(row.before)}</td>
                      <td>{amount(row.after)}</td>
                    </tr>
                  ))}
                  <tr className="simple-total-cost">
                    <th scope="row">Total direct costs</th>
                    <td>{amount(businessCase.a.beforeCosts)}</td>
                    <td>{amount(businessCase.a.afterCosts)}</td>
                  </tr>
                  <tr className="simple-gp-row">
                    <th scope="row">Gross profit</th>
                    <td>{amount(businessCase.a.beforeProfit)}</td>
                    <td>{amount(businessCase.a.afterProfit)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="simple-profit-bridge">
                <b>
                  {amount(
                    businessCase.a.afterProfit - businessCase.a.beforeProfit,
                  )}{" "}
                  more gross profit
                </b>
                <span>
                  ₹2.7 lakh less replacement cost, minus ₹20,000 extra delivery
                  and packaging cost
                </span>
              </div>
              <p className="simple-disclosure">
                Fictional assumed outcome, not measured results or a promise.
                Gross profit is before other expenses. A real business must
                verify the costs and compare like-for-like periods.
              </p>
            </>
          )}
          {slide.kind === "rechoice" && (
            <>
              {comparison(true, true)}
              <p className="simple-audience-prompt">
                A, B, or “I need more information”? Which evidence changed your
                view?
              </p>
              <p className="simple-disclosure">
                BrewBox figures use the fictional improvement scenario. DailyCup
                stays unchanged for comparison. Gross profit alone does not
                establish the better investment.
              </p>
            </>
          )}
          {slide.kind === "close" && (
            <>
              <div className="simple-statements">
                {slide.lines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              <div className="simple-presenter">
                Manoj<span>Data Analyst & AI Engineer</span>
              </div>
              <p className="simple-audience-line">
                Let’s discuss your business question after the session.
              </p>
            </>
          )}
          {slide.kind === "connection" && (
            <>
              <div className="simple-connection-layout">
                <div className="simple-connection-roles">
                  {slide.lines.map(([title, text]) => (
                    <div key={title}>
                      <h2>{title}</h2>
                      <p>{text}</p>
                    </div>
                  ))}
                  <p className="simple-connection-method">
                    Curated introductions and founder conversations help the
                    right people start a discussion.
                  </p>
                </div>
                <figure className="simple-connection-photo">
                  <img
                    src="/images/event-conversations.webp"
                    alt="Guests in conversation at a past Millennia Events meetup"
                    width="1600"
                    height="1408"
                    loading="lazy"
                  />
                  <figcaption>
                    Conversations at the organiser’s past event
                  </figcaption>
                </figure>
              </div>
              <p className="simple-connection-call">
                Introduce yourself. Share your progress. Start a useful
                conversation.
              </p>
              <a
                className="simple-event-source"
                href="https://millenniaevents.in/"
                target="_blank"
                rel="noreferrer"
              >
                millenniaevents.in
              </a>
            </>
          )}
        </section>
        {!presenting && (
          <section className="simple-host-notes">
            <button
              className="simple-notes-toggle"
              aria-expanded={notes}
              onClick={() => setNotes((value) => !value)}
            >
              {notes ? "Hide my speaking script" : "Show my speaking script"}
              <span>
                About{" "}
                {seconds < 60
                  ? `${seconds} seconds`
                  : `${Math.floor(seconds / 60)} min${seconds % 60 ? ` ${seconds % 60}s` : ""}`}{" "}
                on this slide
              </span>
            </button>
            {notes && (
              <div className="simple-notes-body">
                <div>
                  <h2>You say</h2>
                  <p>“{slide.say}”</p>
                </div>
                <div className="simple-do">
                  <h2>What you do</h2>
                  <p>{slide.action}</p>
                  <p className="simple-cue">{slide.cue}</p>
                </div>
              </div>
            )}
          </section>
        )}
        {!presenting && (
          <div className="simple-resources">
            <a
              href="/simple-speaking-guide.html"
              target="_blank"
              rel="noreferrer"
            >
              Print the step-by-step speaking guide
            </a>
            <button onClick={onFull}>
              Open the original three-activity workshop
            </button>
          </div>
        )}
      </main>
      <footer className="simple-controls">
        <button
          className="secondary-button"
          disabled={!index}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
        >
          Back
        </button>
        <div>
          <b>
            {index + 1} <span>/ {simpleSlides.length}</span>
          </b>
          <span className="simple-total">{minutes}-minute talk</span>
        </div>
        {index < lastIndex ? (
          <button
            className="primary-button"
            onClick={() => setIndex((value) => value + 1)}
          >
            Next <span aria-hidden="true">→</span>
          </button>
        ) : (
          <button
            className="primary-button"
            onClick={() => {
              setIndex(0);
              setPresenting(false);
            }}
          >
            Start again
          </button>
        )}
      </footer>
    </div>
  );
}
