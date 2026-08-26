import "./AnalyticsTable.css";

function formatConversionRate(addToCart, views) {
  if (!views) {
    return "0.00%";
  }

  return `${((addToCart / views) * 100).toFixed(2)}%`;
}

function AnalyticsTable({ videos, isLoading }) {
  if (isLoading) {
    return (
      <section className="analytics-card">
        <div className="table-state">
          <div className="spinner" aria-hidden="true" />
          <p>Loading video analytics...</p>
        </div>
      </section>
    );
  }

  if (!videos.length) {
    return (
      <section className="analytics-card">
        <div className="table-state">
          <p className="table-state__title">No video data found</p>
          <p>
            Once videos receive engagement data, their analytics will appear
            here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="analytics-card">
      <div className="analytics-card__header">
        <div>
          <h2>Video Performance</h2>
          <p>Engagement metrics by shoppable video.</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="analytics-table">
          <caption className="sr-only">
            Shoppable video engagement analytics
          </caption>
          <thead>
            <tr>
              <th scope="col">Video</th>
              <th scope="col">Product</th>
              <th scope="col">Views</th>
              <th scope="col">Clicks</th>
              <th scope="col">Add to Cart</th>
              <th scope="col">Conversion Rate</th>
            </tr>
          </thead>

          <tbody>
            {videos.map((video) => (
              <tr key={video.id}>
                <td>
                  <div className="video-cell">
                    <span className="video-cell__icon">▶</span>

                    <div>
                      <strong>{video.title}</strong>

                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View video
                      </a>
                    </div>
                  </div>
                </td>

                <td>{video.productName}</td>

                <td>{video.views.toLocaleString()}</td>

                <td>{video.clicks.toLocaleString()}</td>

                <td>{video.addToCart.toLocaleString()}</td>

                <td>
                  <span className="conversion-badge">
                    {formatConversionRate(
                      video.addToCart,
                      video.views
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AnalyticsTable;