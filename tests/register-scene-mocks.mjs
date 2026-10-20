import { registerHooks } from 'node:module';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

// Compile real scene components in the node test worker. Only native boundaries
// are replaced, so tests exercise the same JSX and animation switches as Expo Go.
registerHooks({
  resolve(specifier,context,next){
    if(specifier==='react-native-svg')return next(new URL('./mocks/svg.ts',import.meta.url).href,context);
    if(specifier.startsWith('.')&&!/\.[a-z]+$/i.test(specifier)){
      for(const suffix of ['.ts','.tsx']){
        const url=new URL(specifier+suffix,context.parentURL);
        if(existsSync(fileURLToPath(url)))return next(url.href,context);
      }
    }
    return next(specifier,context);
  },
  load(url,context,next){
    if(!url.endsWith('.tsx'))return next(url,context);
    let source=readFileSync(fileURLToPath(url),'utf8');
    source=source.replace(/require\((['"])([^'"]+\.png)\1\)/g,(_,quote,path)=>JSON.stringify(new URL(path,url).href));
    return {format:'module',source:ts.transpileModule(source,{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText,shortCircuit:true};
  },
});
