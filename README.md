```
███████╗██╗   ██╗██████╗ ███████╗██████╗  ██████╗ ██████╗ ███╗   ███╗██████╗
██╔════╝██║   ██║██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗ ████║██╔══██╗
███████╗██║   ██║██████╔╝█████╗  ██████╔╝██║     ██║   ██║██╔████╔██║██████╔╝
╚════██║██║   ██║██╔═══╝ ██╔══╝  ██╔══██╗██║     ██║   ██║██║╚██╔╝██║██╔═══╝
███████║╚██████╔╝██║     ███████╗██║  ██║╚██████╗╚██████╔╝██║ ╚═╝ ██║██║
╚══════╝ ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝
```

# Table of contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Installation](#installation)
4. [Use](#use)
    1. [CLI](#cli)
    2. [Arguments](#args)


## Introduction <a name="introduction"></a>

> Supercomp is a package that lets your use your terminal to quickly create component files for your projects. It utilizes a template system, it has pre-made templates for TypeScript, JavaScript and Dart, however, users can bring their own templates.

## Features <a name="features"></a>

-  Creates a new folder for the component with the component's name.
-  Generates index.tsx or index.jsx to export the component easily.
- Generates the component file with the name and a simple structure.
- Default support for JSX,TSX, Dart and Vue file extension
- Stateful and Stateless widget support for Dart extesion.
- Support for custom folder selection
- Support for user's own custom template files



## Installation <a name="installation"></a>

Use the package manager **npx** to install SuperComp.

```bash
npx supercomp
```

> During the first installation, users are prompted **to create _"user_template"_ folder**. If they do so, they are able to use any kind of file they put inside that folder as their template to quickly generate new files within their project.


## Use <a name="use"></a>
SuperComp can be used in two different ways. Either through *CLI* or **Arguments**.

> If you wish to use your templates inside user_templates, select CUSTOM option on CLI.
       
## CLI <a name="cli"></a>

`npx supercomp` will trigger the CLI



## Arguments <a name="args"></a>
> Arguments use is still under-development, it may not offer the same flexibility as CLI use.

`npx supercomp ComponentName <jsx  |  tsx | vue | dart>`


## Contributing


Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.


## License




[MIT](https://choosealicense.com/licenses/mit/)
