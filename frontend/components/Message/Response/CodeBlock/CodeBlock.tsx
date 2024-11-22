import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python';
import './CodeBlock.scss';

// Register Python language
SyntaxHighlighter.registerLanguage('python', python);

function CodeBlock({ code, showLines = true }: { code: string, showLines?: boolean }) {
  return (
    <SyntaxHighlighter
      language="python"
      style={oneLight}
      showLineNumbers={showLines}
      className="transparent-code-block"
    >
      {code}
    </SyntaxHighlighter>
  );
}

export default CodeBlock;