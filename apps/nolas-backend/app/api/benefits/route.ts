import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// GET: Fetch all benefits. Seed one dummy benefit if empty.
export async function GET() {
  try {
    let benefits = await prisma.benefit.findMany({
      orderBy: { id: 'asc' },
    });

    if (benefits.length === 0) {
      // Seed dummy benefit
      const dummy = await prisma.benefit.create({
        data: {
          title: 'Decades of Sector Expertise',
          description: 'Leverage our deep experience working directly inside global payment networks and fintech giants to gain a competitive edge.',
          imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978',
        },
      });
      benefits = [dummy];
    }

    return NextResponse.json(benefits);
  } catch (error) {
    console.error('Error fetching benefits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch benefits' },
      { status: 500 }
    );
  }
}

// POST: Create a new benefit.
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

    const newBenefit = await prisma.benefit.create({
      data: {
        title,
        description,
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(newBenefit, { status: 201 });
  } catch (error) {
    console.error('Error creating benefit:', error);
    return NextResponse.json(
      { error: 'Failed to create benefit' },
      { status: 500 }
    );
  }
}
