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
  let num = document.getElementById("float-num").value;
  num = parseFloat(num);
  console.log(num);
  let sign = 0;
  if (num < 0) {
    sign = 1;
  }
  let mag = Math.abs(num);

  let exp = 127;
  while (mag / Math.pow(2, exp) < 1) {
    exp -= 1;
  }

  let mantissa = "";
  let remainder = mag - Math.pow(2, exp);
  console.log(remainder);

  for (let i = 0; i < 23; i++) {
    let place = exp - 1 - i;
    if (remainder / Math.pow(2, place) >= 1) {
      mantissa += '1';
      remainder -= Math.pow(2, place);
    }
    else {
      mantissa += '0';
    }
  }

  let exponent = (exp + 127).toString(2).padStart(8, '0');
  // let mantissa = '0'.repeat(23);
  document.getElementById("full").textContent = "" + sign + " " + exponent + " " + mantissa;
  document.getElementById("sign").textContent = sign;
  document.getElementById("exponent").textContent = exponent;
  document.getElementById("mantissa").textContent = mantissa;
}

function convert_to_bcit() {
  let num = document.getElementById("float-num").value;
  num = parseFloat(num);
  console.log(num);
  let sign = 0;
  if (num < 0) {
    sign = 1;
  }
  let mag = Math.abs(num);

  let exp = 7;
  while (mag / Math.pow(2, exp) < 1) {
    exp -= 1;
  }

  let mantissa = "";
  let remainder = mag - Math.pow(2, exp);
  console.log(remainder);

  for (let i = 0; i < 5; i++) {
    let place = exp - 1 - i;
    if (remainder / Math.pow(2, place) >= 1) {
      mantissa += '1';
      remainder -= Math.pow(2, place);
    }
    else {
      mantissa += '0';
    }
  }

  let exponent = (exp + 7).toString(2).padStart(4, '0');
  document.getElementById("full").textContent = "" + sign + " " + exponent + " " + mantissa;
  document.getElementById("sign").textContent = sign;
  document.getElementById("exponent").textContent = exponent;
  document.getElementById("mantissa").textContent = mantissa;
}