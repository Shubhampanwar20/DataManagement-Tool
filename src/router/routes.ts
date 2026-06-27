import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  FolderKanban,
  Layers3,
  MessageSquareText,
  ScrollText,
  Settings,
  ShieldCheck,
  Upload,
  Users,
} from 'lucide-react'
import DashboardPage from '../features/dashboard'
import ClientsPage from '../features/clients'
import EngagementsPage from '../features/engagements'
import DataTrackerPage from '../features/data-tracker'
import SampleTrackerPage from '../features/samples'
import ObservationsPage from '../features/observations'
import ChecklistsPage from '../features/checklists'
import ReportsPage from '../features/reports'
import DocumentsPage from '../features/document-vault'
import SettingsPage from '../features/settings'
import ExcelImportPage from '../features/excel-import'
import NotFoundPage from '../features/workspace/NotFoundPage'

export interface AppRouteDefinition {
  path: string
  title: string
  description: string
  element: ComponentType
  icon?: LucideIcon
}

export const appRoutes: AppRouteDefinition[] = [
  {
    path: '/',
    title: 'Dashboard',
    description: 'Executive overview and live summaries',
    element: DashboardPage,
  },
  {
    path: '/clients',
    title: 'Clients',
    description: 'Client portfolio and relationships',
    element: ClientsPage,
    icon: Users,
  },
  {
    path: '/engagements',
    title: 'Engagements',
    description: 'Audit engagement monitoring',
    element: EngagementsPage,
    icon: BriefcaseBusiness,
  },
  {
    path: '/requests',
    title: 'Data Tracker',
    description: 'Data request lifecycle and follow-ups',
    element: DataTrackerPage,
    icon: ClipboardList,
  },
  {
    path: '/samples',
    title: 'Sample Tracker',
    description: 'Sampling and testing workflow',
    element: SampleTrackerPage,
    icon: ShieldCheck,
  },
  {
    path: '/observations',
    title: 'Observations',
    description: 'Issue tracking and observation records',
    element: ObservationsPage,
    icon: MessageSquareText,
  },
  {
    path: '/checklists',
    title: 'Checklists',
    description: 'Reusable audit checklists',
    element: ChecklistsPage,
    icon: Layers3,
  },
  {
    path: '/reports',
    title: 'Reports',
    description: 'Working papers and exportable reports',
    element: ReportsPage,
    icon: FileText,
  },
  {
    path: '/documents',
    title: 'Documents',
    description: 'Central document repository',
    element: DocumentsPage,
    icon: FolderKanban,
  },
  {
    path: '/upload-excel',
    title: 'Upload Excel',
    description: 'Upload client trackers and inspect workbook structure',
    element: ExcelImportPage,
    icon: Upload,
  },
  {
    path: '/settings',
    title: 'Settings',
    description: 'Preferences and configuration',
    element: SettingsPage,
    icon: Settings,
  },
  {
    path: '/analytics',
    title: 'Analytics',
    description: 'Executive analytics and trends',
    element: DashboardPage,
    icon: BarChart3,
  },
  {
    path: '*',
    title: 'Page Not Found',
    description: 'The requested page does not exist',
    element: NotFoundPage,
    icon: ScrollText,
  },
]

export const navItems = appRoutes.filter((route) => route.path !== '*' && route.path !== '/analytics')
