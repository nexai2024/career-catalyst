"use client"
import React from 'react'



const page = () => {
    async function callLearningPlanAPI() {
        const response = await fetch("/api/learning-plan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEducation: "Bachelor's in Computer Science",
            userExperience: "3 years as a Frontend Developer",
            userSkills: "JavaScript, React, CSS",
            userCurrentRole: "Frontend Developer",
            targetRole: "Full Stack Developer",
            timeCommitment: "10 hours per week",
            preferredMethods: "online courses, mentorship",
          }),
        });
      
        if (!response.ok) {
          console.error("Failed to call learning plan API:", response.statusText);
          return null;
        }
      
        const data = await response.json();
        console.log("Learning Plan:", data);
        return data;
      }
  return (
    <div>
        <button onClick={callLearningPlanAPI}>Generate Learning Plan</button>
    </div>
  )
}
export default page