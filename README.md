
# 🌦️ [Weather Forecast App](https://rohitpalekar.github.io/Weather_Forecast/)

A responsive and interactive Weather Forecast Application built using **HTML**, **Tailwind CSS**, and **JavaScript**. It fetches real-time weather data based on the user's input or location.

## 📁 Project Structure

```
WEATHER_PROJECT/
│
├── img/                  # Images used in the project (e.g., icons)
├── node_modules/         # Node dependencies
├── index.html            # Main HTML file
├── input.css             # Tailwind CSS input file
├── output.css            # Compiled Tailwind CSS file
├── script.js             # JavaScript logic
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Lockfile for dependencies
├── .gitignore            # Git ignore rules
```

## 🛠️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <https://github.com/RohitPalekar/Weather_Forecast.git>
   ```

2. **Install Tailwind CSS Dependencies**
   Make sure you have **Node.js** and **npm** installed.

   ```bash
   npm install tailwindcss @tailwindcss/cli
   ```

3. **Build Tailwind CSS**
   You can build your `output.css` using Tailwind CLI:

   ```bash
   npx tailwindcss -i ./input.css -o ./output.css --watch
   ```

   > This command will watch for changes in `input.css` and compile them into `output.css`.

4. **Open the App**
   Open `index.html` in your browser or use Live Server (VS Code extension) for real-time development.

## 🚀 Features

- 🌍 Search weather by city or use current location
- 🌡️ Shows temperature, humidity, weather conditions, and more
- 📱 Responsive UI with Tailwind CSS
- ⚡ Dynamic JavaScript DOM manipulation



