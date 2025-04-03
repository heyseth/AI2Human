import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useWordHighlight } from '../hooks/useWordHighlight';
import { defaultPatterns } from '../config/patterns';

const DEFAULT_TEXT = `This tool is designed for anyone who uses ChatGPT or other AI tools for writing and wants their content to sound more natural and less robotic. Simply paste or enter your writing into the text box, and the tool checks it against a list of hundreds of overused AI words and phrases, highlighting any matches that are found.

Changing or removing these phrases can help to elevate your writing, transforming it into a tapestry of dynamic and engaging prose. Whether you're navigating the uncharted landscape of AI-assisted content creation or refining your existing work to stand out, you can leverage this tool to unlock the full potential of your words.`;

const EditorContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const EditorHeader = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditorTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  color: #495057;
  font-weight: 500;
`;

const EditorContent = styled.div`
  min-height: 400px;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #212529;
  outline: none;
  white-space: pre-wrap;

  & mark.highlight {
    background-color: #fff3bf;
    border-radius: 2px;
    padding: 2px 0;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: #ffe066;
    }
  }
`;

const WordList = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  font-size: 0.9rem;
  color: #495057;
  display: ${props => props.hasmatches === 'true' ? 'block' : 'none'};
`;

const Tag = styled.span`
  display: inline-block;
  padding: 4px 8px;
  margin: 4px;
  background: #e9ecef;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #495057;
`;

const MatchCount = styled.span`
  margin-left: 4px;
  color: #868e96;
  font-size: 0.8rem;
`;

const TextEditor = () => {
  const [content, setContent] = useState('');
  const [wordList] = useState(defaultPatterns);
  const editorRef = useRef(null);
  const { html, matches } = useWordHighlight(content, wordList);
  const [isClient, setIsClient] = useState(false);
  const [selectionInfo, setSelectionInfo] = useState(null);
  const isUpdatingRef = useRef(false);

  // Get unique patterns that have matches
  const matchedPatterns = [...new Set(matches.map(match => match.pattern))];
  
  // Count occurrences for each pattern
  const patternCounts = matches.reduce((acc, match) => {
    acc[match.pattern] = (acc[match.pattern] || 0) + 1;
    return acc;
  }, {});

  // Save selection position before input
  const saveSelection = () => {
    if (!isClient || !editorRef.current) return;
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    if (!editorRef.current.contains(range.commonAncestorContainer)) return;
    
    // Calculate caret position
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editorRef.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const caretOffset = preCaretRange.toString().length;
    
    setSelectionInfo({ offset: caretOffset });
  };

  // Restore selection after content update
  const restoreSelection = () => {
    if (!isClient || !editorRef.current || !selectionInfo) return;
    
    const selection = window.getSelection();
    const { offset } = selectionInfo;
    
    // Find the right text node and position
    const textNodes = [];
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }
    
    let currentOffset = 0;
    let targetNode = null;
    let targetOffset = 0;
    
    // Find the text node and offset where the cursor should be placed
    for (const node of textNodes) {
      const nodeLength = node.textContent.length;
      if (currentOffset + nodeLength >= offset) {
        targetNode = node;
        targetOffset = offset - currentOffset;
        break;
      }
      currentOffset += nodeLength;
    }
    
    if (targetNode) {
      try {
        const range = document.createRange();
        range.setStart(targetNode, targetOffset);
        range.setEnd(targetNode, targetOffset);
        selection.removeAllRanges();
        selection.addRange(range);
      } catch (e) {
        console.warn('Could not restore cursor position:', e);
      }
    }
  };

  const handleInput = (e) => {
    if (isUpdatingRef.current) return;
    
    saveSelection();
    const text = e.target.innerText;
    setContent(text);
    localStorage.setItem('editorContent', text);
  };

  // Initialize content from localStorage only on client-side
  useEffect(() => {
    setIsClient(true);
    const savedContent = localStorage.getItem('editorContent');
    setContent(savedContent !== null ? savedContent : DEFAULT_TEXT);
  }, []);

  // Update editor content and restore selection
  useEffect(() => {
    if (!editorRef.current || !isClient || !content) return;
    
    isUpdatingRef.current = true;
    editorRef.current.innerHTML = html;
    
    // Restore cursor position after DOM update
    setTimeout(() => {
      restoreSelection();
      isUpdatingRef.current = false;
    }, 0);
  }, [html, isClient]);

  // Set initial content
  useEffect(() => {
    if (editorRef.current && isClient && content && !selectionInfo) {
      editorRef.current.innerHTML = html;
    }
  }, [isClient]);

  if (!isClient) {
    return <EditorContainer>Loading editor...</EditorContainer>;
  }

  return (
    <EditorContainer>
      <EditorContent
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        suppressContentEditableWarning
      />
      <WordList hasmatches={(matchedPatterns.length > 0).toString()}>
        <div>Found matches:</div>
        {matchedPatterns.map((pattern, index) => (
          <Tag key={index}>
            {pattern}
            <MatchCount>({patternCounts[pattern]})</MatchCount>
          </Tag>
        ))}
      </WordList>
    </EditorContainer>
  );
};

export default TextEditor;
