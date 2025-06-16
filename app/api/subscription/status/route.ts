import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '');

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) return NextResponse.json({ active: false });

    // Buscar o cliente com base no e-mail
    const customers = await stripe.customers.list({
      limit: 1,
      email,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ active: false });
    }

    const customer = customers.data[0];

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1,
      expand: ['data.latest_invoice', 'data.plan.product'],
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ active: false });
    }

    const subscription = subscriptions.data[0];
    const latestInvoice = subscription.latest_invoice as Stripe.Invoice;

    const currentPeriodEnd = latestInvoice.lines.data[0]?.period?.end;
    const isStillValid = currentPeriodEnd ? Date.now() < currentPeriodEnd * 1000 : false;

    const planName =
      typeof subscription.plan.product === 'object' ? subscription.plan.product.name : 'Plano desconhecido';

    return NextResponse.json({
      active: isStillValid,
      planName,
      periodEndsAt: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
    });
  } catch (error) {
    console.error('Erro ao buscar assinatura:', error);
    return NextResponse.json({ active: false });
  }
}
