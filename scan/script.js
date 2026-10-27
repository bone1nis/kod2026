const scene = document.querySelector('.scene');
const glyphs = document.querySelectorAll('.glyph');
const cells = document.querySelectorAll('.progress__cell');
const message = document.querySelector('.message');
const status = document.querySelector('.panel__status');
const button = document.querySelector('.scan-btn');

const SCAN_TIME = 1600;
const PAUSE = 600;

function scanGlyph(index, done) {
  const glyph = glyphs[index];
  const cell = cells[index];

  status.textContent = 'Сканирую символ ' + (index + 1) + ' из ' + glyphs.length + '...';
  glyph.classList.add('glyph--scanning');
  cell.classList.add('progress__cell--active');

  setTimeout(function () {
    glyph.classList.remove('glyph--scanning');
    glyph.classList.add('glyph--decoded');

    cell.classList.remove('progress__cell--active');
    cell.classList.add('progress__cell--done');

    const word = glyph.querySelector('.glyph__word').textContent;
    status.textContent = 'Символ ' + (index + 1) + ' расшифрован: «' + word + '»';

    setTimeout(done, PAUSE);
  }, SCAN_TIME);
}

function scanNext(index) {
  if (index === glyphs.length) {
    finish();
    return;
  }

  scanGlyph(index, function () {
    scanNext(index + 1);
  });
}

function finish() {
  scene.classList.add('scene--open');
  message.classList.add('message--visible');
  status.textContent = 'Послание расшифровано';
  button.textContent = 'Готово';
}

button.addEventListener('click', function () {
  button.disabled = true;
  button.textContent = 'Сканирование...';
  scanNext(0);
});
