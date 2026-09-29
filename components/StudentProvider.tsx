"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { clearStudentNotes, type BoardId, type GoalId } from "@/lib/study";

type Account = {
  username: string;
  passwordHash: string;
  studentId: string;
  grade: number;
  classSet?: boolean;
  board?: BoardId;
  goal?: GoalId;
};

type StudentContextValue = {
  ready: boolean;
  studentId: string;
  grade: number;
  username: string;
  classOpen: boolean;
  board: BoardId;
  goal: GoalId;
  setStudy: (board: BoardId, goal: GoalId) => void;
  deleteAccount: () => void;
  setGrade: (grade: number) => void;
  confirmClass: (grade: number) => void;
  reopenClass: () => void;
  signIn: (username: string, password: string, grade: number) => Promise<string>;
  signUp: (username: string, password: string, grade: number) => Promise<string>;
  changePassword: (current: string, next: string) => Promise<string>;
  resetPassword: (username: string, next: string) => Promise<string>;
  signOut: () => void;
};

const StudentContext = createContext<StudentContextValue | null>(null);

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function readAccounts(): Account[] {
  try {
    const parsed = JSON.parse(localStorage.getItem("apt-accounts") ?? "[]") as Account[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: Account[]) {
  localStorage.setItem("apt-accounts", JSON.stringify(accounts));
}

function cleanName(username: string) {
  return username.trim();
}

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [grade, setGradeState] = useState(6);
  const [studentId, setStudentId] = useState("");
  const [username, setUsername] = useState("");
  const [classOpen, setClassOpen] = useState(false);
  const [board, setBoard] = useState<BoardId>("app");
  const [goal, setGoal] = useState<GoalId>("learn");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const accounts = readAccounts();
    const saved = localStorage.getItem("apt-session") ?? "";
    const account = accounts.find((item) => item.username.toLowerCase() === saved.toLowerCase());
    if (account) {
      setUsername(account.username);
      setStudentId(account.studentId);
      setGradeState(account.grade);
      setBoard("cbse");
      setGoal(account.goal ?? "learn");
      sessionStorage.removeItem("apt-picking");
      sessionStorage.setItem("apt-entered", "1");
      setClassOpen(true);
    }
    setReady(true);
  }, []);

  function setStudy(nextBoard: BoardId, nextGoal: GoalId) {
    setBoard(nextBoard);
    setGoal(nextGoal);
    if (!username) return;
    const accounts = readAccounts().map((item) =>
      item.username.toLowerCase() === username.toLowerCase() ? { ...item, board: nextBoard, goal: nextGoal } : item,
    );
    writeAccounts(accounts);
  }

  function deleteAccount() {
    if (!username) return;
    const id = studentId;
    const accounts = readAccounts().filter((item) => item.username.toLowerCase() !== username.toLowerCase());
    writeAccounts(accounts);
    if (id) clearStudentNotes(id);
    signOut();
  }

  function setGrade(next: number) {
    const current = readAccounts().find((item) => item.username.toLowerCase() === username.toLowerCase());
    if (current?.classSet) return;
    setGradeState(next);
    if (!username) return;
    const accounts = readAccounts().map((item) =>
      item.username.toLowerCase() === username.toLowerCase() ? { ...item, grade: next } : item,
    );
    writeAccounts(accounts);
  }

  function confirmClass(next: number) {
    const current = readAccounts().find((item) => item.username.toLowerCase() === username.toLowerCase());
    if (current?.classSet && current.grade !== next) return;
    setGrade(next);
    const accounts = readAccounts().map((item) =>
      item.username.toLowerCase() === username.toLowerCase() ? { ...item, grade: next, classSet: true } : item,
    );
    writeAccounts(accounts);
    sessionStorage.removeItem("apt-picking");
    sessionStorage.setItem("apt-entered", "1");
    setClassOpen(true);
  }

  function reopenClass() {
    sessionStorage.setItem("apt-picking", "1");
    sessionStorage.removeItem("apt-entered");
    setClassOpen(false);
  }

  async function signUp(rawName: string, password: string, chosenGrade: number) {
    const name = cleanName(rawName);
    if (!/^[A-Za-z][A-Za-z0-9 ]{1,23}$/.test(name)) {
      return "Use your name with letters. Numbers are fine. Leave out other symbols.";
    }
    if (password.length < 4) return "Use a password of at least 4 characters.";
    if (!Number.isInteger(chosenGrade) || chosenGrade < 1 || chosenGrade > 12) return "Choose the class you study.";
    const accounts = readAccounts();
    if (accounts.some((item) => item.username.toLowerCase() === name.toLowerCase())) {
      return "That username is already in use. Sign in instead.";
    }
    const account: Account = {
      username: name,
      passwordHash: await hashPassword(password),
      studentId: crypto.randomUUID(),
      grade: chosenGrade,
      classSet: true,
      board: "cbse",
    };
    writeAccounts([...accounts, account]);
    localStorage.setItem("apt-session", account.username);
    sessionStorage.removeItem("apt-picking");
    sessionStorage.setItem("apt-entered", "1");
    setUsername(account.username);
    setStudentId(account.studentId);
    setGradeState(chosenGrade);
    setBoard("cbse");
    setGoal("learn");
    setClassOpen(true);
    return "";
  }

  async function signIn(rawName: string, password: string, chosenGrade: number) {
    const name = cleanName(rawName);
    if (!Number.isInteger(chosenGrade) || chosenGrade < 1 || chosenGrade > 12) return "Choose the class you study.";
    const account = readAccounts().find((item) => item.username.toLowerCase() === name.toLowerCase());
    if (!account) return "Create an account with that username first.";
    if (account.passwordHash !== (await hashPassword(password))) return "The password does not match.";
    if (account.classSet && account.grade !== chosenGrade) {
      return `This account is for Class ${account.grade}. Class ${chosenGrade} is closed for this name.`;
    }
    const lockedGrade = account.classSet ? account.grade : chosenGrade;
    const accounts = readAccounts().map((item) =>
      item.username.toLowerCase() === name.toLowerCase() ? { ...item, grade: lockedGrade, classSet: true, board: "cbse" as const } : item,
    );
    writeAccounts(accounts);
    localStorage.setItem("apt-session", account.username);
    sessionStorage.removeItem("apt-picking");
    sessionStorage.setItem("apt-entered", "1");
    setUsername(account.username);
    setStudentId(account.studentId);
    setGradeState(lockedGrade);
    setBoard("cbse");
    setGoal(account.goal ?? "learn");
    setClassOpen(true);
    return "";
  }

  async function changePassword(current: string, next: string) {
    if (!username) return "Sign in first.";
    if (next.length < 4) return "Use a password of at least 4 characters.";
    const account = readAccounts().find((item) => item.username.toLowerCase() === username.toLowerCase());
    if (!account || account.passwordHash !== (await hashPassword(current))) return "The password does not match.";
    const passwordHash = await hashPassword(next);
    writeAccounts(
      readAccounts().map((item) => (item.username.toLowerCase() === username.toLowerCase() ? { ...item, passwordHash } : item)),
    );
    return "";
  }

  async function resetPassword(rawName: string, next: string) {
    const name = cleanName(rawName);
    if (next.length < 4) return "Use a password of at least 4 characters.";
    const account = readAccounts().find((item) => item.username.toLowerCase() === name.toLowerCase());
    if (!account) return "No account uses that name. Create an account instead.";
    const passwordHash = await hashPassword(next);
    writeAccounts(readAccounts().map((item) => (item.username.toLowerCase() === name.toLowerCase() ? { ...item, passwordHash } : item)));
    return "";
  }

  function signOut() {
    localStorage.removeItem("apt-session");
    sessionStorage.removeItem("apt-entered");
    sessionStorage.removeItem("apt-picking");
    setUsername("");
    setStudentId("");
    setClassOpen(false);
  }

  return (
    <StudentContext.Provider
      value={{
        ready,
        studentId,
        grade,
        username,
        classOpen,
        board,
        goal,
        setStudy,
        deleteAccount,
        setGrade,
        confirmClass,
        reopenClass,
        signIn,
        signUp,
        changePassword,
        resetPassword,
        signOut,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const value = useContext(StudentContext);
  if (!value) throw new Error("useStudent must be used inside StudentProvider");
  return value;
}
