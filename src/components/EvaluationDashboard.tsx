import React, { useEffect, useState } from 'react';
import { EvaluationResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, AlertTriangle, Target, Briefcase, Award, Calendar, Zap } from 'lucide-react';
import { getQuickSummary } from '../services/geminiService';

interface EvaluationDashboardProps {
  result: EvaluationResult;
}

export function EvaluationDashboard({ result }: EvaluationDashboardProps) {
  const [quickSummary, setQuickSummary] = useState<string | null>(null);

  useEffect(() => {
    getQuickSummary(result).then(setQuickSummary).catch(console.error);
  }, [result]);

  const scoreData = [
    { name: 'DSA', score: result.score_breakdown.dsa_strength, max: 20 },
    { name: 'Dev', score: result.score_breakdown.development_skill, max: 20 },
    { name: 'System Design', score: result.score_breakdown.system_design_awareness, max: 15 },
    { name: 'Projects', score: result.score_breakdown.project_quality, max: 20 },
    { name: 'Practical', score: result.score_breakdown.practical_exposure, max: 15 },
    { name: 'Market', score: result.score_breakdown.market_competitiveness, max: 10 },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };

  const getBarColor = (score: number, max: number) => {
    const ratio = score / max;
    if (ratio >= 0.8) return '#10b981'; // emerald-500
    if (ratio >= 0.6) return '#f59e0b'; // amber-500
    return '#ef4444'; // rose-500
  };

  return (
    <div className="space-y-6">
      {/* Top Section: Score & Salary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Score */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Job Readiness Score</h3>
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-zinc-100"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={351.858}
                strokeDashoffset={351.858 - (351.858 * result.job_readiness_score) / 100}
                className={getScoreColor(result.job_readiness_score).replace('text-', 'text-')}
                strokeLinecap="round"
              />
            </svg>
            <span className={`absolute text-4xl font-bold ${getScoreColor(result.job_readiness_score)}`}>
              {result.job_readiness_score}
            </span>
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-700">
            {result.competitive_positioning.level}
          </p>
        </div>

        {/* Salary Prediction & Quick Summary */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Quick Summary */}
          {quickSummary && (
            <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100 flex items-start">
              <div className="bg-indigo-100 p-2 rounded-lg mr-4 flex-shrink-0">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-900 mb-1">AI Quick Summary</h3>
                <p className="text-sm text-indigo-800 leading-relaxed">{quickSummary}</p>
              </div>
            </div>
          )}

          {/* Salary Prediction */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200 flex-1">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-zinc-700 mr-2" />
              <h3 className="text-lg font-semibold text-zinc-900">Salary Prediction (CTC)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                <div className="text-xs font-medium text-zinc-500 uppercase mb-1">Current</div>
                <div className="text-xl font-bold text-zinc-900">{result.salary_prediction.current_ctc_range}</div>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="text-xs font-medium text-emerald-600 uppercase mb-1">12-Month Projection</div>
                <div className="text-xl font-bold text-emerald-900">{result.salary_prediction['12_month_projection']}</div>
              </div>
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <div className="text-xs font-medium text-indigo-600 uppercase mb-1">24-Month Projection</div>
                <div className="text-xl font-bold text-indigo-900">{result.salary_prediction['24_month_projection']}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Breakdown & Positioning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Breakdown Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
          <div className="flex items-center mb-6">
            <Target className="w-5 h-5 text-zinc-700 mr-2" />
            <h3 className="text-lg font-semibold text-zinc-900">Skill Breakdown</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" domain={[0, 20]} hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#52525b' }} />
                <Tooltip
                  cursor={{ fill: '#f4f4f5' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.score, entry.max)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competitive Positioning */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
          <div className="flex items-center mb-4">
            <Award className="w-5 h-5 text-zinc-700 mr-2" />
            <h3 className="text-lg font-semibold text-zinc-900">Competitive Positioning</h3>
          </div>
          <div className="inline-flex px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-semibold mb-4">
            {result.competitive_positioning.level}
          </div>
          <ul className="space-y-3">
            {result.competitive_positioning.reasoning.map((reason, idx) => (
              <li key={idx} className="flex items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 mr-2 flex-shrink-0" />
                <span className="text-sm text-zinc-700 leading-relaxed">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Critical Skill Gaps */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
        <div className="flex items-center mb-6">
          <AlertTriangle className="w-5 h-5 text-rose-500 mr-2" />
          <h3 className="text-lg font-semibold text-zinc-900">Critical Skill Gaps</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.critical_skill_gaps.map((gap, idx) => (
            <div key={idx} className="bg-rose-50/50 rounded-xl p-4 border border-rose-100">
              <h4 className="font-semibold text-rose-900 mb-2">{gap.gap}</h4>
              <div className="space-y-2 text-sm">
                <p><strong className="text-rose-800">Why it matters:</strong> <span className="text-zinc-700">{gap.why_it_matters}</span></p>
                <p><strong className="text-rose-800">Risk:</strong> <span className="text-zinc-700">{gap.risk_if_ignored}</span></p>
                <p><strong className="text-emerald-700">Fix:</strong> <span className="text-zinc-700">{gap.improvement_direction}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6-Month Roadmap */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-200">
        <div className="flex items-center mb-6">
          <Calendar className="w-5 h-5 text-zinc-700 mr-2" />
          <h3 className="text-lg font-semibold text-zinc-900">6-Month Actionable Roadmap</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Month 1-2 */}
          <div className="relative pl-6 border-l-2 border-zinc-200 flex flex-col gap-4">
            <div className="absolute w-3 h-3 bg-zinc-400 rounded-full -left-[7px] top-1" />
            <h4 className="font-bold text-zinc-900">Months 1–2</h4>
            
            <div>
              <h5 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Action Items</h5>
              <ul className="space-y-2">
                {result.six_month_roadmap.month_1_2.actions.map((item, idx) => (
                  <li key={idx} className="text-sm text-zinc-600 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100">
              <h5 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2 flex items-center">
                <Target className="w-3 h-3 mr-1" /> Interview Prep
              </h5>
              <ul className="space-y-2">
                {result.six_month_roadmap.month_1_2.interview_prep_tips.map((item, idx) => (
                  <li key={idx} className="text-sm text-indigo-800 flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Month 3-4 */}
          <div className="relative pl-6 border-l-2 border-zinc-200 flex flex-col gap-4">
            <div className="absolute w-3 h-3 bg-zinc-400 rounded-full -left-[7px] top-1" />
            <h4 className="font-bold text-zinc-900">Months 3–4</h4>
            
            <div>
              <h5 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Action Items</h5>
              <ul className="space-y-2">
                {result.six_month_roadmap.month_3_4.actions.map((item, idx) => (
                  <li key={idx} className="text-sm text-zinc-600 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100">
              <h5 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2 flex items-center">
                <Target className="w-3 h-3 mr-1" /> Interview Prep
              </h5>
              <ul className="space-y-2">
                {result.six_month_roadmap.month_3_4.interview_prep_tips.map((item, idx) => (
                  <li key={idx} className="text-sm text-indigo-800 flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Month 5-6 */}
          <div className="relative pl-6 border-l-2 border-zinc-200 flex flex-col gap-4">
            <div className="absolute w-3 h-3 bg-zinc-400 rounded-full -left-[7px] top-1" />
            <h4 className="font-bold text-zinc-900">Months 5–6</h4>
            
            <div>
              <h5 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Action Items</h5>
              <ul className="space-y-2">
                {result.six_month_roadmap.month_5_6.actions.map((item, idx) => (
                  <li key={idx} className="text-sm text-zinc-600 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100">
              <h5 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2 flex items-center">
                <Target className="w-3 h-3 mr-1" /> Interview Prep
              </h5>
              <ul className="space-y-2">
                {result.six_month_roadmap.month_5_6.interview_prep_tips.map((item, idx) => (
                  <li key={idx} className="text-sm text-indigo-800 flex items-start">
                    <span className="mr-2 text-indigo-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
