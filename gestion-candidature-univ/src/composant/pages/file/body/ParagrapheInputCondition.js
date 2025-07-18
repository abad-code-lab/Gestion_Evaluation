import { useState } from "react";

function ConditionsEditor({ onChange, setCondition }) {
  const [paragraphes, setParagraphes] = useState([""]);

  const handleParagrapheChange = (index, value) => {
    const updatedParagraphes = [...paragraphes];
    updatedParagraphes[index] = value;
    setParagraphes(updatedParagraphes);
    onChange(updatedParagraphes);
    setCondition(updatedParagraphes.join("\n\n"));
  };

  const handleRemoveParagraphe = (index) => {
    const updatedParagraphes = paragraphes.filter((_, i) => i !== index);
    setParagraphes(updatedParagraphes);
    onChange(updatedParagraphes);
    setCondition(updatedParagraphes.join("\n\n"));
  };

  return (
    <div>
      <h5 className="blue-text">Conditions à remplir pour candidater</h5>
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

export default ConditionsEditor;
