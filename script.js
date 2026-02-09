function displayContent() {
  const selector = document.getElementById('content-selector');
  const selectedValue = selector.value;
  const cont = document.getElementById("content");

  let file = '';

  if (selectedValue === "binary") {
    file = './binary.html';
  }
  else if (selectedValue === 'float') {
    file = './float.html';
  }
  else {
    cont.innerHTML = '';
    return;
  }

  fetch(file)
    .then(response => response.text())
    .then(html => {
      cont.innerHTML = html;
    })
    .catch(err => {
      cont.innerHTML = '<p>Error loading content.</p>';
      console.error(err);
  });
}

function calculate() {
  let num = document.getElementById("num").value;
  let bits = document.getElementById("bits").value;

  num = parseInt(num, 10);
  bits = parseInt(bits, 10);

  let absnum = Math.abs(num);

  if (num < 0) {
    document.getElementById("unsigned").textContent = "Invalid";
  }
  else {
    document.getElementById("unsigned").textContent = absnum.toString(2).padStart(bits, '0');
  }


  /* Signed Magnitude
  *  MSB is sign
  */
  if (Math.abs(num) > Math.pow(2, bits-1) - 1) {
    document.getElementById("sm").textContent = "Invalid";
  }
  else {
    let sign = "0";
    if(num < 0) {
      sign = "1";
    }
    let mag = absnum.toString(2).padStart(bits - 1, '0');
    document.getElementById("sm").textContent = sign + mag;
  }

  /* 
   * One's Complement
   * 
   * 
  */
  let onec = "Invalid";
  if (num > -Math.pow(2, bits - 1) && num < Math.pow(2, bits - 1)) {
    onec = document.getElementById("sm").textContent;
    if (onec.charAt(0) === '1') {
      onec = "1" + invert(onec.substring(1));
    }
  }
  document.getElementById("1c").textContent = onec;
  /* 
   * Two's Complement
   * 
   * 
  */
  let twoc = "Invalid";
  if (num >= -Math.pow(2, bits - 1) && num < Math.pow(2, bits - 1)) {
    if (num === -Math.pow(2, bits - 1)) {
      twoc = "1" + "0".repeat(bits - 1);
    }
    else {
      twoc = add_bit(onec, bits);
    }
  }
  document.getElementById("2c").textContent = twoc;

  
  /* 
   * Excess 2^(n - 1)
   * 
  */
  let bias = Math.pow(2, bits - 1);
  let excess = bias + num;
  if (excess < 0 || excess > (Math.pow(2, bits) - 1)) {
    excess = "Invalid";
  }
  document.getElementById("excess").textContent = excess.toString(2).padStart(bits, '0');

  
  /* 
   * Bias 2^(n - 1) - 1
   * 
  */
  bias = Math.pow(2, bits - 1) - 1;
  let bias_num = bias + num;
  if (bias_num < 0 || bias_num > (Math.pow(2, bits))) {
    bias_num = "Invalid";
  }
  document.getElementById("bias").textContent = bias_num.toString(2).padStart(bits, '0');

}

function add_bit(num, bits) {
  // let n = num.toString(2).padStart(bits, '0');
  // let n = "";
  // if (n.length() > bits) {
  //   n = n.substring(n.length() - bits);
  // }
  let carry = '1';
  let i = num.length - 1;
  while (i > -1) {
    if (num.charAt(i) === '0' && carry === '1') {
      num = num.substring(0, i) + '1' + num.substring(i + 1);
      carry = '0';
    }
    else if (num.charAt(i) === '1' && carry === '1') {
      num = num.substring(0, i) + '0' + num.substring(i + 1);
    }
    i--;
  }
  return num;
  
}

// num is a bitstring
function invert(num) {
  let n = "";
  for (let i = 0; i < num.length; i++) {
    if (num.charAt(i) === '0') {
      n += '1';
    }
    else {
      n += '0';
    }
    
  }
  return n;
}

function convert_to_ieee() {
  const min_exp = -127;
  const max_exp = 127;
  const len_mantissa = 23;

  let num = document.getElementById("float-num").value;
  num = parseFloat(num);
  console.log(num);
  let sign = 0;
  if (num < 0) {
    sign = 1;
  }
  let mag = Math.abs(num);

  let exp = max_exp;
  while (mag / Math.pow(2, exp) < 1 && exp > min_exp) {
    exp -= 1;
  }
  console.log("exp: " + exp);

  let mantissa = "";
  let remainder = mag;
  if (mag >= Math.pow(2, exp)) {
    remainder = mag - Math.pow(2, exp);
  }
  console.log(remainder);

  for (let i = 0; i < len_mantissa; i++) {
    let place = exp - 1 - i;
    if (remainder / Math.pow(2, place) >= 1) {
      mantissa += '1';
      remainder -= Math.pow(2, place);
    }
    else {
      mantissa += '0';
    }
  }

  let exponent;
  if (exp == min_exp) {
    exponent = '0'.repeat(8);
  }
  else {
    exponent = (exp + max_exp).toString(2).padStart(8, '0');
  }
  document.getElementById("full").textContent = "" + sign + " " + exponent + " " + mantissa;
  document.getElementById("sign").textContent = sign;
  document.getElementById("exponent").textContent = exponent;
  document.getElementById("mantissa").textContent = mantissa;
}

function convert_to_bcit() {
  const min_exp = -7;
  const max_exp = 7;
  const len_mantissa = 5;

  let num = document.getElementById("float-num").value;
  num = parseFloat(num);
  console.log(num);
  let sign = 0;
  if (num < 0) {
    sign = 1;
  }
  let mag = Math.abs(num);

  let exp = max_exp;
  while (mag / Math.pow(2, exp) < 1 && exp > min_exp) {
    exp -= 1;
  }
  console.log("exp: " + exp);

  let mantissa = "";
  let remainder = mag;
  if (mag >= Math.pow(2, exp)) {
    remainder = mag - Math.pow(2, exp);
  }
  console.log(remainder);

  for (let i = 0; i < len_mantissa; i++) {
    let place = exp - 1 - i;
    if (remainder / Math.pow(2, place) >= 1) {
      mantissa += '1';
      remainder -= Math.pow(2, place);
    }
    else {
      mantissa += '0';
    }
  }

  let exponent;
  if (exp == min_exp) {
    exponent = '0'.repeat(4);
  }
  else {
    exponent = (exp + max_exp).toString(2).padStart(8, '0');
  }
  document.getElementById("full").textContent = "" + sign + " " + exponent + " " + mantissa;
  document.getElementById("sign").textContent = sign;
  document.getElementById("exponent").textContent = exponent;
  document.getElementById("mantissa").textContent = mantissa;
}