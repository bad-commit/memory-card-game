import { useEffect, useState } from "react";
import cardBack from "./assets/cardBack.svg";

// Function to shuffle an array in place
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://fed-team.modyo.cloud/api/content/spaces/animals/types/game/entries?per_page=20"
        );
        const result = await response.json();
        setIsLoading(false);

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

  const handleCardClick = (key) => {
    // Check if the clicked card is already selected
    if (
      selectedCards.includes(key) ||
      selectedCards.length >= 2 ||
      matchedPairs.includes(key)
    ) {
      return; // Ignore clicks on already selected cards, more than two selected cards, or matched pairs
    }

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

        // // Clear the selected cards after a brief delay
        // setTimeout(() => {
        //   setSelectedCards([]);
        // }, 1000);
      }

      // Clear the selected cards after checking for a match
      setTimeout(() => {
        setSelectedCards([]);
      }, 1000); // timeout based on UI interaction needs
    }
  };

  if (isLoading) {
    // If it's loading, show this
    return (
      <div className="App">
        <h1>Cargando...</h1>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 text-4xl pb-8">
          Memory
        </h1>
        <div className="flex justify-center">
          <div className="text-3xl text-right">
            <p>Matches: {matchCount}</p>
            <p>Errors: {errorCount}</p>
          </div>
          <ul className="grid lg:grid-cols-5 md:grid-cols-3 justify-items-center gap-4 w-4/5">
            {cards.map((item) => (
              <li
                key={item.key}
                onClick={() => handleCardClick(item.key)}
                className="size-52"
              >
                {matchedPairs.includes(item.key) ||
                selectedCards.includes(item.key) ? (
                  <img
                    className="size-full"
                    src={item.fields.image.url}
                    alt={item.fields.image.title}
                  />
                ) : (
                  <img className="size-full" src={cardBack} alt="Card Back" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
