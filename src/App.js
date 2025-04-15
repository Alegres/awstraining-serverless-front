import { withAuthenticator, Button, TextField, Table, TableCell, TableBody, TableRow, TableHead, Alert } from '@aws-amplify/ui-react';
import ReactMarkdown from "react-markdown";
import '@aws-amplify/ui-react/styles.css';
import { fetchAuthSession } from 'aws-amplify/auth';
import React, { useState } from "react";

function App({ signOut, user }) {
  const RECOMMENDATIONS_URL = "https://uiqiygztmj.execute-api.eu-central-1.amazonaws.com/prod/recommendations"; // New URL for recommendations
  const FEEDBACK_URL = "https://uiqiygztmj.execute-api.eu-central-1.amazonaws.com/prod/feedback"; // New URL for feedback
  const [recommendations, setRecommendations] = useState([]); // State to store recommendations
  const [feedback, setFeedback] = useState(""); // State to store feedback message
  const [feedbackSent, setFeedbackSent] = useState(false); // State to control feedback popup


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

  const submitFeedback = async () => {
    try {
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();

      fetch(FEEDBACK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({ message: feedback }),
      });

      setFeedback(""); // Clear the feedback textbox after submission
      setFeedbackSent(true); // Show feedback sent popup
      setTimeout(() => setFeedbackSent(false), 3000); // Hide popup after 3 seconds
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  const deleteRecommendations = async () => {
    try {
      const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();

      await fetch(RECOMMENDATIONS_URL, {
        method: "DELETE",
        headers: {
          Authorization: authToken,
        },
      });

      setRecommendations([]); // Clear recommendations state after deletion
    } catch (error) {
      console.error("Failed to delete recommendations:", error);
    }
  };

  return (
    <div className="App">
      <h1>Hello {user.username}</h1>
      <Button variation="primary" onClick={signOut}>Sign out</Button>
      <Button variation="primary" onClick={fetchRecommendations}>Load Recommendations</Button>
      <Button variation="warning" onClick={deleteRecommendations}>Delete Recommendations</Button>

        <div className="recommendations">
          <h2>Recommendations</h2>
          {recommendations && recommendations.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell as="th">#</TableCell>
                <TableCell as="th">Recommendation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recommendations.map((rec, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell><ReactMarkdown>{rec.recommendation}</ReactMarkdown></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          ) : (
            <p>No recommendations available.</p>
          )}
        </div>

      <h2>Feedback</h2>
      <TextField
        label="Your Feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Enter your feedback here"
        descriptiveText="We value your feedback!"
      />
      <Button variation="primary" onClick={submitFeedback}>Submit Feedback</Button>
      {feedbackSent && (
        <Alert variation="success" isDismissible={true}>
          Feedback sent successfully! Please load recommendations after some time.
        </Alert>
      )}
    </div>
  );
}

export default withAuthenticator(App);