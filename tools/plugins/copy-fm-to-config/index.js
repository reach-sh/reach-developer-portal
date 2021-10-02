import { visit } from 'unist-util-visit';
import yaml from 'js-yaml';
import fs from 'fs-extra';

export default function attacher(options = {}) {
  return (tree, file) => {
    try {
      let configJson = fs.readJsonSync(options.path);
      visit(tree, 'yaml', (node, index, parent) => {
        let fm = yaml.load(node.value, 'utf8');

        //console.log(JSON.stringify(fm, null, 2));

        if(fm.hasOwnProperty('author')) {configJson.author = fm.author;}
        if(fm.hasOwnProperty('bookTitle')) {configJson.bookTitle = fm.bookTitle;}
        if(fm.hasOwnProperty('hasOtp')) {configJson.hasOtp = fm.hasOtp;}
        if(fm.hasOwnProperty('hasPageHeader')) {configJson.hasPageHeader = fm.hasPageHeader;}
        if(fm.hasOwnProperty('hasPageScrollbar')) {configJson.hasPageScrollbar = fm.hasPageScrollbar;}
        if(fm.hasOwnProperty('menuItem')) {configJson.menuItem = fm.menuItem;}
        if(fm.hasOwnProperty('publishedDate')) {configJson.publishedDate = fm.publishedDate;}
        fs.writeFileSync(options.path, JSON.stringify(configJson, null, 2));
        parent.children.splice(index, 1); // Remove yaml node.
        return [visit.SKIP, index];
      });

    } catch (err) {
      console.log(err);
    }
  }
}
