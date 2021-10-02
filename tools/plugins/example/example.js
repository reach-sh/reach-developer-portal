import { readFileSync } from 'fs'
import { retext } from 'retext'
import report from 'vfile-reporter'
import spacing from './index.js'

var input = readFileSync('example.md')

retext()
  .use(spacing)
  .process(input, function (err, output) {
    console.error(report(err || output))
  })
