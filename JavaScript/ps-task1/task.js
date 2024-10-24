function createString(s) {
  s = String(s);
  if (s.length < 3) {
    return s;
  }
  const sbstr = s.slice(-3);
  return s = sbstr + s + sbstr;
}
createString("Swift");

// one line version
function createString2(s) {
  return ((s = String(s)).length < 3).length < 3 ? s : s.slice(-3) + s + s.slice(-3);
}
createString2(123);

// arrow
const createString3 = (s) => (s = String(s)).length < 3 ? s : s.slice(-3) + s + s.slice(-3);
createString3("Swift");
