import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
    console.log('Fetching ebooks...');
    const prismaClient = prisma;
    const user = await auth();
    if (!user || !user.userId) {    
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }       
    console.log('Fetching documents for user:', user.userId);
    try {
    const ebooks = await prismaClient.ebook.findMany();
    
  
      return NextResponse.json(ebooks);
    } catch (error) {
      console.error('Error fetching documents:', error);
      return NextResponse.json({ error: 'Error fetching documents' }, { status: 500 });
    }
  }
  
  export async function POST(request: Request) {
   
    
    try {
    const prismaClient = prisma;
    const user = await auth();
    if (!user || !user.userId) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { title, author, publicationDate } = body;

    if (!title || !author || !publicationDate) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newEbook = await prismaClient.ebook.create({
        data: {
            title,
            author,
            publicationDate,
            genre: body.genre || 'Unknown', // Provide a default value if not supplied
            description: body.description || 'No description provided',
            coverImage: body.coverImage || 'default-cover.jpg',
            filePath: body.filePath || '/default/path/to/ebook',
            rating: body.rating || 0, // Default rating value
            availability: body.availability || 'In Stock', // Default availability value
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    return NextResponse.json(newEbook, { status: 201 });
    } catch (error) {
      console.error('Error creating document:', error);
      return NextResponse.json({ error: 'Error creating document' }, { status: 500 });
    }
  }