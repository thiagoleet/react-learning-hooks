import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";
import { addIngredient } from "../../util";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const addIngredientHandler = (ingredient) => {
    addIngredient(ingredient).then((data) => {
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

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
