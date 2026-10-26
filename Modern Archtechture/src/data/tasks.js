const DAY = 86400000;

export const STATUSES = [
  { key: "todo", label: "To do" },
  { key: "in-progress", label: "In progress" },
  { key: "review", label: "In review" },
  { key: "done", label: "Done" },
];

export function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY);
}

function parseDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const TASKS = [
  {
    phase: "discovery",
    title: "Project brief and site analysis",
    owner: "Emma Rodriguez",
    pri: "high",
    status: "done",
    progress: 100,
  },
  {
    phase: "discovery",
    title: "Survey and client requirements",
    owner: "Sarah Johnson",
    pri: "med",
    status: "done",
    progress: 100,
  },
  {
    phase: "concept",
    title: "Concept design and mood boards",
    owner: "Emma Rodriguez",
    pri: "high",
    status: "done",
    progress: 100,
  },
  {
    phase: "concept",
    title: "Client concept review",
    owner: "Michael Chen",
    pri: "med",
    status: "review",
    progress: 85,
  },
  {
    phase: "design",
    title: "Detailed drawings and specifications",
    owner: "Michael Chen",
    pri: "high",
    status: "in-progress",
    progress: 45,
  },
  {
    phase: "design",
    title: "Materials and finishes approval",
    owner: "Laila Noori",
    pri: "med",
    status: "todo",
    progress: 0,
  },
  {
    phase: "execution",
    title: "Construction and site coordination",
    owner: "Bilal Ahmadi",
    pri: "high",
    status: "todo",
    progress: 0,
  },
  {
    phase: "execution",
    title: "Project handover",
    owner: "Sarah Johnson",
    pri: "high",
    status: "todo",
    progress: 0,
    milestone: true,
  },
];

export function buildTasks(project) {
  const due = project?.due
    ? parseDate(project.due)
    : addDays(startOfToday(), 180);
  const projectId = project?.id ?? "project";

  return TASKS.map((task, index) => {
    const start = addDays(due, -193 + index * 25);

    return {
      ...task,
      id: `${projectId}-${index + 1}`,
      project: projectId,
      start,
      end: task.milestone ? start : addDays(start, 18),
    };
  });
}
