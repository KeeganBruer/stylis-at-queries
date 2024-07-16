# stylis-at-queries

**stylis-at-queries** is a Stylis plugin designed for use with styled-components, enabling transformation of custom `@` queries such as `@isMobile` and `@isPrint`.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)
- [Custom Queries](#custom-queries)
- [License](#license)

## Installation

You can install `stylis-at-queries` via npm:

```bash
npm install stylis-at-queries
```

or using yarn:

```bash
yarn add stylis-at-queries
```

## Usage

### Configure
To use `stylis-at-queries` with styled-components, import and add it as a plugin to the StyleSheetManager when creating your styled-components theme:

```javascript
import { createGlobalStyle, StyleSheetManager } from 'styled-components';
import { stylisAtQueries } from 'stylis-at-queries';

const GlobalStyle = createGlobalStyle`
  /* Your global styles here */
`;

const theme = {
  mobile_size: "600px",
  /* Your theme configuration */
};

const atQueries = stylisAtQueries();

const App = () => (
  <>
    <StyleSheetManager stylisPlugins={[atQueries.plugin]}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {/* Your application components */}
      </ThemeProvider>
    </StyleSheetManager>
  </>
);

export default App;
```

### Component Example
Once configured, you can use `stylis-at-queries` directly within your styled components to apply styles conditionally based on custom queries. Here’s an example:
```javascript
import styled from 'styled-components';

const Button = styled.button`
  background-color: blue;

  @isMobile {
    background-color: red;
  }

  @isPrint {
    display: none;
  }
`;

export default Button;
```

## Custom Queries

`stylis-at-queries` allows you to define and transform custom `@` queries to suit your application's needs. Simply add new query handlers to the object created by the `stylisAtQueries` function to extend functionality:

```javascript
import { createGlobalStyle, StyleSheetManager } from 'styled-components';
import { stylisAtQueries } from 'stylis-at-queries';

const GlobalStyle = createGlobalStyle`
  /* Your global styles here */
`;

const theme = {
  mobile_size: "600px",
  /* Your theme configuration */
};

const atQueries = stylisAtQueries();
atQueries.add('@screenSize', (element, content) => {
  // Custom transformation logic
});

const App = () => (
  <>
    <StyleSheetManager stylisPlugins={[atQueries.plugin]}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {/* Your application components */}
      </ThemeProvider>
    </StyleSheetManager>
  </>
);

export default App;
```


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
