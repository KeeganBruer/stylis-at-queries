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

To use `stylis-at-queries` with styled-components, import and add it as a plugin when creating your styled-components theme:

```javascript
import { createGlobalStyle } from 'styled-components';
import { stylisAtQueries } from 'stylis-at-queries';

const GlobalStyle = createGlobalStyle`
  /* Your global styles here */
`;

const theme = {
  /* Your theme configuration */
};

const App = () => (
  <>
    <GlobalStyle />
    {/* Your application components */}
  </>
);

export default App;
```

## Example

```javascript
import styled from 'styled-components';
import { stylisAtQueries } from 'stylis-at-queries';

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

`stylis-at-queries` allows you to define and transform custom `@` queries to suit your application's needs. Simply add new query handlers to the `stylisAtQueries` function to extend functionality:

```javascript
import { stylisAtQueries } from 'stylis-at-queries';

stylisAtQueries.add('@isMobile', (node) => {
  // Custom transformation logic
});

stylisAtQueries.add('@isPrint', (node) => {
  // Custom transformation logic
});
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
