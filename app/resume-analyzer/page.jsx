// app/resume-analyzer/page.jsx
import ResumeAnalyzer from '../dashboard/_components/ResumeAnalyzer';  // Ensure correct import path
import Header from "../dashboard/_components/ResumeHeader";

export default function ResumeAnalyzerPage() {
  return (
    <div>
              <Header />

      <ResumeAnalyzer />
    </div>
  );
}
