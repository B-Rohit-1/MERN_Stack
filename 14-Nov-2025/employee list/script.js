document
  .getElementById("employeeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var name = document.getElementById("name").value.trim();
    var age = document.getElementById("age").value.trim();
    var position = document.getElementById("position").value.trim();

    if (name === "" || age === "" || position === "") {
      alert("Please fill out this field.");
      return;
    }

    var table = document
      .getElementById("employeeTable")
      .getElementsByTagName("tbody")[0];
    var newRow = table.insertRow();
    newRow.insertCell(0).innerText = name;
    newRow.insertCell(1).innerText = age;
    newRow.insertCell(2).innerText = position;

    document.getElementById("employeeForm").reset();
  });
