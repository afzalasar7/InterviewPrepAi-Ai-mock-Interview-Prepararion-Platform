// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Webcam from "react-webcam";
// import { Button } from "@/components/ui/button";
// import useSpeechToText from "react-hook-speech-to-text";
// import { Mic, StopCircle } from "lucide-react";
// import { toast } from "sonner";
// import { chatSession } from "@/utils/GeminiAIModel";
// import { db } from "@/utils/db";
// import { UserAnswer } from "@/utils/schema";
// import { useUser } from "@clerk/nextjs";
// import moment from "moment";
// import { eq, and } from "drizzle-orm"; // Adjust the package name based on your setup

// function RecordAnswerSection({ activeQuestionIndex, mockInterViewQuestion,interviewData }) {
//   const [userAnswer, setUserAnswer] = useState("");
//   const [loading,setLoading]=useState(false)
//   const {user}=useUser()
//   const {
//     error,
//     interimResult,
//     isRecording,
//     results,
//     startSpeechToText,
//     stopSpeechToText,
//     setResults
//   } = useSpeechToText({
//     continuous: true,
//     useLegacyResults: false,
//   });
//   if (error) {
//     toast(error);
//     return;
//   }

//   useEffect(() => {
//     results.map((result) => {
//       setUserAnswer((prevAns) => prevAns + result?.transcript);
//     });
//   }, [results]);

//   const StartStopRecording = async () => {

//     if (isRecording) {
//       stopSpeechToText();   
//     } else {
//       startSpeechToText();
//     }
//   };

//   useEffect(()=>{
//     if(!isRecording&&userAnswer.length>10){
//       UpdateUserAnswerInDb();
//     }
//   },[userAnswer])

  
//   const UpdateUserAnswerInDb = async () => {
//     console.log(userAnswer);
//     setLoading(true);
  
//     const feedbackPromt = `Question: ${mockInterViewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Based on the question and the user's answer, please provide a rating 1 to 10 for the answer and feedback in the form of areas for improvement, if any. The feedback should be in JSON format only. Nothing else, just the rating and feedback in 3 to 5 lines.`;
  
//     // Get feedback from chat session
//     const result = await chatSession.sendMessage(feedbackPromt);
//     const mockJsonResp = result.response
//       .text()
//       .replace("```json", "")
//       .replace("```", "");
  
//     const JsonFeedbackResp = JSON.parse(mockJsonResp);
  
//     const mockIdRef = interviewData?.mockId; // Assuming this is the correct type (string or number)
//     const questionText = mockInterViewQuestion[activeQuestionIndex]?.question; // Assuming this is a string
  
//     // Check if the combination of mockIdRef and question already exists
//     const existingAnswer = await db
//       .select()
//       .from(UserAnswer)
//       .where(eq(UserAnswer.mockIdRef, mockIdRef))
//       .where(eq(UserAnswer.question, questionText))
//       .limit(1);
  
//     if (existingAnswer.length > 0) {
//       // If the combination exists, update the userAns
//       const updatedResp = await db
//         .update(UserAnswer)
//         .set({
//           userAns: userAnswer,
//           feedback: JsonFeedbackResp?.feedback,
//           rating: JsonFeedbackResp?.rating,
//           createdAt: moment().format('DD-MM-yyyy')
//         })
//         .where(eq(UserAnswer.id, existingAnswer[0].id)); // Update the existing record by ID
  
//       if (updatedResp) {
//         toast('User Answer updated successfully!');
//       }
//     } else {
//       // If no record exists, insert the new question and answer for the mockIdRef
//       const resp = await db.insert(UserAnswer).values({
//         mockIdRef: mockIdRef,
//         question: questionText,
//         correctAns: mockInterViewQuestion[activeQuestionIndex]?.answer,
//         userAns: userAnswer,
//         feedback: JsonFeedbackResp?.feedback,
//         rating: JsonFeedbackResp?.rating,
//         userEmail: user?.primaryEmailAddress?.emailAddress,
//         createdAt: moment().format('DD-MM-yyyy')
//       });
  
//       if (resp) {
//         toast('User Answer recorded successfully!');
//       }
//     }
  
//     // Reset results and state
//     setUserAnswer('');
//     setResults([]);
//     setLoading(false);
//   };
  
  
//   return (
//     <div className="flex items-center justify-center flex-col">
//       <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
//         <Image
//           src={"/webcam.png"}
//           width={200}
//           height={200}
//           className="absolute"
//         />
//         <Webcam
//           mirrored={true}
//           style={{
//             height: "50vh",
//             width: "100%",
//             zIndex: 10,
//           }}
//         />
//       </div>
//       <Button  disabled={loading} variant="outline" onClick={StartStopRecording} className="my-10">
//         {isRecording ? (
//           <h2 className="flex items-center justify-center text-red-600 gap-2">
//             <StopCircle />
//             Click to stop Recording...
//           </h2>
//         ) : (
//           <h2 className="flex items-center justify-center gap-2">
//             <Mic />
//             Start Recording
//           </h2>
//         )}
//       </Button>
//     </div>
//   );
// }

// export default RecordAnswerSection;


"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { eq } from "drizzle-orm"; // Adjust the package name based on your setup

function RecordAnswerSection({ activeQuestionIndex, mockInterViewQuestion, interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(" ");
        setUserAnswer((prev) => prev + " " + transcript);
      };

      recognition.onerror = (event) => {
        toast.error(`Speech recognition error: ${event.error}`);
      };

      recognitionRef.current = recognition;
    } else {
      toast.error("Speech Recognition is not supported in your browser.");
    }
  }, []);

  const startStopRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswerInDb();
    }
  }, [userAnswer]);

  const UpdateUserAnswerInDb = async () => {
    console.log(userAnswer);
    setLoading(true);

    const feedbackPrompt = `Question: ${mockInterViewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Based on the question and the user's answer, please provide a rating 1 to 10 for the answer and feedback in the form of areas for improvement, if any. The feedback should be in JSON format only. Nothing else, just the rating and feedback in 3 to 5 lines.`;

    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    const JsonFeedbackResp = JSON.parse(mockJsonResp);

    const mockIdRef = interviewData?.mockId;
    const questionText = mockInterViewQuestion[activeQuestionIndex]?.question;

    const existingAnswer = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, mockIdRef))
      .where(eq(UserAnswer.question, questionText))
      .limit(1);

    if (existingAnswer.length > 0) {
      const updatedResp = await db
        .update(UserAnswer)
        .set({
          userAns: userAnswer,
          feedback: JsonFeedbackResp?.feedback,
          rating: JsonFeedbackResp?.rating,
          createdAt: moment().format("DD-MM-yyyy"),
        })
        .where(eq(UserAnswer.id, existingAnswer[0].id));

      if (updatedResp) {
        toast.success("User Answer updated successfully!");
      }
    } else {
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: mockIdRef,
        question: questionText,
        correctAns: mockInterViewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });

      if (resp) {
        toast.success("Answer recorded successfully!");
      }
    }

    setUserAnswer("");
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: "50vh",
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        onClick={startStopRecording}
        className="my-10"
      >
        {isRecording ? (
          <h2 className="flex items-center justify-center text-red-600 gap-2">
            <StopCircle />
            Click to stop Recording...
          </h2>
        ) : (
          <h2 className="flex items-center justify-center gap-2">
            <Mic />
            Start Recording
          </h2>
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;
