/*
 * @lc app=leetcode id=30 lang=typescript
 *
 * [30] Substring with Concatenation of All Words
 */

findSubstring('barfoothefoobarman', ['foo', 'bar']);

// @lc code=start

function findSubstring(s: string, words: string[]): number[] {
  return [];
}

// not work currently for like aaaaaaaaaaaaaa with words [aa, aa, aa]
export function findSubstring1(s: string, words: string[]): number[] {
  if (words.length === 0 || s.length === 0) {
    return [];
  }

  const wordFreqMap = new Map<string, number>();
  for (const word of words) {
    wordFreqMap.set(word, (wordFreqMap.get(word) || 0) + 1);
  }
  const wordLen = words[0].length;
  const wordIdxMap = new Map<string, number[]>();

  const retIdx: number[] = [];
  let left = 0;
  let right = 0;
  let curWord = '';
  let searchRepo = words;

  const getMatchedWords = (chars: string, repo: string[]) =>
    repo.filter((word) => word.startsWith(chars));

  while (right < s.length) {
    const char = s[right];
    curWord += char;
    const matchedWords = getMatchedWords(curWord, searchRepo);
    // might be in the word repo(starts with)
    if (matchedWords.length) {
      searchRepo = matchedWords;
      // check the complete word
      if (curWord.length === wordLen) {
        const wordIdxs = wordIdxMap.get(curWord);
        const freq = wordFreqMap.get(curWord) || 0;
        // already met the word, skip to the next word position
        if (wordIdxs?.length && wordIdxs.length >= freq) {
          const firstMetIdx = wordIdxs.shift() || left;
          left = firstMetIdx + wordLen;
          // clear all the recorded words before this wordIdx
          wordIdxMap.forEach((idxs, word) => {
            const newIdxs = idxs.filter((idx) => idx >= left);
            if (newIdxs.length) {
              wordIdxMap.set(word, newIdxs);
            } else {
              wordIdxMap.delete(word);
            }
          });
        }

        wordIdxMap.set(
          curWord,
          wordIdxMap.get(curWord)?.concat([right - wordLen + 1]) || [
            right - wordLen + 1,
          ],
        );

        // find one concatenation, reduce the first word and continue
        const wordsSize = Array.from(wordIdxMap.values()).reduce(
          (sum, idxs) => sum + idxs.length,
          0,
        );
        if (wordsSize === words.length) {
          retIdx.push(left);
          // move left pointer to the next word position
          let reduceWord = '';
          while (reduceWord.length < wordLen) {
            reduceWord += s[left];
            left++;
          }
          const reduceWordIdxs = wordIdxMap.get(reduceWord) || [];
          reduceWordIdxs.shift();
          if (reduceWordIdxs.length) {
            wordIdxMap.set(reduceWord, reduceWordIdxs);
          } else {
            wordIdxMap.delete(reduceWord);
          }
        }

        // clear current word and reset search repo
        curWord = '';
        searchRepo = words;
        right++;
      } else {
        // continue to build the current word
        right++;
      }
    } else {
      // not in the word repo, narrow down the slide window
      // clear the map as well
      wordIdxMap.clear();
      searchRepo = words;
      left = right - curWord.length + 1;
      while (left < right) {
        left++;
        curWord = curWord.substring(0);
        // match again
        const matchedWords = getMatchedWords(curWord, searchRepo);
        // matched, then continue to build the current word
        if (matchedWords.length) {
          searchRepo = matchedWords;
          break;
        }
      }

      if (left === right) {
        left++;
        curWord = '';
      }
      right++;
    }
  }

  return retIdx;
}
// @lc code=end
