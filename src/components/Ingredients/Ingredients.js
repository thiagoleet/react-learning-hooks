import React, { useReducer, useEffect, useCallback, useMemo } from "react";

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

const httpActions = {
  SEND_REQUEST: "SEND REQUEST",
  RESPONSE: "RESPONSE",
  ERROR: "ERROR",
  CLEAR: "CLEAR",
};

const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case httpActions.SEND_REQUEST:
      return { loading: true, error: null };
    case httpActions.RESPONSE:
      return { ...currHttpState, loading: false };
    case httpActions.ERROR:
      return { loading: false, error: action.errorMessage };
    case httpActions.CLEAR:
      return { ...currHttpState, error: null };

    default:
      throw new Error("Should not be reached!");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const addIngredientHandler = useCallback((ingredient) => {
    // setIsLoading(true);
    dispatchHttp({ type: httpActions.SEND_REQUEST });

    addIngredient(ingredient).then((data) => {
      // setIsLoading(false);
      // setUserIngredients((prevIngredients) => [
      //   ...prevIngredients,
      //   {
      //     id: data.name,
      //     ...ingredient,
      //   },
      // ]);

      dispatchHttp({ type: httpActions.RESPONSE });

      dispatch({
        type: ingredientActions.ADD_INGREDIENT,
        ingredient: {
          id: data.name,
          ...ingredient,
        },
      });
    });
  }, []);

  const removeIngredientHandler = useCallback((ingredientId) => {
    // setIsLoading(true);
    dispatchHttp({ type: httpActions.SEND_REQUEST });

    removeIngredient(ingredientId)
      .then(() => {
        // setIsLoading(false);
        // setUserIngredients((prevIngredients) => {
        //   return prevIngredients.filter(
        //     (ingredient) => ingredient.id !== ingredientId
        //   );
        // });

        dispatchHttp({ type: httpActions.RESPONSE });

        dispatch({
          type: ingredientActions.DELETE_INGREDIENT,
          id: ingredientId,
        });
      })
      .catch((error) => {
        const message = "Something went wrong";
        // setError(message);
        // setIsLoading(false);

        dispatchHttp({ type: httpActions.ERROR, errorMessage: message });
      });
  }, []);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    dispatch({
      type: ingredientActions.SET_INGREDIENTS,
      ingredients: filteredIngredients,
    });
  }, []);

  const clearError = () => {
    // setError(null);
    dispatchHttp({ type: httpActions.CLEAR });
  };

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
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
