# Newponent

A command-line utility to quickly generate React component files with a directory structure.

## Features

- Creates a new directory for the component with the component's name.

- Generates an `index.jsx` or `index.tsx` file to export the component.

- Generates a component file with the component's name and a basic structure.

- Supports both JSX and TSX file types.

## Installation

  `npm i newponent`

## Usage

ncomp NewComponent <jsx  |  tsx>+
  
## TO USE CLI
ncomp
  



Replace `NewComponent` with the name of your component and `<tsx | jsx>` with the file type you want to use (either `tsx` for TypeScript or `jsx` for JavaScript).



*For example:*



    ncomp MyComponent tsx



This will create a new directory `MyComponent` with the following structure:



> MyComponent/ 	

	> ├── index.tsx 	

	> └── MyComponent.tsx



  



And the content of `MyComponent.tsx` will be:

  

    import React from 'react';

    const MyComponent: React.FC = () => { return <div>MyComponent</div>; };

    export default MyComponent;



  

  



## Contributing



  



Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



  



## License



  



[MIT](https://choosealicense.com/licenses/mit/)
