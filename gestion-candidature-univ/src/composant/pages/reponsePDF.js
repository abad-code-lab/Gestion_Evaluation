import { useState } from "react";
import { Col, Divider, Row } from "antd";
import File from "./file";
import Preview from "./preview";

function ReponsePDF() {
  const [fileData, setFileData] = useState({
    title: "",
    paragraphes: [],
    alignment: "center",
    styles: {
      bold: false,
      italic: false,
      underline: false,
    },
  });

  // Gestion des changements de données
  const handleFileChange = (data) => {
    setFileData(data); // Mettre à jour les données pour Preview
  };

  return (
    <Row>
      <Col span={11}>
        <div className="border border-t-8 border-dashed border-red-600 mb-4" />
        <File onFileChange={handleFileChange} />
      </Col>
      <Col span={1}>
        <Divider type="vertical" />
      </Col>
      <Col span={12}>
        <div className="border border-t-8 border-dashed border-red-600 mb-4" />
        <Preview
          title={fileData.title}
          paragraphes={fileData.paragraphes}
          alignment={fileData.alignment}
          styles={fileData.styles}
        />
      </Col>
    </Row>
  );
}

export default ReponsePDF;
