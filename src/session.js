export const SESSION_KEY = 'founder-lab-session-v1';
export const fullRoute = Array.from({ length: 15 }, (_, i) => i);
export const shortRoute = [0, 2, 3, 6, 7, 10, 11, 13];
export const shortTimes = [30, 60, 60, 90, 60, 120, 90, 90];
export const reviews = [
  { id: 1, text: 'My box arrived two days after the promised date.', theme: 'Delivery' },
  { id: 2, text: 'One pouch split open inside the box.', theme: 'Packaging' },
  { id: 3, text: 'Tracking said dispatched, but the box came late.', theme: 'Delivery' },
  { id: 4, text: 'I love the coffee. My refill arrived after I ran out.', theme: 'Delivery' },
  { id: 5, text: 'The outer box was crushed and a pouch was damaged.', theme: 'Packaging' },
  { id: 6, text: 'The delivery window passed. I had to chase support.', theme: 'Delivery' },
  { id: 7, text: 'I was charged twice for this month’s subscription.', theme: 'Billing' },
  { id: 8, text: 'The beans taste great. This is my second late delivery.', theme: 'Delivery' },
];

export const opportunities = {
  delivery: {
    label: 'Delivery questions', problem: 'Support spends too long answering delivery questions.',
    source: 'Order IDs, promised dates, verified courier status and approved support policy.',
    workflow: 'Check order facts with rules. Use AI to draft a reply and group unusual complaints.',
    human: 'A support person verifies each status and approves every reply during the pilot.',
    metric: 'Average handling time per enquiry, with reply accuracy checked separately.',
    guardrail: 'Never invent arrival dates. Escalate missing status, refunds and uncertain cases.',
    control: 'On-time delivery rate. Faster replies alone do not fix late deliveries.',
  },
  leads: {
    label: 'Lead follow-ups', problem: 'The team repeatedly writes similar follow-up messages.',
    source: 'Consented lead notes, the approved product facts and the last conversation.',
    workflow: 'Use rules for reminders. Let AI draft a relevant follow-up from the notes.',
    human: 'The salesperson checks context, pricing and permission before sending.',
    metric: 'Minutes per follow-up and qualified replies per 100 messages.',
    guardrail: 'Avoid invented claims or promises. Honour contact preferences.',
    control: 'Track complaint and opt-out rates alongside qualified replies.',
  },
  reports: {
    label: 'Weekly reporting', problem: 'The founder spends hours assembling the same weekly report.',
    source: 'A reconciled sales export, agreed metric definitions and the previous report.',
    workflow: 'Calculate totals in a spreadsheet. Use AI to draft a commentary with source references.',
    human: 'The analyst checks every figure and separates observed changes from possible explanations.',
    metric: 'Minutes per report and the number of factual corrections.',
    guardrail: 'Keep calculations deterministic. Label explanations as hypotheses until verified.',
    control: 'Report completeness and accuracy must stay at least as good as the baseline.',
  },
  invoices: {
    label: 'Invoice entry', problem: 'Staff manually copy details from incoming invoices.',
    source: 'Sample invoices, the required fields and an approved vendor list.',
    workflow: 'Use extraction tools to suggest fields. Apply rules for duplicates and arithmetic.',
    human: 'A person checks tax fields, totals and bank details before saving or paying.',
    metric: 'Minutes per invoice and the percentage of fields entered correctly.',
    guardrail: 'Keep payments outside this pilot. Route uncertain or changed bank details for review.',
    control: 'No increase in entry errors. Track exceptions separately.',
  },
};

export const defaultClinic = {
  type: 'delivery', volume: 100, before: 6, after: 3, rate: 300, cost: 500,
  task: '', source: '', workflow: '', human: '', metric: '',
};

export function calculateSavings({ volume, before, after, rate, cost }) {
  const values = [volume, before, after, rate, cost].map(Number);
  if (values.some(value => !Number.isFinite(value) || value < 0) || !Number.isInteger(values[0])) return null;
  const hours = values[0] * (values[1] - values[2]) / 60;
  return { hours, capacityValue: hours * values[3], net: hours * values[3] - values[4] };
}

export function getPlan(clinic) {
  if (clinic.type !== 'custom') return opportunities[clinic.type] || opportunities.delivery;
  return {
    label: 'Your business task', problem: clinic.task.trim(), source: clinic.source.trim(),
    workflow: clinic.workflow.trim(), human: clinic.human.trim(), metric: clinic.metric.trim(),
    guardrail: 'Keep sensitive data out of public prompts. Escalate uncertain outputs to a person.',
    control: 'Agree a quality check and a stop condition before starting the pilot.',
  };
}

export function validateClinic(clinic) {
  const errors = [];
  if (!calculateSavings(clinic)) errors.push('Use non-negative numbers and a whole number of tasks.');
  if (clinic.type === 'custom' && ['task', 'source', 'workflow', 'human', 'metric'].some(key => !clinic[key].trim())) {
    errors.push('Complete all five fields for your own task.');
  }
  return errors;
}

export function newSession() {
  return {
    slide: 0, mode: 'full', votes: [{ a: 0, b: 0, unsure: 0 }, { a: 0, b: 0, unsure: 0 }],
    guess: '', question: 'retention', clinic: { ...defaultClinic }, pledge: '',
    presenter: 'Manoj',
  };
}

export function sanitizeSession(raw) {
  const fallback = newSession();
  if (!raw || typeof raw !== 'object') return fallback;
  const numeric = key => Number.isFinite(Number(raw.clinic?.[key])) && Number(raw.clinic[key]) >= 0 ? raw.clinic[key] : defaultClinic[key];
  const text = key => typeof raw.clinic?.[key] === 'string' ? raw.clinic[key].slice(0, 1000) : '';
  return {
    ...fallback,
    slide: Number.isInteger(raw.slide) && raw.slide >= 0 && raw.slide < 15 ? raw.slide : 0,
    mode: raw.mode === 'short' ? 'short' : 'full',
    votes: [0, 1].map(round => Object.fromEntries(['a', 'b', 'unsure'].map(key => [key, Number.isSafeInteger(raw.votes?.[round]?.[key]) && raw.votes[round][key] >= 0 ? Math.min(raw.votes[round][key], 9999) : 0]))),
    guess: ['Delivery', 'Packaging', 'Billing'].includes(raw.guess) ? raw.guess : '',
    question: ['retention', 'cash', 'acquisition'].includes(raw.question) ? raw.question : 'retention',
    clinic: {
      type: [...Object.keys(opportunities), 'custom'].includes(raw.clinic?.type) ? raw.clinic.type : 'delivery',
      ...Object.fromEntries(['volume', 'before', 'after', 'rate', 'cost'].map(key => [key, numeric(key)])),
      ...Object.fromEntries(['task', 'source', 'workflow', 'human', 'metric'].map(key => [key, text(key)])),
    },
    pledge: typeof raw.pledge === 'string' ? raw.pledge.slice(0, 1000) : '',
    presenter: typeof raw.presenter === 'string' && raw.presenter.trim() ? raw.presenter.slice(0, 80) : 'Manoj',
  };
}

export const slides = [
  {
    nav: 'Welcome', section: 'Opening', title: 'The next good business decision', minutes: 1,
    say: 'Good evening. I’m Manoj, a data analyst and AI engineer. Tonight we will make a business decision together, listen to customers, and design one small AI experiment. You don’t need a technical background. Your business experience is the most useful tool in the room.',
    do: 'Introduce yourself. Ask for a show of hands: founders, investors, operators and people exploring an idea. Invite everyone to participate.',
    ask: 'Who has made an important business decision with incomplete information?',
    takeaway: 'Everyone can participate using business judgement.',
    transition: 'We will use one fictional coffee subscription case to connect all three activities.',
  },
  {
    nav: 'Our route', section: 'Opening', title: 'Three questions for a founder', minutes: 1,
    say: 'First, which business deserves a closer look? Then, what are its customers telling us? Finally, where could AI help with a specific task? We will use fictional information for practice. At the end, you will turn the exercise into a useful conversation with someone here.',
    do: 'Explain that the host records a show of hands. Nobody needs to install an app or join a poll. All examples and savings assumptions are invented for the workshop.',
    ask: 'What would make this time useful for your own business?',
    takeaway: 'The activities connect evidence to a small, measurable experiment.',
    transition: 'Imagine you can take only one introductory founder meeting.',
  },
  {
    nav: 'The first vote', section: 'Activity 01', title: 'Would you back this business?', minutes: 2,
    say: 'Meet BrewBox and DailyCup, two fictional coffee subscription businesses at a similar stage. BrewBox reports ten lakh rupees in monthly revenue and twenty percent growth over the previous month. DailyCup reports six lakh and eight percent growth. Which founder would you meet first? A, B, or do you need more information? There is no penalty for that last answer.',
    do: 'Give 20 seconds of thinking time. Count each person once and record the three totals. Invite one person from A and one from B or the undecided group to explain their reasoning in 20 seconds each. Ask for no real investment commitments.',
    ask: 'What made you choose that business? Which fact did you use?',
    takeaway: 'The first impression depends on which facts we see.',
    transition: 'Now we get the direct costs for the same month.',
  },
  {
    nav: 'The cost reveal', section: 'Activity 01', title: 'The numbers behind the revenue', minutes: 2,
    say: 'BrewBox has nine point five lakh rupees in direct costs, leaving fifty thousand in gross profit. DailyCup has three point six lakh in direct costs, leaving two point four lakh. Their gross margins are five percent and forty percent. Gross profit is revenue minus direct costs. Gross margin is gross profit divided by revenue. This is before overheads and other expenses, so it is not net profit. Would anyone change their choice?',
    do: 'Explain the two calculations. Take a second show of hands and record it independently of round one. If counts differ, mention that people may have joined or abstained. Invite one person who changed their view. Avoid declaring a winning investment.',
    ask: 'What does this reveal, and what is still missing?',
    takeaway: 'DailyCup has more gross profit in this example. Neither business is automatically the better investment.',
    transition: 'Let’s practise asking the next useful question.',
  },
  {
    nav: 'The next question', section: 'Activity 01', title: 'What would you ask next?', minutes: 1,
    say: 'Both businesses still have unanswered questions. I would want to know whether customers return, how much cash the business needs and what it costs to acquire a customer. A growing business might need working capital. A strong margin might coexist with weak repeat purchasing. The next question depends on the decision we are making.',
    do: 'Ask a participant to select one question. Open its explanation. Take one additional question from the room. Credit sensible alternatives such as delivery reliability, market size or founder capability.',
    ask: 'Which missing fact would most change your choice, and why?',
    takeaway: 'A useful metric answers a specific decision question.',
    transition: 'BrewBox has asked us to investigate a problem, whichever business we voted for.',
  },
  {
    nav: 'Meet the customer', section: 'Activity 02', title: 'BrewBox asks for help', minutes: 1,
    say: 'We will now work with BrewBox because it has volunteered a customer problem. The founder says people like the coffee, but support keeps receiving complaints. We have eight fictional complaint messages. This is a selected practice sample, not a survey of all customers. We will look for a pattern and decide what to investigate.',
    do: 'Make pairs, ideally with someone the participant has not met. If seating makes that hard, ask people to work with a neighbour. Explain that the biggest category does not automatically mean the most costly problem.',
    ask: 'How can a customer message become useful business evidence?',
    takeaway: 'Customer feedback provides clues that need checking against operational data.',
    transition: 'Read the eight messages and choose the most common complaint theme.',
  },
  {
    nav: 'The complaint challenge', section: 'Activity 02', title: 'Guess the customer complaint', minutes: 2,
    say: 'With your partner, read these eight messages. Choose the most common theme: delivery, packaging or billing. Count the messages that support your choice. You have sixty seconds, then I’ll ask one pair to share its evidence. Please separate what the customer actually says from what you think caused the problem.',
    do: 'Start the slide timer. Give 60 seconds for reading and discussion, then ask for a show of hands. Select the room’s leading guess. Ask one pair to cite a message before opening the reveal.',
    ask: 'Which theme occurs most often? Which messages support your answer?',
    takeaway: 'A count should be traceable to the messages behind it.',
    transition: 'Let’s compare our guess with a simple manual classification.',
  },
  {
    nav: 'The feedback pattern', section: 'Activity 02', title: 'Delivery appears in five messages', minutes: 2,
    say: 'Delivery appears in messages one, three, four, six and eight. Packaging appears in two and five. Billing appears in seven. That makes delivery five of eight, or sixty-two point five percent of this selected sample. We cannot say sixty-two point five percent of all customers have a delivery problem. We also cannot infer that delivery caused churn from these comments alone.',
    do: 'Show the grouped counts and evidence IDs. Give credit for alternative labels if someone explains them. Explain that real feedback can contain multiple themes, whereas these practice examples each use one primary theme.',
    ask: 'What would we check next? What if the single billing complaint is financially serious?',
    takeaway: 'Frequency guides investigation. Severity and representativeness also matter.',
    transition: 'The next step is an operational question, followed by a possible AI support task.',
  },
  {
    nav: 'A useful AI role', section: 'Activity 02', title: 'A business question before an AI tool', minutes: 1,
    say: 'First I would check promised dates against actual delivery dates, split by courier and area. That tells us whether late delivery is widespread and where it occurs. Rules can calculate those dates. AI could help group free-text complaints or draft a response using verified order facts. A person still checks the output. Faster support replies will not by themselves make the courier arrive sooner.',
    do: 'Distinguish calculations, language tasks and operational changes. If time allows, read the sample prompt. Explain that the displayed classification is a prepared answer key, not a live AI response.',
    ask: 'Which part of this workflow needs language understanding, and which part is a calculation?',
    takeaway: 'Match the method to the task and verify the result.',
    transition: 'Now we will build a small experiment for this task or one from your business.',
  },
  {
    nav: 'The opportunity clinic', section: 'Activity 03', title: 'AI Opportunity Clinic', minutes: 1,
    say: 'Could one founder volunteer a repetitive task? Tell us what happens, how often, and how you know whether it is done well. We will choose a small task, identify the information it needs and decide who checks the result. We can use delivery enquiries as a fallback. This application is a planning worksheet with prepared examples. It does not call an AI model.',
    do: 'Invite one volunteer and limit their description to 30 seconds. Keep details non-confidential. For a large group, use the prepared delivery example and invite pairs to create their own version afterwards.',
    ask: 'Which repetitive task would you like your team to spend less time on?',
    takeaway: 'A suitable pilot has a clear input, output and human owner.',
    transition: 'Let’s fill in the worksheet and estimate the time involved.',
  },
  {
    nav: 'Build the experiment', section: 'Activity 03', title: 'A small experiment for your business', minutes: 4,
    say: 'Choose one example or enter your own task. Identify the source information, the proposed workflow, who reviews it and how we measure quality. For the example, suppose we handle one hundred enquiries a month. If average handling time falls from six minutes to three, including review, that releases five hours. At an assumed three hundred rupees per hour, that is fifteen hundred rupees of capacity value. After a hypothetical five hundred rupee monthly tool cost, the net capacity value is one thousand rupees. This is an estimate, not observed savings or guaranteed cash savings.',
    do: 'Use the volunteer’s task or Delivery questions. Read all plan fields aloud. Let the audience suggest volume, baseline time and pilot time. Include review time in the pilot estimate. If the pilot is slower or more expensive, keep the negative result and discuss whether it is worthwhile. Complete all five custom fields before opening the plan.',
    ask: 'What would make this experiment useful? What could go wrong? Would a simple rule solve it first?',
    takeaway: 'An estimate becomes credible only after measurement and quality checks.',
    transition: 'The worksheet now gives us a concrete pilot brief.',
  },
  {
    nav: 'The pilot brief', section: 'Activity 03', title: 'A pilot with a clear measure', minutes: 2,
    say: 'For a suggested seven-day pilot, use an approved sample and compare with the current workflow. Agree the quality measure before starting. Keep a person responsible for checking outputs. Record the time including review, tool costs and mistakes. Continue only if the result improves the task without unacceptable errors. The first week may reveal that the data needs cleaning or that a simple rule is enough.',
    do: 'Read the generated brief, then the time and cost assumptions. Ask the volunteer to name an owner and a stop condition. Explain that the seven-day plan is a suggested structure, not a promise that every task can be assessed in seven days.',
    ask: 'Who owns the pilot? What result would make you stop or revise it?',
    takeaway: 'The pilot tests an assumption with measured effort and a quality threshold.',
    transition: 'Now everyone can turn the same approach into a useful introduction.',
  },
  {
    nav: 'Make a connection', section: 'Networking', title: 'Your next useful conversation', minutes: 3,
    say: 'Find someone you have not spoken to yet. Each person gets one minute. Say what you are building, the decision you are struggling with, and the evidence or help you need. Your partner then gets thirty seconds to suggest a useful question, introduce someone relevant or offer a concrete next step. You can exchange contact details directly if you both want to.',
    do: 'Run two 90-second rounds: 60 seconds speaking and 30 seconds responding, then swap. In a seated room, use neighbours. Invite two people to share their next step. Record only a non-confidential example in the optional field.',
    ask: 'I’m building ____. My current decision is ____. The evidence or help I need is ____.',
    takeaway: 'A clear business question makes networking more useful.',
    transition: 'We have now connected a business decision to evidence, a possible experiment and a person who can help.',
  },
  {
    nav: 'One next step', section: 'Closing', title: 'One decision to take forward', minutes: 1,
    say: 'We began with a first impression, then found the missing numbers. We listened to customers and checked the evidence. We designed a small experiment with a human check and a measure. Choose one decision in your own business where better information would help. I’m happy to discuss how data analysis or a small AI experiment could support that decision. Thank you to Millennia Events for bringing this room together.',
    do: 'Invite one or two final responses. Introduce yourself as a data analyst and AI engineer. Use the session’s ending to encourage direct conversations. Do not imply any guaranteed return or AI result.',
    ask: 'What is the next business question you will investigate?',
    takeaway: 'A useful next step names the decision, the evidence and the person responsible.',
    transition: 'We have time for questions, or we can carry the conversation into networking.',
  },
  {
    nav: 'Questions & discussion', section: 'Closing', title: 'Questions for the room', minutes: 1,
    say: 'What would you like to apply to your own business? We can discuss what data to start with, how to choose a small task, or how an investor might ask a more useful follow-up question. If a question needs confidential details, let’s take it in a separate conversation.',
    do: 'Take one or two short questions. For questions requiring investigation, say what you would verify and follow up directly if mutually agreed. Use the answer bank in the facilitator guide for common questions.',
    ask: 'Which part would you like to try first?',
    takeaway: 'The workshop is a starting point for specific follow-up conversations.',
    transition: 'Thank everyone and return the room to the organiser.',
  },
];

export const answers = [
  ['Which business is the right answer?', 'There is no definitive investment answer from these figures. DailyCup has higher gross profit and margin in the example. Ask about retention, cash needs, acquisition costs, the market and the team before reaching a decision.'],
  ['Is gross profit the money the founder takes home?', 'No. Gross profit here is revenue less direct costs. Overheads and other expenses still need to be considered.'],
  ['Does 62.5% mean most customers complain about delivery?', 'No. Five of eight messages in this selected practice sample mention delivery. We do not know how representative the sample is.'],
  ['Did AI produce the complaint classification?', 'No. This is a prepared, manually checked answer key. AI can assist with similar classification tasks, but its output needs review against the original messages.'],
  ['Can AI solve the delivery problem?', 'It could assist with analysis or communication. Improving actual delivery may require changes to stock, dispatch or courier operations. Check the cause first.'],
  ['Do these estimates prove a return on investment?', 'No. They use editable hypothetical assumptions. Time released is capacity, which may not reduce payroll or become cash savings. Check actual time, quality, setup effort and costs in a pilot.'],
  ['What if we have very little data?', 'Begin with a small, clearly defined record of the decision and its inputs. Clean spreadsheets and a consistent process may be the most useful first step.'],
  ['Do we need a paid AI tool?', 'This workshop needs no AI service. For a real pilot, compare a manual process or simple rule with an AI-assisted approach before choosing a tool.'],
];
