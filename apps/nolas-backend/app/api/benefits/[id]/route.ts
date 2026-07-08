import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const benefitId = parseInt(id, 10);
    if (isNaN(benefitId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const benefit = await prisma.benefit.findUnique({
      where: { id: benefitId },
    });

    if (!benefit) {
      return NextResponse.json({ error: 'Benefit not found' }, { status: 404 });
    }

    return NextResponse.json(benefit);
  } catch (error) {
    console.error('Error fetching benefit:', error);
    return NextResponse.json({ error: 'Failed to fetch benefit' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const benefitId = parseInt(id, 10);
    if (isNaN(benefitId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, imageUrl } = body;

    const existing = await prisma.benefit.findUnique({
      where: { id: benefitId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Benefit not found' }, { status: 404 });
    }

    const updated = await prisma.benefit.update({
      where: { id: benefitId },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating benefit:', error);
    return NextResponse.json({ error: 'Failed to update benefit' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const benefitId = parseInt(id, 10);
    if (isNaN(benefitId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const existing = await prisma.benefit.findUnique({
      where: { id: benefitId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Benefit not found' }, { status: 404 });
    }

    await prisma.benefit.delete({
      where: { id: benefitId },
    });

    return NextResponse.json({ message: 'Benefit deleted successfully' });
  } catch (error) {
    console.error('Error deleting benefit:', error);
    return NextResponse.json({ error: 'Failed to delete benefit' }, { status: 500 });
  }
}
