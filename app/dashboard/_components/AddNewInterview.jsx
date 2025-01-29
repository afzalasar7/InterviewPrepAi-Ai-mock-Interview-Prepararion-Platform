"use client";
import React, { useState } from "react";
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
import { chatSession } from "@/utils/GeminiAIModel";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState();
  const [jobDesc, setJobDesc] = useState();
  const [jobExperience, setJobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [JsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const route=useRouter()
  const onSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const InputPrompt = `Generate 5 tailored interview questions in an array of JSON objects format. The output should be relevant to and align with the following criteria:

 **Job Position**: ${jobPosition}
 **Job Description**: ${jobDesc}
 **Years of Experience**: ${jobExperience}
 
The questions should evaluate proficiency in the specified job position, problem-solving abilities, and domain-specific knowledge. Include concise, clear answers for each question to aid effective mock interview preparation.

**Output Format**:
Return a JSON object structured as follows:
{
  {
    "question": "<Question Text>",
    "answer": "<Detailed Answer>"
  },
  }

Ensure the array of JSON object is clean and does not include any introductory or explanatory text. Return only the clean JSON array as the output.`;

    const result = await chatSession.sendMessage(InputPrompt);
    console.log
    const MockJsonResp = result.response
      .text()
      .replace(/```json/, '') // Remove starting ```json
      .replace(/```/, '') // Remove ending ```
      .trim();
    setJsonResponse(JSON.parse(MockJsonResp));
   if(MockJsonResp){
    const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      }).returning({mockId:MockInterview.mockId})
      console.log("Insert ID:", resp)
      if(resp){
       route.push('/dashboard/interview/'+resp[0].mockId)
        setOpenDialog(false)
      }
   }else{
    console.log("ERROR")
   }
   setLoading(false);
   console.log(JsonResponse)  
};
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all delay-100"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add new Interview</h2>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogClose asChild>
              <button
                aria-label="Close"
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                
              </button>
            </DialogClose>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add Details about your job position/role, Job description,
                    and years of experience
                  </h2>

                  <div className="mt-7 my-3">
                  <label className="text-gray-700">Job Role/Job Position</label>
                  <Input
                      onChange={(event) => setJobPosition(event.target.value)}
                      placeholder="Ex. Software Engineer, HR, Financial Analyst, Product Manager, etc"
                      required
                    />
                  </div>
                  <div className="mt-7 my-3">
                  <label className="text-gray-700">Job Description (In Short)</label>
                    <Textarea
                      onChange={(event) => setJobDesc(event.target.value)}
                      placeholder="Provide a summary of the job role, highlighting the key responsibilities, necessary skills, and any specific technologies or tools used."
                    />
                  </div>
                  <div className="mt-7 my-3">
                  <label className="text-gray-700">Years of experience</label>
                    <Input
                      onChange={(event) => setJobExperience(event.target.value)}
                      placeholder="Ex. 5"
                      type="number"
                      min = "0"
                      max="50"
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
                        <LoaderCircle className="animate-spin" /> Generating
                        from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
