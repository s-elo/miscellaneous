/*
 * @lc app=leetcode id=68 lang=typescript
 *
 * [68] Text Justification
 */

fullJustify(
  ['This', 'is', 'an', 'example', 'of', 'text', 'justification.'],
  16,
);

// @lc code=start
function fullJustify(words: string[], maxWidth: number): string[] {
  const ret: string[] = [];

  let currentLineWords: string[] = [];
  let currentLineWordsWidth = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // include current word
    const gap = currentLineWords.length;
    const greedyWidth = currentLineWordsWidth + gap * 1 + word.length;

    // handle next line
    if (greedyWidth > maxWidth) {
      const gap = currentLineWords.length - 1;
      // only one word
      if (gap === 0) {
        ret.push(
          currentLineWords[0] +
            ' '.repeat(maxWidth - currentLineWords[0].length),
        );
      } else {
        const spaces = Math.floor((maxWidth - currentLineWordsWidth) / gap);
        const extraOneSpaceNum =
          (maxWidth - spaces * gap - currentLineWordsWidth) % gap;

        ret.push(
          currentLineWords.reduce((acc, word, i) => {
            if (i === currentLineWords.length - 1) return acc + word;
            acc +=
              word + ' '.repeat(i < extraOneSpaceNum ? spaces + 1 : spaces);
            return acc;
          }, ''),
        );
      }
      // reset records
      currentLineWords = [];
      currentLineWordsWidth = 0;
    }

    currentLineWords.push(word);
    currentLineWordsWidth += word.length;

    if (i === words.length - 1) {
      const gap = currentLineWords.length - 1;
      const extraSpaces = maxWidth - 1 * gap - currentLineWordsWidth;
      ret.push(currentLineWords.join(' ') + ' '.repeat(extraSpaces));
    }
  }

  return ret;
}
// @lc code=end
