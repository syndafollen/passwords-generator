import { serializeForm } from "./utils";

// https://j7rrbn.deta.dev/register // endpoint
// https://j7rrbn.deta.dev/login

document.addEventListener("submit", async (event) => {
  event.preventDefault(); //zamezení deafaultního chování při zmačknutí submit (odesílání metódy GET a načtení str znovu)

  const form = document.getElementById("post");
  const data = serializeForm(form); // {username: "fewfewfew", password: "fewfewfew"}

  const response = await fetch("https://j7rrbn.deta.dev/register", {
    //požadavek na backend
    method: "POST",
    body: data, // объект в виде строки
    headers: {
      "Content-Type": "application/json"
    }
  });

  const result = await response.json();

  console.log("result:", result);

  if (response.status === 201) {
    document.getElementById("formErrorText").textContent = "Success mssg";
    event.target.reset();
    setTimeout(() => {
      window.location.href = "/login.html";
    }, 1000);
  } else if (response.status !== 201) {
    document.getElementById("formErrorText").textContent = "Error";
  }
});
