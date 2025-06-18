document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-comparar");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    resultDiv.innerHTML = "<p><em>Processando...</em></p>";

    try {
      const response = await fetch("/comparar", {
        method: "POST",
        body: formData,
      });

      const html = await response.text();
      resultDiv.innerHTML = html;
    } catch (error) {
      resultDiv.innerHTML = "<p>Erro ao processar imagens.</p>";
      console.error(error);
    }
  });
});