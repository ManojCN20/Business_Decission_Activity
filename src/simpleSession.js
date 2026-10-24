import { reviews } from './session.js';

export const simpleTimings = {
  5: [10, 25, 35, 30, 25, 30, 40, 35, 25, 20, 25],
  7: [15, 40, 45, 50, 30, 35, 55, 45, 35, 30, 40],
  10: [25, 55, 55, 80, 55, 55, 85, 55, 50, 25, 60],
};

// Fictional monthly direct costs. The improvement is an assumption, not a measured client result.
export const improvementCosts = [
  { label: 'Product and other direct costs', before: 550000, after: 550000 },
  { label: 'Normal delivery and packaging', before: 100000, after: 120000 },
  { label: 'Replacement and urgent dispatch', before: 300000, after: 30000 },
];
const beforeCosts = improvementCosts.reduce((total, row) => total + row.before, 0);
const afterCosts = improvementCosts.reduce((total, row) => total + row.after, 0);
export const businessCase = {
  a: { letter: 'A', name: 'BrewBox', sales: 1000000, beforeCosts, afterCosts, beforeProfit: 1000000 - beforeCosts, afterProfit: 1000000 - afterCosts },
  b: { letter: 'B', name: 'DailyCup', sales: 600000, beforeCosts: 360000, afterCosts: 360000, beforeProfit: 240000, afterProfit: 240000 },
};
export const feedbackMessages = reviews;
export const feedbackAnalysis = ['Delivery', 'Packaging', 'Billing'].map(theme => {
  const matching = reviews.filter(review => review.theme === theme);
  return { theme, count: matching.length, ids: matching.map(review => review.id) };
});

export const simpleSlides = [
  {
    title: 'Better business decisions', kind: 'cover', label: 'A short talk with a customer feedback story',
    say: 'Good evening. I’m Manoj, a data analyst and AI engineer. We will choose between two fictional businesses, listen to customer feedback, and see how a business change could improve its numbers. I will ask for your choice again after we have more evidence.',
    action: 'Introduce yourself. Explain that everyone can participate by raising a hand.',
    cue: 'The businesses, feedback and improvement figures are fictional teaching examples. The opening photo is from a past event on the organiser’s website: https://millenniaevents.in/images/bengaluru/guests-group.webp',
  },
  {
    title: 'Which business would you choose?', kind: 'choice', label: 'Round 1 / monthly sales only',
    say: 'Here are two fictional coffee subscription businesses. BrewBox makes ten lakh rupees in monthly sales. DailyCup makes six lakh. Which founder would you meet first? Raise your hand for A, then B, or if you need more information. Could one person explain their choice in one sentence?',
    action: 'Show only sales. Take a show of hands and one brief explanation. Then click Next.',
    cue: 'Everyone can choose the same business. The activity still works.',
  },
  {
    title: 'The costs change the picture', kind: 'reveal', label: 'Round 2 / sales and direct costs',
    say: 'BrewBox has nine point five lakh in direct costs, leaving fifty thousand rupees of gross profit. DailyCup has three point six lakh in direct costs, leaving two point four lakh. Gross profit means sales minus direct costs, before other expenses. Who would change their choice now? Next, let’s investigate why BrewBox has such high costs.',
    action: 'Read the two subtraction results. Take a second show of hands. Move straight into the feedback example.',
    cue: 'DailyCup has higher gross profit here. We still need more evidence to assess an investment.',
  },
  {
    title: 'What are BrewBox customers saying?', kind: 'feedback', label: 'Audience activity / customer feedback',
    say: 'BrewBox shares eight selected complaint messages. Read them and tell me which issue appears most often: delivery, packaging or billing. Take twenty seconds to look. Which issue would you investigate first, and which messages support your answer?',
    action: 'Give 20 seconds to read. Take a show of hands for delivery, packaging and billing. Invite one person to cite a message. Click Next to reveal the analysis.',
    cue: 'These are eight selected fictional complaints, not a representative survey of all customers.',
  },
  {
    title: 'The feedback points to delivery', kind: 'analysis', label: 'Prepared analysis / eight selected messages',
    say: 'Five messages mention delivery, two mention packaging and one mentions billing. Delivery is the most frequent theme in this sample. That gives us a place to investigate. It does not yet prove the cause or the cost. We should check order dates, damaged parcels and replacement dispatch records. The single billing complaint could also be serious.',
    action: 'Read the counts and point to the supporting message IDs. Explain that feedback gives a clue, while operating records help verify it.',
    cue: 'Five of eight means 62.5% of this selected sample, not 62.5% of all customers. The classification is a prepared answer key.',
  },
  {
    title: 'A business change based on evidence', kind: 'change', label: 'The fictional business response',
    lines: [
      ['Verify the problem', 'Check delivery dates and extra replacement dispatches.'],
      ['Try an improvement', 'Test a more reliable courier and stronger packaging.'],
      ['Measure what changes', 'Track delivery reliability, replacement costs and gross profit.'],
    ],
    say: 'For our fictional example, assume the records confirm that delivery and packaging failures create expensive replacements and urgent dispatches. BrewBox tests a more reliable courier and stronger packaging. Normal delivery and packaging become a little more expensive. But suppose the cost of replacements and urgent dispatches falls. Let’s look at what those assumptions would mean in the monthly accounts.',
    action: 'Explain the operational change. Make clear that the courier and packaging change the operation, while the data helps identify and evaluate the change.',
    cue: 'Feedback analysis or AI alone does not increase profit. The change has to work, and the accounts must confirm the result. The coffee packaging image is an AI-generated illustration of the fictional case.',
  },
  {
    title: 'The assumed result: higher gross profit', kind: 'impact', label: 'Fictional before-and-after / monthly figures',
    say: 'In this illustrative result, monthly sales stay at ten lakh rupees. Product and other direct costs stay at five point five lakh. Normal delivery and packaging rise from one lakh to one point two lakh. Replacement and urgent dispatch costs fall from three lakh to thirty thousand. Total direct costs therefore fall from nine point five lakh to seven lakh. Gross profit rises from fifty thousand rupees to three lakh. The net cost reduction is two point five lakh. These are fictional assumptions to explain the calculation, not a guaranteed result.',
    action: 'Read the cost rows, then the gross profit row. Emphasise that sales stay the same and the profit increase comes from a net reduction in direct costs.',
    cue: 'The assumed ₹2.7 lakh reduction in replacement costs, less ₹20,000 of extra delivery and packaging cost, gives ₹2.5 lakh more gross profit. A real business must verify costs in comparable periods.',
  },
  {
    title: 'Which business would you choose now?', kind: 'rechoice', label: 'Round 3 / after the fictional improvement',
    say: 'Now compare them again. In our scenario, BrewBox has ten lakh in sales and three lakh in gross profit. DailyCup still has six lakh in sales and two point four lakh in gross profit. Who would choose A now? Who would choose B? Who wants more information? What changed your mind? We have a stronger reason to investigate BrewBox, but these figures still do not establish an investment winner.',
    action: 'Take a final show of hands and one explanation. Ask people to name the specific evidence behind their choice. Accept “I need more information”.',
    cue: 'DailyCup still has a higher gross margin: 40% versus BrewBox’s 30%. Retention, cash needs, risk and valuation also matter. Do not force a winning answer.',
  },
  {
    title: 'Where data and AI helped', kind: 'ai', label: 'A practical role for your skills',
    lines: [
      ['AI can assist with the feedback', 'Group comments by issue, with a person checking the labels.'],
      ['Data analysis checks the business', 'Verify costs and compare results with the baseline.'],
      ['The business acts and measures', 'Test operational changes and check whether the result lasts.'],
    ],
    say: 'AI can assist by grouping large amounts of customer feedback, and a person should check its classifications. Data analysis connects those clues with delivery records and actual costs. The founder chooses an operational change and checks the result. This application shows a prepared classification and an illustrative calculation. It does not run an AI model or show a measured client result.',
    action: 'Connect your data analyst and AI engineer background to the example. Keep the explanation brief.',
    cue: 'Explain the sequence: feedback suggests a problem, records verify it, a business change addresses it, and financial data checks the outcome.',
  },
  {
    title: 'Business decisions need evidence', kind: 'close', label: 'Your takeaway',
    lines: ['Gut feeling alone is not enough.', 'Use financial data and customer feedback to test your assumptions.', 'Then make an informed decision and review the result.'],
    say: 'Our first choice used a first impression. Costs changed the picture. Customer feedback helped identify a problem to investigate, and the revised cost figures changed the comparison again. The message is simple: do not rely on gut feeling alone for business or investment decisions. Use data to test your assumptions, apply your judgement and review what happens. Now let’s connect that idea to the people in this room.',
    action: 'Read the takeaway. Invite the room to think of one decision where better evidence would help.',
    cue: 'Data supports judgement. It does not remove uncertainty or guarantee a successful business or investment.',
  },
  {
    title: 'Where businesses meet investors', kind: 'connection', label: 'Millenial Events / the next conversation',
    lines: [
      ['For businesses', 'Meet potential investors, present your progress and explain the support you need.'],
      ['For investors', 'Meet founders, understand their businesses and explore the evidence behind their ideas.'],
    ],
    say: 'Good information helps us ask better questions. Millenial Events brings founders, investors and industry leaders into the same room so those conversations can begin. If you run a business, share what you are building, your progress and the support you need. If you are an investor, meet the founders, understand their business and ask about the evidence behind their plans. Curated introductions and founder conversations create an opportunity to explore whether there is a fit. Start with one useful introduction today. Thank you.',
    action: 'Explain both directions of the connection. Invite businesses and investors to introduce themselves, share their interests and arrange a useful follow-up conversation.',
    cue: 'Source: https://millenniaevents.in/ describes curated introductions, founder spotlights and investor connects. Photo: https://millenniaevents.in/images/mandya/conversations.webp . Introductions create opportunities, without promising funding or investment returns.',
  },
];

