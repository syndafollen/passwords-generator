import { serializeForm } from "./utils";
// https://j7rrbn.deta.dev/login

document.addEventListener("submit", async (event) => {
  event.preventDefault();

  const form = document.getElementById("login");
  const data = serializeForm(form); // {username: "fewfewfew", password: "fewfewfew"}
  const response = await fetch("https://j7rrbn.deta.dev/login", {
    //požadavek na backend
    method: "POST",
    body: data, // объект в виде строки
    headers: {
      "Content-Type": "application/json"
    }
  });

  const result = await response.json();

  if (response.status === 200) {
    localStorage.setItem("token", result.token);
    localStorage.setItem("refreshToken", result.refreshToken);
    document.getElementById("formErrorText").textContent = "Success mssg";
    event.target.reset();
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 1000);
  } else if (response.status !== 200) {
    document.getElementById("formErrorText").textContent = "Error";
  }
});
