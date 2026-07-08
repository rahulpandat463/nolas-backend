import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// GET: Fetch all hero sections. Seed one dummy entry if empty.
export async function GET() {
  try {
    let heroSections = await prisma.heroSection.findMany({
      orderBy: { id: 'asc' },
    });

    if (heroSections.length === 0) {
      // Seed dummy data
      const dummy = await prisma.heroSection.create({
        data: {
          title: 'Innovative borderless strategy consultants.',
          description: 'We partner with clients across the payments and fintech ecosystem to tackle their most challenging strategic problems and accelerate profitable growth.',
        },
      });
      heroSections = [dummy];
    }

    return NextResponse.json(heroSections);
  } catch (error) {
    console.error('Error fetching hero sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero sections' },
      { status: 500 }
    );
  }
}
