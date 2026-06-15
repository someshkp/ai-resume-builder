import { RouterProvider } from "react-router"
import appRouter from "./app.routes.jsx"
import AuthProvider from "./features/auth/services/AuthProvider.jsx"
import { InterviewProvider } from "./features/interview/services/interview.context.jsx"
function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={appRouter} />
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App
