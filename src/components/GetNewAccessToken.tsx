export const getNewAccessToken = async () => {
  const response = await fetch(
    "http://localhost:5001/api/v1/auth/refresh-token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies (similar to withCredentials in axios)
    }
  );

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();

  return data; // This should return the new access token
};
