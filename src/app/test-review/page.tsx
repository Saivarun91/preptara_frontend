"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Clock,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer: number | null;
  topic?: string;
  explanation?: string;
}

interface TestReviewProps {
  searchParams: { testId?: string; title?: string };
}

const TestReview = ({ searchParams }: TestReviewProps) => {
  const router = useRouter();
  const [testData, setTestData] = useState<{ title?: string; name?: string } | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [score, setScore] = useState<number | undefined>(undefined);
  const [timeTaken, setTimeTaken] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Load test review data from sessionStorage (or API)
    const data = sessionStorage.getItem("testReview");
    if (data) {
      const parsed = JSON.parse(data);
      setTestData(parsed.testData);
      setQuestions(parsed.questions);
      setAnswers(parsed.answers);
      setScore(parsed.score);
      setTimeTaken(parsed.timeTaken);
    }
  }, []);

  const generateExplanation = (question: Question, isCorrect: boolean) => {
    if (isCorrect) return `Correct! ${question.options[question.correctAnswer]} is the right answer.`;
    return `The correct answer is "${question.options[question.correctAnswer]}". This is an important concept to remember for competitive exams.`;
  };

  const reviewData = {
    questions: questions.map((q, index) => ({
      ...q,
      userAnswer: answers[index] !== undefined ? answers[index] : null,
      explanation: generateExplanation(q, answers[index] === q.correctAnswer),
    })),
  };

  if (!testData) {
    return (
      <div className="min-h-screen pt-16 bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">No test data found</p>
            <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const correctAnswers = reviewData.questions.filter(q => q.correctAnswer === q.userAnswer).length;
  const totalQuestions = reviewData.questions.length;
  const incorrectAnswers = reviewData.questions.filter(q => q.userAnswer !== null && q.correctAnswer !== q.userAnswer).length;
  const unanswered = reviewData.questions.filter(q => q.userAnswer === null).length;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const scorePercentage = score !== undefined ? score : accuracy;

  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2">Test Review</h1>
          <p className="text-muted-foreground">{testData?.title || testData?.name || "Practice Test"}</p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="border-primary/10 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="text-2xl">Score Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { icon: Award, label: "Final Score", value: `${scorePercentage.toFixed(1)}%`, color: "text-primary", bgColor: "bg-primary/10" },
                  { icon: Target, label: "Total Questions", value: totalQuestions, color: "text-accent", bgColor: "bg-accent/10" },
                  { icon: CheckCircle2, label: "Correct Answers", value: correctAnswers, color: "text-success", bgColor: "bg-success/10" },
                  { icon: XCircle, label: "Wrong Answers", value: incorrectAnswers, color: "text-destructive", bgColor: "bg-destructive/10" },
                  { icon: Clock, label: "Time Taken", value: timeTaken || "N/A", color: "text-highlight", bgColor: "bg-highlight/10" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-center"
                  >
                    <div className={`${stat.bgColor} rounded-full p-4 mb-3 inline-flex`}>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                    <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Review */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Detailed Question Review</h2>
            <div className="text-sm text-muted-foreground">{reviewData.questions.length} Questions</div>
          </div>

          {reviewData.questions.map((question, index) => {
            const isCorrect = question.correctAnswer === question.userAnswer;
            const isUnanswered = question.userAnswer === null;

            return (
              <motion.div key={question.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className={`border-2 transition-all hover:shadow-lg ${
                  isCorrect ? "border-success/50 bg-success/5" : isUnanswered ? "border-muted bg-muted/5" : "border-destructive/50 bg-destructive/5"
                }`}>
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-muted-foreground">Question {index + 1}</span>
                          {question.topic && <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{question.topic}</span>}
                        </div>
                        <span className="text-lg font-semibold">{question.question}</span>
                      </div>
                      {isCorrect ? (
                        <div className="flex-shrink-0 bg-success/20 p-2 rounded-full">
                          <CheckCircle2 className="h-6 w-6 text-success" />
                        </div>
                      ) : isUnanswered ? (
                        <div className="flex-shrink-0 bg-muted p-2 rounded-full">
                          <XCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 bg-destructive/20 p-2 rounded-full">
                          <XCircle className="h-6 w-6 text-destructive" />
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isUserAnswer = optIndex === question.userAnswer;
                        const isCorrectAnswer = optIndex === question.correctAnswer;

                        return (
                          <div key={optIndex} className={`p-4 rounded-lg border-2 transition-all ${
                            isCorrectAnswer ? "border-success bg-success/10" : isUserAnswer && !isCorrect ? "border-destructive bg-destructive/10" : "border-border bg-card"
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                                isCorrectAnswer ? "border-success bg-success text-white" : isUserAnswer && !isCorrect ? "border-destructive bg-destructive text-white" : "border-muted-foreground/30"
                              }`}>{String.fromCharCode(65 + optIndex)}</div>
                              <span className="flex-1 font-medium">{option}</span>
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && <span className="text-xs px-2 py-1 bg-success text-white rounded-full font-semibold flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Correct</span>}
                                {isUserAnswer && !isCorrect && <span className="text-xs px-2 py-1 bg-destructive text-white rounded-full font-semibold flex items-center gap-1"><XCircle className="h-3 w-3" /> Your Answer</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {!isCorrect && (
                      <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary text-xs font-bold">!</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold mb-1">Explanation</p>
                            <p className="text-sm text-muted-foreground">{question.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
          <Button className="bg-gradient-primary hover:shadow-glow" onClick={() => router.push("/practice-tests")}>Take Another Test</Button>
        </motion.div>
      </div>
    </div>
  );
};

export default TestReview;
