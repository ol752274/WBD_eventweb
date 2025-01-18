export const setEmail = (email) => {
    return {
      type: 'SET_EMAIL',
      payload: email,
    };
  };
  
  export const setRating = (rating) => {
    return {
      type: 'SET_RATING',
      payload: rating,
    };
  };