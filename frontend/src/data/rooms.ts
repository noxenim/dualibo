export type StudyMode =
  | "Silent"
  | "Occasional discussion"
  | "Discussion welcome";

export type StudyRoom = {
  id: string;
  topic: string;
  description: string;
  goal: string;
  date: string;
  time: string;
  duration: string;
  host: string;
  participants: number;
  cameraOn: boolean;
  introEnabled: boolean;
  testEnabled: boolean;
  studyMode: StudyMode;
  recurring: boolean;
};

const STORAGE_KEY = "paird_rooms";

function getToday(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const defaultRooms: StudyRoom[] = [
  {
    id: "demo-1",
    topic: "Machine Learning",
    description: "Linear regression and regularization",
    goal: "Finish Chapter 3",
    date: getToday(),
    time: "20:00",
    duration: "1 hour",
    host: "Aanya",
    participants: 1,
    cameraOn: true,
    introEnabled: true,
    testEnabled: true,
    studyMode: "Discussion welcome",
    recurring: false,
  },
  {
    id: "demo-2",
    topic: "Operating Systems",
    description: "Deadlocks and scheduling",
    goal: "Revise deadlocks",
    date: getToday(),
    time: "20:00",
    duration: "1 hour",
    host: "Rishi",
    participants: 1,
    cameraOn: true,
    introEnabled: true,
    testEnabled: false,
    studyMode: "Silent",
    recurring: false,
  },
];

export function getRooms(): StudyRoom[] {
  const storedRooms = localStorage.getItem(STORAGE_KEY);

  if (!storedRooms) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultRooms)
    );

    return defaultRooms;
  }

  try {
    return JSON.parse(storedRooms);
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultRooms)
    );

    return defaultRooms;
  }
}

export function getRoomById(
  roomId: string
): StudyRoom | undefined {
  const rooms = getRooms();

  return rooms.find((room) => room.id === roomId);
}

export function saveRoom(room: StudyRoom): void {
  const rooms = getRooms();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...rooms, room])
  );
}

export function updateRoom(
  roomId: string,
  updates: Partial<StudyRoom>
): StudyRoom | undefined {
  const rooms = getRooms();

  const updatedRooms = rooms.map((room) =>
    room.id === roomId
      ? { ...room, ...updates }
      : room
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updatedRooms)
  );

  return updatedRooms.find(
    (room) => room.id === roomId
  );
}

export function createRoomId(): string {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}