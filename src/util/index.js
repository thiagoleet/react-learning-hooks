export const API_URL =
  "https://react-hooks-update-a4e09-default-rtdb.firebaseio.com/ingredients.json";

/**
 *
 * @param {*} filter query parameters
 * @param {*} callback Callback function
 */
export const getIngredients = (filter, callback) => {
  fetch(`${API_URL}${filter}`)
    .then((response) => response.json())
    .then((data) => {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }

      callback(loadedIngredients);
    });
};

/**
 *
 * @param {*} ingredient
 * @returns
 */
export const addIngredient = (ingredient) => {
  return fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(ingredient),
    header: { ContentType: "application/json" },
  }).then((response) => response.json);
};
