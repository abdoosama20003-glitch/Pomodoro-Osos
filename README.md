# FitForge | Premium Home Fitness System

A state-of-the-art, comprehensive fitness tracking platform built with Next.js 15, Tailwind CSS v4, and Framer Motion. FitForge is designed to bring a premium, start-up level aesthetic (dark futuristic UI, glassmorphism) directly to your browser. 

All user data is automatically and persistently saved in the browser via `localStorage`, ensuring your workouts, nutrition, habits, and weight logs are never lost.

## Features

- **Dynamic Dashboard**: View daily calorie consumption, hydration progress, weight tracking, and daily habits with an integrated streak counter and motivational content.
- **Workout Tracking**: Follow structured workout programs, mark exercises as complete to maintain streaks, view built-in YouTube technique videos, and use the floating stopwatch for rest times.
- **Nutrition & Hydration**: Add custom meals with exact calorie/protein counts, track water intake with quick-add buttons and a dynamic liquid progress visualization. You can also easily undo water additions or delete meals.
- **Weight Analytics**: Log weight directly, compare against your target goal, and view your weight progression over time via beautiful Recharts graphs.
- **Daily Discipline (Habits)**: Track and maintain daily essential habits (workout, walking, sleep, hydration, clean eating) featuring a beautiful circular completion ring and high-quality background imagery.
- **Settings**: Fully customizable user profile, fitness metrics, and app preferences.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Context API + LocalStorage
- **Language**: TypeScript

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Design Philosophy

The application utilizes a dark, cyberpunk-inspired futuristic design system. The aesthetics borrow heavily from premium platforms like Nike Training Club and Apple Fitness, featuring deep backgrounds (`#060816`), neon-tinted gradients, translucent glassmorphism panels, and high-quality photography instead of generic vectors.
