import { DefaultTheme } from 'styled-components';
import {
  COMMENT,
  compile,
  DECLARATION,
  IMPORT,
  RULESET,
  serialize,
  strlen,
  Middleware,
  KEYFRAMES,
  MEDIA,
  SUPPORTS,
} from 'stylis';

//Define Common Types
type MiddlewareParams = Parameters<Middleware>;
type StylisElement = MiddlewareParams[0];
type AtQueryTransformer = (element: StylisElement, content: string, theme:DefaultTheme) => string
type ThemeConfig = DefaultTheme | { mobile_size: string }

export function stylisAtQueries(_theme?:Partial<ThemeConfig>) {
  let queries: {
    [key:string]:AtQueryTransformer
  } = {}

  const add = (key:string, func:AtQueryTransformer) => {
    queries[key] = func;
  }

  add("@isMobile", (element, content, theme) => {
    return `
    @media screen and (max-width: ${theme.mobile_size}) {
      ${getClosestParentRule(element)} {
        ${content}
      }
    }
    `
  });
  const definedTheme:ThemeConfig = {
    mobile_size: "600px",
    ..._theme,
  }
  return {
    add,
    plugin: (
      element: StylisElement,
      index: MiddlewareParams[1],
      children: MiddlewareParams[2],
      callback: MiddlewareParams[3]
    )=>stylisAtQueriesPlugin(definedTheme, queries, element, index, children, callback)
  }
}

// stable identifier that will not be dropped by minification unless the whole module is unused
Object.defineProperty(stylisAtQueries, 'name', { value: 'stylisAtQueries' });



function stringifyElement(
  element: StylisElement,
): string {
  if (element == undefined) return "";
  
  const serializedChildren = serialize(Array.prototype.concat(element.children), stringifyElement);

  return strlen(serializedChildren) ? (element.return = element.value + '{' + serializedChildren + '}') : element.value;
}

function stringifyElements(
  elements: string | (StylisElement)[],
): string {
  if (typeof elements == "string") return elements;
  let rtn = ""

  for (let i = 0; i < elements.length; i++) {
    rtn+= stringifyElement(elements[i])
  }
  return rtn;
}

function stylisAtQueriesPlugin(
  theme:DefaultTheme,
  queries: {
    [key:string]:AtQueryTransformer
  },
  element: StylisElement,
  index: MiddlewareParams[1],
  children: MiddlewareParams[2],
  callback: MiddlewareParams[3]
): string | void {

  const QueryKeys = Object.keys(queries);

  for (let i = 0; i < QueryKeys.length; i++) {
    if (element.type != QueryKeys[i]) continue;

    //Convert children to string
    let stringifiedContent = ""
    if (typeof element.children[0] == "string") {
      stringifiedContent = element.children[0]
    } else {
      stringifiedContent = stringifyElements(element.children);
    }

    //convert string to node
    let element_str = queries[QueryKeys[i]](element, stringifiedContent, theme)
    let elements = compile(element_str);
    let newElement = elements[0];

    //replace element content
    element.type = newElement.type;
    element.return = newElement.return;
    element.value = newElement.value;
    element.children = newElement.children;
    element.props = newElement.props;
    element.line = newElement.line;
    element.column = newElement.column;
    element.length = newElement.length;
  }
}

function getClosestParentRule(element:StylisElement) {
  let ele:StylisElement|null = element;
  while (ele != null && ele.type != "rule") {
    ele = ele.parent;
  }
  if (ele != null) return ele.value;
  return ""
}