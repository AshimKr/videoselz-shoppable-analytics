import "./MetricCard.css";

function MetricCard({ label, value, description }) {
  return (
    <article className="metric-card">
      <p className="metric-card__label">{label}</p>
      <p className="metric-card__value">{value.toLocaleString()}</p>

      {description && (
        <p className="metric-card__description">{description}</p>
      )}
    </article>
  );
}

export default MetricCard;