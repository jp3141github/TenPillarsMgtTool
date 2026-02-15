import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CORPORATE_MAPPINGS = [
  {
    jobSpec: 'Lead Lloyd\'s reporting delivery incl Solvency UK, to timetable; present to Committees for review/sign-off',
    category: 'BAU / Deadlines + Communication + Governance/Controls',
    practice: 'Critical path ownership + committee-ready narrative + evidence pack',
  },
  {
    jobSpec: 'Manage Munich Group reporting delivery to group requirements; present to senior management for challenge/sign-off',
    category: 'BAU / Deadlines + Stakeholder Mgmt + Communication',
    practice: '"No surprises" governance with senior challenge handled cleanly',
  },
  {
    jobSpec: 'Manage IFRS 17 actuarial data submissions; ensure data quality + validations; review/validate BS & P&L items; present to Local + Group incl analysis of change',
    category: 'Governance/Controls + Risk Mgmt/Delivery Assurance + Communication + Stakeholder Mgmt',
    practice: 'This is the control tower: validation, movement explain, sign-off readiness',
  },
  {
    jobSpec: 'Review work by line reports/colleagues; share feedback/knowledge',
    category: 'Continuous Improvement/Development (and really \'People capability\')',
    practice: 'Reduce key-person risk; standardise outputs; uplift quality bar',
  },
  {
    jobSpec: 'Manage day-to-day workflow of reporting staff; oversee training needs',
    category: 'BAU / Deadlines + Continuous Improvement/Development',
    practice: 'Capacity management, prioritisation, coaching, resilience',
  },
  {
    jobSpec: 'Build strong relationships outside Actuarial (e.g. Finance) to build confidence; joined-up CFO approach',
    category: 'Stakeholder Mgmt + Communication',
    practice: 'Pre-wire decisions, align expectations, reduce friction at sign-off',
  },
  {
    jobSpec: 'Monitor data quality across the process (incl fast-close) and escalate key points',
    category: 'Risk Mgmt/Delivery Assurance + Governance/Controls',
    practice: 'Escalate-by-exception with thresholds; prevent late-stage blow-ups',
  },
  {
    jobSpec: 'Develop reporting infrastructure + ML; deliver process automation to support accelerated timetables',
    category: 'Continuous Improvement/Development',
    practice: 'Make each close cheaper, faster, safer',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  'BAU / Deadlines': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  'Communication': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  'Governance/Controls': 'bg-slate-100 text-slate-800 dark:bg-slate-700/40 dark:text-slate-300',
  'Stakeholder Mgmt': 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  'Risk Mgmt/Delivery Assurance': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  'Continuous Improvement/Development': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
};

function CategoryBadges({ category }: { category: string }) {
  const parts = category.split(' + ').map(p => p.trim());
  return (
    <div className="flex flex-wrap gap-1">
      {parts.map((part, i) => {
        const baseKey = Object.keys(CATEGORY_COLORS).find(k => part.startsWith(k));
        const colorClass = baseKey ? CATEGORY_COLORS[baseKey] : 'bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-300';
        return (
          <span key={i} className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
            {part}
          </span>
        );
      })}
    </div>
  );
}

export default function CorporateMode() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            Mapping: Job spec &rarr; your 6 categories
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            How each job specification item maps to your pillar categories and what it means in practice.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 text-sm font-semibold text-foreground border-b border-border w-[38%]">Job spec item</th>
                  <th className="text-left p-3 text-sm font-semibold text-foreground border-b border-border w-[32%]">Maps to your category</th>
                  <th className="text-left p-3 text-sm font-semibold text-foreground border-b border-border w-[30%]">What it means in practice</th>
                </tr>
              </thead>
              <tbody>
                {CORPORATE_MAPPINGS.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                    <td className="p-3 text-sm text-foreground border-b border-border align-top">
                      {row.jobSpec}
                    </td>
                    <td className="p-3 text-sm border-b border-border align-top">
                      <CategoryBadges category={row.category} />
                    </td>
                    <td className="p-3 text-sm text-muted-foreground border-b border-border align-top italic">
                      {row.practice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
