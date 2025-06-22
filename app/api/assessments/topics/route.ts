import { NextResponse } from 'next/server';

// Predefined topics with metadata for AI generation
const ASSESSMENT_TOPICS = [
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Programming Languages',
    description: 'Core JavaScript concepts, ES6+, async programming, and best practices',
    icon: '🟨',
    estimatedTime: '45-90 minutes',
    skillAreas: ['Syntax & Fundamentals', 'DOM Manipulation', 'Async Programming', 'ES6+ Features', 'Error Handling']
  },
  {
    id: 'react',
    name: 'React',
    category: 'Frontend Frameworks',
    description: 'React components, hooks, state management, and modern patterns',
    icon: '⚛️',
    estimatedTime: '60-120 minutes',
    skillAreas: ['Components & JSX', 'Hooks', 'State Management', 'Performance', 'Testing']
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Programming Languages',
    description: 'Python fundamentals, OOP, data structures, and libraries',
    icon: '🐍',
    estimatedTime: '45-90 minutes',
    skillAreas: ['Syntax & Basics', 'Data Structures', 'OOP', 'Libraries', 'Best Practices']
  },
  {
    id: 'data-structures',
    name: 'Data Structures',
    category: 'Computer Science',
    description: 'Arrays, linked lists, trees, graphs, and their implementations',
    icon: '🌳',
    estimatedTime: '60-120 minutes',
    skillAreas: ['Linear Structures', 'Trees', 'Graphs', 'Hash Tables', 'Complexity Analysis']
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    category: 'Computer Science',
    description: 'Sorting, searching, dynamic programming, and algorithm design',
    icon: '🔍',
    estimatedTime: '90-150 minutes',
    skillAreas: ['Sorting & Searching', 'Graph Algorithms', 'Dynamic Programming', 'Greedy Algorithms', 'Complexity']
  },
  {
    id: 'sql-databases',
    name: 'SQL & Databases',
    category: 'Data Management',
    description: 'SQL queries, database design, normalization, and optimization',
    icon: '🗄️',
    estimatedTime: '45-90 minutes',
    skillAreas: ['SQL Queries', 'Database Design', 'Normalization', 'Indexing', 'Transactions']
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend Development',
    description: 'Server-side JavaScript, APIs, middleware, and best practices',
    icon: '🟢',
    estimatedTime: '60-120 minutes',
    skillAreas: ['Core Modules', 'Express.js', 'APIs', 'Middleware', 'Security']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Programming Languages',
    description: 'Type system, interfaces, generics, and advanced TypeScript features',
    icon: '🔷',
    estimatedTime: '45-90 minutes',
    skillAreas: ['Type System', 'Interfaces', 'Generics', 'Advanced Types', 'Configuration']
  },
  {
    id: 'css',
    name: 'CSS & Styling',
    category: 'Frontend Development',
    description: 'CSS fundamentals, Flexbox, Grid, animations, and responsive design',
    icon: '🎨',
    estimatedTime: '45-75 minutes',
    skillAreas: ['Selectors & Properties', 'Layout (Flexbox/Grid)', 'Responsive Design', 'Animations', 'Preprocessors']
  },
  {
    id: 'git',
    name: 'Git & Version Control',
    category: 'Development Tools',
    description: 'Git commands, branching strategies, collaboration, and best practices',
    icon: '📝',
    estimatedTime: '30-60 minutes',
    skillAreas: ['Basic Commands', 'Branching & Merging', 'Collaboration', 'Advanced Features', 'Best Practices']
  },
  {
    id: 'system-design',
    name: 'System Design',
    category: 'Architecture',
    description: 'Scalability, load balancing, databases, caching, and distributed systems',
    icon: '🏗️',
    estimatedTime: '90-180 minutes',
    skillAreas: ['Scalability', 'Load Balancing', 'Caching', 'Database Design', 'Microservices']
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'Security',
    description: 'Security principles, common vulnerabilities, encryption, and best practices',
    icon: '🔒',
    estimatedTime: '60-120 minutes',
    skillAreas: ['Security Principles', 'Common Vulnerabilities', 'Encryption', 'Network Security', 'Best Practices']
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    category: 'AI & Data Science',
    description: 'ML algorithms, supervised/unsupervised learning, and model evaluation',
    icon: '🤖',
    estimatedTime: '90-150 minutes',
    skillAreas: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Feature Engineering', 'Deep Learning Basics']
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    category: 'Infrastructure',
    description: 'Cloud services, deployment, scaling, and cloud architecture patterns',
    icon: '☁️',
    estimatedTime: '60-120 minutes',
    skillAreas: ['Cloud Services', 'Deployment', 'Scaling', 'Security', 'Cost Optimization']
  },
  {
    id: 'devops',
    name: 'DevOps',
    category: 'Operations',
    description: 'CI/CD, containerization, monitoring, and infrastructure as code',
    icon: '⚙️',
    estimatedTime: '75-120 minutes',
    skillAreas: ['CI/CD', 'Containerization', 'Monitoring', 'Infrastructure as Code', 'Automation']
  }
];

export async function GET() {
  try {
    // Group topics by category
    const topicsByCategory = ASSESSMENT_TOPICS.reduce((acc, topic) => {
      if (!acc[topic.category]) {
        acc[topic.category] = [];
      }
      acc[topic.category].push(topic);
      return acc;
    }, {} as Record<string, typeof ASSESSMENT_TOPICS>);

    return NextResponse.json({
      topics: ASSESSMENT_TOPICS,
      categories: topicsByCategory,
      totalTopics: ASSESSMENT_TOPICS.length
    });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json({ error: 'Error fetching topics' }, { status: 500 });
  }
}