import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'

const CodeSnippet = ({code}: { code: string }) => {
  return (
    <details className='code-details'>
      <summary>Show code</summary>
      <pre>
        <code dangerouslySetInnerHTML={{__html: Prism.highlight(code, Prism.languages.tsx, 'tsx')}}/>
      </pre>
    </details>
  )
}

export default CodeSnippet