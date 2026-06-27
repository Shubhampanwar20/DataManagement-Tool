import { BrowserRouter } from 'react-router-dom'
import { DatabaseProvider } from './DatabaseProvider'
import { NotificationProvider } from './NotificationProvider'
import { ThemeProvider } from './ThemeProvider'
import { ErrorBoundary } from './common/ErrorBoundary'
import { AppRouter } from '../router/Router'

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DatabaseProvider>
          <NotificationProvider>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </NotificationProvider>
        </DatabaseProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
