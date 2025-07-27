import { auth } from '@clerk/nextjs/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { UserContext } from "@/contexts/User";
import { useContext } from 'react'; 
import ServerUser from '@/lib/server-user';
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { checkUsage, incrementUsage } from '@/lib/subscription';
// Mock AI generation functions - in production, these would call actual AI services
async function GenerateResume(userProfile: any, jobDescription?: string) {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  const user = await ServerUser();
  if (!user || !user.id) {
    throw new Error('User not authenticated');
  }
  // Mock resume content based on user profile and job description
  
  const skills = user.skills || [
    'JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'
  ];
  const experiences = user.experiences || [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      startDate: '2021-06',
      endDate: 'Present',
      description: 'Lead development of scalable web applications using React, Node.js, and cloud technologies.',
      achievements: [
        'Improved application performance by 40% through optimization',
        'Led a team of 5 developers on critical projects',      
        'Implemented CI/CD pipelines reducing deployment time by 60%'
      ]
    }
  ];
  const education = user.education || [
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      graduationDate: '2018'
    }
  ];
  const certifications = user.certifications || [
    {
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2022-05',
      url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'
    }
  ];
  const awards = user.awards || [
    {
      title: 'Employee of the Year',
      date: '2023-01',
      issuer: 'TechCorp Inc.',
      summary: 'Recognized for outstanding contributions to the team and exceptional performance.'    
    }
  ];
  const projects = user.projects || [
    {
      name: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce platform with React and Node.js',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'], 
      link: 'github.com/johndoe/ecommerce'
    }
  ];

  const systemPrompt = getResumePrompt();
  const userPrompt = `Here's my information: ${userProfile}, skills: ${skills}, experience: ${experiences},
  education: ${education}, certifications: ${certifications}, awards: ${awards}, projects: ${projects}`

  const { text } = await generateText({
    model: google("models/gemini-2.0-flash-exp"),
    system: systemPrompt,
    prompt: userPrompt,
    })
}
  // Combine all data into a structured resume format
  // const resumeContent = {
  //   personalInfo: {
  //     name: userProfile.name || 'John Doe',
  //     email: userProfile.email || 'john@example.com',
  //     phone: userProfile.phone || '(555) 123-4567',
  //     location: userProfile.location || 'San Francisco, CA',
  //     linkedin: userProfile.linkedin || 'linkedin.com/in/johndoe',
  //     website: userProfile.website || 'johndoe.dev'
  //   },
  //   summary: userProfile.bio || 'Experienced professional with a strong background in technology and innovation. Proven track record of delivering high-quality solutions and driving business growth.',
  //   experience: userProfile.experience || [
  //     {
  //       title: 'Senior Software Engineer',
  //       company: 'TechCorp Inc.',
  //       location: 'San Francisco, CA',
  //       startDate: '2021-06',
  //       endDate: 'Present',
  //       description: 'Lead development of scalable web applications using React, Node.js, and cloud technologies.',
  //       achievements: [
  //         'Improved application performance by 40% through optimization',
  //         'Led a team of 5 developers on critical projects',
  //         'Implemented CI/CD pipelines reducing deployment time by 60%'
  //       ]
  //     }
  //   ],
  //   education: userProfile.education || [
  //     {
  //       degree: 'Bachelor of Science in Computer Science',
  //       school: 'University of California, Berkeley',
  //       location: 'Berkeley, CA',
  //       graduationDate: '2018'
  //     }
  //   ],
  //   skills: userProfile.skills || [
  //     'JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'
  //   ],
  //   projects: userProfile.projects || [
  //     {
  //       name: 'E-commerce Platform',
  //       description: 'Built a full-stack e-commerce platform with React and Node.js',
  //       technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
  //       link: 'github.com/johndoe/ecommerce'
  //     }
  //   ]
  // };

//  return resumeContent;
//}

function getResumePrompt() {
  return `"Your task is to generate a resume that will help me secure a job. I will provide you with two sets of information. 
  The first set includes my work experience, educational background, skills, and any relevant certifications or awards. The second set is a
  detailed description of the job I'm applying for, including the company name, job title, responsibilities, and required qualifications.

Based on this information, create a resume that highlights the skills and experiences that align most closely with the job requirements. 
Emphasize the value I can bring to the company and how my qualifications make me a strong candidate for the position. The language should be 
formal, concise, and positive.

Your response should be formatted as jsom, with the following structure:
{
  "basics": {
    "name": "John Doe",
    "label": "Programmer",
    "image": "",
    "email": "john@gmail.com",
    "phone": "(912) 555-4321",
    "url": "https://johndoe.com",
    "summary": "A summary of John Doe…",
    "location": {
      "address": "2712 Broadway St",
      "postalCode": "CA 94115",
      "city": "San Francisco",
      "countryCode": "US",
      "region": "California"
    },
    "introduction": "introduction with highlightas that align with the job description",
    "profiles": [{
      "network": "Twitter",
      "username": "john",
      "url": "https://twitter.com/john"
    }]
  },
  "work": [{
    "name": "Company",
    "position": "President",
    "url": "https://company.com",
    "startDate": "2013-01-01",
    "endDate": "2014-01-01",
    "summary": "Description…",
    "highlights": [
      "Started the company"
    ]
  }],
  "volunteer": [{
    "organization": "Organization",
    "position": "Volunteer",
    "url": "https://organization.com/",
    "startDate": "2012-01-01",
    "endDate": "2013-01-01",
    "summary": "Description…",
    "highlights": [
      "Awarded 'Volunteer of the Month'"
    ]
  }],
  "education": [{
    "institution": "University",
    "url": "https://institution.com/",
    "area": "Software Development",
    "studyType": "Bachelor",
    "startDate": "2011-01-01",
    "endDate": "2013-01-01",
    "score": "4.0",
    "courses": [
      "DB1101 - Basic SQL"
    ]
  }],
  "awards": [{
    "title": "Award",
    "date": "2014-11-01",
    "awarder": "Company",
    "summary": "There is no spoon."
  }],
  "certificates": [{
    "name": "Certificate",
    "date": "2021-11-07",
    "issuer": "Company",
    "url": "https://certificate.com"
  }],
  "publications": [{
    "name": "Publication",
    "publisher": "Company",
    "releaseDate": "2014-10-01",
    "url": "https://publication.com",
    "summary": "Description…"
  }],
  "skills": [{
    "name": "Web Development",
    "level": "Master",
    "keywords": [
      "HTML",
      "CSS",
      "JavaScript"
    ]
  }],
  "languages": [{
    "language": "English",
    "fluency": "Native speaker"
  }],
  "interests": [{
    "name": "Wildlife",
    "keywords": [
      "Ferrets",
      "Unicorns"
    ]
  }],
  "references": [{
    "name": "Jane Doe",
    "reference": "Reference…"
  }],
  "projects": [{
    "name": "Project",
    "startDate": "2019-01-01",
    "endDate": "2021-01-01",
    "description": "Description...",
    "highlights": [
      "Won award at AIHacks 2016"
    ],
    "url": "https://project.com/"
  }]
}
  `
}
function getCoverLetterPrompt() {
  return `"Your task is to generate a cover letter that will help me secure a job. I will provide you with two sets of information.
  The first set includes my work experience, educational background, skills, and any relevant certifications or awards. The second set is a
  detailed description of the job I'm applying for, including the company name, job title, responsibilities, and required qualifications.
Based on this information, create a cover letter that highlights my qualifications and expresses my enthusiasm for the position.
Emphasize how my skills and experiences align with the company's needs and how I can contribute to their success. The tone should be professional, engaging, and tailored to the specific job and company.
Here's my information:
  `
}

function getPortfolioPrompt() {
  return `"Your task is to generate a portfolio that showcases my skills, projects, and professional background. I will provide you with my work experience, educational background, skills, and any relevant projects or achievements.
Based on this information, create a portfolio that highlights my key projects, skills, and experiences in a visually appealing and organized manner. The portfolio should include sections for an introduction, skills, projects, work experience, education, and contact information. Use a professional tone and ensure the content is tailored to my field of expertise.
Here's my information:
  `
} 

async function generateCoverLetter(userProfile: any, jobDescription: string, companyName: string) {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const coverLetterContent = {
    header: {
      name: userProfile.name || 'John Doe',
      email: userProfile.email || 'john@example.com',
      phone: userProfile.phone || '(555) 123-4567',
      location: userProfile.location || 'San Francisco, CA',
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    },
    recipient: {
      company: companyName || 'Hiring Manager',
      address: 'Company Address'
    },
    content: {
      opening: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the position at ${companyName}. With my background in ${userProfile.currentPosition || 'software development'} and passion for innovation, I am excited about the opportunity to contribute to your team.`,
      body: `In my current role as ${userProfile.currentPosition || 'Senior Software Engineer'}, I have developed expertise in building scalable applications and leading technical initiatives. My experience aligns well with your requirements, particularly in areas such as:\n\n• Full-stack development with modern technologies\n• Team leadership and mentoring\n• Performance optimization and system design\n• Agile development methodologies\n\nI am particularly drawn to ${companyName} because of your commitment to innovation and technical excellence. I believe my skills and experience would be valuable additions to your team.`,
      closing: `I would welcome the opportunity to discuss how my background and enthusiasm can contribute to ${companyName}'s continued success. Thank you for considering my application. I look forward to hearing from you.\n\nSincerely,\n${userProfile.name || 'John Doe'}`
    }
  };

  return coverLetterContent;
}

async function generatePortfolio(userProfile: any) {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  const portfolioContent = {
    hero: {
      name: userProfile.name || 'John Doe',
      title: userProfile.currentPosition || 'Software Engineer',
      tagline: 'Building innovative solutions with modern technology',
      bio: userProfile.bio || 'Passionate developer with expertise in full-stack development and a love for creating user-centric applications.',
      image: userProfile.image || '/placeholder-avatar.jpg'
    },
    about: {
      description: `I'm a ${userProfile.currentPosition || 'software engineer'} with ${userProfile.yearsExperience || '5+'} years of experience in building web applications. I specialize in modern JavaScript frameworks and have a strong background in both frontend and backend development.`,
      skills: userProfile.skills || [
        'JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'
      ],
      interests: ['Open Source', 'Machine Learning', 'UI/UX Design', 'Mentoring']
    },
    projects: userProfile.projects || [
      {
        id: 1,
        title: 'E-commerce Platform',
        description: 'A full-featured e-commerce platform built with React and Node.js',
        image: '/project-1.jpg',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com/johndoe/ecommerce',
        featured: true
      },
      {
        id: 2,
        title: 'Task Management App',
        description: 'A collaborative task management application with real-time updates',
        image: '/project-2.jpg',
        technologies: ['Vue.js', 'Express', 'Socket.io', 'MongoDB'],
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com/johndoe/taskapp',
        featured: true
      }
    ],
    experience: userProfile.experience || [
      {
        title: 'Senior Software Engineer',
        company: 'TechCorp Inc.',
        period: '2021 - Present',
        description: 'Lead development of scalable web applications and mentor junior developers.'
      }
    ],
    contact: {
      email: userProfile.email || 'john@example.com',
      linkedin: userProfile.linkedin || 'linkedin.com/in/johndoe',
      github: userProfile.github || 'github.com/johndoe',
      website: userProfile.website || 'johndoe.dev'
    }
  };

  return portfolioContent;
}

export async function POST(request: Request) {
    const prismaClient = prisma;
  
const user = await auth();
  if (!user || !user.userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  
  try {
    const { type, jobDescription, companyName, customizations } = await request.json();

    const { hasAccess, message } = await checkUsage(user.userId, 'document_generation');
    if (!hasAccess) {
      return NextResponse.json({ error: message }, { status: 403 });
    }

    // Get user profile data
    const profile = await prismaClient?.user.findUnique({
      where: { id: user.userId },
      include: {
        profiles: true,
        skills: true,
        experiences: {
          orderBy: { startDate: 'desc' }
        }
      }
    });

    // Combine user data
    const userProfile = {
      ...profile
    };

    let generatedContent;
    let title;

    switch (type) {
      case 'resume':
        generatedContent = await GenerateResume(userProfile, jobDescription);
        title = `Resume - ${new Date().toLocaleDateString()}`;
        break;
      case 'cover_letter':
        generatedContent = await generateCoverLetter(userProfile, jobDescription, companyName);
        title = `Cover Letter - ${companyName || 'Application'}`;
        break;
      case 'portfolio':
        generatedContent = await generatePortfolio(userProfile);
        title = `Portfolio - ${userProfile.name || 'Professional'}`;
        break;
      default:
        throw new Error('Invalid document type');
    }

    // Save the generated document
  
      const document = prismaClient?.document.create({
        data: {
          userId: user.userId,
          type,
          title,
          content: JSON.stringify(generatedContent),
        }
      });
    if (!document) throw new Error('Failed to save document');  

    await incrementUsage(user.userId, 'document_generation');


    return NextResponse.json({
      document,
      content: generatedContent
    });
  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Error generating document' 
    }, { status: 500 });
  }
}