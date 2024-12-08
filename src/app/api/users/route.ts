import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {  // Removed unused request parameter
  try {
    const users = await prisma.user.findMany({
      include: {
        reviews: true
      }
    });
    return NextResponse.json(users);
  } catch (error: unknown) {  // Added type and using error in response
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password, // Note: Should be hashed before saving
        phone: data.phone,
        address: data.address,
        preferences: data.preferences || {}
      }
    });
    return NextResponse.json(user);
  } catch (error: unknown) {  // Added type and using error in response
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}