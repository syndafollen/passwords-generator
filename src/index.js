import {
    passwordElement,
    inputElement,
    passUppercaseElement,
    passLowercaseElement,
    passSpecialCharElement,
    passwordNoNumbersElement,
    savedPasswordsList,
    generateButton,
    saveButton,
    copyButton,
    sortPasswordsByDate,
    sortButton,
    sortPasswordsByDateNew,
    deleteIcon,
    copyIcon,
    editIcon,
    submitIcon,
    aboutButton,
    manualButton,
    searchBySavedPassword,
    searchInput
  } from "./utils";
  import { generateToast } from "./toast";
  import { guard } from "./guard";
  import { createLoader } from "./loader";
  
  let length = 8;
  let isUppercase = false;
  let isLowercase = false;
  let isNoSpecialChar = false;
  let isNoNumbers = false;
  let token = "";
  let chars =
    "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  const generatePassword = () => {
    let password = "";
  
    if (isNoSpecialChar) {
      chars = chars.replace(/[^a-zA-Z0-9]/g, ""); //použití regulárního výrazu, g = global
    }
  
    if (isNoNumbers) {
      chars = chars.replace(/[^a-zA-Z!@#$%^&*()]/g, "");
    }
  
    for (let i = 0; i < length; i++) {
      let randomNumber = Math.floor(Math.random() * chars.length);
      if (isUppercase) {
        password += chars.substring(randomNumber, randomNumber + 1).toUpperCase();
      } else if (isLowercase) {
        password += chars.substring(randomNumber, randomNumber + 1).toLowerCase();
      } else {
        password += chars.substring(randomNumber, randomNumber + 1);
      }
    }
  
    passwordElement.value = password;
  };
  
  const copyPassword = () => {
    const copyText = document.getElementById("password");
    copyText.select();
    document.execCommand("copy");
    // generateToast({ message: "Copied", color: "white" });
  };
  
  const editPassword = async ({ newPassword, key }) => {
    const response = await fetch("https://j7rrbn.deta.dev/edit", {
      method: "PATCH",
      body: JSON.stringify({ newPassword, key }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
  
    if (response.status === 201) {
      const password = await getSavedPasswords();
      console.log(password);
      renderPassword(password);
    }
  };
  
  const renderPassword = (passwordsArray) => {
    savedPasswordsList.replaceChildren();
  
    passwordsArray.forEach((element) => {
      // 1) есть массив паролей passwordsArray
      // 2) каждый объект имеет вид {savedPassword: "8vCKETT5"}
      // 3) для каждого объекта создать li, который добавляем в ul
      // 4) создать кнопку удаления для каждого li
  
      const li = document.createElement("li"); // const pro vytváření elementu <li>
      const btnDelete = document.createElement("button"); // const pro vytváření tlačítka delete
      const btnEdit = document.createElement("button");
      const btnSubmit = document.createElement("button");
      const buttonWrapper = document.createElement("div");
      const btnCopy = document.createElement("button");
      const input = document.createElement("input");
  
      input.setAttribute("class", "innerInput");
      input.setAttribute("readonly", true);
  
      buttonWrapper.setAttribute("class", "passwordItemButtonsWrapper");
      li.setAttribute("class", "passwordItem");
      li.setAttribute("id", element.key);
      input.value = element.savedPassword;
      li.appendChild(input);
  
      btnDelete.setAttribute("class", "passwordItemButtons");
      btnDelete.insertAdjacentHTML("afterbegin", deleteIcon);
      btnDelete.setAttribute("id", element.key); // key: "u0t4n1jahoyx"
  
      btnEdit.setAttribute("class", "passwordItemButtons");
      btnEdit.insertAdjacentHTML("afterbegin", editIcon);
      btnEdit.setAttribute("id", element.key);
  
      btnSubmit.setAttribute("class", "passwordItemButtons");
      btnSubmit.insertAdjacentHTML("afterbegin", submitIcon);
      btnSubmit.setAttribute("id", element.key);
  
      btnCopy.setAttribute("class", "passwordItemButtons");
      btnCopy.insertAdjacentHTML("afterbegin", copyIcon);
      btnCopy.setAttribute("id", element.key);
  
      buttonWrapper.appendChild(btnCopy);
      buttonWrapper.appendChild(btnDelete);
      buttonWrapper.appendChild(btnEdit);
      buttonWrapper.appendChild(btnSubmit);
  
      li.appendChild(buttonWrapper);
  
      savedPasswordsList.appendChild(li);
  
      btnCopy.addEventListener("click", (event) => {
        const copyText = document.querySelector(`li[id="${event.target.id}"]`)
          .childNodes[0];
  
        // <div id='2' onClick='2'>
        //  <div id='1' onClick='1'>
        //    <button onClick='0'>Click me</button> // poiner-events: none;
        //  </div>
        // <button></button>
        // </div>
        console.log(copyText);
        copyText.select();
        document.execCommand("copy");
        // generateToast({ message: "Copied", color: "white" });
  
        // <div id='1'><div id='2'><button id='3'>Copy</button></div></div>
      });
  
      btnDelete.addEventListener("click", (event) => {
        deletePassword(event.target.id);
      });
  
      btnEdit.addEventListener("click", (event) => {
        const li = document.getElementById(event.target.id);
        const password = li.childNodes[0].wholeText;
        const input = document.createElement("input");
  
        input.value = password;
        li.replaceChild(input, li.childNodes[0]);
        // https://j7rrbn.deta.dev/edit METHOD PATCH
        btnSubmit.addEventListener("click", async (event) => {
          await editPassword({ newPassword: input.value, key: event.target.id });
        });
      });
    });
  };
  
  const getSavedPasswords = async () => {
    let { show: showLoader, hide: hideLoader } = createLoader();
    if (token) {
      showLoader();
    }
    const response = await fetch("https://j7rrbn.deta.dev/saved", {
      method: "GET",
      headers: { Authorization: "Bearer " + token }
    });
  
    const result = await response.json();
  
    const passwords = sortPasswordsByDate(result.items);
    hideLoader();
    return passwords;
  };
  
  async function deletePassword(id) {
    let result = await guard({
      title: "Czus"
    });
    console.log(result);
  
    if (result) {
      const response = await fetch(`https://j7rrbn.deta.dev/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token
        }
      });
  
      if (response.status === 200) {
        const password = await getSavedPasswords();
        // generateToast({ message: "Deleted", color: "#ff9000" });
  
        renderPassword(password);
      }
    }
  }
  
  const savePassword = async () => {
    // https://j7rrbn.deta.dev/saved endpoint
    // { savedPassword: '...' }
  
    const data = { savedPassword: passwordElement.value };
  
    const response = await fetch("https://j7rrbn.deta.dev/saved", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    });
  
    if (response.status !== 403) {
      const password = await getSavedPasswords();
  
      renderPassword(password);
      // generateToast({ message: "Saved", color: "white" });
    }
  };
  
  (async () => {
    token = localStorage.getItem("token");
  
    if (!token) {
      document.getElementById("savebtn").setAttribute("class", "hide");
    }
  
    generatePassword();
  
    inputElement.value = length;
    const result = await getSavedPasswords();
  
    const toggleSort = sortPasswordsByDateNew(result);
  
    sortButton.addEventListener("click", (event) => {
      renderPassword(toggleSort());
    });
  
    const greenToast = generateToast({ message: "Green", bg: "green" });
  
    const blueToast = generateToast({ message: "Blue", bg: "blue" });
  
    aboutButton.addEventListener("click", () => {
      greenToast();
    });
  
    manualButton.addEventListener("click", () => {
      blueToast();
    });
  
    searchInput.oninput = () => {
      const passwords = searchBySavedPassword(result, searchInput.value);
      renderPassword(passwords);
    };
  
    renderPassword(result);
  
    // generateToast({ message: "Hello!", bg: "white", color: "#ff9000" });
  })();
  
  // 1) Когда загрузилась страница мы должны видеть пароли
  // 2) При загрузке страницы вызывается функция
  // 3)
  
  // Event Listeners
  saveButton.onclick = savePassword;
  generateButton.onclick = generatePassword;
  copyButton.onclick = copyPassword;
  
  passUppercaseElement.onclick = (event) => {
    isUppercase = event.target.checked; // pokud checked=true checkbox je oznacen
    if (isUppercase) {
      passLowercaseElement.setAttribute("disabled", true);
    } else {
      passLowercaseElement.removeAttribute("disabled");
    }
  };
  
  passLowercaseElement.onchange = (event) => {
    isLowercase = event.target.checked; // pokud checked=true checkbox je oznacen
    if (isLowercase) {
      passUppercaseElement.setAttribute("disabled", true);
    } else {
      passUppercaseElement.removeAttribute("disabled");
    }
  };
  
  inputElement.onchange = (event) => {
    length = event.target.value; // objekt udalosti, element u kterehose uskutecnila udalost, ve chvili udalosti
  };
  
  inputElement.oninput = (event) => {
    // if (event.target.value.length > 2) {
    //   inputElement.value = event.target.value.slice(0, 2);
    // }
  
    if (event.target.value > 16) {
      inputElement.value = 16; // lze nahradit inputElement.value = 16
    } else if (event.target.value < 8) {
      inputElement.value = 8;
    }
  };
  
  passSpecialCharElement.onchange = (event) => {
    isNoSpecialChar = event.target.checked;
  };
  
  passwordNoNumbersElement.addEventListener("change", (event) => {
    isNoNumbers = event.target.checked;
  }); // lze nahradit metodou onchange
  