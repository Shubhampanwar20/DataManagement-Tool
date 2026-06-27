import { Link } from 'react-router-dom'
import { FeaturePlaceholder } from '../_shared/FeaturePlaceholder'

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <FeaturePlaceholder
        title="Dashboard"
        description="This dashboard shell will host executive summaries and analytics in later milestones."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Start by importing an Excel tracker to inspect worksheets, preview rows, and capture workbook details.
        </p>
        <Link
          to="/import"
          className="mt-4 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          Import Excel
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage
