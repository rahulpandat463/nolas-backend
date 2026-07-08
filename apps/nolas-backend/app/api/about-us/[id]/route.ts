import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const aboutId = parseInt(id, 10);
    if (isNaN(aboutId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const entry = await prisma.aboutUs.findUnique({
      where: { id: aboutId },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error fetching about-us entry:', error);
    return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const aboutId = parseInt(id, 10);
    if (isNaN(aboutId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, imageUrl } = body;

    const existing = await prisma.aboutUs.findUnique({
      where: { id: aboutId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    const updated = await prisma.aboutUs.update({
      where: { id: aboutId },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating about-us entry:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const aboutId = parseInt(id, 10);
    if (isNaN(aboutId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const existing = await prisma.aboutUs.findUnique({
      where: { id: aboutId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    await prisma.aboutUs.delete({
      where: { id: aboutId },
    });

    return NextResponse.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting about-us entry:', error);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}
