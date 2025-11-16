const form = document.getElementById("generator-form");
const slideInput = document.getElementById("slide-url");
const resultSection = document.getElementById("result");
const iframe = document.getElementById("preview-frame");
const codeArea = document.getElementById("iframe-code");
const errorMessage = document.getElementById("error");
const downloadBtn = document.getElementById("download-btn");

const isValidSlideUrl = (value) =>
  /^https:\/\/docs\.google\.com\/presentation\//.test(value);

const buildIframeMarkup = (src) =>
  `<iframe src="${src}" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>`;

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = slideInput.value.trim();

  if (!value) {
    showError("URL tidak boleh kosong.");
    return;
  }

  if (!isValidSlideUrl(value)) {
    showError("Masukkan URL Google Slides yang valid.");
    return;
  }

  errorMessage.textContent = "";
  const iframeMarkup = buildIframeMarkup(value);

  iframe.src = value;
  codeArea.value = iframeMarkup;
  resultSection.hidden = false;
  downloadBtn.disabled = false;
});

downloadBtn?.addEventListener("click", () => {
  if (downloadBtn.disabled) return;

  const markup = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Google Slides Embed</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #0f172a; }
      iframe { width: min(90vw, 960px); height: min(70vh, 569px); border: 0; box-shadow: 0 20px 40px rgba(0,0,0,0.35); border-radius: 20px; }
    </style>
  </head>
  <body>
    ${codeArea.value}
  </body>
</html>`;

  const blob = new Blob([markup], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "google-slide-iframe.html";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

function showError(message) {
  errorMessage.textContent = message;
  resultSection.hidden = true;
  downloadBtn.disabled = true;
}
