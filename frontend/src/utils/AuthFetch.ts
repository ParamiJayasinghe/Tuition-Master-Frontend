export const authFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMessage = "Request failed";
    try {
      const text = await response.text();
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // If not JSON, use the text itself if not empty, otherwise status text
        errorMessage = text || response.statusText;
      }
    } catch (e) {
      // Fallback if reading text fails
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
