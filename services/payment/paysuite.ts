// ============================================================
// PaySuite Integration (e-Mola)
// ============================================================

export type PaymentRequest = {
  reference: string;
  amount: number;
  phone: string;
  description: string;
};

export type PaymentResponse = {
  success: boolean;
  transactionId?: string;
  statusUrl?: string;
  error?: string;
};

const API_KEY = process.env.PAYSUITE_API_KEY || "";
const API_URL = process.env.PAYSUITE_API_URL || "https://api.paysuite.co.mz/v1";

/**
 * Initiates an e-Mola payment via PaySuite
 */
export async function initiatePayment(data: PaymentRequest): Promise<PaymentResponse> {
  if (!API_KEY) {
    console.warn("PaySuite API key missing. Mocking success response for development.");
    return {
      success: true,
      transactionId: `mock_tx_${Date.now()}`,
      statusUrl: `/checkout/pending?ref=${data.reference}`
    };
  }

  try {
    const response = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        method: "emola",
        reference: data.reference,
        amount: data.amount,
        customer: {
          phone: data.phone,
        },
        description: data.description,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/paysuite`
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to initiate payment");
    }

    const result = await response.json();
    
    return {
      success: true,
      transactionId: result.transaction_id,
      statusUrl: result.status_url || `/checkout/pending?ref=${data.reference}`
    };
  } catch (error: any) {
    console.error("PaySuite Payment Error:", error);
    return { success: false, error: error.message };
  }
}
