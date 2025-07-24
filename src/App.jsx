import React, { useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [processed, setProcessed] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      processImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (src) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;

        if (avg < 128) {
          data[i] = 0x00;
          data[i + 1] = 0xfb;
          data[i + 2] = 0xf3;
          data[i + 3] = 255;
        } else {
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessed(canvas.toDataURL());
    };
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = processed;
    link.download = "2-0-pfp.png";
    link.click();
  };

  const copyImage = async () => {
    const blob = await fetch(processed).then((res) => res.blob());
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    alert("Image copied to clipboard!");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        2.0-ify
      </h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        style={{ marginBottom: "1rem" }}
      />
      {processed && (
        <div
          style={{ background: "#111", padding: "1rem", borderRadius: "1rem" }}
        >
          <img
            src={processed}
            alt="Line Art"
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              border: "1px solid #00FBF3",
            }}
          />
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button onClick={downloadImage}>Download</button>
            <button onClick={copyImage}>Copy to Clipboard</button>
          </div>
        </div>
      )}
    </div>
  );
}
