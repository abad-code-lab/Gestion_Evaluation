import { useState, useEffect } from "react";

function TitleCustomizer({ value, onChange, onAlignmentChange, onStyleChange }) {
  const [alignment, setAlignment] = useState("center");
  const [styles, setStyles] = useState({
    bold: false,
    italic: false,
    fontSize: 12, // stocké comme nombre
  });

  // Appelle onStyleChange uniquement quand styles changent
  useEffect(() => {
    onStyleChange(styles);
  }, [styles, onStyleChange]);

  const handleTitleChange = (event) => onChange(event.target.value);

  const handleAlignmentChange = (valeur) => {
    setAlignment(valeur);
    onAlignmentChange(valeur);
  };

  const toggleStyle = (style) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      [style]: !prevStyles[style],
    }));
  };

  const handleFontSizeChange = (fontSize) => {
    setStyles((prevStyles) => ({
      ...prevStyles,
      fontSize: Number(fontSize),
    }));
  };

  return (
    <div>
      <h5 className="blue-text">Titre de l'appel à candidature</h5>

      {/* Style et Alignement */}
      <div className="mb-3">
        <button
          type="button"
          className={`btn ${styles.bold ? "btn-primary" : "btn-outline-primary"} me-2`}
          onClick={() => toggleStyle("bold")}
        >
          Gras
        </button>
        <button
          type="button"
          className={`btn ${styles.italic ? "btn-primary" : "btn-outline-primary"} me-2`}
          onClick={() => toggleStyle("italic")}
        >
          Italique
        </button>
        <button
          type="button"
          className={`btn ${alignment === "left" ? "btn-primary" : "btn-outline-primary"} me-2`}
          onClick={() => handleAlignmentChange("left")}
        >
          Gauche
        </button>
        <button
          type="button"
          className={`btn ${alignment === "center" ? "btn-primary" : "btn-outline-primary"} me-2`}
          onClick={() => handleAlignmentChange("center")}
        >
          Centre
        </button>
        <button
          type="button"
          className={`btn ${alignment === "right" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => handleAlignmentChange("right")}
        >
          Droite
        </button>

        {/* Taille de police */}
        <select
          className="browser-default ms-3"
          value={styles.fontSize}
          onChange={(e) => handleFontSizeChange(e.target.value)}
        >
          {[12, 14, 16, 18, 20, 24, 30, 36].map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>

      {/* Champ de titre */}
      <div className="input-field">
        <input
          type="text"
          value={value}
          onChange={handleTitleChange}
          id="title"
          className="form-control"  /* Remplace materialize-textarea par form-control (Bootstrap) */
          placeholder="Titre"
          style={{
            fontSize: `${styles.fontSize}px`,
            textAlign: alignment,
            fontWeight: styles.bold ? "bold" : "normal",
            fontStyle: styles.italic ? "italic" : "normal",
          }}
        />
        <label htmlFor="title" className="active">
          Titre
        </label>
      </div>
    </div>
  );
}

export default TitleCustomizer;
