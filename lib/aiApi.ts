/**
 * AI Service API Client
 * Communicates with the Python FastAPI backend at http://127.0.0.1:8000
 */

const AI_BASE_URL = "http://127.0.0.1:8000";

export interface AIQueryRequest {
  description: string;
}

export interface AIQueryResponse {
  input_description: string;
  matched_description: string;
  cta: string;
  similarity_score: number;
  deeplink: string;
  route?: string;
}

export interface BalanceQueryRequest {
  balance: number;
}

export interface BalanceQueryResponse {
  balance: number;
  suggestions: string[];
}

export interface CreditCardRecommendation {
  name: string;
  reason: string;
  benefits: string[];
  apply_url: string;
  potential_savings: string;
}

export interface CreditCardRecommendationsResponse {
  spending_summary: {
    total_spent: number;
    travel_spend: number;
    food_spend: number;
    grocery_spend: number;
    entertainment_spend: number;
  };
  recommendations: CreditCardRecommendation[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  cta?: {
    label: string;
    route: string;
  };
  creditCardRecommendations?: CreditCardRecommendation[];
  timestamp: number;
}

/**
 * Query the AI for matching services based on user input
 */
export async function queryAI(query: string): Promise<AIQueryResponse> {
  try {
    const response = await fetch(`${AI_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: query }),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error querying AI:", error);
    throw error;
  }
}

/**
 * Get balance-based suggestions from AI
 */
export async function getBalanceSuggestions(
  balance: number
): Promise<BalanceQueryResponse> {
  try {
    const response = await fetch(`${AI_BASE_URL}/suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ balance }),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting balance suggestions:", error);
    throw error;
  }
}

/**
 * Get credit card recommendations based on transactions
 */
export async function getCreditCardRecommendations(
  transactions: any[]
): Promise<CreditCardRecommendationsResponse> {
  try {
    const response = await fetch(`${AI_BASE_URL}/credit-card-recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions }),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting balance suggestions:", error);
    throw error;
  }
}

export interface PFMDashboardResponse {
  image_base64: string;
}

/**
 * Get PFM dashboard image based on transactions
 */
export async function getPFMDashboardImage(
  transactions: any[]
): Promise<PFMDashboardResponse> {
  try {
    const response = await fetch(`${AI_BASE_URL}/pfm-dashboard-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactions),
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting PFM dashboard image:", error);
    throw error;
  }
}

/**
 * Check if AI service is available
 */
export async function checkAIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${AI_BASE_URL}/`, {
      method: "GET",
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
