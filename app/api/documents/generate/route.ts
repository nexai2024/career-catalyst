import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Mock AI generation functions - in production, these would call actual AI services
async function generateResume(userProfile: any, jobDescription?: string) {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const resumeContent = {
    personalInfo: {
      name: userProfile.name || 'John Doe',
      email: userProfile.email || 'john@example.com',
      phone: userProfile.phone || '(555) 123-4567',
      location: userProfile.location || 'San Francisco, CA',
      linkedin: userProfile.linkedin || 'linkedin.com/in/johndoe',
      website: userProfile.website || 'johndoe.dev'
    },
    summary: userProfile.bio || 'Experienced professional with a strong background in technology and innovation. Proven track record of delivering high-quality solutions and driving business growth.',
    experience: userProfile.experience || [
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
    ],
    education: userProfile.education || [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        graduationDate: '2018'
      }
    ],
    skills: userProfile.skills || [
      'JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL'
    ],
    projects: userProfile.projects || [
      {
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform with React and Node.js',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
        link: 'github.com/johndoe/ecommerce'
      }
    ]
  };

  return resumeContent;
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
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { type, jobDescription, companyName, customizations } = await request.json();

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Get user profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    // Get user skills
    const { data: skills } = await supabase
      .from('user_skills')
      .select('*')
      .eq('user_id', user.user.id);

    // Get user experience
    const { data: experience } = await supabase
      .from('user_experiences')
      .select('*')
      .eq('user_id', user.user.id)
      .order('start_date', { ascending: false });

    // Combine user data
    const userProfile = {
      ...profile,
      skills: skills?.map(s => s.name) || [],
      experience: experience || []
    };

    let generatedContent;
    let title;

    switch (type) {
      case 'resume':
        generatedContent = await generateResume(userProfile, jobDescription);
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
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .insert({
        user_id: user.user.id,
        type,
        title,
        content: JSON.stringify(generatedContent),
        metadata: {
          jobDescription,
          companyName,
          customizations,
          generatedAt: new Date().toISOString()
        },
        status: 'generated'
      })
      .select()
      .single();

    if (documentError) throw documentError;

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