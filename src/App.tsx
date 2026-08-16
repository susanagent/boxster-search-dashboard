import { Route, Routes } from "react-router-dom";
import { AppDataProvider } from "./context/AppDataContext";
import { AppShell } from "./app/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { CandidatesPage } from "./pages/CandidatesPage";
import { CandidateDetailPage } from "./pages/CandidateDetailPage";
import { ComparePage } from "./pages/ComparePage";
import { SearchRunsPage } from "./pages/SearchRunsPage";
import { SourcesPage } from "./pages/SourcesPage";
import { FeedbackRulesPage } from "./pages/FeedbackRulesPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <AppDataProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="candidates/:id" element={<CandidateDetailPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="search-runs" element={<SearchRunsPage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="feedback-rules" element={<FeedbackRulesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppDataProvider>
  );
}

export default App;
