import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import getCategoryDataForDay from "../../data/info"; // Importa a função em vez de data
import "./Home.css";

const Home = () => {
  const [data, setData] = useState({});
  const [showRules, setShowRules] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchedData = getCategoryDataForDay(); // Chama a função para obter os dados
    setData(fetchedData);
    setSelectedCategory(Object.keys(fetchedData)[0] || ""); // Inicializa com a primeira categoria
  }, []);

  const handlePlayClick = () => {
    const categoryData = data[selectedCategory];
    console.log("Categoria Selecionada:", selectedCategory);
    console.log("Dados da Categoria:", categoryData);
    navigate("/game", {
      state: { category: selectedCategory, data: categoryData },
    });
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const getCategoryImage = (category) => {
    switch (category) {
      case "anime":
        return "/logo-category.png";
      case "animal":
        return "/guaxinim.png";
      case "alimento":
        return "/maca.png";
      case "objeto":
        return "/obj.png";
      default:
        return "/L.png"; // Imagem padrão
    }
  };

  return (
    <div className="home">
      <div className="image-container">
        <img
          src={getCategoryImage(selectedCategory)}
          alt="Category"
          className="home-image"
          draggable="false"
        />
      </div>
      <h1>Kage Guess</h1>
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="category-select"
      >
        {Object.keys(data).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button className="button-13" role="button" onClick={handlePlayClick}>
        <span className="text">Jogar</span>
        <span className="button-13-background"></span>
        <span className="button-13-border"></span>
      </button>
      <button
        className="button-13"
        role="button"
        onClick={() => setShowRules(true)}
      >
        <span className="text">Regras</span>
        <span className="button-13-background"></span>
        <span className="button-13-border"></span>
      </button>

      {showRules && (
        <div className="modal" onClick={() => setShowRules(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Regras do Jogo</h2>
            <p>1. Você verá a sombra de uma imagem.</p>
            <p>2. Adivinhe o nome da imagem.</p>
            <p>3. Use o teclado para digitar sua resposta.</p>
            <p>
              4. Existem três níveis de dificuldade: Fácil, Médio e Difícil.
            </p>
            <p>5. Todos os dias surgem desafios novos.</p>
            <button
              className="button-13"
              role="button"
              onClick={() => setShowRules(false)}
            >
              <span className="text">Fechar</span>
              <span className="button-13-background"></span>
              <span className="button-13-border"></span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
