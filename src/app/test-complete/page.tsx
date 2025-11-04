"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

// Define types for the props
interface TestCompleteProps {
  testData: {
    id: number;
    title: string;
    duration?: number;
    [key: string]: any;
  };
  questions: Array<any>;
  answers: { [key: number]: number };
  score: number;
  timeTaken: string;
}

const TestComplete: React.FC<TestCompleteProps> = ({
  testData,
  questions,
  answers,
  score,
  timeTaken,
}) => {
  const router = useRouter();

  const handleViewReview = () => {
    // Save test data in sessionStorage
    sessionStorage.setItem(
      "testReview",
      JSON.stringify({ testData, questions, answers, score, timeTaken })
    );

    // Navigate to the TestReview page
    router.push("/test-review");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Test Completed!</h1>
      <p className="mb-6">Your score: {score}%</p>
      <Button onClick={handleViewReview}>View Test Review</Button>
    </div>
  );
};

export default TestComplete;
