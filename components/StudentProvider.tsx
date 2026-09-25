"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Account = {
  username: string;
  passwordHash: string;
  studentId: string;
  grade: number;
};

type StudentContextValue = {
  ready: boolean;
  studentId: string;
  grade: number;
  username: string;
  classOpen: boolean;
  setGrade: (grade: number) => void;
  confirmClass: (grade: number) => void;
  reopenClass: () => void;
  signIn: (username: string, password: string) => Promise<string>;
  signUp: (username: string, password: string) => Promise<string>;
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const accounts = readAccounts();
    const saved = localStorage.getItem("apt-session") ?? "";
    const account = accounts.find((item) => item.username.toLowerCase() === saved.toLowerCase());
    if (account) {
      setUsername(account.username);
      setStudentId(account.studentId);
      setGradeState(account.grade);
      setClassOpen(sessionStorage.getItem("apt-entered") === "1");
    }
    setReady(true);
  }, []);

  function setGrade(next: number) {
    setGradeState(next);
    if (!username) return;
    const accounts = readAccounts().map((item) =>
      item.username.toLowerCase() === username.toLowerCase() ? { ...item, grade: next } : item,
    );
    writeAccounts(accounts);
  }

  function confirmClass(next: number) {
    setGrade(next);
    sessionStorage.setItem("apt-entered", "1");
    setClassOpen(true);
  }

  function reopenClass() {
    sessionStorage.removeItem("apt-entered");
    setClassOpen(false);
  }

  async function signUp(rawName: string, password: string) {
    const name = cleanName(rawName);
    if (!/^[A-Za-z0-9]{3,20}$/.test(name)) {
      return "Use 3 to 20 letters or numbers for the username.";
    }
    if (password.length < 4) return "Use a password of at least 4 characters.";
    const accounts = readAccounts();
    if (accounts.some((item) => item.username.toLowerCase() === name.toLowerCase())) {
      return "That username is already in use. Sign in instead.";
    }
    const account: Account = {
      username: name,
      passwordHash: await hashPassword(password),
      studentId: crypto.randomUUID(),
      grade,
    };
    writeAccounts([...accounts, account]);
    localStorage.setItem("apt-session", account.username);
    setUsername(account.username);
    setStudentId(account.studentId);
    return "";
  }

  async function signIn(rawName: string, password: string) {
    const name = cleanName(rawName);
    const account = readAccounts().find((item) => item.username.toLowerCase() === name.toLowerCase());
    if (!account) return "Create an account with that username first.";
    if (account.passwordHash !== (await hashPassword(password))) return "The password does not match.";
    localStorage.setItem("apt-session", account.username);
    setUsername(account.username);
    setStudentId(account.studentId);
    setGradeState(account.grade);
    return "";
  }

  function signOut() {
    localStorage.removeItem("apt-session");
    sessionStorage.removeItem("apt-entered");
    setUsername("");
    setStudentId("");
    setClassOpen(false);
  }

  return (
    <StudentContext.Provider
      value={{ ready, studentId, grade, username, classOpen, setGrade, confirmClass, reopenClass, signIn, signUp, signOut }}
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
