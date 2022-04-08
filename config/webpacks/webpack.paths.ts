const path = require('path');

const rootPath = path.join(__dirname, '../..');
const dllPath = path.join(__dirname, '../dll');
const srcPath = path.join(rootPath, 'src');
const srcMainPath = path.join(srcPath, 'main');
const srcRendererPath = path.join(srcPath, 'renderer');


const distPath = path.join(__dirname, '../../release/app/dist');


export default {
  rootPath,
  srcPath,
  srcMainPath,
  srcRendererPath,
  distPath,
  dllPath,
};
