import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

  try {
    const { planId, email } = await request.json();

    // Mapear os planos para os Price IDs do Stripe
    const priceIdMap: Record<string, string> = {
      silver: process.env.STRIPE_PRICE_ID_SILVER ?? '',
      gold: process.env.STRIPE_PRICE_ID_GOLD ?? '',
      premium: process.env.STRIPE_PRICE_ID_PREMIUM ?? '',
    };

    const priceId = priceIdMap[planId];

    if (!priceId) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          quantity: 1,
          price: priceId,
        },
      ],
      mode: 'subscription',
      payment_method_types: ['card'],
      return_url: `${request.headers.get('origin')}/payment-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: email,
      metadata: {
        planId: planId,
      },
    });

    return NextResponse.json({
      id: session.id,
      client_secret: session.client_secret,
    });
  } catch (e) {
    console.error('Erro no checkout:', e);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
