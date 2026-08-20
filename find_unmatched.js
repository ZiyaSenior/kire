const fs = require('fs');
const path = 'frontend/src/App.tsx';
const s = fs.readFileSync(path, 'utf8');
let stack = [];
for (let i=0;i<s.length;i++){
  const c = s[i];
  if (c==='{') stack.push(i+1);
  else if (c==='}') {
    if (stack.length===0) {
      console.log('Unexpected } at', i+1);
      process.exit(0);
    }
    stack.pop();
  }
}
if (stack.length===0) console.log('All braces matched');
else {
  console.log('Unmatched { count:', stack.length);
  const pos = stack[stack.length-1];
  console.log('Last unmatched { at pos', pos);
  const start = Math.max(0,pos-50);
  const end = Math.min(s.length,pos+200);
  console.log('Context:\n', s.slice(start,end).replace(/\n/g,'\n'));
}
