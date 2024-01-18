import { useEffect, useState } from "react";
import cardBack from "./assets/cardBack.svg";
import "@fontsource-variable/onest";
import cardClickSound from "./assets/card-flip-sound.mp3";

// Function to shuffle an array in place
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function App() {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const cardClickAudio = new Audio(cardClickSound);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20"
        );
        const result = await response.json();

        // Duplicate the array and add a suffix to the key
        const duplicatedCards = result.entries.flatMap((item) => [
          { ...item, key: `${item.meta.slug}-original` },
          {
            ...item,
            key: `${item.meta.slug}-copy`,
          },
        ]);

        // Shuffle the duplicated cards array
        const shuffledCards = shuffleArray([...duplicatedCards]);

        setCards(shuffledCards);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleStartGame = (name) => {
    setPlayerName(name);
    setIsGameStarted(true);
  };

  const handleGameCompletion = () => {
    // Logic to check if all cards are matched
    if (matchCount === 20) {
      // Display congratulations message
      alert(`You've already completed the game.`);
    }
  };

  if (!isGameStarted) {
    // Display input form to get player's name
    return (
      <div className="flex flex-col justify-center h-screen">
        <h1 className="text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 text-4xl pb-8">
          Welcome to the Memory Card Game!
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.elements.playerName.value;
            handleStartGame(name);
          }}
        >
          <div className="flex flex-col items-center gap-y-8">
            <div className="flex gap-x-2">
              <label className="text-xl" htmlFor="playerName">
                Please enter your name 😊:{" "}
              </label>
              <input
                className="w-fit shadow-lg rounded-sm"
                type="text"
                id="playerName"
                onInvalid={(e) =>
                  e.target.setCustomValidity("You must enter your name 😅")
                }
                onInput={(e) => e.target.setCustomValidity("")}
                required
              />
            </div>
            <button
              className="px-2 py-1 ring-1 ring-blue-400 rounded-sm text-xl hover:bg-blue-400 hover:text-white transition-all w-fit"
              type="submit"
            >
              Start Game
            </button>
          </div>
        </form>
      </div>
    );
  }

  const handleCardClick = (key) => {
    // Check if the clicked card is already selected
    if (
      selectedCards.includes(key) ||
      selectedCards.length >= 2 ||
      matchedPairs.includes(key)
    ) {
      return; // Ignore clicks on already selected cards, more than two selected cards, or matched pairs
    }

    // Play the card click sound
    cardClickAudio.play();

    setSelectedCards((prevSelected) => [...prevSelected, key]);

    // Check for a match when two cards are selected
    if (selectedCards.length === 1) {
      const [firstCard] = selectedCards;
      const firstIdentifier = firstCard.split("-")[0];
      const secondIdentifier = key.split("-")[0];

      if (firstIdentifier === secondIdentifier) {
        // It's a match
        setMatchCount((prevCount) => prevCount + 1);

        setMatchedPairs((prevPairs) => [...prevPairs, firstCard, key]);
      } else {
        // It's an error
        setErrorCount((prevCount) => prevCount + 1);
      }

      // Clear the selected cards after checking for a match
      setTimeout(() => {
        setSelectedCards([]);
      }, 1000); // timeout based on UI interaction
    }
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 text-5xl pb-8">
          Memory Card Game
        </h1>
        <div className="text-lg">
          <span>Rules:</span>
          <p>
            The rules are simple, just flip the cards until you find two
            identical! then just keep it up until you flip all the cards. <br />
            Easy peasy 👌
          </p>
          <span>Good luck!</span>
        </div>
        {matchCount === 20 && (
          <div className="pb-4">
            <h1 className="!leading-[1.5] md:text-4xl text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Congratulations, {playerName}! Youve completed the game.
            </h1>
          </div>
        )}
        <div className="flex flex-col items-center gap-y-6">
          <div className="flex flex-col gap-y-4 text-3xl md:text-right w-fit">
            <p className="px-2 py-1 bg-blue-400/30 rounded-md">
              Matches: <span className="">{matchCount}</span>
            </p>
            <p className="px-2 py-1 bg-blue-400/30 rounded-md">
              Errors: <span className="">{errorCount}</span>
            </p>
          </div>
          <ul className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 justify-items-center gap-4">
            {cards.map((item) => (
              <li
                onClick={() => {
                  handleCardClick(item.key);
                  handleGameCompletion();
                }}
                key={item.key}
                className={`sm:size-44 size-32 rounded-xl shadow-lg transform transition-all duration-500 cursor-pointer hover:shadow-2xl ${
                  matchedPairs.includes(item.key) ||
                  selectedCards.includes(item.key)
                    ? "flipped"
                    : ""
                }`}
              >
                <img
                  className="size-full rounded-xl shadow-xl"
                  src={
                    matchedPairs.includes(item.key) ||
                    selectedCards.includes(item.key)
                      ? item.fields.image.url
                      : cardBack
                  }
                  alt={
                    matchedPairs.includes(item.key) ||
                    selectedCards.includes(item.key)
                      ? item.fields.image.title
                      : "Card Back"
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
