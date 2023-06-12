import React, { useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import { addIngredient, removeIngredient } from "../../util";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);

    addIngredient(ingredient).then((data) => {
      setIsLoading(false);
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
    setIsLoading(true);

    removeIngredient(ingredientId)
      .then(() => {
        setIsLoading(false);
        setUserIngredients((prevIngredients) => {
          return prevIngredients.filter(
            (ingredient) => ingredient.id !== ingredientId
          );
        });
      })
      .catch((error) => {
        setError("Something went wrong");
      });
  };

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

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
