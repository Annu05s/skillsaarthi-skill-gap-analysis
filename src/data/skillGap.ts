// Structured data model for the Skill Gap Analysis page.
// These interfaces mirror the shape a future backend API would return.

export interface RoleContext {
  roleTitle: string;
  overallReadinessPercent: number;
  readinessNote: string;
}

export interface CompetencyGap {
  id: string;
  skillName: string;
  currentPercent: number;
  requiredPercent: number;
  /** Derived: max(required - current, 0) */
  gapPoints: number;
  status: "meets" | "gap";
  isLargestGap: boolean;
}

export interface PriorityGap {
  skillName: string;
  currentPercent: number;
  requiredPercent: number;
  gapPoints: number;
  priorityTag: string;
  explanation: string;
}

export interface GapImpact {
  skillName: string;
  areas: string[];
  summary: string;
}

export interface RecommendedCourse {
  title: string;
  provider: string;
  level: string;
  durationHours: number;
  targetSkill: string;
}

export interface PrioritizationFactor {
  label: string;
  description: string;
}

export interface ProcessStep {
  id: string;
  label: string;
  isCurrent: boolean;
}

export interface SkillGapAnalysisData {
  pageTitle: string;
  pageSubtitle: string;
  roleContext: RoleContext;
  competencyGaps: CompetencyGap[];
  priorityGap: PriorityGap;
  gapImpact: GapImpact;
  recommendedCourse: RecommendedCourse;
  prioritizationFactors: PrioritizationFactor[];
  whatIfSimulator: {
    heading: string;
    description: string;
    disclaimer: string;
  };
  processSteps: ProcessStep[];
}

export const skillGapAnalysisData: SkillGapAnalysisData = {
  pageTitle: "Skill Gap Analysis",
  pageSubtitle:
    "Understand the competencies that need improvement for your current role.",
  roleContext: {
    roleTitle: "Statistical Investigator",
    overallReadinessPercent: 72,
    readinessNote:
      "Your Skill Twin is compared with the competency requirements of your selected role to identify priority gaps.",
  },
  competencyGaps: [
    {
      id: "data-analysis",
      skillName: "Data Analysis",
      currentPercent: 82,
      requiredPercent: 80,
      gapPoints: 0,
      status: "meets",
      isLargestGap: false,
    },
    {
      id: "statistical-methods",
      skillName: "Statistical Methods",
      currentPercent: 68,
      requiredPercent: 75,
      gapPoints: 7,
      status: "gap",
      isLargestGap: false,
    },
    {
      id: "survey-design",
      skillName: "Survey Design",
      currentPercent: 54,
      requiredPercent: 75,
      gapPoints: 21,
      status: "gap",
      isLargestGap: true,
    },
    {
      id: "data-visualization",
      skillName: "Data Visualization",
      currentPercent: 61,
      requiredPercent: 70,
      gapPoints: 9,
      status: "gap",
      isLargestGap: false,
    },
    {
      id: "communication",
      skillName: "Communication",
      currentPercent: 74,
      requiredPercent: 75,
      gapPoints: 1,
      status: "gap",
      isLargestGap: false,
    },
  ],
  priorityGap: {
    skillName: "Survey Design",
    currentPercent: 54,
    requiredPercent: 75,
    gapPoints: 21,
    priorityTag: "HIGH PRIORITY",
    explanation:
      "Survey Design is currently the largest competency gap for your role and is the highest-priority area for development.",
  },
  gapImpact: {
    skillName: "Survey Design",
    summary:
      "Strengthening Survey Design directly increases your readiness across core responsibilities of the Statistical Investigator role.",
    areas: [
      "Survey planning and methodology selection",
      "Questionnaire design and validation",
      "Sampling strategy and sample size estimation",
      "Field data collection and quality control",
    ],
  },
  recommendedCourse: {
    title: "Fundamentals of Survey Design",
    provider: "iGOT Karmayogi",
    level: "Intermediate",
    durationHours: 6,
    targetSkill: "Survey Design",
  },
  prioritizationFactors: [
    {
      label: "Current Skill Level",
      description: "Your assessed competency today",
    },
    {
      label: "Role Requirement",
      description: "The level your role demands",
    },
    {
      label: "Gap Size",
      description: "The distance between the two",
    },
    {
      label: "Role Importance",
      description: "How critical the skill is",
    },
    {
      label: "Learning Priority",
      description: "Your recommended focus",
    },
  ],
  whatIfSimulator: {
    heading: "Want to see how learning could improve your readiness?",
    description:
      "Use the What-If Simulator to model how completing recommended courses could raise your competency levels and overall role readiness.",
    disclaimer:
      "Estimates are indicative and based on current assessment data.",
  },
  processSteps: [
    { id: "assessment", label: "Skill Assessment", isCurrent: false },
    { id: "twin", label: "Skill Twin", isCurrent: false },
    { id: "gap", label: "Skill Gap", isCurrent: true },
    { id: "learning", label: "Personalized Learning", isCurrent: false },
    { id: "quiz", label: "Adaptive Quiz", isCurrent: false },
    { id: "updated-twin", label: "Updated Skill Twin", isCurrent: false },
  ],
};
