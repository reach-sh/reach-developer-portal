import { visit } from 'unist-util-visit'
import { is } from 'unist-util-is'

export default attacher

function attacher() {
  return transformer

  function transformer(tree, file) {
    visit(tree, 'ParagraphNode', visitor)

    function visitor(node) {
      var children = node.children
      children.forEach(function (child, index) {
        if (
          is(children[index - 1], 'SentenceNode') &&
          is(child, 'WhiteSpaceNode') &&
          is(children[index + 1], 'SentenceNode')
        ) {
          if (child.value.length !== 1) {
            file.message(
              'Expected 1 space between sentences, not ' + child.value.length,
              child
            )
          }
        }
      })
    }
  }
}