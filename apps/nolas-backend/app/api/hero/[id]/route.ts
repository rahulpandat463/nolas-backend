import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const heroId = parseInt(id, 10);
    if (isNaN(heroId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const hero = await prisma.heroSection.findUnique({
      where: { id: heroId },
    });

    if (!hero) {
      return NextResponse.json({ error: 'Hero section not found' }, { status: 404 });
    }

    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error fetching hero section:', error);
    return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const heroId = parseInt(id, 10);
    if (isNaN(heroId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description } = body;

    const existing = await prisma.heroSection.findUnique({
      where: { id: heroId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Hero section not found' }, { status: 404 });
    }

    const updated = await prisma.heroSection.update({
      where: { id: heroId },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating hero section:', error);
    return NextResponse.json({ error: 'Failed to update hero section' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const heroId = parseInt(id, 10);
    if (isNaN(heroId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const existing = await prisma.heroSection.findUnique({
      where: { id: heroId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Hero section not found' }, { status: 404 });
    }

    await prisma.heroSection.delete({
      where: { id: heroId },
    });

    return NextResponse.json({ message: 'Hero section deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero section:', error);
    return NextResponse.json({ error: 'Failed to delete hero section' }, { status: 500 });
  }
}
