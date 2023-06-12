export const BASE_API_URL =
  "https://react-hooks-update-a4e09-default-rtdb.firebaseio.com/ingredients";

export const API_URL = `${BASE_API_URL}.json`;

export const createIngredients = (data) => {
  const loadedIngredients = [];
  for (const key in data) {
    loadedIngredients.push({
      id: key,
      title: data[key].title,
      amount: data[key].amount,
    });
  }
  return loadedIngredients;
};
