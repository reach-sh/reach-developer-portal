import { visit } from 'unist-util-visit';
import fs from 'fs-extra';

export default function attacher(options = {}) {
  return (tree, file) => {

    tree.children = [
      {
        "type": "heading",
        "depth": 6,
        "children": [
          {
            "type": "text",
            "value": "toc",
            "position": {
              "start": {
                "line": 1,
                "column": 8,
                "offset": 7
              },
              "end": {
                "line": 1,
                "column": 11,
                "offset": 10
              }
            }
          }
        ],
        "position": {
          "start": {
            "line": 1,
            "column": 1,
            "offset": 0
          },
          "end": {
            "line": 1,
            "column": 12,
            "offset": 11
          }
        }
      },
      ...tree.children.slice(0)
    ];

    /*
    node.children = [
      ...node.children.slice(0, result.index),
      result.map,
      ...node.children.slice(result.endIndex)
    ]
    */
    
  }
}
