import { BrowserRouter } from 'react-router-dom'
import { DatabaseProvider } from './providers/DatabaseProvider'
import { NotificationProvider } from './providers/NotificationProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { ErrorBoundary } from '../components/common/ErrorBoundary'
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
