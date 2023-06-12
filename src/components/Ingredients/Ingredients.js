import React, { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const API_URL =
  "https://react-hooks-update-a4e09-default-rtdb.firebaseio.com/ingredients.json";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  useEffect(() => {
    fetch(API_URL)
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
        
        setUserIngredients(loadedIngredients);
      });
  }, []);

  const addIngredientHandler = (ingredient) => {
    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(ingredient),
      header: { ContentType: "application/json" },
    })
      .then((response) => response.json)
      .then((data) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          {
            id: data.name,
            ...ingredient,
          },
        ]);
      });
  };

  const removeIngredientHandler = (ingredientId) => {
    setUserIngredients((prevIngredients) => {
      return prevIngredients.filter(
        (ingredient) => ingredient.id !== ingredientId
      );
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
