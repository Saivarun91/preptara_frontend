"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Question interface
interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  topic?: string;
}

// TestAttempt interface
interface TestAttempt {
  testId: string; // ✅ string id
  testTitle: string;
  status: "in-progress" | "completed";
  questionsAnswered: number;
  totalQuestions: number;
  score?: number;
  correctCount?: number;
  wrongCount?: number;
  startedAt: string;
  completedAt?: string;
  answers: Record<number, number>;
  timeSpent?: number;
  questions?: Question[];
}

// Context type
interface TestContextType {
  unlockedCourses: string[];
  unlockCourseAccess: (courseId: string, plan?: string) => void;
  hasCourseAccess: (courseId: string) => boolean;
  testAttempts: TestAttempt[];
  saveTestAttempt: (attempt: TestAttempt) => void;
  getTestAttempt: (testId: string) => TestAttempt | undefined;
  completeTest: (
    testId: string,
    score: number,
    timeSpent: number,
    questions?: Question[],
    correctCount?: number,
    wrongCount?: number
  ) => void;
  deleteTestAttempt: (testId: string) => void;
}

// Create Context
const TestContext = createContext<TestContextType | undefined>(undefined);

// Provider
export const TestProvider = ({ children }: { children: ReactNode }) => {
  const [unlockedCourses, setUnlockedCourses] = useState<string[]>([]);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCourses = localStorage.getItem("unlockedCourses");
      const savedAttempts = localStorage.getItem("testAttempts");

      if (savedCourses) setUnlockedCourses(JSON.parse(savedCourses));
      if (savedAttempts) setTestAttempts(JSON.parse(savedAttempts));
    }
  }, []);

  // Save unlockedCourses to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("unlockedCourses", JSON.stringify(unlockedCourses));
    }
  }, [unlockedCourses]);

  // Save testAttempts to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("testAttempts", JSON.stringify(testAttempts));
    }
  }, [testAttempts]);

  // Unlock course
  const unlockCourseAccess = (courseId: string, plan?: string) => {
    if (!unlockedCourses.includes(courseId)) {
      setUnlockedCourses((prev) => [...prev, courseId]);
    }
  };

  // Check access
  const hasCourseAccess = (courseId: string) => unlockedCourses.includes(courseId);

  // Save or update attempt
  const saveTestAttempt = (attempt: TestAttempt) => {
    setTestAttempts((prev) => {
      const index = prev.findIndex((a) => a.testId === attempt.testId);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = attempt;
        return updated;
      }
      return [...prev, attempt];
    });
  };

  // Get attempt by id
  const getTestAttempt = (testId: string) => testAttempts.find((a) => a.testId === testId);

  // Complete a test
  const completeTest = (
    testId: string,
    score: number,
    timeSpent: number,
    questions?: Question[],
    correctCount?: number,
    wrongCount?: number
  ) => {
    setTestAttempts((prev) =>
      prev.map((attempt) =>
        attempt.testId === testId
          ? {
              ...attempt,
              status: "completed",
              score,
              timeSpent,
              questions,
              correctCount,
              wrongCount,
              completedAt: new Date().toISOString(),
            }
          : attempt
      )
    );
  };

  // Delete attempt
  const deleteTestAttempt = (testId: string) => {
    setTestAttempts((prev) => prev.filter((a) => a.testId !== testId));
  };

  return (
    <TestContext.Provider
      value={{
        unlockedCourses,
        unlockCourseAccess,
        hasCourseAccess,
        testAttempts,
        saveTestAttempt,
        getTestAttempt,
        completeTest,
        deleteTestAttempt,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

// Hook to use context
export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) throw new Error("useTest must be used within TestProvider");
  return context;
};
