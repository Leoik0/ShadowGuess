import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaLightbulb } from "react-icons/fa";
import data from "../../data/info";
import useResetLocalStorageEveryDay from "../../hook/useResetLocalStorageEveryDay";
import "./Game.css";

const Game = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { category, data: categoryData } = location.state || {
    category: "anime",
    data: data["anime"],
  };

  const [difficulty, setDifficulty] = useState("easy");
  const [currentImage, setCurrentImage] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [guess, setGuess] = useState("");
  const [typedLetters, setTypedLetters] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [congrations, setCongrations] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem("gameProgress");
    return savedProgress
      ? JSON.parse(savedProgress)
      : {
          anime: { easy: false, medium: false, hard: false },
          animal: { easy: false, medium: false, hard: false },
          alimento: { easy: false, medium: false, hard: false },
          objeto: { easy: false, medium: false, hard: false },
        };
  });

  useResetLocalStorageEveryDay(); //hook

  useEffect(() => {
    // Verificar se a dificuldade já foi concluída e mostrar o modal de congratulações
    if (progress[category][difficulty]) {
      setCongrations(true);
    } else {
      setCongrations(false);
    }
  }, [progress, difficulty, category]);

  useEffect(() => {
    localStorage.setItem("gameProgress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    loadNewImage();
    setHintCount(0); // Reinicia as dicas quando a dificuldade muda
    setAttempts(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const loadNewImage = () => {
    if (categoryData) {
      const { images, words } = categoryData[difficulty][0];

      if (images && words) {
        setCurrentImage(images); // ou outro índice se houver múltiplas imagens
        setCurrentWord(words); // ou outro índice se houver múltiplas palavras
        setIsCorrect(false); // Resetar para não exibir a imagem se errar
      }
    }
  };

  const playAudio = (audioFile) => {
    const audio = new Audio(`/${audioFile}`);
    audio.play();
  };

  const handleGuess = () => {
    const formattedGuess = guess.trim().toLowerCase();
    const formattedWord = currentWord.toLowerCase();

    setAttempts((prevAttempts) => prevAttempts + 1);

    if (formattedGuess === formattedWord) {
      setIsCorrect(true); // Marca como correto
      setGuess(""); // Limpa o palpite após acertar
      setTypedLetters(""); // Limpa as letras digitadas
      setCongrations(true);
      playAudio("parabens.mp3");

      // Marcar a dificuldade atual como concluída
      setProgress((prevProgress) => ({
        ...prevProgress,
        [category]: {
          ...prevProgress[category],
          [difficulty]: true, // Marca a dificuldade atual como 'true'
        },
      }));
    } else {
      setIsCorrect(false); // Define como incorreto
      setTypedLetters(""); // Limpa as letras digitadas
      setGuess(""); // Limpa o palpite após acertar
      playAudio("gambare.mp3");
    }
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    loadNewImage();

    // Verificar se a dificuldade já foi concluída e mostrar o modal de congratulações
    if (progress[category][newDifficulty]) {
      setCongrations(true);
    }
  };

  const handleKeyClick = (letter) => {
    if (typedLetters.length < 25) {
      setGuess((prev) => prev + letter);
      setTypedLetters((prev) => prev + letter);
    }
  };

  const handleDelete = () => {
    setGuess((prev) => prev.slice(0, -1));
    setTypedLetters((prev) => prev.slice(0, -1));
  };

  // Função para alternar a exibição do modal e aumentar as dicas
  const toggleHint = () => {
    playAudio("yowaimo.mp3");
    if (hintCount < 5) {
      setHintCount((prevCount) => prevCount + 1); // Mostra uma dica a mais a cada clique, até o máximo de 5
    }
    setShowHint(true); // Garante que o modal de dicas esteja visível
  };

  const toggleCongrations = () => {
    setCongrations(!congrations);
  };

  // Função para exibir as dicas com base no número de dicas disponíveis
  const renderHints = () => {
    const hints = categoryData[difficulty]?.[0]?.hints || [];

    return hints
      .slice(0, hintCount) // Mostra apenas o número de dicas reveladas
      .map((hint, index) => <p key={index}>{hint}</p>);
  };

  return (
    <div className="game">
      <div className="game-info">
        <p>Tentativas: {attempts}</p>
      </div>
      <div className="category-description">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <FaArrowLeft
            style={{
              cursor: "pointer",
            }}
            className="back-icon"
            onClick={() => navigate("/")}
          />
          <h1>{category}</h1>
        </div>

        <div className="difficulty">
          <span
            className={`difficulty-btn ${
              difficulty === "easy" ? "active" : ""
            }`}
            onClick={() => handleDifficultyChange("easy")}
          >
            Fácil
          </span>
          <span
            className={`difficulty-btn ${
              difficulty === "medium" ? "active" : ""
            }`}
            onClick={() => handleDifficultyChange("medium")}
          >
            Médio
          </span>
          <span
            className={`difficulty-btn ${
              difficulty === "hard" ? "active" : ""
            }`}
            onClick={() => handleDifficultyChange("hard")}
          >
            Difícil
          </span>
        </div>
      </div>

      <div className="shadow-container">
        <img
          src={currentImage}
          alt="Imagem em sombra"
          className={isCorrect || congrations ? "visible" : "darkened"} // Verifica se isCorrect ou congrations é true
        />
      </div>

      <div className="keyboard">
        <div className="letter-add">
          {typedLetters}
          <FaLightbulb className="hint-icon" onClick={toggleHint} />
        </div>

        <div className="keyboard-row">
          {Array.from("QWERTYUIOP").map((letter) => (
            <button
              key={letter}
              className="key-btn"
              onClick={() => handleKeyClick(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="keyboard-row">
          {Array.from("ASDFGHJKL").map((letter) => (
            <button
              key={letter}
              className="key-btn"
              onClick={() => handleKeyClick(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
        <div className="keyboard-row">
          <button className="key-btn" onClick={handleDelete}>
            Del
          </button>
          {Array.from("ZXCVBNM").map((letter) => (
            <button
              key={letter}
              className="key-btn"
              onClick={() => handleKeyClick(letter)}
            >
              {letter}
            </button>
          ))}
          <button className="key-btn" onClick={handleGuess}>
            Ent
          </button>
        </div>
      </div>

      {/* Modal para exibir dicas */}
      {showHint && (
        <div className="hint-modal" onClick={() => setShowHint(false)}>
          <div className="hint-content" onClick={(e) => e.stopPropagation()}>
            <h2>Dicas</h2>
            {renderHints()}
            <button className="btn" onClick={() => setShowHint(false)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {congrations && (
        <div className="congrations-modal" onClick={toggleCongrations}>
          <div className="congrations-content">
            <h2>Parabéns, avance para o próximo nível</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
