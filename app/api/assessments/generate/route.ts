import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Mock AI service for generating assessments
async function generateAssessmentWithAI(topic: string, difficulty: string, questionCount: number, options: any) {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 3000));

  const assessmentData = {
    title: `${topic} Assessment - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level`,
    description: `Comprehensive assessment to evaluate your knowledge and skills in ${topic}. This assessment covers key concepts, practical applications, and advanced topics.`,
    instructions: `This assessment contains ${questionCount} questions designed to test your understanding of ${topic}. 

Instructions:
• Read each question carefully before answering
• For multiple choice questions, select the best answer
• For coding questions, provide complete and working solutions
• You have ${options.timeLimit || 60} minutes to complete this assessment
• A score of ${options.passingScore || 70}% or higher is required to pass

Good luck!`,
    timeLimitMinutes: options.timeLimit || 60,
    passingScore: options.passingScore || 70,
    questions: generateQuestionsForTopic(topic, difficulty, questionCount)
  };

  return assessmentData;
}

function generateQuestionsForTopic(topic: string, difficulty: string, count: number) {
  const questionTemplates = getQuestionTemplatesForTopic(topic, difficulty);
  const questions = [];

  // Ensure variety in question types
  const questionTypes = ['multiple_choice', 'true_false', 'short_answer', 'essay'];
  const typeDistribution = {
    multiple_choice: Math.ceil(count * 0.6), // 60% multiple choice
    true_false: Math.ceil(count * 0.2),      // 20% true/false
    short_answer: Math.ceil(count * 0.15),   // 15% short answer
    essay: Math.ceil(count * 0.05)           // 5% essay
  };

  let questionIndex = 0;

  for (const [type, typeCount] of Object.entries(typeDistribution)) {
    if (questionIndex >= count) break;

    const actualCount = Math.min(typeCount, count - questionIndex);
    const typeTemplates = questionTemplates[type as keyof typeof questionTemplates] || [];

    for (let i = 0; i < actualCount && questionIndex < count; i++) {
      const template = typeTemplates[i % typeTemplates.length];
      if (template) {
        questions.push({
          ...template,
          id: `q_${questionIndex + 1}`,
          order: questionIndex + 1,
          points: getPointsForDifficulty(difficulty, type)
        });
        questionIndex++;
      }
    }
  }

  return questions;
}

function getQuestionTemplatesForTopic(topic: string, difficulty: string) {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('javascript') || topicLower.includes('js')) {
    return getJavaScriptQuestions(difficulty);
  } else if (topicLower.includes('react')) {
    return getReactQuestions(difficulty);
  } else if (topicLower.includes('python')) {
    return getPythonQuestions(difficulty);
  } else if (topicLower.includes('data structure')) {
    return getDataStructureQuestions(difficulty);
  } else if (topicLower.includes('algorithm')) {
    return getAlgorithmQuestions(difficulty);
  } else if (topicLower.includes('database') || topicLower.includes('sql')) {
    return getDatabaseQuestions(difficulty);
  } else {
    return getGenericProgrammingQuestions(difficulty, topic);
  }
}

function getJavaScriptQuestions(difficulty: string) {
  const base = {
    multiple_choice: [
      {
        questionText: "What is the output of: console.log(typeof null)?",
        questionType: "multiple_choice",
        options: { choices: ["null", "undefined", "object", "boolean"] },
        correctAnswer: "object",
        explanation: "In JavaScript, typeof null returns 'object' due to a historical bug that has been kept for backward compatibility.",
        category: "JavaScript Fundamentals",
        difficulty
      },
      {
        questionText: "Which method is used to add an element to the end of an array?",
        questionType: "multiple_choice",
        options: { choices: ["push()", "pop()", "shift()", "unshift()"] },
        correctAnswer: "push()",
        explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array.",
        category: "JavaScript Arrays",
        difficulty
      }
    ],
    true_false: [
      {
        questionText: "JavaScript is a statically typed language.",
        questionType: "true_false",
        options: { choices: ["true", "false"] },
        correctAnswer: "false",
        explanation: "JavaScript is a dynamically typed language, meaning variable types are determined at runtime.",
        category: "JavaScript Fundamentals",
        difficulty
      }
    ],
    short_answer: [
      {
        questionText: "Explain the difference between 'let', 'const', and 'var' in JavaScript.",
        questionType: "short_answer",
        correctAnswer: "var is function-scoped and can be redeclared; let is block-scoped and can be reassigned but not redeclared; const is block-scoped and cannot be reassigned or redeclared.",
        explanation: "Understanding variable declarations is crucial for proper JavaScript development and avoiding common pitfalls.",
        category: "JavaScript Variables",
        difficulty
      }
    ],
    essay: [
      {
        questionText: "Describe the event loop in JavaScript and how it handles asynchronous operations. Provide examples of how callbacks, promises, and async/await work within this system.",
        questionType: "essay",
        correctAnswer: "The event loop is JavaScript's mechanism for handling asynchronous operations in a single-threaded environment...",
        explanation: "Understanding the event loop is essential for writing efficient asynchronous JavaScript code.",
        category: "JavaScript Async Programming",
        difficulty
      }
    ]
  };

  if (difficulty === 'hard') {
    base.multiple_choice.push({
      questionText: "What will be the output of this code?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100);\n}",
      questionType: "multiple_choice",
      options: { choices: ["0 1 2", "3 3 3", "undefined undefined undefined", "Error"] },
      correctAnswer: "3 3 3",
      explanation: "Due to closure and var's function scoping, all setTimeout callbacks reference the same variable i, which has value 3 after the loop completes.",
      category: "JavaScript Closures",
      difficulty
    });
  }

  return base;
}

function getReactQuestions(difficulty: string) {
  return {
    multiple_choice: [
      {
        questionText: "What is the purpose of the useEffect hook in React?",
        questionType: "multiple_choice",
        options: { choices: ["State management", "Side effects", "Component rendering", "Event handling"] },
        correctAnswer: "Side effects",
        explanation: "useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.",
        category: "React Hooks",
        difficulty
      },
      {
        questionText: "Which method is called when a component is first mounted?",
        questionType: "multiple_choice",
        options: { choices: ["componentDidUpdate", "componentWillUnmount", "componentDidMount", "componentWillMount"] },
        correctAnswer: "componentDidMount",
        explanation: "componentDidMount is called immediately after a component is mounted (inserted into the tree).",
        category: "React Lifecycle",
        difficulty
      }
    ],
    true_false: [
      {
        questionText: "React components must return a single root element.",
        questionType: "true_false",
        options: { choices: ["true", "false"] },
        correctAnswer: "false",
        explanation: "With React Fragments or React 16+, components can return multiple elements without a wrapper.",
        category: "React Components",
        difficulty
      }
    ],
    short_answer: [
      {
        questionText: "What is the difference between controlled and uncontrolled components in React?",
        questionType: "short_answer",
        correctAnswer: "Controlled components have their form data handled by React state, while uncontrolled components store their data in the DOM.",
        explanation: "Understanding this distinction is important for proper form handling in React applications.",
        category: "React Forms",
        difficulty
      }
    ],
    essay: [
      {
        questionText: "Explain the concept of Virtual DOM in React. How does it improve performance, and what is the reconciliation process?",
        questionType: "essay",
        correctAnswer: "The Virtual DOM is a JavaScript representation of the actual DOM...",
        explanation: "Understanding the Virtual DOM is crucial for optimizing React application performance.",
        category: "React Performance",
        difficulty
      }
    ]
  };
}

function getPythonQuestions(difficulty: string) {
  return {
    multiple_choice: [
      {
        questionText: "What is the output of: print(type([]))?",
        questionType: "multiple_choice",
        options: { choices: ["<class 'list'>", "<class 'array'>", "<class 'tuple'>", "<class 'dict'>"] },
        correctAnswer: "<class 'list'>",
        explanation: "[] creates an empty list, and type() returns the class type of the object.",
        category: "Python Data Types",
        difficulty
      }
    ],
    true_false: [
      {
        questionText: "Python is an interpreted language.",
        questionType: "true_false",
        options: { choices: ["true", "false"] },
        correctAnswer: "true",
        explanation: "Python is an interpreted language, meaning code is executed line by line by the Python interpreter.",
        category: "Python Fundamentals",
        difficulty
      }
    ],
    short_answer: [
      {
        questionText: "Explain the difference between a list and a tuple in Python.",
        questionType: "short_answer",
        correctAnswer: "Lists are mutable (can be changed) and use square brackets, while tuples are immutable (cannot be changed) and use parentheses.",
        explanation: "Understanding mutability is important for choosing the right data structure in Python.",
        category: "Python Data Structures",
        difficulty
      }
    ],
    essay: [
      {
        questionText: "Describe Python's Global Interpreter Lock (GIL) and its impact on multithreading. What are some alternatives for achieving parallelism in Python?",
        questionType: "essay",
        correctAnswer: "The GIL is a mutex that protects access to Python objects...",
        explanation: "Understanding the GIL is important for writing efficient concurrent Python programs.",
        category: "Python Concurrency",
        difficulty
      }
    ]
  };
}

function getDataStructureQuestions(difficulty: string) {
  return {
    multiple_choice: [
      {
        questionText: "What is the time complexity of searching in a balanced binary search tree?",
        questionType: "multiple_choice",
        options: { choices: ["O(1)", "O(log n)", "O(n)", "O(n log n)"] },
        correctAnswer: "O(log n)",
        explanation: "In a balanced BST, the height is log n, so search operations take O(log n) time.",
        category: "Tree Data Structures",
        difficulty
      }
    ],
    true_false: [
      {
        questionText: "A stack follows the FIFO (First In, First Out) principle.",
        questionType: "true_false",
        options: { choices: ["true", "false"] },
        correctAnswer: "false",
        explanation: "A stack follows LIFO (Last In, First Out) principle. FIFO is the principle of queues.",
        category: "Linear Data Structures",
        difficulty
      }
    ],
    short_answer: [
      {
        questionText: "Explain the difference between an array and a linked list.",
        questionType: "short_answer",
        correctAnswer: "Arrays store elements in contiguous memory with O(1) access time, while linked lists store elements in nodes with pointers, requiring O(n) access time but allowing dynamic size.",
        explanation: "Understanding these fundamental data structures is crucial for algorithm design.",
        category: "Basic Data Structures",
        difficulty
      }
    ],
    essay: [
      {
        questionText: "Compare and contrast different tree data structures (Binary Tree, BST, AVL Tree, Red-Black Tree). Discuss their use cases and performance characteristics.",
        questionType: "essay",
        correctAnswer: "Binary trees are the foundation, BSTs add ordering, AVL trees maintain strict balance...",
        explanation: "Understanding various tree structures is important for choosing the right data structure for specific problems.",
        category: "Advanced Tree Structures",
        difficulty
      }
    ]
  };
}

function getAlgorithmQuestions(difficulty: string) {
  return {
    multiple_choice: [
      {
        questionText: "What is the worst-case time complexity of QuickSort?",
        questionType: "multiple_choice",
        options: { choices: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"] },
        correctAnswer: "O(n²)",
        explanation: "QuickSort's worst case occurs when the pivot is always the smallest or largest element, leading to O(n²) complexity.",
        category: "Sorting Algorithms",
        difficulty
      }
    ],
    true_false: [
      {
        questionText: "Dijkstra's algorithm can handle negative edge weights.",
        questionType: "true_false",
        options: { choices: ["true", "false"] },
        correctAnswer: "false",
        explanation: "Dijkstra's algorithm assumes non-negative edge weights. For negative weights, use Bellman-Ford algorithm.",
        category: "Graph Algorithms",
        difficulty
      }
    ],
    short_answer: [
      {
        questionText: "Explain the difference between BFS and DFS traversal algorithms.",
        questionType: "short_answer",
        correctAnswer: "BFS explores nodes level by level using a queue, while DFS explores as far as possible along each branch using a stack or recursion.",
        explanation: "These are fundamental graph traversal algorithms with different use cases.",
        category: "Graph Traversal",
        difficulty
      }
    ],
    essay: [
      {
        questionText: "Describe dynamic programming and provide examples of problems that can be solved using this technique. Explain the concepts of overlapping subproblems and optimal substructure.",
        questionType: "essay",
        correctAnswer: "Dynamic programming is an optimization technique that solves complex problems by breaking them down into simpler subproblems...",
        explanation: "Dynamic programming is a crucial algorithmic technique for optimization problems.",
        category: "Dynamic Programming",
        difficulty
      }
    ]
  };
}

function getDatabaseQuestions(difficulty: string) {
  return {
    multiple_choice: [
      {
        questionText: "Which SQL command is used to retrieve data from a database?",
        questionType: "multiple_choice",
        options: { choices: ["INSERT", "UPDATE", "SELECT", "DELETE"] },
        correctAnswer: "SELECT",
        explanation: "SELECT is the SQL command used to query and retrieve data from database tables.",
        category: "SQL Basics",
        difficulty
      }
    ],
    true_false: [
      {
        questionText: "A primary key can contain NULL values.",
        questionType: "true_false",
        options: { choices: ["true", "false"] },
        correctAnswer: "false",
        explanation: "Primary keys must be unique and cannot contain NULL values.",
        category: "Database Constraints",
        difficulty
      }
    ],
    short_answer: [
      {
        questionText: "What is database normalization and why is it important?",
        questionType: "short_answer",
        correctAnswer: "Database normalization is the process of organizing data to reduce redundancy and improve data integrity by dividing large tables into smaller, related tables.",
        explanation: "Normalization is crucial for maintaining data consistency and reducing storage space.",
        category: "Database Design",
        difficulty
      }
    ],
    essay: [
      {
        questionText: "Compare and contrast SQL and NoSQL databases. Discuss their advantages, disadvantages, and appropriate use cases.",
        questionType: "essay",
        correctAnswer: "SQL databases are relational with ACID properties and structured schemas, while NoSQL databases are non-relational with flexible schemas...",
        explanation: "Understanding different database paradigms is important for choosing the right solution.",
        category: "Database Systems",
        difficulty
      }
    ]
  };
}

function getGenericProgrammingQuestions(difficulty: string, topic: string) {
  return {
    multiple_choice: [
      {
        questionText: `What is a key principle of ${topic}?`,
        questionType: "multiple_choice",
        options: { choices: ["Modularity", "Complexity", "Redundancy", "Ambiguity"] },
        correctAnswer: "Modularity",
        explanation: `Modularity is a fundamental principle in ${topic} that promotes code organization and reusability.`,
        category: topic,
        difficulty
      }
    ],
    true_false: [
      {
        questionText: `${topic} requires understanding of fundamental programming concepts.`,
        questionType: "true_false",
        options: { choices: ["true", "false"] },
        correctAnswer: "true",
        explanation: `Most programming topics build upon fundamental concepts.`,
        category: topic,
        difficulty
      }
    ],
    short_answer: [
      {
        questionText: `Describe a key concept in ${topic}.`,
        questionType: "short_answer",
        correctAnswer: `A key concept in ${topic} involves understanding its core principles and practical applications.`,
        explanation: `Understanding core concepts is essential for mastering ${topic}.`,
        category: topic,
        difficulty
      }
    ],
    essay: [
      {
        questionText: `Discuss the importance of ${topic} in modern software development and provide examples of its practical applications.`,
        questionType: "essay",
        correctAnswer: `${topic} plays a crucial role in modern software development...`,
        explanation: `Understanding the practical applications of ${topic} is important for real-world development.`,
        category: topic,
        difficulty
      }
    ]
  };
}

function getPointsForDifficulty(difficulty: string, questionType: string) {
  const basePoints = {
    multiple_choice: 1,
    true_false: 1,
    short_answer: 2,
    essay: 5
  };

  const multiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2
  };

  return Math.round(basePoints[questionType as keyof typeof basePoints] * multiplier[difficulty as keyof typeof multiplier]);
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { 
      topic, 
      difficulty = 'medium', 
      questionCount = 10,
      timeLimit = 60,
      passingScore = 70,
      randomizeQuestions = true,
      isPublished = false,
      startDate,
      endDate
    } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Generate assessment with AI
    const assessmentData = await generateAssessmentWithAI(topic, difficulty, questionCount, {
      timeLimit,
      passingScore
    });

    // Create the assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        title: assessmentData.title,
        description: assessmentData.description,
        instructions: assessmentData.instructions,
        time_limit_minutes: assessmentData.timeLimitMinutes,
        passing_score: assessmentData.passingScore,
        attempts_allowed: 3, // Default to 3 attempts
        randomize_questions: randomizeQuestions,
        is_published: isPublished,
        start_date: startDate || null,
        end_date: endDate || null,
        created_by: user.user.id
      })
      .select()
      .single();

    if (assessmentError) throw assessmentError;

    // Create questions and link them to the assessment
    const createdQuestions = [];
    for (let i = 0; i < assessmentData.questions.length; i++) {
      const questionData = assessmentData.questions[i];
      
      // Create the question
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert({
          question_text: questionData.questionText,
          question_type: questionData.questionType,
          options: 'options' in questionData ? questionData.options : null,
          correct_answer: questionData.correctAnswer,
          explanation: questionData.explanation,
          category: questionData.category,
          difficulty: questionData.difficulty,
          created_by: user.user.id
        })
        .select()
        .single();

      if (questionError) throw questionError;

      // Link question to assessment
      const { error: linkError } = await supabase
        .from('assessment_questions')
        .insert({
          assessment_id: assessment.id,
          question_id: question.id,
          points: questionData.points,
          question_order: i + 1
        });

      if (linkError) throw linkError;

      createdQuestions.push({
        ...question,
        points: questionData.points,
        question_order: i + 1
      });
    }

    return NextResponse.json({
      assessment: {
        ...assessment,
        questions: createdQuestions
      },
      message: `Successfully generated ${assessmentData.questions.length} questions for ${topic}`
    });

  } catch (error) {
    console.error('Error generating assessment:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Error generating assessment' 
    }, { status: 500 });
  }
}