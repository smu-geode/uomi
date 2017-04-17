// original code by Paul Herz

document.querySelectorAll('.form-magic-item').forEach(el => {
  
  let textField = el.querySelector('.text-input');
  
  textField.addEventListener('focus', ev => {
    el.classList.add('form-focus');
  });
  textField.addEventListener('blur', ev => {
    el.classList.remove('form-focus');
  });
  
  textField.addEventListener('keyup', ev => {
    console.log('change');
    if(textField.value == "") {
      el.classList.remove('form-filled');
    } else {
      el.classList.add('form-filled');
    }
  });
  
});