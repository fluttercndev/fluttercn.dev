# Website

This website is built using Docusaurus 2, a modern static website generator.

env: [nodejs](https://nodejs.org)

command tool: [yarn](https://yarnpkg.com/lang/en/) or [npm](https://www.npmjs.com/)

```
$ cd fluttercn.dev
```

### Installation

通过 yarn 安装依赖：

```
$ yarn
```

通过 npm 安装依赖：

```
$ npm install
```

### Local Development

通过 yarn 命令进行本地开发：

```
$ yarn start
```

通过 npm 命令进行本地开发：

```
$ npm start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Add Markdown

将 md 文件重命名为`{yyyy-mm-dd}-{title}.md` (2019-07-23-flutter-text.md)，日期不要重复，并添加进`./blog`文件夹即可。

提示：

1.需要添加 md 描述

```
---
title: title
author: author
authorTitle: authorTitle
authorURL: authorURL
authorImageURL: authorImageURL
tags: [flutter, widget]
---
```

2.适当位置添加截取标识，以便列表页内容截断展示

```
<!--truncate-->
```

### Build

通过 yarn 构建静态内容：

```
$ yarn build
```

通过 npm 构建静态内容：

```
$ npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

通过 yarn 发布：

```
$ GIT_USER=<Your GitHub username> USE_SSH=1 yarn deploy
```

通过 npm 发布：

```
$ GIT_USER=<Your GitHub username> \
$ CURRENT_BRANCH=master \
$ USE_SSH=true \
$ npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
