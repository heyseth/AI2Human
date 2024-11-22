import { useMemo } from 'react';

const convertWildcardToRegExp = (pattern) => {
  // Convert the pattern to a RegExp object
  return new RegExp(
    pattern
    // replace * with (\w)*
    .replace(/\*/g, '(\\w)*')
  );
};

export const useWordHighlight = (text, patterns) => {
  return useMemo(() => {
    if (!text || !patterns?.length) return { html: text, matches: [] };

    // Convert patterns with wildcards to RegExp objects
    const regexPatterns = patterns.map(pattern => ({
      original: pattern,
      regex: convertWildcardToRegExp(pattern.toLowerCase())
    }));

    const matches = [];
    let html = text;
    let offset = 0;

    // Find all matches in the text
    const allMatches = [];
    regexPatterns.forEach(({ original, regex }) => {
      const globalRegex = new RegExp(regex.source, 'gi');
      let match;
      while ((match = globalRegex.exec(text)) !== null) {
        allMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[0],
          pattern: original
        });
      }
    });

    // Sort matches by start position
    allMatches.sort((a, b) => a.start - b.start);

    // Filter out overlapping matches
    const validMatches = allMatches.reduce((acc, match) => {
      if (!acc.length) {
        acc.push(match);
      } else {
        const lastMatch = acc[acc.length - 1];
        if (match.start >= lastMatch.end) {
          acc.push(match);
        }
      }
      return acc;
    }, []);

    // Apply highlighting
    let lastIndex = 0;
    const parts = [];

    validMatches.forEach(match => {
      // Add text before the match
      if (match.start > lastIndex) {
        parts.push(text.substring(lastIndex, match.start));
      }

      // Add highlighted match
      parts.push(`<mark class="highlight">${text.substring(match.start, match.end)}</mark>`);
      lastIndex = match.end;

      // Store match information
      matches.push({
        word: match.text,
        pattern: match.pattern,
        position: match.start
      });
    });

    // Add remaining text after last match
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return {
      html: parts.join(''),
      matches
    };
  }, [text, patterns]);
};
