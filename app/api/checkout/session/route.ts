import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID é obrigatório' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
      payment_status: session.payment_status,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Erro ao recuperar sessão:', error);
    return NextResponse.json({ error: 'Erro ao verificar sessão' }, { status: 500 });
  }
}
