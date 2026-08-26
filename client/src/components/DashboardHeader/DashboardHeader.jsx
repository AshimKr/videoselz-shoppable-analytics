import "./DashboardHeader.css";

function DashboardHeader({ onSimulate, isSimulating }) {
  return (
    <header className="dashboard-header">
      <div>
        <p className="dashboard-header__eyebrow">VIDEO ANALYTICS</p>

        <h1>Shoppable Video Performance</h1>

        <p className="dashboard-header__subtitle">
          Monitor engagement and conversion performance across your storefront
          videos.
        </p>
      </div>

      <button
        type="button"
        className="traffic-button"
        onClick={onSimulate}
        disabled={isSimulating}
      >
        {isSimulating ? "Simulating..." : "Simulate Traffic"}
      </button>
    </header>
  );
}

export default DashboardHeader;