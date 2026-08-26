import { useCallback, useEffect, useState } from "react";

import {
  createEngagementEvent,
  fetchVideoAnalytics
} from "./services/analyticsApi";

import DashboardHeader from "./components/DashboardHeader/DashboardHeader";
import MetricCard from "./components/MetricCard/MetricCard";
import AnalyticsTable from "./components/AnalyticsTable/AnalyticsTable";
import Pagination from "./components/Pagination/Pagination";

import "./App.css";

const PAGE_SIZE = 5;

const EVENT_TYPES = [
  "view",
  "click",
  "add_to_cart"
];

function App() {
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState("");
  const [error, setError] = useState("");

  const [summary, setSummary] = useState({
    views: 0,
    clicks: 0,
    addToCart: 0
  });

  const loadAnalytics = useCallback(async (page = 1) => {
    try {
      setError("");
      setIsLoading(true);

      const response = await fetchVideoAnalytics(
        page,
        PAGE_SIZE
      );

      setVideos(response.data);
      setSummary(response.summary);
      setPagination(response.pagination);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to load video analytics."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics(1);
  }, [loadAnalytics]);

  async function handleSimulateTraffic() {
    if (!videos.length) {
      return;
    }

    try {
      setError("");
      setSimulationMessage("");
      setIsSimulating(true);

      const randomVideo =
        videos[Math.floor(Math.random() * videos.length)];

      const randomEventType =
        EVENT_TYPES[
          Math.floor(Math.random() * EVENT_TYPES.length)
        ];

      await createEngagementEvent(
        randomVideo.id,
        randomEventType
      );

      await loadAnalytics(pagination.page);

      setSimulationMessage(
        `Simulated "${randomEventType}" for "${randomVideo.title}".`
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          "Unable to simulate traffic."
      );
    } finally {
      setIsSimulating(false);
    }
  }

  function handlePageChange(nextPage) {
    loadAnalytics(nextPage);
  }

  return (
    <div className="app-shell">
      <main className="dashboard-container">
        <DashboardHeader
          onSimulate={handleSimulateTraffic}
          isSimulating={isSimulating}
        />

        {simulationMessage && (
          <div className="success-banner" role="status" aria-live="polite">
            {simulationMessage}
          </div>
        )}

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => loadAnalytics(pagination.page)}
            >
              Retry
            </button>
          </div>
        )}

        <section className="metrics-grid" aria-label="Analytics summary">
          <MetricCard
            label="Total Views"
            value={summary.views}
            description="Across all tracked videos"
          />

          <MetricCard
            label="Total Clicks"
            value={summary.clicks}
            description="Across all tracked videos"
          />

          <MetricCard
            label="Add to Cart"
            value={summary.addToCart}
            description="Across all tracked videos"
          />

          <MetricCard
            label="Videos"
            value={pagination.total}
            description="Total videos tracked"
          />
        </section>

        <AnalyticsTable
          videos={videos}
          isLoading={isLoading}
        />

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          disabled={isLoading}
        />
      </main>
    </div>
  );
}

export default App;