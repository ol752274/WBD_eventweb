// src/redux/reducer.js
const initialState = {
    email: "",
    rating: 0,
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_EMAIL":
        return { ...state, email: action.payload };
      case "SET_RATING":
        return { ...state, rating: action.payload };
      default:
        return state;
    }
  };
  
  export default reducer;