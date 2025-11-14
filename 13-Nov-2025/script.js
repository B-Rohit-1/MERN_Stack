function checkNumber() {
  const num = parseFloat(document.getElementById("numInput").value);
  const result = document.getElementById("result");

  if (isNaN(num)) {
    result.textContent = "⚠️ Please enter a valid number.";
    result.style.color = "black";
    return;
  }

  if (num > 0) {
    result.textContent = `${num} is Positive`;
    result.style.color = "green";
  } else if (num < 0) {
    result.textContent = `${num} is Negative`;
    result.style.color = "red";
  } else {
    result.textContent = `${num} is Zero`;
    result.style.color = "blue";
  }
}
