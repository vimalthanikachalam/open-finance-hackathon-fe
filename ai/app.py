
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import pandas as pd
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# Add CORS middleware to allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:1411", "http://127.0.0.1:1411"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Accepts POST with JSON body: [ ...list of transactions... ]
@app.post("/pfm-dashboard-image")
async def pfm_dashboard_image(request: Request):
    try:
        transactions = await request.json()
        if not isinstance(transactions, list) or len(transactions) == 0:
            return JSONResponse(content={"error": "No transactions provided."}, status_code=400)
        df = pd.json_normalize(transactions)
        df["TransactionDateTime"] = pd.to_datetime(df["TransactionDateTime"], errors="coerce")
        # Support both nested and flat Amount
        if "Amount.Amount" in df.columns:
            df["Amount.Amount"] = pd.to_numeric(df["Amount.Amount"], errors="coerce")
        elif "Amount" in df.columns:
            df["Amount.Amount"] = pd.to_numeric(df["Amount"].apply(lambda x: x.get("Amount") if isinstance(x, dict) else None), errors="coerce")
        else:
            df["Amount.Amount"] = None
        df["SignedAmount"] = df.apply(
            lambda x: x["Amount.Amount"] if str(x.get("CreditDebitIndicator", "")).lower() == "credit"
            else -x["Amount.Amount"], axis=1
        )
        insights = {}
        insights["total_transactions"] = len(df)
        insights["total_spent"] = round(df[df["SignedAmount"] < 0]["SignedAmount"].sum(), 2)
        insights["total_income"] = round(df[df["SignedAmount"] > 0]["SignedAmount"].sum(), 2)
        insights["net_balance_change"] = round(df["SignedAmount"].sum(), 2)
        if "MerchantDetails.MerchantName" in df.columns:
            top_merchants = (
                df.groupby("MerchantDetails.MerchantName")["SignedAmount"]
                .sum()
                .sort_values()
                .head(5)
            )
            insights["top_spending_merchants"] = top_merchants.to_dict()
        if "PaymentModes" in df.columns:
            insights["spending_by_payment_mode"] = (
                df.groupby("PaymentModes")["SignedAmount"].sum().to_dict()
            )
        df["Month"] = df["TransactionDateTime"].dt.to_period("M")
        monthly_trend = df.groupby("Month")["SignedAmount"].sum().to_dict()
        insights["monthly_spending_trend"] = {str(k): v for k, v in monthly_trend.items()}
        insights["average_transaction_amount"] = round(df["Amount.Amount"].mean(), 2)
        if "TransactionType" in df.columns:
            insights["transaction_type_breakdown"] = (
                df.groupby("TransactionType")["SignedAmount"].sum().to_dict()
            )
        # Prepare data series
        monthly_series = pd.Series(insights["monthly_spending_trend"])
        payment_mode_series = pd.Series(insights["spending_by_payment_mode"]) if "spending_by_payment_mode" in insights and insights["spending_by_payment_mode"] else pd.Series()
        type_breakdown_series = pd.Series(insights["transaction_type_breakdown"]) if "transaction_type_breakdown" in insights and insights["transaction_type_breakdown"] else pd.Series()
        merchant_series = pd.Series(insights["top_spending_merchants"]) if "top_spending_merchants" in insights and insights["top_spending_merchants"] else pd.Series()
        fig, axs = plt.subplots(2, 2, figsize=(14, 8))
        # Chart 1: Monthly Spending Trend
        if not monthly_series.empty and monthly_series.dtype.kind in 'fi':
            monthly_series.plot(kind="bar", color="skyblue", ax=axs[0, 0])
            axs[0, 0].set_title("Monthly Spending Trend")
            axs[0, 0].set_ylabel("Net Amount (AED)")
            axs[0, 0].set_xlabel("Month")
            axs[0, 0].tick_params(axis='x', rotation=45)
        else:
            axs[0, 0].text(0.5, 0.5, "No Data", ha='center', va='center')
            axs[0, 0].set_title("Monthly Spending Trend")
            axs[0, 0].axis('off')
        # Chart 2: Spending by Payment Mode
        if not payment_mode_series.empty:
            payment_mode_series.plot(kind="bar", color="orange", ax=axs[0, 1])
            axs[0, 1].set_title("Spending by Payment Mode")
            axs[0, 1].set_ylabel("Amount (AED)")
            axs[0, 1].tick_params(axis='x', rotation=45)
        else:
            axs[0, 1].text(0.5, 0.5, "No Data", ha='center', va='center')
            axs[0, 1].set_title("Spending by Payment Mode")
            axs[0, 1].axis('off')
        # Chart 3: Transaction Type Breakdown
        if not type_breakdown_series.empty:
            type_breakdown_series.plot(kind="bar", color="green", ax=axs[1, 0])
            axs[1, 0].set_title("Transaction Type Breakdown")
            axs[1, 0].set_ylabel("Amount (AED)")
            axs[1, 0].tick_params(axis='x', rotation=45)
        else:
            axs[1, 0].text(0.5, 0.5, "No Data", ha='center', va='center')
            axs[1, 0].set_title("Transaction Type Breakdown")
            axs[1, 0].axis('off')
        # Chart 4: Top Spending Merchants
        if not merchant_series.empty:
            merchant_series.plot(kind="bar", color="purple", ax=axs[1, 1])
            axs[1, 1].set_title("Top Spending Merchants")
            axs[1, 1].set_ylabel("Amount (AED)")
            axs[1, 1].tick_params(axis='x', rotation=45)
        else:
            axs[1, 1].text(0.5, 0.5, "No Data", ha='center', va='center')
            axs[1, 1].set_title("Top Spending Merchants")
            axs[1, 1].axis('off')
        plt.tight_layout()
        buf = BytesIO()
        plt.savefig(buf, format='png')
        plt.close(fig)
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        return JSONResponse(content={"image_base64": img_base64})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd

# Load your CSV
df = pd.read_csv("end_points.csv")

# Load credit card information
with open("creditcard.txt", "r", encoding="utf-8") as f:
    credit_cards_text = f.read()

# Build TF-IDF model on the descriptions
vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(df['description'])

# Define input model
class Query(BaseModel):
    description: str

@app.post("/predict")
def predict(query: Query):
    # Transform input description
    query_vec = vectorizer.transform([query.description])

    # Compute cosine similarity
    similarity = cosine_similarity(query_vec, X).flatten()

    # Find best match
    best_idx = similarity.argmax()
    best_match = df.iloc[best_idx]
    best_score = float(similarity[best_idx])
    
    print(best_match)
    
    # Check if the match is good enough and if the service is ready
    if best_score < 0.3:  # Low similarity threshold
        return {
            "input_description": query.description,
            "matched_description": "Service not available",
            "cta": "Coming Soon",
            "similarity_score": best_score,
            "deeplink": "/",
            "status": "not_ready",
            "message": "This service is not yet integrated. We're working on bringing you more features soon!"
        }
    
    # Check if service is ready
    service_status = best_match.get('status', 'ready')
    if service_status != 'ready':
        return {
            "input_description": query.description,
            "matched_description": best_match['description'],
            "cta": "Service Not Integrated",
            "similarity_score": best_score,
            "deeplink": "/",
            "status": "not_ready",
            "message": "This service is not yet integrated. Please check back later or explore our available services like Accounts, Balances, Beneficiaries, and Transactions."
        }
    
    return {
        "input_description": query.description,
        "matched_description": best_match['description'],
        "cta": best_match['cta'],
        "similarity_score": best_score,
        "deeplink": best_match['route'],
        "status": "ready"
    }


# Optional: simple root route
@app.get("/")
def home():
    return {"message": "Function name prediction API is running 🚀"}

# Credit card recommendations based on transactions
class TransactionData(BaseModel):
    transactions: list

@app.post("/credit-card-recommendations")
def credit_card_recommendations(data: TransactionData):
    try:
        transactions = data.transactions
        df_trans = pd.json_normalize(transactions)
        
        # Parse transaction data
        if "Amount.Amount" in df_trans.columns:
            df_trans["Amount.Amount"] = pd.to_numeric(df_trans["Amount.Amount"], errors="coerce")
        elif "Amount" in df_trans.columns:
            df_trans["Amount.Amount"] = pd.to_numeric(df_trans["Amount"].apply(lambda x: x.get("Amount") if isinstance(x, dict) else None), errors="coerce")
        else:
            df_trans["Amount.Amount"] = 0
            
        df_trans["SignedAmount"] = df_trans.apply(
            lambda x: x["Amount.Amount"] if str(x.get("CreditDebitIndicator", "")).lower() == "credit"
            else -x["Amount.Amount"], axis=1
        )
        
        # Calculate spending patterns
        total_spent = abs(df_trans[df_trans["SignedAmount"] < 0]["SignedAmount"].sum())
        
        # Categorize spending
        travel_keywords = ['airline', 'hotel', 'flight', 'travel', 'booking']
        food_keywords = ['talabat', 'restaurant', 'cafe', 'coffee', 'food', 'dining', 'delivery']
        grocery_keywords = ['lulu', 'supermarket', 'grocery', 'carrefour']
        entertainment_keywords = ['vox', 'cinema', 'movie', 'entertainment']
        
        travel_spend = 0
        food_spend = 0
        grocery_spend = 0
        entertainment_spend = 0
        
        for _, row in df_trans.iterrows():
            merchant = str(row.get('MerchantDetails.MerchantName', '')).lower()
            amount = abs(row['SignedAmount']) if row['SignedAmount'] < 0 else 0
            
            if any(keyword in merchant for keyword in travel_keywords):
                travel_spend += amount
            elif any(keyword in merchant for keyword in food_keywords):
                food_spend += amount
            elif any(keyword in merchant for keyword in grocery_keywords):
                grocery_spend += amount
            elif any(keyword in merchant for keyword in entertainment_keywords):
                entertainment_spend += amount
        
        recommendations = []
        scored_cards = []
        
        # Score each card based on spending patterns
        # Travel Card
        travel_score = travel_spend / max(total_spent, 1) * 100
        if travel_spend > 0:
            scored_cards.append({
                "score": travel_score,
                "card": {
                    "name": "Traveller Credit Card",
                    "reason": f"You spent AED {travel_spend:.2f} ({travel_score:.0f}% of total) on travel. Get 10% cashback on flights and hotels.",
                    "benefits": ["10% cashback on airline tickets", "10% cashback on hotel stays", "0 foreign currency fees", "Complimentary lounge access", "Travel insurance"],
                    "apply_url": "https://www.adcb.com/en/personal/cards/",
                    "potential_savings": f"Save up to AED {(travel_spend * 0.10):.2f} per month",
                    "category": "travel"
                }
            })
        
        # Food/Dining Card
        food_score = food_spend / max(total_spent, 1) * 100
        if food_spend > 0:
            scored_cards.append({
                "score": food_score,
                "card": {
                    "name": "Talabat ADCB Credit Card",
                    "reason": f"You spent AED {food_spend:.2f} ({food_score:.0f}% of total) on dining. Get 35% back on talabat orders.",
                    "benefits": ["35% back on talabat orders", "Unlimited free delivery", "Up to AED 750 welcome bonus", "Lounge access"],
                    "apply_url": "https://www.adcb.com/en/personal/cards/",
                    "potential_savings": f"Save up to AED {(food_spend * 0.35):.2f} per month",
                    "category": "dining"
                }
            })
        
        # Grocery Card
        grocery_score = grocery_spend / max(total_spent, 1) * 100
        if grocery_spend > 0:
            scored_cards.append({
                "score": grocery_score,
                "card": {
                    "name": "Lulu Platinum Credit Card",
                    "reason": f"You spent AED {grocery_spend:.2f} ({grocery_score:.0f}% of total) at groceries. Earn 8 LuLu Points per AED.",
                    "benefits": ["Earn up to 8 LuLu Points per AED", "Complimentary airport lounge access", "Buy 1 Get 1 Free Movie tickets", "Free for life"],
                    "apply_url": "https://www.adcb.com/en/personal/cards/",
                    "potential_savings": f"Earn up to {(grocery_spend * 8):.0f} LuLu Points per month",
                    "category": "grocery"
                }
            })
        
        # Entertainment Card
        entertainment_score = entertainment_spend / max(total_spent, 1) * 100
        if entertainment_spend > 0:
            scored_cards.append({
                "score": entertainment_score,
                "card": {
                    "name": "Etihad Guest Credit Card",
                    "reason": f"You spent AED {entertainment_spend:.2f} on entertainment. Earn miles on every purchase plus dining benefits.",
                    "benefits": ["Earn Etihad Guest Miles", "Priority boarding", "Extra baggage allowance", "Lounge access"],
                    "apply_url": "https://www.adcb.com/en/personal/cards/",
                    "potential_savings": f"Earn up to {(entertainment_spend * 2):.0f} miles per month",
                    "category": "entertainment"
                }
            })
        
        # Always include general cashback card (high spend)
        if total_spent > 1000:
            scored_cards.append({
                "score": 50,  # Medium priority
                "card": {
                    "name": "365 Cashback Credit Card",
                    "reason": f"With AED {total_spent:.2f} monthly spend, maximize rewards with up to 6% cashback on everyday purchases.",
                    "benefits": ["Up to 6% cashback on everyday spends", "AED 365 welcome bonus", "Up to AED 1,000 monthly cashback", "Hotel discounts"],
                    "apply_url": "https://www.adcb.com/en/personal/cards/",
                    "potential_savings": f"Save up to AED {min(total_spent * 0.06, 1000):.2f} per month",
                    "category": "cashback"
                }
            })
        
        # Premium card for high spenders
        if total_spent > 5000:
            scored_cards.append({
                "score": 60,
                "card": {
                    "name": "Infinite Credit Card",
                    "reason": f"Your high spending of AED {total_spent:.2f} qualifies you for premium benefits and exclusive privileges.",
                    "benefits": ["Unlimited airport lounge access", "Golf privileges", "Personal concierge", "Travel insurance up to AED 5M"],
                    "apply_url": "https://www.adcb.com/en/personal/cards/",
                    "potential_savings": f"Premium benefits worth AED {(total_spent * 0.08):.2f} per month",
                    "category": "premium"
                }
            })
        
        # Essential card for low spenders
        if total_spent < 1000:
            scored_cards.append({
                "score": 80,
                "card": {
                    "name": "Essential Cashback Credit Card",
                    "reason": "Perfect starter card with no annual fees and guaranteed 1% cashback on all purchases.",
                    "benefits": ["1% cashback on all purchases", "Up to AED 1000 cashback monthly", "Free for life", "Dining & Shopping Discounts"],
                    "apply_url": "https://www.adcb.com/en/personal/cards/",
                    "potential_savings": f"Save up to AED {(total_spent * 0.01):.2f} per month",
                    "category": "basic"
                }
            })
        
        # Islamic card option (always include as alternative)
        scored_cards.append({
            "score": 30,
            "card": {
                "name": "Islamic Credit Card",
                "reason": "Sharia-compliant card with no interest charges and ethical banking benefits.",
                "benefits": ["Sharia-compliant", "No interest charges", "Cashback on purchases", "Travel benefits"],
                "apply_url": "https://www.adcb.com/en/personal/cards/",
                "potential_savings": f"Ethical banking with rewards",
                "category": "islamic"
            }
        })
        
        # Sort by score (highest first) and take top cards
        scored_cards.sort(key=lambda x: x["score"], reverse=True)
        
        # Always show at least 3 different types of cards
        recommendations = []
        seen_categories = set()
        
        # First pass: Add high-scoring cards with unique categories
        for item in scored_cards:
            if len(recommendations) >= 4:
                break
            card = item["card"]
            if card["category"] not in seen_categories:
                recommendations.append(card)
                seen_categories.add(card["category"])
        
        # Second pass: Fill remaining slots with any other cards
        for item in scored_cards:
            if len(recommendations) >= 4:
                break
            card = item["card"]
            if card not in recommendations:
                recommendations.append(card)
        
        # Remove category field before returning (internal use only)
        for rec in recommendations:
            rec.pop("category", None)
        
        return {
            "spending_summary": {
                "total_spent": round(total_spent, 2),
                "travel_spend": round(travel_spend, 2),
                "food_spend": round(food_spend, 2),
                "grocery_spend": round(grocery_spend, 2),
                "entertainment_spend": round(entertainment_spend, 2)
            },
            "recommendations": recommendations[:4]  # Return top 4 diverse recommendations
        }
    except Exception as e:
        return {"error": str(e), "recommendations": []}

# Suggestion API based on balance
class BalanceQuery(BaseModel):
    balance: float

@app.post("/suggestions")
def suggestions(query: BalanceQuery):
    # Expanded suggestions logic
    if query.balance < 0:
        suggestions = [
            "Your balance is negative. Consider reducing expenses or transferring funds.",
            "Review your recent transactions for any unexpected charges.",
            "Set up alerts for low balance to avoid overdraft fees."
        ]
    elif query.balance < 100:
        suggestions = [
            "Your balance is critically low. Avoid any discretionary spending.",
            "Consider transferring funds from savings if available.",
            "Track upcoming bills to prevent missed payments."
        ]
    elif query.balance < 500:
        suggestions = [
            "Your balance is low. Monitor your spending and avoid unnecessary purchases.",
            "Look for ways to cut down on recurring expenses.",
            "Plan a budget for the upcoming week."
        ]
    elif query.balance < 2000:
        suggestions = [
            "Your balance is moderate. Consider saving a portion for emergencies.",
            "Review your monthly subscriptions for possible cancellations.",
            "Set a savings goal for the month."
        ]
    elif query.balance < 5000:
        suggestions = [
            "Your balance is healthy. Consider saving or investing.",
            "Explore high-yield savings accounts.",
            "Review your investment portfolio for diversification."
        ]
    elif query.balance < 20000:
        suggestions = [
            "Great balance! You may want to explore investment opportunities.",
            "Consult a financial advisor for long-term planning.",
            "Consider charitable donations or gifting."
        ]
    else:
        suggestions = [
            "Excellent financial standing! Consider advanced investment strategies.",
            "Review estate planning and tax optimization.",
            "Support community projects or philanthropy."
        ]
    return {
        "balance": query.balance,
        "suggestions": suggestions
    }


# pip3 install fastapi uvicorn scikit-learn pandas 
# python3 -m uvicorn app:app --reload
# python3 -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
# source venv/bin/activate && pip install -r requirements.txt

