import asyncio
import aiohttp
import math

# Base URL of the Flask app
BASE_URL = 'http://localhost:5000/add'

# Define parameters for the sine wave
ID_VALUE = "speed"  # Example sensor ID
INTERVAL = 0.05  # Interval between data transmissions in seconds
FREQUENCY = 0.1  # Frequency of the sine wave
AMPLITUDE = 10.0  # Amplitude of the sine wave

async def send_data(session, payload):
    try:
        async with session.post(BASE_URL, data=payload) as response:
            if response.status != 200:
                print("error")
    except Exception as e:
        print(f"Error sending data: {e}")

async def simulate_data_transmission():
    t = 0  # Initial time value
    async with aiohttp.ClientSession() as session:
        while True:
            # Calculate the sine wave value based on time
            float_value = AMPLITUDE * math.sin(2 * math.pi * FREQUENCY * t)

            # Prepare the data payload
            payload = {
                'id': ID_VALUE,
                'value': float_value
            }

            # Send data asynchronously
            await send_data(session, payload)

            # Increment time and wait for the specified interval
            t += INTERVAL
            await asyncio.sleep(INTERVAL)

if __name__ == "__main__":
    # Run the async function in the asyncio event loop
    asyncio.run(simulate_data_transmission())
