const fs = require('fs');
const path = 'frontend/src/App.tsx';
const s = fs.readFileSync(path, 'utf8');
let counts = {'{':0,'}':0,'(':0,')':0,'[':0,']':0,'<jsx_open>':0,'<jsx_close>':0};
for (let i=0;i<s.length;i++){
  const c = s[i];
  if (counts.hasOwnProperty(c)) counts[c]++;
}
// naive JSX tag count
const openTags = s.match(/<[^>\/!][^>]*>/g) || [];
const closeTags = s.match(/<\/[^>]+>/g) || [];
counts['<jsx_open>']=openTags.length;
counts['<jsx_close>']=closeTags.length;
console.log(JSON.stringify(counts,null,2));
// find last non-whitespace character
for (let i=s.length-1;i>=0;i--){ if(!/\s/.test(s[i])){ console.log('lastChar:', s[i], 'at', i+1); break; }}
