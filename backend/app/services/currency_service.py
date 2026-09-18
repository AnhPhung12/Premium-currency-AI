import httpx

EXCHANGE_RATE_API = "https://open.er-api.com/v6/latest"

async def get_exchange_rates(base: str = "USD"):
    """Fetch latest exchange rates using ExchangeRate-API (free, supports VND)."""
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{EXCHANGE_RATE_API}/{base.upper()}")
            response.raise_for_status()
            data = response.json()
            return {
                "base": data.get("base_code"),
                "date": data.get("time_last_update_utc"),
                "rates": data.get("rates", {})
            }
        except Exception as e:
            print(f"Error fetching exchange rates: {e}")
            return None
