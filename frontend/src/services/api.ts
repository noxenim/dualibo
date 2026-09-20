const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const TOKEN_KEY = "paird_access_token";

export type User = {
  id: number;
  name: string;
  email: string;
};

export type StudyRoom = {
  id: number;
  topic: string;
  description: string;
  goal: string | null;
  date: string;
  time: string;
  duration: string;
  host_id: number;
  host_name: string;
  participants: number;
  camera_on: boolean;
  intro_enabled: boolean;
  test_enabled: boolean;
  study_mode: string;
  recurring: boolean;
  is_host: boolean;
  has_joined: boolean;
  is_full: boolean;
};

export type CreateStudyRoom = {
  topic: string;
  description: string;
  goal: string | null;
  date: string;
  time: string;
  duration: string;
  camera_on: boolean;
  intro_enabled: boolean;
  test_enabled: boolean;
  study_mode: string;
  recurring: boolean;
};

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

function authHeaders(): HeadersInit {
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      responseData?.detail || "Registration failed."
    );
  }

  return responseData;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<string> {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      responseData?.detail || "Login failed."
    );
  }

  return responseData.access_token;
}

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(
    `${API_URL}/auth/me`,
    {
      headers: {
        ...authHeaders(),
      },
    }
  );

  if (!response.ok) {
    removeToken();
    throw new Error("Authentication expired.");
  }

  return response.json();
}

export async function logoutUser(): Promise<void> {
  removeToken();
}

export async function getRooms(): Promise<StudyRoom[]> {
  const token = getToken();

  const headers: HeadersInit = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  const response = await fetch(
    `${API_URL}/rooms`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch study rooms."
    );
  }

  return response.json();
}

export async function createRoom(
  room: CreateStudyRoom
): Promise<StudyRoom> {
  const response = await fetch(
    `${API_URL}/rooms`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(room),
    }
  );

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      responseData?.detail ||
        "Failed to create study room."
    );
  }

  return responseData;
}

export async function getRoom(
  roomId: number
): Promise<StudyRoom> {
  const token = getToken();

  const headers: HeadersInit = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

  const response = await fetch(
    `${API_URL}/rooms/${roomId}`,
    {
      headers,
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch study room."
    );
  }

  return response.json();
}

export async function joinRoom(
  roomId: number
): Promise<StudyRoom> {
  const response = await fetch(
    `${API_URL}/rooms/${roomId}/join`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
      },
    }
  );

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      responseData?.detail ||
        "Unable to join the study room."
    );
  }

  return responseData;
}