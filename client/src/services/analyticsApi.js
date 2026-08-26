const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  let payload;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      payload?.message || "Something went wrong with the request."
    );
  }

  return payload;
}

export function fetchVideoAnalytics(page = 1, limit = 5) {
  return request(`/analytics/videos?page=${page}&limit=${limit}`);
}

export function createEngagementEvent(videoId, eventType) {
  return request("/events", {
    method: "POST",
    body: JSON.stringify({
      videoId,
      eventType
    })
  });
}