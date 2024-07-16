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

type MiddlewareParams = Parameters<Middleware>;
type StylisElement = MiddlewareParams[0];
type AtQueryTransformer = (element: StylisElement, content: string) => string
export function stylisAtQueries() {
  let queries: {
    [key:string]:AtQueryTransformer
  } = {
    "@isMobile": (element: StylisElement, content: string) => {
      return `
      @media screen and (max-width: 600px) {
        ${getClosestParentRule(element)} {
          ${content}
        }
      }
      `
    }
  }
  const add = (key:string, func:AtQueryTransformer) => {
    queries[key] = func;
  }
  return {
    add,
    plugin: (
      element: StylisElement,
      index: MiddlewareParams[1],
      children: MiddlewareParams[2],
      callback: MiddlewareParams[3]
    )=>stylisAtQueriesPlugin(queries, element, index, children, callback)
  }
}

// stable identifier that will not be dropped by minification unless the whole module
// is unused
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
  queries: {
    [key:string]:(element:StylisElement, content:string)=> string
  },
  element: StylisElement,
  index: MiddlewareParams[1],
  children: MiddlewareParams[2],
  callback: MiddlewareParams[3]
): string | void {

  const QueryKeys = Object.keys(queries);

  for (let i = 0; i < QueryKeys.length; i++) {
    if (element.type != QueryKeys[i]) continue;
    let stringifiedContent = ""
    if (typeof element.children[0] == "string") {
      stringifiedContent = element.children[0]
    } else {
      stringifiedContent = stringifyElements(element.children);
    }
    console.log("Found", QueryKeys[i], stringifiedContent)
    let element_str = queries[QueryKeys[i]](element, stringifiedContent)
    let elements = compile(element_str);
    console.log("elements", element_str, elements[0])
    let newElement = elements[0];
    element.type = newElement.type;
    element.return = newElement.return;
    element.value = newElement.value;
    element.children = newElement.children;
    element.props = newElement.props;
    element.line = newElement.line;
    element.column = newElement.column;
    element.length = newElement.length;
    console.log(element, element.children)
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


function screenWidthLessThan(size:string, ...content: string[]) {
  return `
  @media screen and (max-width: ${size}) {
    & {
      ${content.join("")}
    }
  }
  `
}
function screenWidthGreaterThan(size:string, ...content: string[]) {
  return `
  @media screen and (min-width: ${size}) {
    & {
      ${content.join("")}
    }
  }
  `
}
function screenHeightLessThan(size:string, ...content: string[]):string {
  return `
  @media screen and (max-height: ${size}) {
    & {
      ${content.join("")}
    }
  }
  `
}
function screenHeightGreaterThan(size:string, ...content: string[]) {
  return `
  @media screen and (min-height: ${size}) {
    & {
      ${content.join("")}
    }
  }
  `
}