"use client";

import { createContext, useContext, useEffect, useState } from "react";

type StudentContextValue = {
  ready: boolean;
  studentId: string;
  grade: number;
  setGrade: (grade: number) => void;
};

const StudentContext = createContext<StudentContextValue | null>(null);

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [grade, setGradeState] = useState(8);
  const [studentId, setStudentId] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedGrade = Number(localStorage.getItem("apt-grade"));
    if (savedGrade >= 1 && savedGrade <= 12) setGradeState(savedGrade);
    let id = localStorage.getItem("apt-id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("apt-id", id);
    }
    setStudentId(id);
    setReady(true);
  }, []);

  function setGrade(next: number) {
    setGradeState(next);
    localStorage.setItem("apt-grade", String(next));
  }

  return (
    <StudentContext.Provider value={{ ready, studentId, grade, setGrade }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const value = useContext(StudentContext);
  if (!value) throw new Error("useStudent must be used inside StudentProvider");
  return value;
}
