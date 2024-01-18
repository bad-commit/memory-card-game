# Memory Card Game

Welcome to the Memory Card Game! This is a simple React-based memory card matching game. Test your memory and have fun finding matching pairs of cards!

## Getting Started

Follow these steps to get the game up and running on your local environment.

### Prerequisites

Make sure you have Node.js and pnpm installed on your machine.

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository to your local machine.

```bash
git clone https://github.com/your-username/memory-card-game.git
```

2. Navigate to the project directory.
```bash
cd memory-card-game
```

3. Install the required node modules using pnpm.
```bash
pnpm i
```

### Running the Game
After the installation is complete, start the development server to run the game.
```bash
pnpm run dev
```
Open your web browser and go to the specific route to play the game.

### Game Instructions
- The goal of the game is to find all matching pairs of cards.
- Click on a card to reveal its image.
- Click on another card to see if it matches the first one.
- If the cards match, they will stay flipped. Otherwise, they will be flipped back.
- Keep flipping cards until all pairs are found.

### Additional Information
- The game fetches data from an external API to generate a set of unique card pairs.
- Player statistics, such as the number of matches and errors, are displayed during the game.
- The game congratulates the player upon successful completion.
