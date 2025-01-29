"use client";
import ParticleBackground from "./ParticleBackground"; 
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Lightbulb } from "lucide-react"; // Import the Lightbulb icon

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModel";

function ResumeAnalyzer() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);
  const [showNote, setShowNote] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const handleResumeUpload = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleTryOut = async () => {
    setLoading(true);
    const resumeText = `
     
 Academic Qualifications

- B.Tech. in AI & ML (2021-2025), University of Mumbai, 9.1 CGPA
- Higher Secondary School Certificate (H.S.C.), February 2021, Maharashtra State Board (90.83%)

---

 Technical Skills

- Languages: Python, Java, SQL, HTML/CSS
- Databases: MySQL, MongoDB
- Libraries/Frameworks: NumPy, Pandas, Scikit-learn, Flask, Matplotlib
- Coursework: Machine Learning, NLP, Data Structures & Algorithms, DBMS

---

 Internship Experience

- Accenture, Associate Software Engineering Intern (May 2024 – July 2024)
    - Collaborated with a cross-functional team to develop a wrapper product for the Oracle Cloud EPM suite, enhancing functionality and integration within enterprise financial planning systems.
    - Implemented an end-to-end chat interface feature using the Google Gemini API and NLP algorithms, providing personalized user guidance and automating system interactions.
    - Utilized Python and Flask to develop RESTful APIs to automate Oracle EPM data load rules, reducing manual intervention by 60% and boosting efficiency.
    - Presented project results and insights to senior leadership, reaching 30+ developers across the organization and influencing the adoption of the wrapper product.

- Prasunet Pvt. Ltd., Machine Learning Intern (August 2024 – September 2024)
    - Assisted in developing machine learning models to improve predictive accuracy and classification performance, including linear regression and decision tree classifiers.
    - Utilized ML libraries such as NumPy, Pandas, and Scikit-learn to build, evaluate, and optimize models.
    - Conducted Exploratory Data Analysis and feature engineering to improve model performance.

---

 Projects

- AutoInsights (June 2024) - Python, Streamlit, NumPy, Pandas, Scikit-learn, Matplotlib, Seaborn
    - Developed an automated tool to simplify exploratory data analysis and preprocessing for datasets.
    - Integrated interactive visualizations and statistical insights to streamline data exploration.
    - Optimized data cleaning processes, reducing manual effort by 35% and boosting data accuracy.

- CommuniSyncAI (June 2024) - HTML, CSS, JavaScript, Speech Recognition, Google TTS, Gemini
    - Built an immersive, personalized platform for interview prep, enhancing spoken English skills.
    - Utilized the Gemini API and prompt engineering techniques to deliver dynamic, tailored AI responses.
    - Integrated voice-enabled features and detailed feedback, resulting in a 30% improvement in communication skills.

- ExpenseTracker (October 2023) - Python, Flask, SQLite, Plotly, HTML, CSS
    - Designed a personal finance app to track income, expenses, savings, and investments seamlessly.
    - Crafted dynamic charts and insights to reveal spending patterns and enhance decision-making.
    - Ensured data security with robust session management and intuitive user authentication.

---

 Certifications

- Machine Learning Specialization by Stanford University, Coursera
- Deep Learning Specialization by DeepLearning.ai, Coursera
`
    
    
    const jobDesc = (`
       Junior Machine Learning Engineer - Job Description
  
      We are looking for a motivated Junior Machine Learning Engineer to build and deploy models, perform data analysis, and contribute to AI solutions. You will work with teams to design data-driven systems and optimize workflows.
  
      Key Responsibilities:
      - Develop and deploy ML models using Python and Scikit-learn.
      - Perform data preprocessing, feature engineering, and EDA.
      - Automate data pipelines and integrate ML models with APIs.
      - Collaborate on designing predictive and classification models.
  
      Desired Skills:
      - Proficiency in Python, NumPy, Pandas, Scikit-learn.
      - Familiarity with SQL and databases (e.g., MySQL, MongoDB).
      - Experience with Flask for API development.
      - Strong analytical and problem-solving abilities.
  
      Qualifications:
      - Degree in AI, ML, or a related field.
      - Internship or project experience in ML and data analysis.
  
      This is a great opportunity for early-career professionals to work on impactful AI projects.
    `);
    
  try {
    const parsedResult = await generateFeedback(resumeText, jobDesc);

    setSessionDetails({
      resumeFileName: "Afzal Asar resume.pdf",
      jobDesc: "Junior Machine Learning Engineer",
    });

    setAnalysisResult(parsedResult); // Set the parsed result to state
  } catch (error) {
    console.error("Error analyzing resume:", error);
    alert("An error occurred. Please try again.");
  } finally {
    setLoading(false);
    setOpenDialog(false);
  }
  };


  // Function to handle generating feedback using Gemini API
const generateFeedback = async (resumeText, jobDesc) => {
  const InputPrompt = `
You are a resume evaluation assistant. Analyze the following resume in the context of the provided job description and return an array of JSON objects format.
Evaluate the resume's strengths, weaknesses, keyword relevance, and overall alignment with the job. 
Provide feedback on areas for improvement and give actionable suggestions for each section (e.g., skills, experience, projects).
Additionally, rate the alignment of the resume with the job description on a scale of 1-100, and break down how the score was determined.

For each section (e.g., Summary, Experience, Education, Skills, Projects, etc.), please:
- Highlight the strongest points and explain why they stand out in the context of the job description.
- Identify weaknesses and provide actionable recommendations for improvement.
- Assess how well keywords from the job description are reflected in the resume.
- Suggest specific changes or enhancements to better align with the job description.

Please ensure the feedback is:
- Concise, but comprehensive
- Actionable, with clear suggestions
- Precise, with explanations behind each rating

Resume Content: ${resumeText}

Job Description: ${jobDesc}

Return a JSON object structured as follows:
[
  {
    "feedback": "<General feedback text providing a high-level overview of the alignment between the resume and the job description>",
    "rating": "<alignment rating (1-100)>",
    "pros": [
      "<Pro 1: A key strength or advantage of the resume>",
      "<Pro 2: Another notable strength or positive aspect of the resume>"
    ],
    "cons": [
      "<Con 1: A key weakness or area for improvement>",
      "<Con 2: Another notable weakness or gap in the resume>"
    ],
    "keywordRelevance": [
      "<Keyword 1: Relevant keyword from job description that appears in the resume>",
      "<Keyword 2: Another relevant keyword or skill>"
    ],
    "suggestions": [
      "<Suggestion 1: Specific action or change to improve the resume (e.g., adding more details, rewording experience)>",
      "<Suggestion 2: Another action to enhance the resume or make it more aligned with the job description>"
    ],
    "actionableInsights": [
      "<Insight 1: A clear, actionable recommendation for improving the resume's effectiveness in the job market>",
      "<Insight 2: Another insight that helps tailor the resume or makes it stand out>"
    ]
  }
]

Ensure the array of JSON objects is clean and does not include any introductory or explanatory text. Return only the clean JSON array as the output.
`;

  // Step 3: Send the InputPrompt to Gemini API
  const gemini_response = await chatSession.sendMessage(InputPrompt);

  // Parse the response from Gemini
  const result = gemini_response.response.text();
  const parsedResult = JSON.parse(
    result
      .replace(/```json/, "")
      .replace(/```/, "")
      .trim()
  );

  return parsedResult;
};

// Refactored handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!resumeFile) {
    alert("Please upload a resume file.");
    setLoading(false);
    return;
  }

  const formData = new FormData();
  formData.append("file", resumeFile);

  try {
    // Step 1: Get text from the parsing API
    const res = await fetch("/api/parse-pdf", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.error || "An error occurred while processing the file.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    const resumeText = data.cleanedText; // Extract the cleanedText from the response

    if (!resumeText) {
      alert("Failed to extract text from the resume.");
      setLoading(false);
      return;
    }

    // Step 2: Generate feedback using Gemini
    const parsedResult = await generateFeedback(resumeText, jobDesc);

    setSessionDetails({
      resumeFileName: resumeFile.name,
      jobDesc,
    });

    setAnalysisResult(parsedResult); // Set the parsed result to state

  } catch (error) {
    console.error("Error analyzing resume:", error);
    alert("An error occurred. Please try again.");
  } finally {
    setLoading(false);
    setOpenDialog(false);
  }
};
  

  return (
    <div>
      <section className="bg-gray-900 text-white relative overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Unlock Your Resume's Full Potential with AI
          </h1>
          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
            Take your resume to the next level with our AI-powered Resume Analyzer. Get personalized feedback, optimize your content, and ensure your resume stands out to recruiters.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div
              className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto cursor-pointer transition-all delay-100"
              onClick={() => setOpenDialog(true)}
            >
              Analyze My Resume
            </div>
          </div>
        </div>
      </div>

      {/* Light bulb icon button */}
<button
  onClick={() => setShowNote(!showNote)}
  className="absolute top-6 right-6 bg-blue-500 p-3 rounded-full cursor-pointer hover:bg-blue-600 hidden md:block"
>
  <Lightbulb className="w-8 h-8 text-white" />
</button>


      {/* Note section */}
      {showNote && (
        <div className="absolute top-16 right-6 bg-white text-black p-4 rounded-lg shadow-lg max-w-xs">
          <strong>Please note:</strong> The resume analysis feature is currently in the development phase. It is designed to process single-column, text-based resumes without complex formatting, images, or other advanced elements. Kindly submit only this type of resume for analysis.
        </div>
      )}
    </section>

    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl">
        Resume Analyzer
      </DialogTitle>
      <DialogDescription>
        <form onSubmit={handleSubmit}>
          <div>
            <div className="mt-7 my-3">
              <label className="text-gray-900">Upload Resume</label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                required
              />
            </div>
            <div className="mt-7 my-3">
              <label className="text-gray-900">Job Description</label>
              <Textarea
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Provide job description for the role you are applying"
                required
              />
            </div>
          </div>

          <div className="flex gap-5 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpenDialog(false)}
            >
              Cancel
            </Button>
            <Button disabled={loading} type="submit">
              {loading ? (
                <>
                  <LoaderCircle className="animate-spin" /> Analyzing Resume...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
          </div>
        </form>
        
        <div className="text-center my-3">
          <span className="text-gray-600">OR</span>
        </div>

        {/* Try Out Button */}
        <div className="mt-5">
          <Button
            type="button"
            onClick={handleTryOut}
            className="bg-blue-700 text-white hover:bg-gray-800 w-full"
          >
            Try Out with Sample Resume and JD
          </Button>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

      
      {sessionDetails && (
        <div className="px-14 py-6 bg-gray-50 rounded-lg">
          <h2 className="font-bold text-2xl text-gray-800 mb-6 border-b pb-2">Current Session Details</h2>
          <div className="flex flex-row gap-6">
            <div className="flex flex-col p-6 rounded-lg border border-gray-200 bg-white gap-4 flex-1">
              <h2 className="text-lg text-gray-700">
                <strong className="text-gray-900">Resume:</strong> {sessionDetails.resumeFileName}
              </h2>
              <h2 className="text-lg text-gray-700">
                <strong className="text-gray-900">Job Description:</strong> {sessionDetails.jobDesc}
              </h2>
            </div>
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="px-14 py-6 bg-gray-50 rounded-lg">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0 mb-4 text-center sm:text-left">
  <h2 className="text-3xl font-bold text-green-500">🎉 Congratulations!</h2>
  <h2 className="font-bold text-2xl text-gray-800">Here is your resume feedback</h2>
          </div>
          <h2 className="text-lg text-gray-700 mb-4">
            Your overall analysis score:{" "}
            <strong className="text-primary text-xl">{analysisResult[0]?.rating}</strong>
          </h2>
          <div className="flex flex-col gap-4">
    {analysisResult.map((item, index) => (
      <div
        key={index}
        className="p-4 rounded-lg border border-gray-200 bg-white"
      >
        {/* Render feedback */}
<div className="text-gray-800">
  <ReactMarkdown>{item.feedback}</ReactMarkdown>
</div>

<br />

{/* Render pros */}
{item.pros && item.pros.length > 0 && (
  <div className="mt-2">
    <strong>Pros:</strong>
    <ul className="list-disc pl-5">
      {item.pros.map((pro, idx) => (
        <li key={idx} className="text-gray-600">{pro}</li>
      ))}
    </ul>
  </div>
)}

<br />

{/* Render cons */}
{item.cons && item.cons.length > 0 && (
  <div className="mt-2">
    <strong>Cons:</strong>
    <ul className="list-disc pl-5">
      {item.cons.map((con, idx) => (
        <li key={idx} className="text-gray-600">{con}</li>
      ))}
    </ul>
  </div>
)}

<br />

{/* Render keyword relevance */}
{item.keywordRelevance && item.keywordRelevance.length > 0 && (
  <div className="mt-2">
    <strong>Relevant Keywords:</strong>
    <ul className="list-disc pl-5">
      {item.keywordRelevance.map((keyword, idx) => (
        <li key={idx} className="text-gray-600">{keyword}</li>
      ))}
    </ul>
  </div>
)}

<br />

{/* Render suggestions */}
{item.suggestions && item.suggestions.length > 0 && (
  <div className="mt-2">
    <strong>Suggestions:</strong>
    <ul className="list-disc pl-5">
      {item.suggestions.map((suggestion, idx) => (
        <li key={idx} className="text-gray-600">{suggestion}</li>
      ))}
    </ul>
  </div>
)}

<br />

{/* Render actionable insights */}
{item.actionableInsights && item.actionableInsights.length > 0 && (
  <div className="mt-2">
    <strong>Actionable Insights:</strong>
    <ul className="list-disc pl-5">
      {item.actionableInsights.map((insight, idx) => (
        <li key={idx} className="text-gray-600">{insight}</li>
      ))}
    </ul>
  </div>
)}

      </div>
    ))}
  </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAnalyzer;

