import React, { useState } from "react";

import Card from "../UI/Card";
import LoadingIndicator from "../UI/LoadingIndicator";

import "./IngredientForm.css";

const IngredientForm = React.memo((props) => {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredAmount, setEnteredAmount] = useState("");

  console.log("RENDERING INGREDIENT FORM");

  const inputTitleHandler = (event) => {
    const newTitle = event.target.value;

    setEnteredTitle(newTitle);
  };

  const inputAmountHanlder = (event) => {
    const newAmount = event.target.value;

    setEnteredAmount(newAmount);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    props.onAddIngredient({
      title: enteredTitle,
      amount: enteredAmount,
    });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={enteredTitle}
              onChange={inputTitleHandler}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={enteredAmount}
              onChange={inputAmountHanlder}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit" disabled={props.loading}>
              Add Ingredient
            </button>
            {props.loading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
