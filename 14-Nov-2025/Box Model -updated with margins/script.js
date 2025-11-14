document.addEventListener("DOMContentLoaded", function () {
  const marginTopSlider = document.getElementById("margin-top");
  const marginRightSlider = document.getElementById("margin-right");
  const marginBottomSlider = document.getElementById("margin-bottom");
  const marginLeftSlider = document.getElementById("margin-left");
  const borderSlider = document.getElementById("border");
  const paddingSlider = document.getElementById("padding");
  const boxExample = document.querySelector(".box-model-example");

  const marginTopValue = document.getElementById("margin-top-value");
  const marginRightValue = document.getElementById("margin-right-value");
  const marginBottomValue = document.getElementById("margin-bottom-value");
  const marginLeftValue = document.getElementById("margin-left-value");
  const borderValue = document.getElementById("border-value");
  const paddingValue = document.getElementById("padding-value");

  marginTopSlider.addEventListener("input", function () {
    const value = this.value + "px";
    boxExample.style.marginTop = value;
    marginTopValue.textContent = value;
  });

  marginRightSlider.addEventListener("input", function () {
    const value = this.value + "px";
    boxExample.style.marginRight = value;
    marginRightValue.textContent = value;
  });

  marginBottomSlider.addEventListener("input", function () {
    const value = this.value + "px";
    boxExample.style.marginBottom = value;
    marginBottomValue.textContent = value;
  });

  marginLeftSlider.addEventListener("input", function () {
    const value = this.value + "px";
    boxExample.style.marginLeft = value;
    marginLeftValue.textContent = value;
  });

  borderSlider.addEventListener("input", function () {
    const value = this.value + "px";
    boxExample.style.borderWidth = value;
    borderValue.textContent = value;
  });

  paddingSlider.addEventListener("input", function () {
    const value = this.value + "px";
    boxExample.style.padding = value;
    paddingValue.textContent = value;
  });
});
