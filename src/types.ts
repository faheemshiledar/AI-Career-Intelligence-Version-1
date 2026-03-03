export interface ScoreBreakdown {
  dsa_strength: number;
  development_skill: number;
  system_design_awareness: number;
  project_quality: number;
  practical_exposure: number;
  market_competitiveness: number;
}

export interface SalaryPrediction {
  current_ctc_range: string;
  "12_month_projection": string;
  "24_month_projection": string;
}

export interface CriticalSkillGap {
  gap: string;
  why_it_matters: string;
  risk_if_ignored: string;
  improvement_direction: string;
}

export interface CompetitivePositioning {
  level: string;
  reasoning: string[];
}

export interface RoadmapPhase {
  actions: string[];
  interview_prep_tips: string[];
}

export interface SixMonthRoadmap {
  month_1_2: RoadmapPhase;
  month_3_4: RoadmapPhase;
  month_5_6: RoadmapPhase;
}

export interface EvaluationResult {
  job_readiness_score: number;
  score_breakdown: ScoreBreakdown;
  salary_prediction: SalaryPrediction;
  critical_skill_gaps: CriticalSkillGap[];
  competitive_positioning: CompetitivePositioning;
  six_month_roadmap: SixMonthRoadmap;
}

export interface ProfileData {
  education: string;
  skills: string;
  github: string;
  leetcode: string;
  projects: string;
  internships: string;
  certifications: string;
  careerGoal: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
