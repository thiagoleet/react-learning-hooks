import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";
import { API_URL, BASE_API_URL } from "../../util";

const actions = {
  SET_INGREDIENTS: "SET",
  ADD_INGREDIENT: "ADD",
  DELETE_INGREDIENT: "DELETE",
};

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case actions.SET_INGREDIENTS:
      return action.ingredients;
    case actions.ADD_INGREDIENT:
      return [...currentIngredients, action.ingredient];
    case actions.DELETE_INGREDIENT:
      return currentIngredients.filter(
        (ingredient) => ingredient.id !== action.id
      );
    default:
      throw new Error("Should not get there!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { isLoading, error, data, sendRequest, clear, extra, identifier } =
    useHttp();

  useEffect(() => {
    if (!isLoading && !error && identifier === actions.DELETE_INGREDIENT) {
      dispatch({ type: actions.DELETE_INGREDIENT, id: extra });
    } else if (!isLoading && !error && identifier === actions.ADD_INGREDIENT) {
      dispatch({
        type: actions.ADD_INGREDIENT,
        ingredient: {
          id: data.name,
          ...extra,
        },
      });
    }
  }, [data, extra, identifier, isLoading, error]);

  const addIngredientHandler = useCallback(
    (ingredient) => {
      sendRequest(
        API_URL,
        "POST",
        JSON.stringify(ingredient),
        ingredient,
        actions.ADD_INGREDIENT
      );
    },
    [sendRequest]
  );

  const removeIngredientHandler = useCallback(
    (ingredientId) => {
      const url = `${BASE_API_URL}/${ingredientId}.json`;
      sendRequest(url, "DELETE", null, ingredientId, actions.DELETE_INGREDIENT);
    },
    [sendRequest]
  );

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({
      type: actions.SET_INGREDIENTS,
      ingredients: filteredIngredients,
    });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
