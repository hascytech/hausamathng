export interface Topic {
  id: string;
  classLevel: "SS1" | "SS2" | "SS3";
  title: string;
  description: string;
  videoUrl: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; value: string }[];
  correctAnswer: string;
  stepByStep: string[];
  explanation: string;
}

export const topics: Topic[] = [
  {
    id: "linear-equations",
    classLevel: "SS1",
    title: "Linear Equations",
    description: "Learn how to solve linear equations. In this lesson, we'll find the value of x in equations.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    order: 1,
  },
  {
    id: "indices",
    classLevel: "SS1",
    title: "Indices",
    description: "Learn the laws of indices and how to apply them to solve problems. We'll cover adding, subtracting, and multiplying indices.",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    order: 2,
  },
  {
    id: "quadratic-expressions",
    classLevel: "SS1",
    title: "Quadratic Expressions",
    description: "Understand quadratic expressions and how to factorize them. We'll learn how to use formulas to solve problems.",
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    order: 3,
  },
  {
    id: "trigonometry",
    classLevel: "SS2",
    title: "Trigonometry",
    description: "Learn sine, cosine, and tangent. We'll use them to calculate angles and sides of triangles.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    order: 1,
  },
  {
    id: "logarithms",
    classLevel: "SS2",
    title: "Logarithms",
    description: "Understand logarithms and their laws. We'll learn how to use logarithm tables and calculators.",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    order: 2,
  },
  {
    id: "surds",
    classLevel: "SS2",
    title: "Surds",
    description: "Learn how to simplify surds and rationalize the denominator. We'll practice arithmetic operations with surds.",
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    order: 3,
  },
  {
    id: "differentiation",
    classLevel: "SS3",
    title: "Differentiation",
    description: "Learn how to find the derivative of a function. We'll cover differentiation rules and their applications.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    order: 1,
  },
  {
    id: "integration",
    classLevel: "SS3",
    title: "Integration",
    description: "Understand integration as the reverse of differentiation. We'll learn how to integrate various functions.",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    order: 2,
  },
  {
    id: "probability",
    classLevel: "SS3",
    title: "Probability",
    description: "Learn how to calculate the likelihood of events. We'll cover probability rules and their applications.",
    videoUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    order: 3,
  },
];

export const classLevels = [
  { id: "SS1", label: "SS1", description: "Senior Secondary 1", topicCount: 3 },
  { id: "SS2", label: "SS2", description: "Senior Secondary 2", topicCount: 3 },
  { id: "SS3", label: "SS3", description: "Senior Secondary 3", topicCount: 3 },
];

export function getTopicsByClass(classLevel: string): Topic[] {
  return topics.filter((t) => t.classLevel === classLevel).sort((a, b) => a.order - b.order);
}

export function getTopicById(id: string): Topic | undefined {
  return topics.find((t) => t.id === id);
}

// Sample quiz questions (will be replaced by AI generation)
export function getSampleQuestions(topicId: string): QuizQuestion[] {
  const topic = getTopicById(topicId);
  if (!topic) return [];

  const questionSets: Record<string, QuizQuestion[]> = {
    "linear-equations": [
      {
        id: "le-1",
        question: "Solve: 2x + 5 = 13. What is the value of x?",
        options: [
          { label: "A", value: "3" },
          { label: "B", value: "4" },
          { label: "C", value: "5" },
          { label: "D", value: "6" },
        ],
        correctAnswer: "4",
        stepByStep: [
          "2x + 5 = 13",
          "2x = 13 - 5",
          "2x = 8",
          "x = 8 ÷ 2",
          "x = 4",
        ],
        explanation: "We started by subtracting 5 from both sides, then divided by 2 to find x.",
      },
      {
        id: "le-2",
        question: "If 3x - 7 = 14, what is x?",
        options: [
          { label: "A", value: "5" },
          { label: "B", value: "7" },
          { label: "C", value: "8" },
          { label: "D", value: "3" },
        ],
        correctAnswer: "7",
        stepByStep: [
          "3x - 7 = 14",
          "3x = 14 + 7",
          "3x = 21",
          "x = 21 ÷ 3",
          "x = 7",
        ],
        explanation: "We added 7 to both sides, then divided by 3.",
      },
      {
        id: "le-3",
        question: "Solve: 5x + 3 = 2x + 18",
        options: [
          { label: "A", value: "3" },
          { label: "B", value: "5" },
          { label: "C", value: "7" },
          { label: "D", value: "4" },
        ],
        correctAnswer: "5",
        stepByStep: [
          "5x + 3 = 2x + 18",
          "5x - 2x = 18 - 3",
          "3x = 15",
          "x = 15 ÷ 3",
          "x = 5",
        ],
        explanation: "We collected x terms on one side and constants on the other.",
      },
      {
        id: "le-4",
        question: "What is the value of x if x/4 = 6?",
        options: [
          { label: "A", value: "20" },
          { label: "B", value: "24" },
          { label: "C", value: "10" },
          { label: "D", value: "18" },
        ],
        correctAnswer: "24",
        stepByStep: [
          "x/4 = 6",
          "x = 6 × 4",
          "x = 24",
        ],
        explanation: "We multiplied both sides by 4 to eliminate the fraction.",
      },
      {
        id: "le-5",
        question: "Solve: 4(x - 2) = 20",
        options: [
          { label: "A", value: "5" },
          { label: "B", value: "6" },
          { label: "C", value: "7" },
          { label: "D", value: "8" },
        ],
        correctAnswer: "7",
        stepByStep: [
          "4(x - 2) = 20",
          "4x - 8 = 20",
          "4x = 20 + 8",
          "4x = 28",
          "x = 28 ÷ 4",
          "x = 7",
        ],
        explanation: "We expanded the bracket first, then solved as usual.",
      },
    ],
  };

  // For topics without specific questions, generate generic ones
  return questionSets[topicId] || [
    {
      id: `${topicId}-1`,
      question: `Question 1 on ${topic.title}: If a = 5, b = 3, what is a + b?`,
      options: [
        { label: "A", value: "7" },
        { label: "B", value: "8" },
        { label: "C", value: "9" },
        { label: "D", value: "6" },
      ],
      correctAnswer: "8",
      stepByStep: ["a + b", "= 5 + 3", "= 8"],
      explanation: "We added the values of a and b together.",
    },
    {
      id: `${topicId}-2`,
      question: `Question 2 on ${topic.title}: What is 12 × 3?`,
      options: [
        { label: "A", value: "33" },
        { label: "B", value: "36" },
        { label: "C", value: "39" },
        { label: "D", value: "30" },
      ],
      correctAnswer: "36",
      stepByStep: ["12 × 3", "= 36"],
      explanation: "We multiplied 12 by 3.",
    },
    {
      id: `${topicId}-3`,
      question: `Question 3 on ${topic.title}: What is 45 ÷ 9?`,
      options: [
        { label: "A", value: "4" },
        { label: "B", value: "5" },
        { label: "C", value: "6" },
        { label: "D", value: "7" },
      ],
      correctAnswer: "5",
      stepByStep: ["45 ÷ 9", "= 5"],
      explanation: "We divided 45 by 9.",
    },
    {
      id: `${topicId}-4`,
      question: `Question 4 on ${topic.title}: If x² = 49, what is x?`,
      options: [
        { label: "A", value: "6" },
        { label: "B", value: "7" },
        { label: "C", value: "8" },
        { label: "D", value: "9" },
      ],
      correctAnswer: "7",
      stepByStep: ["x² = 49", "x = √49", "x = 7"],
      explanation: "We found the square root of 49.",
    },
    {
      id: `${topicId}-5`,
      question: `Question 5 on ${topic.title}: What is 15% of 200?`,
      options: [
        { label: "A", value: "25" },
        { label: "B", value: "30" },
        { label: "C", value: "35" },
        { label: "D", value: "20" },
      ],
      correctAnswer: "30",
      stepByStep: ["15% of 200", "= 15/100 × 200", "= 0.15 × 200", "= 30"],
      explanation: "We converted the percentage to a decimal, then multiplied.",
    },
  ];
}

// Mock leaderboard data
export const leaderboardData = [
  { rank: 1, name: "Aminu Ibrahim", points: 450, accuracy: 92 },
  { rank: 2, name: "Fatima Yusuf", points: 420, accuracy: 88 },
  { rank: 3, name: "Musa Abdullahi", points: 380, accuracy: 85 },
  { rank: 4, name: "Aisha Bello", points: 350, accuracy: 82 },
  { rank: 5, name: "Usman Sani", points: 320, accuracy: 80 },
  { rank: 6, name: "Hafsat Mohammed", points: 290, accuracy: 78 },
  { rank: 7, name: "Ibrahim Garba", points: 270, accuracy: 76 },
  { rank: 8, name: "Zainab Abubakar", points: 250, accuracy: 74 },
  { rank: 9, name: "Suleiman Danladi", points: 230, accuracy: 72 },
  { rank: 10, name: "Hauwa Musa", points: 210, accuracy: 70 },
];
