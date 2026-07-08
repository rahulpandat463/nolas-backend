import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// GET: Fetch all services. Seed one dummy service if the table is empty.
export async function GET() {
  try {
    let services = await prisma.service.findMany({
      orderBy: { id: 'asc' },
    });

    if (services.length === 0) {
      // Seed dummy service
      const dummy = await prisma.service.create({
        data: {
          title: 'Dummy Strategy Consulting',
          description: 'This is a description of the dummy strategy consulting service.',
          imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
        },
      });
      services = [dummy];
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST: Create a new service.
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

    const newService = await prisma.service.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
