// Run: node src/build.js  (inlines css + js into the single deliverable html)
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const read = (f) => fs.readFileSync(path.join(dir, f), 'utf8');
const jsFiles = ['notes-l6.js', 'notes-l7.js', 'notes-l8.js', 'notes-cs.js', 'quiz-practice.js', 'quiz-mock.js', 'concepts.js', 'logic.js', 'app.js'];

// "</script" and "<!--" inside inline JS strings would end or confuse the script element.
const js = ('const NOTES = [];\n' + jsFiles.map(read).join('\n'))
  .replace(/<\/script/gi, '<\\/script')
  .replace(/<!--/g, '<\\!--');

const html = read('template.html')
  .replace('/*@CSS*/', () => read('styles.css'))
  .replace('/*@JS*/', () => js);

const out = path.join(dir, '..', 'JS-Exam-Guide.html');
fs.writeFileSync(out, html);
// GitHub Pages serves index.html at the repo root.
fs.writeFileSync(path.join(dir, '..', 'index.html'), html);
console.log('wrote', out, (html.length / 1024).toFixed(0) + ' KB');
