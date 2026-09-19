const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export type StudyRoom = {
  id: number;
  topic: string;
  description: string;
  goal: string | null;
  date: string;
  time: string;
  duration: string;
  host: string;
  participants: number;
  camera_on: boolean;
  intro_enabled: boolean;
  test_enabled: boolean;
  study_mode: string;
  recurring: boolean;
};

export type CreateStudyRoom = {
  topic: string;
  description: string;
  goal: string | null;
  date: string;
  time: string;
  duration: string;
  host: string;
  camera_on: boolean;
  intro_enabled: boolean;
  test_enabled: boolean;
  study_mode: string;
  recurring: boolean;
};

export async function getRooms(): Promise<StudyRoom[]> {
  const response = await fetch(`${API_URL}/rooms`);

  if (!response.ok) {
    throw new Error("Failed to fetch study rooms.");
  }

  return response.json();
}

export async function createRoom(
  room: CreateStudyRoom
): Promise<StudyRoom> {
  const response = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(room),
  });

  if (!response.ok) {
    throw new Error("Failed to create study room.");
  }

  return response.json();
}