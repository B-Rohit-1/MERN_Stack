import { useState } from "react";

function MyForm() {
  const [selectedFruit, setSelectedFruit] = useState('banana');

  const handleChange = (event) => {
    setSelectedFruit(event.target.value);
  };

  const handleSubmit = (event) => {
    alert(`Your favorite fruit is: ${selectedFruit}`);
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Select your favorite fruit:</p>
      <label>
        <input 
          type="radio" 
          name="fruit" 
          value="apple" 
          checked={selectedFruit === 'apple'} 
          onChange={handleChange} /> Apple
      </label>
      <br />
      <label>
        <input 
          type="radio" 
          name="fruit" 
          value="banana" 
          checked={selectedFruit === 'banana'} 
          onChange={handleChange} /> Banana
      </label>
      <br />
      <label>
        <input 
          type="radio" 
          name="fruit" 
          value="orange" 
          checked={selectedFruit === 'cherry'} 
          onChange={handleChange} /> Cherry
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export default MyForm;
