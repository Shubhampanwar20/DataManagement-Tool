import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { appRoutes } from './routes'

export const AppRouter = () => {
  return (
    <MainLayout>
      <Routes>
        {appRoutes.map((route) => {
          const Element = route.element

          return <Route key={route.path} path={route.path} element={<Element />} />
        })}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </MainLayout>
  )
}
