import { useEffect, useRef, useState } from "react";
import SimpleSession from "./SimpleSession.jsx";
import ArrowDown from "lucide-react/dist/esm/icons/arrow-down.js";
import ArrowRight from "lucide-react/dist/esm/icons/arrow-right.js";
import ArrowUpRight from "lucide-react/dist/esm/icons/arrow-up-right.js";
import BarChart3 from "lucide-react/dist/esm/icons/chart-no-axes-column-increasing.js";
import BookOpen from "lucide-react/dist/esm/icons/book-open.js";
import Check from "lucide-react/dist/esm/icons/check.js";
import CheckCircle2 from "lucide-react/dist/esm/icons/circle-check.js";
import ChevronLeft from "lucide-react/dist/esm/icons/chevron-left.js";
import ChevronRight from "lucide-react/dist/esm/icons/chevron-right.js";
import Clock3 from "lucide-react/dist/esm/icons/clock-3.js";
import Coffee from "lucide-react/dist/esm/icons/coffee.js";
import Download from "lucide-react/dist/esm/icons/download.js";
import FileText from "lucide-react/dist/esm/icons/file-text.js";
import FlaskConical from "lucide-react/dist/esm/icons/flask-conical.js";
import Keyboard from "lucide-react/dist/esm/icons/keyboard.js";
import Lightbulb from "lucide-react/dist/esm/icons/lightbulb.js";
import Maximize2 from "lucide-react/dist/esm/icons/maximize-2.js";
import Menu from "lucide-react/dist/esm/icons/menu.js";
import MessageSquareText from "lucide-react/dist/esm/icons/message-square-text.js";
import Minimize2 from "lucide-react/dist/esm/icons/minimize-2.js";
import Minus from "lucide-react/dist/esm/icons/minus.js";
import Pause from "lucide-react/dist/esm/icons/pause.js";
import Play from "lucide-react/dist/esm/icons/play.js";
import Plus from "lucide-react/dist/esm/icons/plus.js";
import Presentation from "lucide-react/dist/esm/icons/presentation.js";
import RotateCcw from "lucide-react/dist/esm/icons/rotate-ccw.js";
import Settings2 from "lucide-react/dist/esm/icons/settings-2.js";
import Users from "lucide-react/dist/esm/icons/users.js";
import X from "lucide-react/dist/esm/icons/x.js";
import {
  SESSION_KEY,
  fullRoute,
  shortRoute,
  shortTimes,
  slides,
  reviews,
  opportunities,
  newSession,
  sanitizeSession,
  calculateSavings,
  getPlan,
  validateClinic,
  answers,
} from "./session.js";

const formatTime = (seconds) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
const decimal = (value) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(value);
const samplePrompt = `Group these customer messages into complaint themes. For each theme, report the message IDs and count. Keep every claim traceable to the original text. Flag ambiguity and distinguish frequency from severity. Do not infer causes, customer churn or population percentages from this selected sample. A person will check the classifications.\n\n${reviews.map((review) => `${review.id}. ${review.text}`).join("\n")}`;

function readSession() {
  try {
    return sanitizeSession(JSON.parse(localStorage.getItem(SESSION_KEY)));
  } catch {
    return newSession();
  }
}

function downloadFile(name, contents, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function useCountdown(seconds, resetKey) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);
  useEffect(() => {
    setRemaining(seconds);
    setRunning(false);
  }, [seconds, resetKey]);
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const value = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setRemaining(value);
      if (!value) setRunning(false);
    };
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [running]);
  const toggle = () => {
    if (running) setRunning(false);
    else {
      const start = remaining || seconds;
      setRemaining(start);
      deadline.current = Date.now() + start * 1000;
      setRunning(true);
    }
  };
  return {
    remaining,
    running,
    toggle,
    reset: () => {
      setRemaining(seconds);
      setRunning(false);
    },
  };
}

function Modal({ title, children, close, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const el = ref.current;
    el.querySelector("button, a, input, select, textarea")?.focus();
    const keydown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
      if (event.key !== "Tab") return;
      const focusable = [
        ...el.querySelectorAll(
          'button, a[href], input, select, textarea, [tabindex="0"]',
        ),
      ].filter((item) => !item.disabled && item.offsetParent !== null);
      const first = focusable[0],
        last = focusable.at(-1);
      if (!first) {
        event.preventDefault();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        last.focus();
        event.preventDefault();
      }
      if (!event.shiftKey && document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <section
        ref={ref}
        className={`modal ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="modal-header">
          <h2>{title}</h2>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </header>
        <div className="modal-content">{children}</div>
      </section>
    </div>
  );
}

function Eyebrow({ children }) {
  return <div className="eyebrow">{children}</div>;
}
function SlideTitle({ eyebrow, title, children }) {
  return (
    <div className="slide-heading">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      {children && <p className="slide-lead">{children}</p>}
    </div>
  );
}
function Notice({ children }) {
  return (
    <div className="notice">
      <span className="notice-dot" />
      {children}
    </div>
  );
}

function VoteTally({ round, state, setState, printable }) {
  const votes = state.votes[round];
  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  const update = (key, delta) =>
    setState((current) => ({
      ...current,
      votes: current.votes.map((item, index) =>
        index === round
          ? { ...item, [key]: Math.min(9999, Math.max(0, item[key] + delta)) }
          : item,
      ),
    }));
  const setCount = (key, value) =>
    setState((current) => ({
      ...current,
      votes: current.votes.map((item, index) =>
        index === round
          ? {
              ...item,
              [key]: Math.min(
                9999,
                Math.max(0, Math.floor(Number(value) || 0)),
              ),
            }
          : item,
      ),
    }));
  return (
    <div className="vote-tally">
      <div className="tally-heading">
        <span>
          ROUND {round + 1} <span className="muted">/ show of hands</span>
        </span>
        <span>{total} counted</span>
      </div>
      <div className="tally-options">
        {[
          ["a", "A · BrewBox"],
          ["b", "B · DailyCup"],
          ["unsure", "Need more info"],
        ].map(([key, label]) => (
          <div className="tally-item" key={key}>
            <span>{label}</span>
            <div className="counter">
              {!printable && (
                <button
                  aria-label={`Remove vote for ${label} round ${round + 1}`}
                  disabled={!votes[key]}
                  onClick={() => update(key, -1)}
                >
                  <Minus size={13} />
                </button>
              )}
              {printable ? (
                <output>{votes[key]}</output>
              ) : (
                <input
                  aria-label={`${label} round ${round + 1} votes`}
                  type="number"
                  min="0"
                  max="9999"
                  step="1"
                  value={votes[key]}
                  onChange={(event) => setCount(key, event.target.value)}
                />
              )}
              {!printable && (
                <button
                  aria-label={`Add vote for ${label} round ${round + 1}`}
                  onClick={() => update(key, 1)}
                >
                  <Plus size={13} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="micro">
        The host counts raised hands. Votes stay on this device.
      </p>
    </div>
  );
}

function Comparison({ reveal = false }) {
  return (
    <div className={`business-comparison ${reveal ? "revealed" : ""}`}>
      {[
        {
          letter: "A",
          name: "BrewBox",
          caption: "Coffee subscriptions",
          revenue: "₹10 lakh",
          growth: "20%",
          cost: "₹9.5 lakh",
          profit: "₹50,000",
          margin: "5%",
          width: 5,
        },
        {
          letter: "B",
          name: "DailyCup",
          caption: "Coffee subscriptions",
          revenue: "₹6 lakh",
          growth: "8%",
          cost: "₹3.6 lakh",
          profit: "₹2.4 lakh",
          margin: "40%",
          width: 40,
        },
      ].map((business) => (
        <article
          className={`business business-${business.letter.toLowerCase()}`}
          key={business.letter}
        >
          <div className="business-name">
            <span className="letter">{business.letter}</span>
            <div>
              <h2>{business.name}</h2>
              <p>{business.caption}</p>
            </div>
            <Coffee size={24} strokeWidth={1.3} />
          </div>
          <div className="business-metrics">
            <div>
              <span>Monthly revenue</span>
              <strong>{business.revenue}</strong>
            </div>
            <div>
              <span>Monthly growth</span>
              <strong>
                {business.growth}
                <ArrowUpRight size={21} />
              </strong>
            </div>
          </div>
          {reveal && (
            <div className="reveal-data">
              <div className="cost-row">
                <span>Direct costs</span>
                <b>{business.cost}</b>
              </div>
              <div className="profit-row">
                <span>Gross profit</span>
                <strong>{business.profit}</strong>
              </div>
              <div className="margin-label">
                <span>Gross margin</span>
                <b>{business.margin}</b>
              </div>
              <div className="margin-track">
                <div style={{ width: `${business.width}%` }} />
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function ClinicForm({ clinic, update, errors }) {
  const plan = getPlan(clinic),
    result = calculateSavings(clinic);
  const field = (key, label, placeholder) => (
    <label key={key}>
      {label}
      <textarea
        value={clinic[key]}
        onChange={(event) => update(key, event.target.value)}
        placeholder={placeholder}
        maxLength={1000}
        rows={2}
      />
    </label>
  );
  return (
    <div className="clinic-layout">
      <div className="clinic-fields">
        <label className="select-label">
          The business task
          <select
            value={clinic.type}
            onChange={(event) => update("type", event.target.value)}
          >
            {Object.entries(opportunities).map(([key, value]) => (
              <option value={key} key={key}>
                {value.label}
              </option>
            ))}
            <option value="custom">Your own task</option>
          </select>
        </label>
        {clinic.type === "custom" ? (
          <div className="custom-fields">
            {field(
              "task",
              "1. The problem",
              "Which repetitive task needs improvement?",
            )}
            {field(
              "source",
              "2. Source information",
              "Which reliable information is available?",
            )}
            {field(
              "workflow",
              "3. Proposed workflow",
              "What could rules or AI help produce?",
            )}
            {field(
              "human",
              "4. Human review",
              "Who checks the result before it is used?",
            )}
            {field(
              "metric",
              "5. Success measure",
              "How will you measure time and quality?",
            )}
          </div>
        ) : (
          <dl className="plan-preview">
            <div>
              <dt>The problem</dt>
              <dd>{plan.problem}</dd>
            </div>
            <div>
              <dt>Source information</dt>
              <dd>{plan.source}</dd>
            </div>
            <div>
              <dt>Proposed workflow</dt>
              <dd>{plan.workflow}</dd>
            </div>
            <div>
              <dt>Human review</dt>
              <dd>{plan.human}</dd>
            </div>
            <div>
              <dt>Quality & time measure</dt>
              <dd>{plan.metric}</dd>
            </div>
          </dl>
        )}
      </div>
      <div className="calculator">
        <div className="calculator-title">
          <Clock3 size={18} />
          <h2>What could it save?</h2>
        </div>
        <p>Editable monthly assumptions</p>
        <div className="number-fields">
          {[
            ["volume", "Tasks per month", "tasks", 1],
            ["before", "Current time per task", "min", 0.5],
            ["after", "Pilot time, including review", "min", 0.5],
            ["rate", "Value of staff time", "₹ / hour", 10],
            ["cost", "Monthly tool cost", "₹", 100],
          ].map(([key, label, unit, step]) => (
            <label key={key}>
              <span>{label}</span>
              <div className="unit-input">
                <input
                  type="number"
                  min="0"
                  max={key === "volume" ? 10000000 : 1000000}
                  step={step}
                  value={clinic[key]}
                  onChange={(event) => update(key, event.target.value)}
                />
                <span>{unit}</span>
              </div>
            </label>
          ))}
        </div>
        {result ? (
          <div className="calculator-result">
            <span>
              {result.hours >= 0
                ? "Time released / month"
                : "Extra time required / month"}
            </span>
            <strong>
              {decimal(Math.abs(result.hours))} <small>hours</small>
            </strong>
            <div>
              <span>Capacity value</span>
              <b>{money(result.capacityValue)}</b>
            </div>
            <div>
              <span>Less tool cost</span>
              <b>{money(Number(clinic.cost))}</b>
            </div>
            <div className="net-value">
              <span>Net capacity value</span>
              <b className={result.net < 0 ? "negative" : ""}>
                {money(result.net)}
              </b>
            </div>
          </div>
        ) : (
          <p className="error">
            Enter valid non-negative numbers. Tasks must be a whole number.
          </p>
        )}
        <p className="micro">
          Estimate only. Capacity value may not become cash savings. Setup
          effort is additional.
        </p>
      </div>
      {!!errors.length && (
        <div className="form-errors" role="alert">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function PlanSummary({ state }) {
  const plan = getPlan(state.clinic),
    result = calculateSavings(state.clinic);
  const errors = validateClinic(state.clinic);
  if (errors.length)
    return (
      <div className="empty-plan">
        <FileText size={40} />
        <h2>Your worksheet needs a little more detail</h2>
        {errors.map((error) => (
          <p key={error}>{error}</p>
        ))}
        <p>Go back to “Build the experiment” to complete it.</p>
      </div>
    );
  return (
    <>
      <div className="pilot-heading">
        <span className="small-tag">SUGGESTED 7-DAY PILOT</span>
        <h2>{plan.label}</h2>
        <p>{plan.problem}</p>
      </div>
      <div className="pilot-details">
        <div>
          <span>01 / Information</span>
          <p>{plan.source}</p>
        </div>
        <div>
          <span>02 / Workflow</span>
          <p>{plan.workflow}</p>
        </div>
        <div>
          <span>03 / Human check</span>
          <p>{plan.human}</p>
        </div>
        <div>
          <span>04 / Measure</span>
          <p>{plan.metric}</p>
        </div>
      </div>
      <div className="pilot-metrics">
        <div>
          <span>Monthly tasks</span>
          <strong>{decimal(Number(state.clinic.volume))}</strong>
        </div>
        <div>
          <span>
            {result.hours >= 0
              ? "Hours released / month"
              : "Extra hours / month"}
          </span>
          <strong>{decimal(Math.abs(result.hours))}</strong>
        </div>
        <div>
          <span>Net capacity value / month</span>
          <strong className={result.net < 0 ? "negative" : ""}>
            {money(result.net)}
          </strong>
        </div>
      </div>
      <div className="guardrail">
        <CheckCircle2 size={18} />
        <div>
          <b>The quality check</b>
          <p>
            {plan.guardrail} {plan.control}
          </p>
        </div>
      </div>
      <p className="micro">
        Agree an owner and a stop condition. Compare actual results with a
        baseline. All estimates use your worksheet assumptions.
      </p>
    </>
  );
}

function Slide({
  id,
  state,
  setState,
  go,
  errors = [],
  printable = false,
  notify = () => {},
}) {
  const updateClinic = (key, value) =>
    setState((current) => ({
      ...current,
      clinic: { ...current.clinic, [key]: value },
    }));
  const questionDetails = {
    retention: [
      "Do customers return?",
      "Compare repeat purchasing for the same customer cohort over a defined period. Separate new customer growth from repeat demand.",
      "Useful evidence: a cohort table with a clear definition of “returning”.",
    ],
    cash: [
      "How much cash does growth need?",
      "Look at cash available, monthly cash outflow and the timing of customer payments and supplier bills.",
      "Useful evidence: a cash flow forecast and working capital assumptions.",
    ],
    acquisition: [
      "What does a new customer cost?",
      "Check the costs included in acquisition and compare them with the gross profit earned over a customer’s relationship.",
      "Useful evidence: acquisition cost by channel and observed customer behaviour.",
    ],
  };
  switch (id) {
    case 0:
      return (
        <div className="cover-layout">
          <div className="cover-copy">
            <Eyebrow>MILLENIA EVENTS / BUSINESS DECISIONS</Eyebrow>
            <h1>
              The next good
              <br />
              business
              <br />
              <em>decision.</em>
            </h1>
            <p>
              A hands-on session on business data
              <br className="desktop-break" /> and practical AI.
            </p>
            <div className="presenter-line">
              <span className="avatar">
                {state.presenter.trim().charAt(0).toUpperCase() || "M"}
              </span>
              <div>
                <strong>{state.presenter}</strong>
                <span>Data Analyst & AI Engineer</span>
              </div>
            </div>
          </div>
          <div className="cover-aside">
            <div className="cover-aside-top">
              <FlaskConical size={31} strokeWidth={1.4} />
              <span>
                A LITTLE EVIDENCE.
                <br />A BETTER CONVERSATION.
              </span>
            </div>
            <div className="cover-number">
              03
              <span>
                activities to connect
                <br />
                ideas with evidence
              </span>
            </div>
            <div className="cover-steps">
              <p>
                <span>01</span>A business decision
              </p>
              <p>
                <span>02</span>A customer problem
              </p>
              <p>
                <span>03</span>An AI experiment
              </p>
            </div>
            <div className="cover-aside-bottom">
              <span>Founders. Investors. Operators.</span>
              <ArrowDown size={17} />
            </div>
          </div>
        </div>
      );
    case 1:
      return (
        <>
          <SlideTitle
            eyebrow="OUR ROUTE / 25 MINUTES"
            title="Three questions for a founder"
          >
            One fictional business case connects the whole session.
          </SlideTitle>
          <div className="journey">
            {[
              [
                "01",
                BarChart3,
                "Would you back this business?",
                "Compare the numbers. Ask what is missing.",
                "5 min",
              ],
              [
                "02",
                MessageSquareText,
                "What are customers telling us?",
                "Find a pattern. Check the evidence.",
                "6 min",
              ],
              [
                "03",
                Lightbulb,
                "Where could AI help?",
                "Design a small experiment with a measure.",
                "7 min",
              ],
            ].map(([number, Icon, title, text, duration]) => (
              <div className="journey-row" key={number}>
                <span className="journey-number">{number}</span>
                <Icon size={28} strokeWidth={1.4} />
                <div>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </div>
                <span className="journey-duration">{duration}</span>
              </div>
            ))}
          </div>
          <Notice>
            Plus 7 minutes for opening, networking and questions. Everyone can
            take part.
          </Notice>
        </>
      );
    case 2:
      return (
        <>
          <SlideTitle
            eyebrow="ACTIVITY 01 / YOUR FIRST IMPRESSION"
            title="Would you back this business?"
          >
            You have time for one founder meeting. Which business gets a closer
            look?
          </SlideTitle>
          <Comparison />
          <VoteTally
            round={0}
            state={state}
            setState={setState}
            printable={printable}
          />
          <Notice>
            Fictional businesses at a similar stage. Growth compares revenue
            with the previous month.
          </Notice>
        </>
      );
    case 3:
      return (
        <>
          <SlideTitle
            eyebrow="ACTIVITY 01 / THE REVEAL"
            title="The numbers behind the revenue"
          >
            More information can change the question.
          </SlideTitle>
          <Comparison reveal />
          <div className="formula-line">
            Gross profit = revenue − direct costs{" "}
            <span>Gross margin = gross profit ÷ revenue</span>
          </div>
          <VoteTally
            round={1}
            state={state}
            setState={setState}
            printable={printable}
          />
          <p className="micro">
            Gross profit is before overheads and other expenses. These figures
            alone do not establish an investment decision.
          </p>
        </>
      );
    case 4: {
      const detail = questionDetails[state.question];
      return (
        <>
          <SlideTitle
            eyebrow="ACTIVITY 01 / THE DISCUSSION"
            title="What would you ask next?"
          >
            The next useful metric depends on the decision.
          </SlideTitle>
          <div className="question-options">
            {[
              ["retention", "Customer retention"],
              ["cash", "Cash needs"],
              ["acquisition", "Acquisition cost"],
            ].map(([key, text]) => (
              <button
                className={state.question === key ? "chosen" : ""}
                aria-pressed={state.question === key}
                key={key}
                onClick={() =>
                  setState((current) => ({ ...current, question: key }))
                }
              >
                {text}
                <ArrowUpRight size={18} />
              </button>
            ))}
          </div>
          <div className="question-answer">
            <span className="question-mark">?</span>
            <div>
              <h2>{detail[0]}</h2>
              <p>{detail[1]}</p>
              <span>{detail[2]}</span>
            </div>
          </div>
          <Notice>
            DailyCup has higher gross profit here. Both businesses still need
            further investigation.
          </Notice>
        </>
      );
    }
    case 5:
      return (
        <>
          <SlideTitle
            eyebrow="ACTIVITY 02 / THE SAME BUSINESS, A NEW QUESTION"
            title="BrewBox asks for help"
          />
          <div className="case-quote">
            <Coffee size={36} strokeWidth={1.2} />
            <blockquote>
              “People like our coffee.
              <br />
              Why does support keep
              <br />
              <em>hearing complaints?</em>”
            </blockquote>
            <span>The BrewBox founder / fictional scenario</span>
          </div>
          <div className="case-context">
            <b>Our evidence</b>
            <p>
              Eight selected complaint messages. A small practice sample that
              gives us clues to investigate.
            </p>
          </div>
          <Notice>
            We continue with BrewBox whichever business you chose in the first
            activity.
          </Notice>
        </>
      );
    case 6:
      return (
        <>
          <SlideTitle
            eyebrow="ACTIVITY 02 / WORK WITH A PARTNER"
            title="Guess the customer complaint"
          >
            Read the messages. Pick the most common theme and cite your
            evidence.
          </SlideTitle>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <article className="review" key={review.id}>
                <span className="review-id">
                  {String(review.id).padStart(2, "0")}
                </span>
                <p>“{review.text}”</p>
              </article>
            ))}
          </div>
          <div className="guess-row">
            <span>Your guess</span>
            {["Delivery", "Packaging", "Billing"].map((theme) => (
              <button
                key={theme}
                aria-pressed={state.guess === theme}
                className={state.guess === theme ? "selected" : ""}
                onClick={() =>
                  setState((current) => ({ ...current, guess: theme }))
                }
              >
                {state.guess === theme && <Check size={16} />}
                {theme}
              </button>
            ))}
            {!printable && (
              <button className="text-link" onClick={() => go(7)}>
                Reveal pattern <ArrowRight size={16} />
              </button>
            )}
          </div>
          <p className="micro">
            Fictional, selected messages. Count themes in this sample. Avoid
            guessing the cause.
          </p>
        </>
      );
    case 7:
      return (
        <>
          <SlideTitle
            eyebrow="ACTIVITY 02 / THE ANSWER KEY"
            title="Delivery appears in five messages"
          >
            A pattern to investigate, with the original evidence attached.
          </SlideTitle>
          <div className="feedback-layout">
            <div className="feedback-stat">
              <strong>
                5<span>/ 8</span>
              </strong>
              <h2>mention delivery</h2>
              <p>62.5% of this selected sample</p>
              {state.guess && (
                <span className="your-guess">
                  Your room’s guess: {state.guess}
                </span>
              )}
            </div>
            <div className="feedback-bars">
              {[
                ["Delivery", 5, "01, 03, 04, 06, 08"],
                ["Packaging", 2, "02, 05"],
                ["Billing", 1, "07"],
              ].map(([theme, count, ids]) => (
                <div key={theme}>
                  <div className="bar-label">
                    <b>{theme}</b>
                    <span>{count} messages</span>
                  </div>
                  <div className="feedback-track">
                    <div style={{ width: `${(count / 8) * 100}%` }} />
                  </div>
                  <p>Message IDs: {ids}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="answer-lesson">
            <b>What we know</b>
            <p>
              Delivery is the most frequent theme in these eight messages. Check
              actual delivery dates and complaint severity before choosing an
              action.
            </p>
          </div>
          <Notice>
            This sample does not tell us the percentage of all customers
            affected or the cause of churn.
          </Notice>
        </>
      );
    case 8:
      return (
        <>
          <SlideTitle
            eyebrow="THE CONNECTION / DATA AND AI HAVE DIFFERENT JOBS"
            title="A business question before an AI tool"
          >
            Are promised delivery dates matching the customer’s experience?
          </SlideTitle>
          <div className="method-rows">
            <div>
              <span>01</span>
              <h2>Check the numbers</h2>
              <p>
                Compare promised and actual delivery dates by courier and area.
                Use defined calculations.
              </p>
              <b>Data & rules</b>
            </div>
            <div>
              <span>02</span>
              <h2>Work with the words</h2>
              <p>
                Group complaint messages or draft replies using verified order
                facts.
              </p>
              <b>Possible AI task</b>
            </div>
            <div>
              <span>03</span>
              <h2>Review the result</h2>
              <p>
                Check categories and reply accuracy. Improve the delivery
                operation separately.
              </p>
              <b>A person owns it</b>
            </div>
          </div>
          {!printable && (
            <button
              className="secondary-button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(samplePrompt);
                  notify("Sample prompt copied.");
                } catch {
                  downloadFile(
                    "complaint-classification-prompt.txt",
                    samplePrompt,
                  );
                  notify("Prompt downloaded as a text file.");
                }
              }}
            >
              <FileText size={16} />
              Copy a sample analysis prompt
            </button>
          )}
          <Notice>
            The previous screen is a prepared answer key. No live AI service is
            connected.
          </Notice>
        </>
      );
    case 9:
      return (
        <>
          <SlideTitle
            eyebrow="ACTIVITY 03 / ONE VOLUNTEER, ONE BUSINESS TASK"
            title="AI Opportunity Clinic"
          >
            Which repetitive task would you like your team to spend less time
            on?
          </SlideTitle>
          <div className="clinic-intro">
            <div className="clinic-big">
              <span>30</span>
              <b>seconds to describe your task</b>
              <p>
                What happens?
                <br />
                How often?
                <br />
                What does a good result look like?
              </p>
            </div>
            <div className="clinic-checklist">
              {[
                "A specific problem",
                "Reliable source information",
                "A proposed workflow",
                "A human who checks it",
                "A time and quality measure",
              ].map((text, index) => (
                <div key={text}>
                  <span>0{index + 1}</span>
                  <h2>{text}</h2>
                </div>
              ))}
            </div>
          </div>
          <Notice>
            Use non-confidential examples. We can use BrewBox delivery enquiries
            as a fallback.
          </Notice>
        </>
      );
    case 10:
      return (
        <>
          <SlideTitle
            eyebrow="ACTIVITY 03 / THE WORKSHEET"
            title="A small experiment for your business"
          >
            Choose an example or build your own. Include human review in the
            time estimate.
          </SlideTitle>
          <ClinicForm
            clinic={state.clinic}
            update={updateClinic}
            errors={errors}
          />
          <p className="micro worksheet-footnote">
            Guided planning template with prepared examples. No AI model,
            account or API key required.
          </p>
        </>
      );
    case 11:
      return (
        <>
          <SlideTitle
            eyebrow="ACTIVITY 03 / YOUR PILOT BRIEF"
            title="A pilot with a clear measure"
          >
            A suggested structure to test your assumptions.
          </SlideTitle>
          <PlanSummary state={state} />
        </>
      );
    case 12:
      return (
        <>
          <SlideTitle
            eyebrow="NETWORKING / TWO ROUNDS OF 90 SECONDS"
            title="Your next useful conversation"
          >
            Meet someone new. Speak for 60 seconds, then let your partner
            respond for 30. Swap.
          </SlideTitle>
          <div className="network-script">
            <p>
              I’m building <em>________.</em>
            </p>
            <p>
              My current decision is <em>________.</em>
            </p>
            <p>
              The evidence or help I need is <em>________.</em>
            </p>
          </div>
          <div className="network-tip">
            <Users size={23} />
            <p>
              Your partner offers a useful question, an introduction or a
              concrete next step.
            </p>
          </div>
          <label className="pledge-field">
            Optional example to take away
            <textarea
              value={state.pledge}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  pledge: event.target.value,
                }))
              }
              maxLength={1000}
              rows={2}
              placeholder="One decision, the evidence needed, and who could help…"
            />
          </label>
          <p className="micro">
            Saved on this device only. Exchange contact details directly if you
            both want to.
          </p>
        </>
      );
    case 13:
      return (
        <div className="closing">
          <Eyebrow>ONE NEXT STEP</Eyebrow>
          <h1>
            What is the next
            <br />
            business question
            <br />
            <em>you will investigate?</em>
          </h1>
          <div className="closing-recap">
            <span>
              <BarChart3 size={18} />A decision worth checking
            </span>
            <span>
              <MessageSquareText size={18} />
              Evidence worth hearing
            </span>
            <span>
              <FlaskConical size={18} />
              An experiment worth measuring
            </span>
          </div>
          <div className="closing-person">
            <strong>{state.presenter}</strong>
            <span>Data Analyst & AI Engineer</span>
            <p>Let’s discuss a decision in your business.</p>
          </div>
          <p className="thanks">Thank you, Millenia Events.</p>
        </div>
      );
    case 14:
      return (
        <>
          <SlideTitle
            eyebrow="QUESTIONS & DISCUSSION"
            title="What would you like to try?"
          >
            Bring a business question to the room.
          </SlideTitle>
          <div className="discussion-prompts">
            <p>
              <span>01</span>Which business decision needs better evidence?
            </p>
            <p>
              <span>02</span>Which small task could an experiment improve?
            </p>
            <p>
              <span>03</span>Who here could help you take the next step?
            </p>
          </div>
          <Notice>
            Keep confidential details for a separate, mutually agreed
            conversation.
          </Notice>
        </>
      );
    default:
      return null;
  }
}

function Guide() {
  return (
    <div className="guide-content">
      <div className="guide-intro">
        <Eyebrow>FACILITATOR EDITION</Eyebrow>
        <h2>The next good business decision</h2>
        <p>
          A complete 25-minute session connecting all three activities. Use the
          10-minute route when your slot is shorter.
        </p>
        <div className="guide-downloads">
          <a
            className="secondary-button"
            href="/facilitator-guide.html"
            download
          >
            <Download size={16} />
            Download full guide
          </a>
          <a
            className="secondary-button"
            href="/activity-cards.html"
            target="_blank"
            rel="noreferrer"
          >
            <FileText size={16} />
            Printable activity cards
          </a>
        </div>
      </div>
      <div className="guide-setup">
        <h3>Before the room arrives</h3>
        <p>
          Connect the laptop to the projector. Open the app once online, wait
          for the “Offline ready” status, then rehearse. Use Present mode to
          hide speaker notes. A laptop, projector and host are enough. Printed
          cards and pens are a useful fallback.
        </p>
        <p>
          For roughly 10–60 people, use raised hands and pairs. For a larger
          room, use a show of hands without exact tallies and invite only two
          short responses. Nobody needs a phone. The app does not collect remote
          votes.
        </p>
        <p>
          Choose 25 or 10 minutes. Change the presenter name in Settings. Reset
          the session before the audience arrives. Show every figure as
          fictional or hypothetical. Keep real business information
          non-confidential.
        </p>
      </div>
      <h3>The running order</h3>
      <div className="run-order">
        {slides.map((slide, index) => (
          <div key={slide.nav}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <b>{slide.nav}</b>
            <span>{slide.minutes} min</span>
          </div>
        ))}
      </div>
      <h3>The 10-minute route</h3>
      <p>
        Welcome (30s), first vote (60s), cost reveal (60s), complaint challenge
        (90s), feedback pattern (60s), worksheet (120s), pilot brief (90s),
        closing and one partner introduction (90s). Use the prepared delivery
        example and two brief audience responses.
      </p>
      <h3>If you get only 2 minutes</h3>
      <p>
        Give the revenue figures, take one quick vote, reveal direct costs and
        gross profit, then ask: “What is one number you wish you understood
        better in your business?” This fallback covers only activity one.
      </p>
      <h3>Complete speaking script</h3>
      {slides.map((slide, index) => (
        <article className="guide-slide" key={slide.nav}>
          <span className="eyebrow">
            {String(index + 1).padStart(2, "0")} / {slide.section} /{" "}
            {slide.minutes} MIN
          </span>
          <h3>{slide.title}</h3>
          <h4>Say</h4>
          <p>{slide.say}</p>
          <h4>Do</h4>
          <p>{slide.do}</p>
          <h4>Ask the room</h4>
          <p>{slide.ask}</p>
          <h4>The point to land</h4>
          <p>{slide.takeaway}</p>
          <h4>Transition</h4>
          <p>{slide.transition}</p>
        </article>
      ))}
      <h3>Questions you may hear</h3>
      {answers.map(([question, answer]) => (
        <div className="guide-answer" key={question}>
          <h4>{question}</h4>
          <p>{answer}</p>
        </div>
      ))}
      <h3>Source and exercise disclosures</h3>
      <p>
        Event context:{" "}
        <a href="https://millenniaevents.in/" target="_blank" rel="noreferrer">
          Millenia Events
        </a>
        . All case businesses, comments and financial figures are fictional.
        Classification is a prepared manual answer key. Savings are editable
        assumptions. The app does not call an AI model or make investment
        recommendations.
      </p>
    </div>
  );
}

function FullWorkshop() {
  const [state, setState] = useState(readSession);
  const [notes, setNotes] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const [modal, setModal] = useState(null);
  const [sidebar, setSidebar] = useState(false);
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState([]);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [offlineReady, setOfflineReady] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const route = state.mode === "short" ? shortRoute : fullRoute;
  const position = Math.max(0, route.indexOf(state.slide));
  const slide = slides[state.slide];
  const seconds =
    state.mode === "short" ? shortTimes[position] : slide.minutes * 60;
  const timer = useCountdown(seconds, `${state.slide}-${state.mode}`);
  const mainRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(state));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [state]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    let active = true;
    if (import.meta.env.PROD && "serviceWorker" in navigator)
      navigator.serviceWorker.ready.then(() => {
        if (active) setOfflineReady(true);
      });
    return () => {
      active = false;
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
    setErrors([]);
  }, [state.slide]);
  useEffect(() => {
    if (!route.includes(state.slide))
      setState((current) => ({ ...current, slide: route[0] }));
  }, [state.mode]);

  function go(id) {
    if (state.slide === 10 && id === 11) {
      const issues = validateClinic(state.clinic);
      if (issues.length) {
        setErrors(issues);
        setToast("Complete the worksheet before opening the pilot brief.");
        return;
      }
    }
    setState((current) => ({ ...current, slide: id }));
    setSidebar(false);
    setModal(null);
  }
  function move(delta) {
    const next = route[position + delta];
    if (next !== undefined) go(next);
  }
  function startPresentation() {
    setPresenting(true);
    setNotes(false);
    setSidebar(false);
  }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setToast(
        "Use your browser’s full-screen command. Presentation mode is still available.",
      );
    }
  }
  useEffect(() => {
    const handler = (event) => {
      if (
        modal ||
        event.target.closest("input, textarea, select, button, a, summary") ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      )
        return;
      if (["ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        move(1);
      }
      if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        move(-1);
      }
      if (event.key.toLowerCase() === "t") {
        event.preventDefault();
        timer.toggle();
      }
      if (event.key.toLowerCase() === "n" && !presenting)
        setNotes((value) => !value);
      if (event.key.toLowerCase() === "p") {
        if (presenting) setPresenting(false);
        else startPresentation();
      }
      if (event.key.toLowerCase() === "f") fullscreen();
      if (event.key.toLowerCase() === "o") setModal("overview");
      if (event.key === "Escape") {
        setPresenting(false);
        setSidebar(false);
      }
      if (event.key === "?") setModal("shortcuts");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  function exportSession() {
    const plan = getPlan(state.clinic),
      savings = calculateSavings(state.clinic);
    downloadFile(
      "millenial-events-session.json",
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          ...state,
          plan,
          estimatedMonthlySavings: savings,
          disclosure:
            "Workshop assumptions. Guided template, no AI service. Capacity value is not guaranteed cash savings.",
        },
        null,
        2,
      ),
      "application/json",
    );
    setToast("Session and pilot brief exported.");
  }
  const groups = [...new Set(route.map((id) => slides[id].section))];
  return (
    <div className={`app ${presenting ? "is-presenting" : ""}`}>
      <a className="skip-link" href="#presentation">
        Skip to presentation
      </a>
      {sidebar && (
        <div className="sidebar-shade" onClick={() => setSidebar(false)} />
      )}
      <aside className={`sidebar ${sidebar ? "sidebar-open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            go(0);
          }}
        >
          <div className="brand-icon">
            <FlaskConical size={23} />
          </div>
          <div>
            Millenia <span>Events</span>
            <small>DECISIONS WITH DATA & AI</small>
          </div>
        </a>
        <div className="session-label">
          <span className="live-dot" />
          YOUR WORKSHOP
        </div>
        <nav aria-label="Presentation slides">
          {groups.map((group) => (
            <div className="nav-group" key={group}>
              <div className="nav-group-title">{group}</div>
              {route
                .filter((id) => slides[id].section === group)
                .map((id) => (
                  <button
                    key={id}
                    onClick={() => go(id)}
                    aria-current={id === state.slide ? "step" : undefined}
                    className={`nav-step ${state.slide === id ? "active" : ""}`}
                  >
                    <span>
                      {String(route.indexOf(id) + 1).padStart(2, "0")}
                    </span>
                    {slides[id].nav}
                    {state.slide === id && <span className="active-dot" />}
                  </button>
                ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={() => setModal("guide")}>
            <BookOpen size={17} />
            Facilitator guide
            <ArrowUpRight size={14} />
          </button>
          <button onClick={() => setModal("shortcuts")}>
            <Keyboard size={17} />
            Keyboard shortcuts
          </button>
          <div className="event-credit">
            MADE FOR THE ROOM
            <br />
            <b>Millenia Events</b>
            <span>Founders meet opportunity.</span>
          </div>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu"
              onClick={() => setSidebar(true)}
              aria-label="Open slide navigation"
            >
              <Menu size={20} />
            </button>
            {presenting ? (
              <div className="present-mode-label">
                <Presentation size={18} />
                MILLENIA EVENTS
              </div>
            ) : (
              <div className="breadcrumb">
                Workshop <ChevronRight size={13} />
                <b>{slide.section}</b>
              </div>
            )}
          </div>
          <div className="topbar-actions">
            {!presenting && (
              <>
                <div className="mode-switch" aria-label="Session duration">
                  <button
                    className={state.mode === "full" ? "active" : ""}
                    aria-pressed={state.mode === "full"}
                    onClick={() =>
                      setState((current) => ({ ...current, mode: "full" }))
                    }
                  >
                    25 min
                  </button>
                  <button
                    className={state.mode === "short" ? "active" : ""}
                    aria-pressed={state.mode === "short"}
                    onClick={() =>
                      setState((current) => ({ ...current, mode: "short" }))
                    }
                  >
                    10 min
                  </button>
                </div>
                <button
                  className="icon-button settings-button"
                  onClick={() => setModal("settings")}
                  aria-label="Session settings"
                >
                  <Settings2 size={18} />
                </button>
              </>
            )}
            <button
              className={presenting ? "secondary-button" : "primary-button"}
              onClick={() =>
                presenting ? setPresenting(false) : startPresentation()
              }
            >
              {presenting ? (
                <Minimize2 size={16} />
              ) : (
                <Play size={15} fill="currentColor" />
              )}
              {presenting ? "Exit presentation" : "Present"}
            </button>
            <button
              className="icon-button fullscreen-button"
              onClick={fullscreen}
              aria-label="Toggle browser full screen"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </header>
        {!presenting && (
          <div className="workshop-meta">
            <span>THE NEXT GOOD BUSINESS DECISION</span>
            <div>
              <span className={`status-dot ${!online ? "offline" : ""}`} />
              {!online
                ? "Offline"
                : offlineReady
                  ? "Offline ready"
                  : "Browser workshop"}
              <span className="meta-divider" />
              {storageAvailable
                ? "Saved on this device"
                : "Session saving unavailable"}
            </div>
          </div>
        )}
        <main
          ref={mainRef}
          className="stage-scroll"
          id="presentation"
          tabIndex={-1}
        >
          <section
            className={`slide slide-${state.slide}`}
            aria-label={`Slide ${position + 1}: ${slide.title}`}
            key={state.slide}
          >
            <Slide
              id={state.slide}
              state={state}
              setState={setState}
              go={go}
              errors={errors}
              notify={setToast}
            />
          </section>
          {!presenting && (
            <div className="notes-area">
              <button
                className="notes-toggle"
                onClick={() => setNotes((value) => !value)}
                aria-expanded={notes}
              >
                <BookOpen size={16} />
                <span>Speaker notes</span>
                <span className="notes-hint">
                  {notes
                    ? "Visible in rehearsal"
                    : "Your script & facilitation cues"}
                </span>
                <ChevronRight size={16} className={notes ? "turned" : ""} />
              </button>
              {notes && (
                <div className="speaker-notes">
                  <div>
                    <span>SAY</span>
                    <p>
                      {slide.say.replace("I’m Manoj", `I’m ${state.presenter}`)}
                    </p>
                  </div>
                  <div>
                    <span>DO</span>
                    <p>{slide.do}</p>
                  </div>
                  <div>
                    <span>ASK THE ROOM</span>
                    <p>{slide.ask}</p>
                  </div>
                  <div className="notes-transition">
                    <span>TRANSITION</span>
                    <p>{slide.transition}</p>
                  </div>
                  {state.mode === "short" && (
                    <p className="short-note">
                      10-minute route: use the prepared example, keep responses
                      brief and follow the slide timer. The final slide includes
                      one short partner introduction.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
        <footer className="controlbar">
          <div
            className={`timer ${timer.remaining === 0 ? "timer-ended" : ""}`}
          >
            <button
              className="timer-play"
              onClick={timer.toggle}
              aria-label={
                timer.running ? "Pause slide timer" : "Start slide timer"
              }
            >
              {timer.running ? (
                <Pause size={16} />
              ) : (
                <Play size={15} fill="currentColor" />
              )}
            </button>
            <div>
              <output aria-label="Slide time remaining" role="timer">
                {formatTime(timer.remaining)}
              </output>
              <span>
                {timer.remaining === 0 ? "Time to move on" : "Slide timer"}
              </span>
            </div>
            <button
              className="icon-button timer-reset"
              onClick={timer.reset}
              aria-label="Reset slide timer"
            >
              <RotateCcw size={14} />
            </button>
          </div>
          <button
            className="slide-position"
            onClick={() => setModal("overview")}
            aria-label="Open slide overview"
          >
            <span className="progress-dots">
              {route.map((id, index) => (
                <i
                  key={id}
                  className={
                    index === position
                      ? "current"
                      : index < position
                        ? "complete"
                        : ""
                  }
                />
              ))}
            </span>
            <span>
              {String(position + 1).padStart(2, "0")}{" "}
              <span className="muted">
                / {String(route.length).padStart(2, "0")}
              </span>
            </span>
          </button>
          <div className="navigation-controls">
            <button
              className="previous-button"
              disabled={!position}
              onClick={() => move(-1)}
              aria-label="Previous slide"
            >
              <ChevronLeft size={19} />
              <span>Back</span>
            </button>
            <button
              className="next-button"
              disabled={position === route.length - 1}
              onClick={() => move(1)}
            >
              {position === route.length - 1
                ? "Complete"
                : state.slide === 10
                  ? "View pilot brief"
                  : "Next"}
              <ChevronRight size={18} />
            </button>
          </div>
        </footer>
      </div>
      <div className="toast" role="status" aria-live="polite">
        {toast && (
          <>
            <CheckCircle2 size={17} />
            {toast}
          </>
        )}
      </div>
      {modal === "guide" && (
        <Modal title="Your facilitator guide" wide close={() => setModal(null)}>
          <Guide />
        </Modal>
      )}
      {modal === "overview" && (
        <Modal title="Session overview" wide close={() => setModal(null)}>
          <p className="modal-description">
            {state.mode === "short"
              ? "10 minutes · all three activities · 8 slides"
              : "25 minutes · all three activities · 15 slides"}
          </p>
          <div className="overview-list">
            {route.map((id, index) => (
              <button
                className={id === state.slide ? "current" : ""}
                key={id}
                onClick={() => go(id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <small>{slides[id].section}</small>
                  <b>{slides[id].title}</b>
                </div>
                <span>
                  {state.mode === "short"
                    ? formatTime(shortTimes[index])
                    : `${slides[id].minutes} min`}
                </span>
                <ArrowUpRight size={17} />
              </button>
            ))}
          </div>
        </Modal>
      )}
      {modal === "shortcuts" && (
        <Modal title="Presentation controls" close={() => setModal(null)}>
          <div className="shortcut-list">
            {[
              ["→ / Space", "Next slide"],
              ["←", "Previous slide"],
              ["T", "Start or pause timer"],
              ["P", "Enter or exit presentation"],
              ["F", "Toggle browser full screen"],
              ["N", "Toggle notes in rehearsal"],
              ["O", "Open slide overview"],
              ["Esc", "Close dialog or exit presentation"],
              ["?", "Show these controls"],
            ].map(([key, label]) => (
              <div key={key}>
                <span>{label}</span>
                <kbd>{key}</kbd>
              </div>
            ))}
          </div>
          <p className="micro">
            Shortcuts pause while you type or focus a control. Use Present to
            hide the sidebar and speaker notes.
          </p>
        </Modal>
      )}
      {modal === "settings" && (
        <Modal title="Session settings" close={() => setModal(null)}>
          <div className="settings-content">
            <label>
              Presenter name
              <input
                value={state.presenter}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    presenter: event.target.value,
                  }))
                }
                maxLength={80}
              />
            </label>
            <div>
              <h3>Your session, on this device</h3>
              <p>
                Votes, worksheet inputs and your example stay in this browser.
                There is no server, remote audience polling or connected AI
                service.
              </p>
              <button className="secondary-button" onClick={exportSession}>
                <Download size={16} />
                Export session & pilot brief
              </button>
            </div>
            <div>
              <h3>Workshop materials</h3>
              <a
                className="resource-link"
                href="/facilitator-guide.html"
                target="_blank"
                rel="noreferrer"
              >
                <BookOpen size={17} />
                Complete script and answer bank
                <ArrowUpRight size={16} />
              </a>
              <a
                className="resource-link"
                href="/activity-cards.html"
                target="_blank"
                rel="noreferrer"
              >
                <FileText size={17} />
                Printable cards for all three activities
                <ArrowUpRight size={16} />
              </a>
            </div>
            <div>
              <h3>Start a fresh rehearsal</h3>
              <p>
                This clears the votes, worksheet and progress on this device.
              </p>
              <button
                className="danger-button"
                onClick={() => setModal("reset")}
              >
                <RotateCcw size={15} />
                Reset session
              </button>
            </div>
          </div>
        </Modal>
      )}
      {modal === "reset" && (
        <Modal title="Reset this session?" close={() => setModal(null)}>
          <p>
            Your votes, worksheet, example and slide progress will be cleared.
            Export the session first if you want to keep it.
          </p>
          <div className="modal-buttons">
            <button
              className="secondary-button"
              onClick={() => setModal("settings")}
            >
              Keep session
            </button>
            <button
              className="danger-button"
              onClick={() => {
                setState((current) => ({
                  ...newSession(),
                  presenter: current.presenter,
                }));
                setNotes(false);
                setModal(null);
                timer.reset();
                setToast("Fresh session ready.");
              }}
            >
              Reset session
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function App() {
  const [full, setFull] = useState(false);
  return full ? (
    <>
      <button className="return-simple" onClick={() => setFull(false)}>
        Back to the simple business talk
      </button>
      <FullWorkshop />
    </>
  ) : (
    <SimpleSession onFull={() => setFull(true)} />
  );
}
