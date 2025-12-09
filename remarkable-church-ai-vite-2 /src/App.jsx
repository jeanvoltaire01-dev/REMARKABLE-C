import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Minimal shadcn-style stand-ins so the prototype renders without external setup
const Button = ({ className = "", children, ...props }) => (
  <button
    className={`px-4 py-2 rounded-2xl shadow-sm border text-sm hover:shadow transition ${className}`}
    {...props}
  >
    {children}
  </button>
);
const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl border shadow-sm p-5 bg-white ${className}`}>{children}</div>
);
const Input = (props) => (
  <input
    {...props}
    className={`w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ${props.className || ""}`}
  />
);
const Select = ({ value, onChange, children }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full rounded-xl border px-3 py-2"
  >
    {children}
  </select>
);

// --- Demo data (replace with live APIs later) ---
const demoZip = "74133";
const demoCommunity = {
  zip: demoZip,
  population: 47000,
  youthPct: 0.18,
  youthRange: "13–24",
  schools: [
    { name: "Union High School", distance: "2.1 mi" },
    { name: "Jenks High School", distance: "4.0 mi" },
    { name: "Memorial High School", distance: "3.8 mi" },
  ],
  notes: [
    "Weeknight sports and part‑time jobs compress availability",
    "High smartphone use → short, clear comms win",
    "Parent partnership improves retention",
  ],
};

const budgetPresets = {
  lean: {
    label: "Lean ($0–$500 / 6mo)",
    suggestions: [
      "Snacks + printables",
      "Google Forms sign‑ups",
      "Manual text follow‑ups",
    ],
  },
  standard: {
    label: "Standard ($500–$2k / 6mo)",
    suggestions: [
      "Monthly pizza night",
      "Two outreach events",
      "Basic texting platform",
    ],
  },
  robust: {
    label: "Robust ($2k–$10k / 6mo)",
    suggestions: [
      "Monthly rallies + swag",
      "Targeted local ads",
      "Transportation subsidies",
    ],
  },
};

function Progress({ step }) {
  const items = ["Start", "Profile", "Snapshot", "Plan", "Coach"];
  return (
    <div className="grid grid-cols-5 gap-2 mb-4">
      {items.map((label, idx) => (
        <div key={label} className={`h-2 rounded-full ${idx <= step ? "bg-black" : "bg-gray-200"}`}></div>
      ))}
      <div className="text-xs col-span-5 text-gray-500 mt-1">Step {step + 1} of {items.length} — {items[step]}</div>
    </div>
  );
}

function KeyMetric({ label, value, sub }) {
  return (
    <Card>
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {sub && <div className="text-sm text-gray-500 mt-1">{sub}</div>}
    </Card>
  )
}

function MonthSection({ month, title, tasks }){
  return (
    <Card className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Month {month}: {title}</div>
      </div>
      <ul className="list-disc pl-5 space-y-2">
        {tasks.map((t, i) => (
          <li key={i} className="leading-snug">
            <span className="font-medium">{t.label}</span>
            {t.meta && <span className="text-gray-500"> — {t.meta}</span>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [zip, setZip] = useState("");
  const [profile, setProfile] = useState({
    churchSize: "",
    youthCount: "",
    budget: "standard",
    challenge: "retain",
    style: "mixed",
  });
  const [showCoach, setShowCoach] = useState(false);

  const estimatedYouth = useMemo(() => Math.round(demoCommunity.population * demoCommunity.youthPct), []);

  const plan = useMemo(() => {
    const target = Math.max(20, Math.ceil((Number(profile.youthCount || 0) || 12) * 1.8));
    return {
      goals: {
        attendance: target,
        mentors: Math.ceil(target / 6),
        firstTimers: Math.ceil(target * 1.5),
      },
      months: [
        {
          title: "Foundation & Welcome",
          tasks: [
            { label: "Launch Bring‑a‑Friend night", meta: "wk2 • $40 supplies" },
            { label: "Start 2–3 small groups", meta: "6–8 per group" },
            { label: "Recruit & screen mentors", meta: `${Math.ceil(target/6)} needed` },
            { label: "Parent intro email + weekly recap", meta: "$0" },
          ],
        },
        {
          title: "Belonging Systems",
          tasks: [
            { label: "Train greeters + Sit‑with‑Me role" },
            { label: "3‑touch follow‑up for new students" },
            { label: "Service project lite (1.5h)", meta: "snack packs" },
            { label: "Parent Night #1 (Q&A)" },
          ],
        },
        {
          title: "Leaders & Stories",
          tasks: [
            { label: "Mentor huddles (bi‑weekly)" },
            { label: "Story Night #1" },
            { label: "4‑week micro‑series", meta: "20‑min talk + 25‑min groups" },
          ],
        },
        {
          title: "Community & Momentum",
          tasks: [
            { label: "Outreach event with stations", meta: "invite nearby churches" },
            { label: "Add 1–2 small groups" },
            { label: "Follow‑ups within 48 hours" },
          ],
        },
        {
          title: "Depth & Ownership",
          tasks: [
            { label: "Service project #2 (student‑led)" },
            { label: "Student leadership team", meta: "media/prayer/service/welcome" },
            { label: "Story Night #2 (parents invited)" },
          ],
        },
        {
          title: "Celebrate & Multiply",
          tasks: [
            { label: "Faith‑step class + celebration Sunday" },
            { label: "Evaluate metrics & plan next 6‑mo" },
            { label: "Recruit next mentor cohort" },
          ],
        },
      ],
    };
  }, [profile.youthCount]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold">✝︎</div>
            <div className="font-semibold">ReMarkable Church AI — Project 13</div>
          </div>
          <div className="text-xs text-gray-500">Prototype v0.1</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <Progress step={step} />

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="start" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}}>
                <Card className="space-y-4">
                  <div className="text-2xl font-bold">Welcome, Pastor 👋</div>
                  <p className="text-gray-600">Scan from your book → you’re here. Enter your ZIP to generate a local, 6‑month plan aligned to Project 13. You can use demo ZIP <span className="font-mono">{demoZip}</span> to explore.</p>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <Input placeholder="Enter ZIP code" value={zip} onChange={(e)=>setZip(e.target.value)} />
                    </div>
                    <Button className="bg-black text-white" onClick={()=>{ setZip(zip || demoZip); setStep(1); }}>Start</Button>
                  </div>
                  <div className="text-xs text-gray-500">By continuing you agree to basic data use for plan generation. Student safety & privacy policies apply.</div>
                </Card>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="profile" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}}>
                <Card className="space-y-4">
                  <div className="text-xl font-semibold">Church Profile</div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm mb-1">Approx. church size</div>
                      <Input type="number" placeholder="e.g., 250" value={profile.churchSize} onChange={e=>setProfile({...profile, churchSize: e.target.value})} />
                    </div>
                    <div>
                      <div className="text-sm mb-1">Active youth last month</div>
                      <Input type="number" placeholder="e.g., 12" value={profile.youthCount} onChange={e=>setProfile({...profile, youthCount: e.target.value})} />
                    </div>
                    <div>
                      <div className="text-sm mb-1">Budget level (6 months)</div>
                      <Select value={profile.budget} onChange={(e)=>setProfile({...profile, budget: e.target.value})}>
                        <option value="lean">Lean</option>
                        <option value="standard">Standard</option>
                        <option value="robust">Robust</option>
                      </Select>
                    </div>
                    <div>
                      <div className="text-sm mb-1">Primary challenge</div>
                      <Select value={profile.challenge} onChange={(e)=>setProfile({...profile, challenge: e.target.value})}>
                        <option value="attract">Attract</option>
                        <option value="retain">Retain</option>
                        <option value="disciple">Disciple</option>
                        <option value="volunteers">Volunteers</option>
                        <option value="parents">Parents</option>
                      </Select>
                    </div>
                    <div>
                      <div className="text-sm mb-1">Worship style</div>
                      <Select value={profile.style} onChange={(e)=>setProfile({...profile, style: e.target.value})}>
                        <option value="traditional">Traditional</option>
                        <option value="contemporary">Contemporary</option>
                        <option value="mixed">Mixed</option>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={()=>setStep(0)} className="">Back</Button>
                    <Button onClick={()=>setStep(2)} className="bg-black text-white">Continue</Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="snapshot" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}}>
                <Card className="space-y-4">
                  <div className="text-xl font-semibold">Community Snapshot — {zip || demoZip}</div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <KeyMetric label="Population" value={demoCommunity.population.toLocaleString()} />
                    <KeyMetric label={`Youth (${demoCommunity.youthRange})`} value={`${estimatedYouth.toLocaleString()}`} sub={`${Math.round(demoCommunity.youthPct*100)}% of pop.`} />
                    <KeyMetric label="Local Schools" value={`${demoCommunity.schools.length}`} sub="within ~5 miles" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                      <div className="text-sm font-semibold mb-2">Nearby Schools</div>
                      <ul className="space-y-1 text-sm">
                        {demoCommunity.schools.map((s)=> (
                          <li key={s.name} className="flex items-center justify-between">
                            <span>{s.name}</span>
                            <span className="text-gray-500">{s.distance}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                    <Card>
                      <div className="text-sm font-semibold mb-2">Context Notes</div>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {demoCommunity.notes.map((n, i)=>(<li key={i}>{n}</li>))}
                      </ul>
                    </Card>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button onClick={()=>setStep(1)}>Back</Button>
                    <Button className="bg-black text-white" onClick={()=>setStep(3)}>Generate 6‑Month Plan</Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="plan" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}}>
                <Card className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold">Six‑Month Plan (Auto‑Generated)</div>
                    <Button onClick={()=>setShowCoach(true)} className="bg-black text-white">Ask Coach</Button>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <KeyMetric label="Target Weekly Attendance" value={plan.goals.attendance} />
                    <KeyMetric label="Mentors (screened)" value={plan.goals.mentors} />
                    <KeyMetric label="First‑time Visitors (6mo)" value={plan.goals.firstTimers} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {plan.months.map((m, i)=> (
                      <MonthSection key={i} month={i+1} title={m.title} tasks={m.tasks} />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button onClick={()=>setStep(2)}>Back</Button>
                    <Button className="bg-black text-white" onClick={()=>setStep(4)}>Continue to Coach</Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="coach" initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-8}}>
                <Card className="space-y-4">
                  <div className="text-xl font-semibold">Coach Remark — Weekly Guidance</div>
                  <p className="text-gray-600 text-sm">Ask for next steps, templates, or quick wins. Example: “We have 12 students and 2 leaders — what should we do this week?”</p>

                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="md:col-span-2 space-y-3">
                      <div className="text-sm font-semibold">This Week — 3 Options</div>
                      <ol className="list-decimal pl-5 space-y-2 text-sm">
                        <li>Prep a simple Bring‑a‑Friend night (run‑of‑show included).</li>
                        <li>Send parent intro + 2‑sentence recap template.</li>
                        <li>Launch 2 small groups (6–8 per group) with 20‑min talk / 25‑min discussion.</li>
                      </ol>
                      <div className="text-sm font-semibold">Ready‑to‑Use Assets</div>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>📄 Run‑of‑Show (printable)</li>
                        <li>✉️ Parent Intro Email</li>
                        <li>💬 48‑hour Follow‑up Text</li>
                      </ul>
                    </Card>

                    <Card>
                      <div className="text-sm font-semibold mb-2">Budget Guidance</div>
                      <div className="text-sm text-gray-700 mb-2">Preset: {budgetPresets[profile.budget]?.label}</div>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {budgetPresets[profile.budget]?.suggestions.map((s, i)=> (<li key={i}>{s}</li>))}
                      </ul>
                    </Card>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button onClick={()=>setStep(3)}>Back</Button>
                    <Button className="bg-black text-white">Export PDF</Button>
                    <Button>Share with Team</Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <Card>
            <div className="text-sm font-semibold mb-2">How this prototype works</div>
            <ol className="list-decimal pl-5 text-sm space-y-1">
              <li>Start with ZIP (use {demoZip} for demo).</li>
              <li>Fill the brief profile.</li>
              <li>Review the Snapshot for your area.</li>
              <li>Generate the Six‑Month Plan.</li>
              <li>Open Coach for weekly guidance & assets.</li>
            </ol>
          </Card>

          <Card>
            <div className="text-sm font-semibold mb-2">Next build steps</div>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Connect live demographics (Census & schools API).</li>
              <li>Embed book content vectors for on‑brand coaching.</li>
              <li>Add PDF export + email/text templates.</li>
              <li>Role‑based access + team sharing.</li>
            </ul>
          </Card>
        </div>
      </div>

      <footer className="py-10 text-center text-xs text-gray-400">ReMarkable Church AI — Project 13 • Demo prototype</footer>
    </div>
  );
}