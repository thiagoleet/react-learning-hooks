import React, { useReducer, useState, useEffect, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import { addIngredient, removeIngredient } from "../../util";

const ingredientActions = {
  SET_INGREDIENTS: "SET",
  ADD_INGREDIENT: "ADD",
  DELETE_INGREDIENT: "DELETE",
};

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case ingredientActions.SET_INGREDIENTS:
      return action.ingredients;
    case ingredientActions.ADD_INGREDIENT:
      return [...currentIngredients, action.ingredient];
    case ingredientActions.DELETE_INGREDIENT:
      return currentIngredients.filter(
        (ingredient) => ingredient.id !== action.id
      );
    default:
      throw new Error("Should not get there!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);

    addIngredient(ingredient).then((data) => {
      setIsLoading(false);
      // setUserIngredients((prevIngredients) => [
      //   ...prevIngredients,
      //   {
      //     id: data.name,
      //     ...ingredient,
      //   },
      // ]);

      dispatch({
        type: ingredientActions.ADD_INGREDIENT,
        ingredient: {
          id: data.name,
          ...ingredient,
        },
      });
    });
  };

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);

    removeIngredient(ingredientId)
      .then(() => {
        setIsLoading(false);
        // setUserIngredients((prevIngredients) => {
        //   return prevIngredients.filter(
        //     (ingredient) => ingredient.id !== ingredientId
        //   );
        // });

        dispatch({
          type: ingredientActions.DELETE_INGREDIENT,
          id: ingredientId,
        });
      })
      .catch((error) => {
        setError("Something went wrong");
        setIsLoading(false);
      });
  };

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({
      type: ingredientActions.SET_INGREDIENTS,
      ingredients: filteredIngredients,
    });
  }, []);

  const clearError = () => {
    setError(null);
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
