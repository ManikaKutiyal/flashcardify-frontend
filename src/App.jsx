// client/src/App.jsx 
import React, { useState, useEffect } from 'react';
import styles from './App.module.css';

function App() {
  const [decks, setDecks] = useState([]);  //1. State for data
  const [selectedDeck, setSelectedDeck] = useState(null); //1. State for data

  const [view, setView] = useState('decks');  // State for UI control

  const [title, setTitle] = useState('');  // State for forms
  const [cards, setCards] = useState([]);
  const [newCard, setNewCard] = useState({ front: '', back: '' });  //3. State for forms

  const [currentCardIndex, setCurrentCardIndex] = useState(0);  // State for Study Mode
  const [isFlipped, setIsFlipped] = useState(false);


  useEffect(() => {
    async function fetchDecks() {
      const response = await fetch('http://localhost:5001/api/decks');
      const data = await response.json();
      setDecks(data);
    }
    fetchDecks();
  }, []);

useEffect(() => {
    if (selectedDeck) {
      // Shuffle cards only when a new deck is selected for study
      if (view === 'study') {
        setCards(shuffleArray([...selectedDeck.cards])); // Shuffle for study mode
      } else {
        setCards(selectedDeck.cards); // Original order for manager mode
      }
    }
  }, [selectedDeck, view]); // Re-run if view changes, primarily for study mode trigger
  // Helper function to shuffle array (Fisher-Yates)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  // --- Handlers for Cards ---
  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!selectedDeck || !newCard.front || !newCard.back) return;
    const response = await fetch(`http://localhost:5001/api/decks/${selectedDeck._id}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCard),
    });
    const updatedDeck = await response.json();
    setDecks(decks.map(deck => deck._id === updatedDeck._id ? updatedDeck : deck));
    setSelectedDeck(updatedDeck);
    setNewCard({ front: '', back: '' });
  };

  const handleDeleteCard = async (cardId) => {
    if (!selectedDeck) return;
    const response = await fetch(`http://localhost:5001/api/decks/${selectedDeck._id}/cards/${cardId}`, {
      method: 'DELETE',
    });
    const updatedDeck = await response.json();
    setDecks(decks.map(deck => deck._id === updatedDeck._id ? updatedDeck : deck));
    setSelectedDeck(updatedDeck);
  };
// --- Handlers for Decks ---
  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!title) return;
    const response = await fetch('http://localhost:5001/api/decks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const newDeck = await response.json();
    setDecks([...decks, newDeck]);
    setTitle('');
  };

  const handleDeleteDeck = async (e, deckId) => {
    e.stopPropagation(); // Prevents the li's onClick from firing
    await fetch(`http://localhost:5001/api/decks/${deckId}`, {
      method: 'DELETE',
    });
    setDecks(decks.filter(deck => deck._id !== deckId));
  };

  // --- Handlers for UI Navigation ---
  const handleSelectDeck = (deck) => {
    setSelectedDeck(deck);
    setView('cards');
  };
  const handleBackToDecks = () => {
    setSelectedDeck(null);
    setView('decks');
  };
  const handleStartStudy = () => {
    if (selectedDeck && selectedDeck.cards.length > 0) {
      setCards(shuffleArray([...selectedDeck.cards])); // Shuffle for study mode
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setView('study');
    }
  }; 
  // --- Handlers for Study Mode ---
  const handleFlipCard = () => setIsFlipped(!isFlipped);
  const handleNextCard = () => {
    if (currentCardIndex < cards.length - 1) { // Use 'cards' state which is shuffled
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      // Optionally go back to cards view or show 'study complete' message
      alert("You've completed this deck!");
      setView('cards');
    }
  };
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };


  return (
    <div className={styles.container}>
      {/* VIEW 1: DECK LIST */}
      {view === 'decks' && (
        <div>
          <div className={styles.header}><h1>Flashcardify Decks</h1></div>
          <form onSubmit={handleCreateDeck} className={styles.form}>
            <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New deck title"/>
            <button type="submit" className={styles.button}>Create</button>
          </form>
          <ul className={styles.ul}>
            {decks.map((deck) => (
              <li key={deck._id} onClick={() => handleSelectDeck(deck)} className={styles.li}>
                {deck.title} ({deck.cards.length} cards)
                <button onClick={(e) => handleDeleteDeck(e, deck._id)} className={`${styles.button} ${styles.deleteDeckButton}`}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* VIEW 2: CARD MANAGER */}
      {view === 'cards' && selectedDeck && (
        <div>
          <div className={styles.header}>
            <button onClick={handleBackToDecks} className={`${styles.button} ${styles.backButton}`}>← Back</button>
            <h2>{selectedDeck.title}</h2>
            {selectedDeck.cards.length > 0 && <button onClick={handleStartStudy} className={`${styles.button} ${styles.studyButton}`}>Study</button>}
          </div>
          <form onSubmit={handleCreateCard} className={styles.form}>
            <input className={styles.input} value={newCard.front} onChange={(e) => setNewCard({...newCard, front: e.target.value})} placeholder="Card Front (Question)"/>
            <input className={styles.input} value={newCard.back} onChange={(e) => setNewCard({...newCard, back: e.target.value})} placeholder="Card Back (Answer)"/>
            <button type="submit" className={styles.button}>Add Card</button>
          </form>
          <ul className={styles.ul}>
            {selectedDeck.cards.map((card) => (
              <li key={card._id} className={styles.card}>
                <p><strong>Front:</strong> {card.front}</p>
                <p><strong>Back:</strong> {card.back}</p>
                <button onClick={() => handleDeleteCard(card._id)} className={styles.deleteButton}>&times;</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* VIEW 3: STUDY MODE */}
      {view === 'study' && selectedDeck && (
        <div>
          <div className={styles.header}>
            <button onClick={() => setView('cards')} className={`${styles.button} ${styles.backButton}`}>← Back to Deck</button>
            <h2>Studying: {selectedDeck.title}</h2>
          </div>
          <p>Card {currentCardIndex + 1} of {selectedDeck.cards.length}</p>
          <div onClick={handleFlipCard} className={`${styles.studyCard} ${isFlipped ? styles.studyCardBack : ''}`}>
            {isFlipped ? selectedDeck.cards[currentCardIndex].back : selectedDeck.cards[currentCardIndex].front}
          </div>
          <div className={styles.studyControls}>
            <button onClick={handlePrevCard} className={styles.button} disabled={currentCardIndex === 0}>Previous</button>
            <button onClick={handleFlipCard} className={`${styles.button} ${styles.studyButton}`}>Flip</button>
            <button onClick={handleNextCard} className={styles.button} disabled={currentCardIndex === selectedDeck.cards.length - 1}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}


export default App;