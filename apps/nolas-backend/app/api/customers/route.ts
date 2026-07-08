import { NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// GET: Fetch all customers. Seed one dummy customer if empty.
export async function GET() {
  try {
    let customers = await prisma.ourCustomer.findMany({
      orderBy: { id: 'asc' },
    });

    if (customers.length === 0) {
      // Seed dummy customer
      const dummy = await prisma.ourCustomer.create({
        data: {
          title: 'Acme Corporation',
          description: 'Acme is a global leader in providing digital asset solutions and cross-border payment networks.',
          points: [
            'Successfully integrated unified payment infrastructure.',
            'Reduced settlement times by 60% across North America.',
            'Expanded regulatory coverage into European markets.',
          ],
          imageUrl: 'https://images.unsplash.com/photo-1516880711640-ef7db81be3e1',
        },
      });
      customers = [dummy];
    }

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST: Create a new customer.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, points, imageUrl } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required fields.' },
        { status: 400 }
      );
    }

    // Verify points is an array of strings
    if (points !== undefined && (!Array.isArray(points) || !points.every(p => typeof p === 'string'))) {
      return NextResponse.json(
        { error: 'Points must be an array of strings.' },
        { status: 400 }
      );
    }

    const newCustomer = await prisma.ourCustomer.create({
      data: {
        title,
        description,
        points: points || [],
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
