import { useState } from "react";

function ParagrapheInput({ onChange }) {
  const [paragraphes, setParagraphes] = useState([""]);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleParagrapheChange = (index, value) => {
    const updatedParagraphes = [...paragraphes];
    updatedParagraphes[index] = value;
    setParagraphes(updatedParagraphes);
    onChange(updatedParagraphes); // Propager les changements
  };

  const toggleAccordion = (accordionName) => {
    setActiveAccordion((prev) => (prev === accordionName ? null : accordionName));
  };

  const handleRemoveParagraphe = (index) => {
    const updatedParagraphes = paragraphes.filter((_, i) => i !== index);
    setParagraphes(updatedParagraphes);
    onChange(updatedParagraphes); // Propager les changements après suppression
  };

  return (
    <ul className="collapsible">
      <li className={`collapsible-item ${activeAccordion === "paragraphes" ? "active" : ""}`}>
        <div
          className="collapsible-header blue darken-2 white-text"
          onClick={() => toggleAccordion("paragraphes")}
        >
          <i className="material-icons">format_align_left</i>
          Paragraphes
        </div>
        <div className="collapsible-body">
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
      </li>
    </ul>
  );
}

export default ParagrapheInput;
