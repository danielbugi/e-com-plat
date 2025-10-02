import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, customerName, customerEmail, customerPhone } =
      body;

    // In production, you would:
    // 1. Get your Tranzila terminal ID from environment variables
    // 2. Generate secure payment URL with Tranzila API
    // 3. Include all required parameters

    // For now, we'll create a mock payment URL
    // Replace this with actual Tranzila integration
    const tranzilaTerminalId = process.env.TRANZILA_TERMINAL_ID || "demo";

    // Tranzila payment URL structure (example)
    const paymentUrl = `https://direct.tranzila.com/${tranzilaTerminalId}/iframenew.php?sum=${amount}&currency=1&cred_type=1&orderId=${orderId}&contact=${customerName}&email=${customerEmail}&phone=${customerPhone}&successUrl=${process.env.NEXT_PUBLIC_URL}/order-confirmation?orderId=${orderId}&failureUrl=${process.env.NEXT_PUBLIC_URL}/checkout?error=payment_failed`;

    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
