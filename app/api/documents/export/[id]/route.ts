import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

function generateResumeHTML(content: any): string {
  const data = typeof content === 'string' ? JSON.parse(content) : content;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personalInfo?.name || 'Resume'}</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 2.5em; color: #2c3e50; }
        .contact-info { margin: 10px 0; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
        .experience-item, .education-item, .project-item { margin-bottom: 20px; }
        .experience-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
        .job-title { font-weight: bold; font-size: 1.1em; }
        .company { color: #7f8c8d; }
        .date { color: #95a5a6; font-style: italic; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #ecf0f1; padding: 5px 10px; border-radius: 5px; font-size: 0.9em; }
        ul { padding-left: 20px; }
        @media print { body { padding: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>${data.personalInfo?.name || 'Your Name'}</h1>
        <div class="contact-info">
            ${data.personalInfo?.email || ''} | ${data.personalInfo?.phone || ''} | ${data.personalInfo?.location || ''}
            ${data.personalInfo?.linkedin ? `| ${data.personalInfo.linkedin}` : ''}
        </div>
    </div>

    ${data.summary ? `
    <div class="section">
        <h2>Professional Summary</h2>
        <p>${data.summary}</p>
    </div>
    ` : ''}

    ${data.experience?.length ? `
    <div class="section">
        <h2>Experience</h2>
        ${data.experience.map((exp: any) => `
        <div class="experience-item">
            <div class="experience-header">
                <div>
                    <div class="job-title">${exp.title}</div>
                    <div class="company">${exp.company}</div>
                </div>
                <div class="date">${exp.startDate} - ${exp.endDate || 'Present'}</div>
            </div>
            <p>${exp.description}</p>
            ${exp.achievements?.length ? `
            <ul>
                ${exp.achievements.map((achievement: string) => `<li>${achievement}</li>`).join('')}
            </ul>
            ` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.skills?.length ? `
    <div class="section">
        <h2>Skills</h2>
        <div class="skills">
            ${data.skills.map((skill: string) => `<span class="skill">${skill}</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${data.education?.length ? `
    <div class="section">
        <h2>Education</h2>
        ${data.education.map((edu: any) => `
        <div class="education-item">
            <div class="experience-header">
                <div>
                    <div class="job-title">${edu.degree}</div>
                    <div class="company">${edu.school}</div>
                </div>
                <div class="date">${edu.graduationDate}</div>
            </div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${data.projects?.length ? `
    <div class="section">
        <h2>Projects</h2>
        ${data.projects.map((project: any) => `
        <div class="project-item">
            <div class="job-title">${project.name}</div>
            <p>${project.description}</p>
            ${project.technologies?.length ? `
            <div class="skills">
                ${project.technologies.map((tech: string) => `<span class="skill">${tech}</span>`).join('')}
            </div>
            ` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>
  `;
}

function generateCoverLetterHTML(content: any): string {
  const data = typeof content === 'string' ? JSON.parse(content) : content;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cover Letter - ${data.header?.name || 'Cover Letter'}</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.8; color: #333; max-width: 700px; margin: 0 auto; padding: 40px; }
        .header { margin-bottom: 40px; }
        .sender-info { margin-bottom: 30px; }
        .sender-info h1 { margin: 0; font-size: 1.8em; color: #2c3e50; }
        .date { margin: 30px 0; color: #7f8c8d; }
        .recipient { margin-bottom: 30px; }
        .content { margin-bottom: 30px; }
        .content p { margin-bottom: 20px; text-align: justify; }
        .signature { margin-top: 40px; }
        @media print { body { padding: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="sender-info">
            <h1>${data.header?.name || 'Your Name'}</h1>
            <div>${data.header?.email || ''}</div>
            <div>${data.header?.phone || ''}</div>
            <div>${data.header?.location || ''}</div>
        </div>
        
        <div class="date">${data.header?.date || new Date().toLocaleDateString()}</div>
        
        <div class="recipient">
            <div>${data.recipient?.company || 'Hiring Manager'}</div>
            <div>${data.recipient?.address || ''}</div>
        </div>
    </div>

    <div class="content">
        <p>${data.content?.opening || ''}</p>
        <p>${data.content?.body?.replace(/\n/g, '</p><p>') || ''}</p>
        <p>${data.content?.closing || ''}</p>
    </div>
</body>
</html>
  `;
}

function generatePortfolioHTML(content: any): string {
  const data = typeof content === 'string' ? JSON.parse(content) : content;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.hero?.name || 'Portfolio'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 100px 0; text-align: center; }
        .hero h1 { font-size: 3em; margin-bottom: 10px; }
        .hero .title { font-size: 1.5em; margin-bottom: 20px; opacity: 0.9; }
        .hero .tagline { font-size: 1.2em; opacity: 0.8; }
        .section { padding: 80px 0; }
        .section h2 { font-size: 2.5em; text-align: center; margin-bottom: 50px; color: #2c3e50; }
        .about { background: #f8f9fa; }
        .skills { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 40px 0; }
        .skill { background: white; padding: 20px; border-radius: 10px; text-align: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .projects { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin: 40px 0; }
        .project { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
        .project-content { padding: 30px; }
        .project h3 { color: #2c3e50; margin-bottom: 15px; }
        .tech-stack { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
        .tech { background: #ecf0f1; padding: 5px 15px; border-radius: 20px; font-size: 0.9em; }
        .contact { background: #2c3e50; color: white; text-align: center; }
        .contact-links { display: flex; justify-content: center; gap: 30px; margin-top: 30px; }
        .contact-links a { color: white; text-decoration: none; font-size: 1.1em; }
        @media (max-width: 768px) { .hero h1 { font-size: 2em; } .section { padding: 50px 0; } }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>${data.hero?.name || 'Your Name'}</h1>
            <div class="title">${data.hero?.title || 'Professional Title'}</div>
            <div class="tagline">${data.hero?.tagline || 'Your professional tagline'}</div>
        </div>
    </section>

    <section class="section about">
        <div class="container">
            <h2>About Me</h2>
            <p style="text-align: center; font-size: 1.2em; max-width: 800px; margin: 0 auto;">
                ${data.about?.description || 'Your professional description goes here.'}
            </p>
            
            ${data.about?.skills?.length ? `
            <div class="skills">
                ${data.about.skills.map((skill: string) => `
                <div class="skill">
                    <strong>${skill}</strong>
                </div>
                `).join('')}
            </div>
            ` : ''}
        </div>
    </section>

    ${data.projects?.length ? `
    <section class="section">
        <div class="container">
            <h2>Projects</h2>
            <div class="projects">
                ${data.projects.map((project: any) => `
                <div class="project">
                    <div class="project-content">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        ${project.technologies?.length ? `
                        <div class="tech-stack">
                            ${project.technologies.map((tech: string) => `<span class="tech">${tech}</span>`).join('')}
                        </div>
                        ` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <section class="section contact">
        <div class="container">
            <h2 style="color: white;">Get In Touch</h2>
            <p style="font-size: 1.2em; opacity: 0.9;">Let's work together on your next project</p>
            <div class="contact-links">
                ${data.contact?.email ? `<a href="mailto:${data.contact.email}">Email</a>` : ''}
                ${data.contact?.linkedin ? `<a href="https://${data.contact.linkedin}">LinkedIn</a>` : ''}
                ${data.contact?.github ? `<a href="https://${data.contact.github}">GitHub</a>` : ''}
                ${data.contact?.website ? `<a href="https://${data.contact.website}">Website</a>` : ''}
            </div>
        </div>
    </section>
</body>
</html>
  `;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'html';

    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.user.id)
      .single();

    if (error) throw error;

    let htmlContent = '';
    
    switch (document.type) {
      case 'resume':
        htmlContent = generateResumeHTML(document.content);
        break;
      case 'cover_letter':
        htmlContent = generateCoverLetterHTML(document.content);
        break;
      case 'portfolio':
        htmlContent = generatePortfolioHTML(document.content);
        break;
      default:
        throw new Error('Unsupported document type for export');
    }

    if (format === 'html') {
      return new NextResponse(htmlContent, {
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `attachment; filename="${document.title}.html"`
        }
      });
    }

    // For future PDF export functionality
    return NextResponse.json({ error: 'PDF export not yet implemented' }, { status: 501 });
  } catch (error) {
    console.error('Error exporting document:', error);
    return NextResponse.json({ error: 'Error exporting document' }, { status: 500 });
  }
}