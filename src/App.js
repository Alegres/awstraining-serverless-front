import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';
import React, { useState } from "react";

function App({ signOut, user }) {
  const API_GATEWAY_URL = "https://uiqiygztmj.execute-api.eu-central-1.amazonaws.com/prod/hello";
  const RECOMMENDATIONS_URL = "https://uiqiygztmj.execute-api.eu-central-1.amazonaws.com/prod/recommendations"; // New URL for recommendations
  const [apiResponse, setApiResponse] = useState(null); // State to store API response
  const [recommendations, setRecommendations] = useState([]); // State to store recommendations

  const callAPI = async () => {
    try {
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();

      const response = await fetch(API_GATEWAY_URL, {
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      });

      const data = await response.json();
      setApiResponse(data);
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();

      const response = await fetch(RECOMMENDATIONS_URL, {
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      });

      const data = await response.json();
      setRecommendations(data);

      console.log("Data")
      console.log(data)
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setRecommendations([]); // Ensure recommendations is set to an empty array on error
    }
  };

  return (
    <>
      <h1>Hello {user.username}</h1>
      <button onClick={signOut}>Sign out</button>
      <button onClick={callAPI}>Call API</button>
      {apiResponse && <p>API Response: {JSON.stringify(apiResponse)}</p>}

      <button onClick={fetchRecommendations}>Load Recommendations</button> {/* New button */}
      {recommendations && recommendations.length > 0 ? (
        <div>
          <h2>Recommendations</h2>
          <ul>
            {recommendations.map((rec) => (
              <li key={rec.index}>
                #{rec.index}: {rec.recommendation}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No recommendations</p> // Display plain text when no recommendations or recommendations is undefined
      )}
    </>
  );
}

export default withAuthenticator(App);