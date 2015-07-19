var globalRotors = {
    I: {bindings:["AELTPHQXRU", "BKNW", "CMOY", "DFG", "IV", "JZ", "S"], notch:["Q"],
        position: ""},
    II: {bindings:["FIXVYOMW", "CDKLHUP", "ESZ", "BJ", "GR", "NT", "A", "Q"], notch:["E"],
        position: ""},
    III: {bindings:["ABDHPEJT", "CFLVMZOYQIRWUKXSG", "N"], notch:["V"],
        position: ""},
    IV: {bindings:["AEPLIYWCOXMRFZBSTGJQNH", "DV", "KU"], notch:["J"],
        position: ""},
    V: {bindings:["AVOLDRWFIUQ", "BZKSMNHYC", "EGTJPX"], notch:["Z"],
        position: ""},
    VI: {bindings:["AJQDVLEOZWIYTS", "CGMNHFUX", "BPRK"], notch:["Z", "M"],
        position: ""},
    VII: {bindings:["ANOUPFRIMBZTLWKSVEGCJYDHXQ"], notch:["Z", "M"],
        position: ""},
    VIII: {bindings:["AFLSETWUNDHOZVICQ", "BKJ", "GXY", "MPR"], notch:["Z", "M"],
        position: ""},
    Beta: {bindings:["ALBEVFCYODJWUGNMQTZSKPR", "HIX"], position: ""},
    Gamma: {bindings:["AFNIRLBSQWVXGUZDKMTPCOYJHE"],position: ""},
    B: {bindings:["AE", "BN", "CK", "DQ", "FU", "GY", "HW", "IJ", "LO", "MP", "RX", "SZ", "TV"]},
    C: {bindings:["AR", "BD", "CO", "EJ", "FN", "GT", "HK", "IV", "LM", "PW", "QZ", "SX", "UY"]}
    };

var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function main() {
    rotors = ["B", "Beta", "III", "IV", "I"]
    globalRotors[rotors[1]].position = "A";
    globalRotors[rotors[2]].position = "X";
    globalRotors[rotors[3]].position = "L";
    globalRotors[rotors[4]].position = "E";
    encryptMessage("Hello my name is carlos", rotors);
}

function encryptMessage(message, rotors) {
    lst = parseMessage(message.toUpperCase());
    console.log(lst.join(" "));
    encryptedString = "";
    for (outer = 0; outer < lst.length; outer++) {
        msg = lst[outer];
        for (inner = 0; inner < msg.length; inner++) {
            rotateLetterPositions(rotors);
            encryptedString += encryptLetter(msg[inner], rotors);
        }
    }
    lst1 = parseMessage(encryptedString);
    console.log(lst1.join(" "));
    $(document).keydown(function(e) {
        var elid = $(document.activeElement).hasClass('textInput');
        if (e.keyCode === 8 && !elid) {
            return false;
        };
    });
}

function mod(x, y) {
    return x - (Math.floor(x/y) * y);
}

function parseMessage(msg) {
    var messageList = [];
    var charString = "";
    for (i = 0; i < msg.length; i++) {
        if (msg.charCodeAt(i) != 32) {
           if (charString.length == 4 || i == msg.length - 1) {
               charString += msg[i];
               messageList.push(charString);
               charString = "";
           } else {
               charString += msg[i];
           }
        }
    }
    return messageList
}

function getMapping(rotorName, letter, f) {
    var bindings = globalRotors[rotorName].bindings;
    for (i = 0; i < bindings.length; i++) {
        for (j = 0; j < bindings[i].length; j++) {
            if (bindings[i][j] == letter) {
                if (j == bindings[i].length - 1 && f) {
                    return bindings[i][0];
                } else if (j == 0 && !f) {
                    return bindings[i][bindings[i].length - 1];
                }
                return f ? bindings[i][j + 1] : bindings[i][j - 1];
            }
        }
    }
}

function numInAlphabet(letter) {
    for (i = 0; i < alphabet.length; i++) {
        if (letter == alphabet[i]) {
            return i;
        }
    }
}

function letterInAlphabet(num) {
    return alphabet[mod(num, 26)];
}

function rotateLetter(letter) {
    return letterInAlphabet(mod((numInAlphabet(letter) + 1), 26));
}

function rotateLetterPositions(rotors) {
    var oldNotch5 = globalRotors[rotors[4]].position;
    var oldNotch4 = globalRotors[rotors[3]].position;
    globalRotors[rotors[4]].position =
        rotateLetter(globalRotors[rotors[4]].position);
    if ((globalRotors[rotors[4]].notch).indexOf(oldNotch5) > -1) {
        globalRotors[rotors[3]].position =
            rotateLetter(globalRotors[rotors[3]].position);
        if ((globalRotors[rotors[3]].notch).indexOf(oldNotch4) > -1) {
            globalRotors[rotors[2]].position =
                rotateLetter(globalRotors[rotors[2]].position);
            globalRotors[rotors[3]].position =
                rotateLetter(globalRotors[rotors[3]].position);
        }
    }
    if ((globalRotors[rotors[3]].notch).indexOf(oldNotch4) > -1) {
        globalRotors[rotors[2]].position =
            rotateLetter(globalRotors[rotors[2]].position);
        globalRotors[rotors[3]].position =
            rotateLetter(globalRotors[rotors[3]].position);
    }
}

function forwardPass(rotorName, oldLetter, letterPosition) {
    var newLetter =
    letterInAlphabet(
         mod((numInAlphabet(oldLetter) + numInAlphabet(letterPosition)), 26));
    newNumber = numInAlphabet(getMapping(rotorName, newLetter, true));
    return letterInAlphabet(
        mod((newNumber - numInAlphabet(letterPosition)), 26));
}

function reflect(rotorName, oldLetter) {
    return getMapping(rotorName, oldLetter, false);
}

function backwardPass(rotorName, oldLetter, letterPosition) {
    newLetter =
    letterInAlphabet(
        mod((numInAlphabet(oldLetter) + numInAlphabet(letterPosition)), 26));
    newNumber = numInAlphabet(getMapping(rotorName, newLetter, false));
    return letterInAlphabet(mod(newNumber - numInAlphabet(letterPosition), 26));
}

function encryptLetter (letter, rotors) {
    newLetter = forwardPass(rotors[4], letter,
        globalRotors[rotors[4]].position);
    newLetter = forwardPass(rotors[3], newLetter,
        globalRotors[rotors[3]].position);
    newLetter = forwardPass(rotors[2], newLetter,
        globalRotors[rotors[2]].position);
    newLetter = forwardPass(rotors[1], newLetter,
        globalRotors[rotors[1]].position);
    newLetter = reflect(rotors[0], newLetter);
    newLetter = backwardPass(rotors[1], newLetter,
        globalRotors[rotors[1]].position);
    newLetter = backwardPass(rotors[2], newLetter,
        globalRotors[rotors[2]].position);
    newLetter = backwardPass(rotors[3], newLetter,
        globalRotors[rotors[3]].position);
    newLetter = backwardPass(rotors[4], newLetter,
        globalRotors[rotors[4]].position);
    return newLetter;
}

// page stuff

window.onload = main;
