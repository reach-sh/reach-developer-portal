import { visit } from 'unist-util-visit';

export default function attacher() {
  return (tree, file) => {
    visit(tree, 'code', node => {
      if(node.lang || node.meta) {
        node.lang = 
        node.meta==null ? node.lang 
        : node.lang==null ? node.meta.split(' ').join('_')
        : `${node.lang}_${node.meta.split(' ').join('_')}`;
      }
    });
  }
}
