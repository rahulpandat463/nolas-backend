import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// GET: Fetch all about-us entries. Seed one dummy entry if empty.
export async function GET() {
  try {
    let aboutEntries = await prisma.aboutUs.findMany({
      orderBy: { id: 'asc' },
    });

    if (aboutEntries.length === 0) {
      // Seed dummy about-us entry
      const dummy = await prisma.aboutUs.create({
        data: {
          title: 'Driving Growth Through Partnership',
          description: 'Nolas Capital is a borderless strategy consultancy specializing in payments, digital assets, and embedded finance. We deliver insights that help scale your business.',
          imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
        },
      });
      aboutEntries = [dummy];
    }

    return NextResponse.json(aboutEntries);
  } catch (error) {
    console.error('Error fetching about-us:', error);
    return NextResponse.json(
      { error: 'Failed to fetch about-us' },
      { status: 500 }
    );
  }
}

// POST: Create a new about-us entry.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, imageUrl } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required fields.' },
        { status: 400 }
      );
    }

    const newAbout = await prisma.aboutUs.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(newAbout, { status: 201 });
  } catch (error) {
    console.error('Error creating about-us entry:', error);
    return NextResponse.json(
      { error: 'Failed to create about-us entry' },
      { status: 500 }
    );
  }
}
