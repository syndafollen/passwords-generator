export const serializeForm = (form) => {
    const obj = {};
    const formData = new FormData(form);
  
    for (let key of formData.keys()) {
      obj[key] = formData.get(key);
    }
  
    return JSON.stringify(obj);
  };
  
  export const sortPasswordsByDate = (passwordsArray) => {
    return passwordsArray.sort((a, b) => {
      const date = new Date(a.date);
      const nextDate = new Date(b.date);
  
      return date - nextDate;
    });
  };
  
  export const sortPasswordsByDateNew = (passwordsArray) => {
    let direction = "asc";
  
    return function toggleSort() {
      direction = direction === "asc" ? "desc" : "asc";
  
      return passwordsArray.sort((a, b) => {
        const date = new Date(a.date);
        const nextDate = new Date(b.date);
        return direction === "asc" ? date - nextDate : nextDate - date;
      });
    };
  };
  
  export const searchBySavedPassword = (items, searchTerm) => {
    const resultItems = items.filter((item) => {
      return item.savedPassword.toLowerCase().includes(searchTerm.toLowerCase());
    });
  
    return resultItems;
  };
  
  // const exampleArr = [1, "2f", "ff", 3, 5];
  // console.log(
  //   exampleArr.filter((item) => {
  //     console.log("type:", typeof item);
  //     return Number.isInteger(item);
  //   })
  // );
  
  console.log([1, 3, 5] === [1, 3, 5]); // ???
  console.log({} === {}); // ???
  