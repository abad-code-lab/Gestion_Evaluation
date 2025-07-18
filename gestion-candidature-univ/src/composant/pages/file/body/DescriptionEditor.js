import { useState } from "react";

function ParagrapheInput({ onChange, setDescription }) {
  const [paragraphes, setParagraphes] = useState([""]);

  const handleParagrapheChange = (index, value) => {
    const updatedParagraphes = [...paragraphes];
    updatedParagraphes[index] = value;
    setParagraphes(updatedParagraphes);
    onChange(updatedParagraphes);
    setDescription(updatedParagraphes.join("\n\n"));
  };

  const handleRemoveParagraphe = (index) => {
    const updatedParagraphes = paragraphes.filter((_, i) => i !== index);
    setParagraphes(updatedParagraphes);
    onChange(updatedParagraphes);
    setDescription(updatedParagraphes.join("\n\n"));
  };

  return (
    <div>
      <h5 className="blue-text">Description de l'appel de candidature</h5>
      {paragraphes.map((paragraphe, index) => (
        <div className="row" key={index}>
          <div className="input-field col s10">
            <textarea
              value={paragraphe}
              onChange={(e) => handleParagrapheChange(index, e.target.value)}
              className="materialize-textarea"
              placeholder={`Paragraphe ${index + 1}`}
            />
            <label className="active">Paragraphe {index + 1}</label>
          </div>
          <div className="col s2">
            <button
              type="button"
              onClick={() => setParagraphes([...paragraphes, ""])}
              className="btn green"
            >
              <i className="material-icons">add</i>
            </button>
            {index > 0 && (
              <button
                onClick={() => handleRemoveParagraphe(index)}
                className="btn red ml-2"
              >
                <i className="material-icons">remove</i>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ParagrapheInput;
