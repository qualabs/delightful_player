function getModo(document) {
  const file = document.getElementById('selectFormat');
  const value = file.options[file.selectedIndex].value;

  return value;
}

module.exports = getModo();
