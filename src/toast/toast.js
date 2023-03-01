import { appElement } from "../utils";

let toastContainer;

export const generateToast = ({
  message,
  bg = "#333333",
  color = "#fffffe",
  length = "2000ms"
}) => {
  return () => {
    console.log(message);
    toastContainer = document.createElement("div");
    toastContainer.insertAdjacentHTML(
      "beforeend",
      `<p class='toast'
      style="background-color: ${bg};
      color:${color};
      animation-duration: ${length}">
      ${message}</p>`
    );
  };
};

(() => {
  appElement.insertAdjacentHTML(
    "afterbegin",
    `<div class='toastContainer'></div>`
  );

  toastContainer = document.querySelector(".toastContainer");
})();
