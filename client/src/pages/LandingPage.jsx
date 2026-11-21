import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BrainCircuit, Zap, Target, TrendingUp, Shield, Star,
  ChevronDown, ChevronUp, ArrowRight, CheckCircle, BarChart3,
  FileSearch, Lightbulb, Users, Code2
} from 'lucide-react';

const features = [
  {
    icon: FileSearch,
    title: 'Deep Resume Analysis',
    desc: 'AI reads your resume and evaluates structure, clarity, impact, and skill relevance to give you a holistic quality score.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: Target,
    title: 'Job Description Matching',
    desc: 'Paste any job description and instantly see how your resume aligns — which keywords match and which are missing.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: TrendingUp,
    title: 'Score Breakdown',
    desc: 'Understand exactly where you excel and where to improve across structure, skills, experience descriptions, and impact.',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Lightbulb,
    title: 'Actionable Suggestions',
    desc: 'Get prioritized, specific improvement suggestions including rewritten bullet point examples you can actually use.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    desc: 'Track your resume quality over time with score history charts so you can see the impact of your improvements.',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    desc: 'Your resume content is analyzed and discarded. We do not store raw resume text or share your data with third parties.',
    color: 'bg-slate-100 text-slate-600',
  },
];

const steps = [
  { num: '01', title: 'Upload Your Resume', desc: 'Drop your PDF resume into ResumeIQ. We accept standard PDF files with selectable text.' },
  { num: '02', title: 'AI Analyzes It', desc: 'Our Gemini-powered AI reads your resume content and produces a structured quality analysis in seconds.' },
  { num: '03', title: 'Review & Improve', desc: 'Get your score, detailed feedback by section, skill gaps, and specific suggestions to make your resume stronger.' },
];

const benefits = [
  'AI-generated quality score from 0 to 100',
  'Section-by-section feedback with ratings',
  'Detected technical and soft skills',
  'Missing keyword analysis vs. job descriptions',
  'Prioritized improvement suggestions',
  'Bullet point rewrite examples',
  'Score history over multiple analyses',
  'Secure, no raw data stored',
];

const faqs = [
  {
    q: 'What does the score actually measure?',
    a: 'The score is an AI-generated estimate of your resume\'s quality across four dimensions: structure and readability, skills relevance, quality of experience descriptions, and presence of measurable impact. It is not an official ATS score — it is a helpful quality indicator.',
  },
  {
    q: 'What file types are supported?',
    a: 'Currently only PDF files with selectable text are supported. Scanned image PDFs cannot be analyzed because the text cannot be extracted.',
  },
  {
    q: 'Is my resume data stored?',
    a: 'Raw resume text is not stored after analysis. The structured analysis results (scores, feedback, suggestions) are saved to your account so you can review them later and track your progress.',
  },
  {
    q: 'How accurate is the AI analysis?',
    a: 'The analysis is powered by Google Gemini and gives generally helpful feedback based on resume writing best practices. However, it is an AI estimate, not a guarantee of interview success. Use the suggestions as guidance, not absolute rules.',
  },
  {
    q: 'Can I analyze the same resume multiple times?',
    a: 'Yes. You can re-upload an improved resume at any time. Your analysis history shows all past analyses so you can compare scores over time.',
  },
  {
    q: 'Do I need to provide a job description?',
    a: 'No. The resume-only analysis is fully functional. Adding a job description enables keyword gap analysis and job-specific skill matching as additional data points.',
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full py-5 flex items-center justify-between gap-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-800 text-base">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="pb-5 text-slate-600 leading-relaxed text-sm"
        >
          {a}
        </motion.div>
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navbar ────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <BrainCircuit className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg font-display">
              Resume<span className="text-brand-600">IQ</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm" aria-label="Site navigation">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">How It Works</a>
            <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-secondary btn-sm hidden sm:inline-flex">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ──────────────────────────────────────────────────────────── */}
      <section className="hero-gradient pt-32 pb-20 px-6 relative overflow-hidden" aria-labelledby="hero-heading">
        {/* Background blobs */}
        <div className="hero-blob w-96 h-96 bg-brand-300 top-0 -left-20" />
        <div className="hero-blob w-80 h-80 bg-purple-300 top-20 right-0" />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-8">
              <Zap className="w-3.5 h-3.5" />
              Powered by Google Gemini AI
            </div>

            <h1 id="hero-heading" className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight font-display mb-6">
              Your Resume.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">
                Smarter. Stronger.
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Get an AI-powered analysis of your resume's quality, identify skill gaps,
              and receive specific, actionable suggestions to help you stand out.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" id="cta-analyze" className="btn btn-primary btn-xl">
                Analyze My Resume
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#features" id="cta-features" className="btn btn-secondary btn-xl">
                Explore Features
              </a>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/60 overflow-hidden">
              {/* Mock dashboard header */}
              <div className="bg-slate-900 h-12 flex items-center px-5 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-4 bg-slate-700 h-6 rounded-md" />
              </div>
              {/* Mock dashboard content */}
              <div className="bg-slate-50 p-6 grid grid-cols-3 gap-4">
                <div className="col-span-3 md:col-span-1 bg-white rounded-2xl p-5 border border-slate-100 flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full border-8 border-brand-100 flex items-center justify-center">
                    <span className="text-3xl font-bold text-brand-600">82</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-600">Overall Score</span>
                  <div className="w-full space-y-2">
                    {[['Structure', 88], ['Skills', 79], ['Impact', 72]].map(([l, v]) => (
                      <div key={l} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-500">
                          <span>{l}</span><span>{v}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${v}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-3 md:col-span-2 space-y-3">
                  <div className="bg-white rounded-2xl p-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Strengths</p>
                    {['Strong technical skills section', 'Clear project descriptions', 'Good use of action verbs'].map((s) => (
                      <div key={s} className="flex items-center gap-2 py-1">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-xs text-slate-600">{s}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl p-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Key Suggestions</p>
                    <div className="text-xs text-slate-600 space-y-1.5">
                      <p>· Add measurable metrics to experience bullets</p>
                      <p>· Include a professional summary section</p>
                      <p>· Quantify your project impact</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-white" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-4xl font-bold text-slate-900 font-display mb-4">
              Everything you need to improve your resume
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              A complete toolkit for understanding and improving your resume quality using AI analysis.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="card p-6 hover:scale-[1.01] transition-transform cursor-default"
              >
                <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50" aria-labelledby="how-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="how-heading" className="text-4xl font-bold text-slate-900 font-display mb-4">How It Works</h2>
            <p className="text-lg text-slate-500">Three steps to a stronger resume.</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-brand-300 to-purple-300 hidden md:block" aria-hidden="true" />
            <div className="space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 items-start"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                    {step.num}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Benefits ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-900" aria-labelledby="benefits-heading">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="benefits-heading" className="text-4xl font-bold text-white font-display mb-4">
              What you get with ResumeIQ
            </h2>
            <p className="text-slate-400 text-lg">Comprehensive AI feedback in every analysis.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 bg-white/5 rounded-xl px-5 py-4 border border-white/10"
              >
                <CheckCircle className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <span className="text-slate-200 text-sm font-medium">{b}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/register" className="btn btn-primary btn-xl">
              Start Your Free Analysis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6 bg-white" aria-labelledby="faq-heading">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-4xl font-bold text-slate-900 font-display mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500">Common questions about ResumeIQ.</p>
          </div>
          <div className="card p-6">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white font-display">
              Resume<span className="text-brand-400">IQ</span>
            </span>
          </div>
          <p className="text-sm text-center">
            AI-powered resume analysis. Scores are estimates, not official ATS ratings. Use suggestions as guidance.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
