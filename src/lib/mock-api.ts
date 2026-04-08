// Mock API layer - ready to replace with real endpoints

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface AIReviewResult {
  bugs: string[];
  improvements: string[];
  securityIssues: string[];
  optimizedCode: string;
}

export async function loginUser(email: string, password: string): Promise<User> {
  await delay(1200);
  if (email === "error@test.com") throw new Error("Invalid credentials");
  return {
    id: "user-1",
    name: email.split("@")[0],
    email,
    token: "mock-jwt-" + Date.now(),
  };
}

export async function signupUser(name: string, email: string, password: string): Promise<User> {
  await delay(1200);
  if (email === "exists@test.com") throw new Error("Email already registered");
  return {
    id: "user-" + Date.now(),
    name,
    email,
    token: "mock-jwt-" + Date.now(),
  };
}

export async function reviewCodeAPI(code: string, language: string): Promise<AIReviewResult> {
  await delay(2000);
  return {
    bugs: [
      "Potential null reference at line 12",
      "Unhandled promise rejection in async function",
    ],
    improvements: [
      "Consider using const instead of let for immutable variables",
      "Extract repeated logic into a utility function",
      "Add input validation for user-provided data",
    ],
    securityIssues: [
      "Avoid using eval() - potential code injection risk",
      "Sanitize user input before DOM insertion",
    ],
    optimizedCode: `// Optimized version\n${code.slice(0, 200)}\n// ... with improvements applied`,
  };
}

export async function sendMessage(roomId: string, text: string, user: User): Promise<ChatMessage> {
  await delay(300);
  return {
    id: "msg-" + Date.now(),
    userId: user.id,
    username: user.name,
    text,
    timestamp: Date.now(),
  };
}

// Mock active users for a room
export function getMockUsers() {
  return [
    { id: "user-1", name: "You", online: true },
    { id: "user-2", name: "Alice", online: true },
    { id: "user-3", name: "Bob", online: true },
    { id: "user-4", name: "Charlie", online: false },
  ];
}
