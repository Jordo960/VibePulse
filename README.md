# VibePulse Nutrition 🥗

VibePulse is a high-performance, AI-powered nutrition and fitness tracker designed with a stunning glassmorphism aesthetic. It leverages the Google Gemini API to provide intelligent food analysis and metabolic insights.

**Live Demo**: [https://jordo960.github.io/Daily-Nutrition-Tracker/](https://jordo960.github.io/Daily-Nutrition-Tracker/)

## ✨ Key Features

- **🤖 AI Smart Logging**: Simply describe your meal (e.g., "A bowl of oats with chia seeds and a splash of almond milk") and let Gemini calculate the macros, fibre, and calories for you.
- **🧬 Metabolic Tracking**: Native support for **Net Carbs** (Total Carbs - Fibre). Track your gut health and glycemic impact with dedicated Fibre targets.
- **💎 Glassmorphism UI**: A modern, high-contrast interface designed for both light and dark modes with fluid animations.
- **🍱 Custom Meal Presets**: Save your unique recipes as templates for rapid one-tap logging.
- **💧 Hydration & Weight**: Integrated water tracking and weight progress visualization with interactive Recharts.
- **📊 Deep Analytics**: Weekly trends and metabolic efficiency ratios.

## 🚀 Getting Started

### Prerequisites

To use the AI Smart Logging feature, you need a Google Gemini API Key.

### Environment Setup

VibePulse expects an `API_KEY` environment variable. 

**Important:** Never hardcode your API key in the source code. For GitHub Pages, you typically use a local `.env` file for development and ensure the build process handles the key securely.

```bash
# Example for local development
export API_KEY=your_gemini_api_key_here
```

## 🛠️ Tech Stack

- **Framework**: React 19 (ES6 Modules)
- **Styling**: Tailwind CSS
- **AI**: @google/genai (Gemini 3 Flash)
- **Charts**: Recharts
- **Icons**: Material Symbols (Google)
- **Font**: Plus Jakarta Sans

## 📜 License

This project is open-source. Feel free to fork and build your own fitness pulse.
