---
title: Flutter组件之Text
author: handoing
authorTitle: A flutter fans
authorURL: https://github.com/handoing
authorImageURL: https://p5.ssl.qhimg.com/t01b6580ec3d65d7b7f.png
tags: [flutter, widget]
---

#### Flutter环境
Flutter version 1.7.8+hotfix.3  
Dart version 2.4.0

#### 1.TextStyle

TextStyle，主要用来设置文本相关样式时使用，我们先来看下TextStyle各属性的解释。
<!--truncate-->

如下：
```js
const TextStyle({
  this.inherit = true, // 是否继承父组件样式
  this.color, // 文本颜色
  this.backgroundColor, // 文本背景颜色
  this.fontSize, // 字体大小
  this.fontWeight, // 字体粗度
  this.fontStyle, // 文本形式（斜体）
  this.letterSpacing, // 文本颜色
  this.wordSpacing, // 字母间距
  this.textBaseline, // 单词间距
  this.height, // 行高
  this.locale, // 用于选择区域特定符号的区域设置
  this.foreground, // 设置Paint来作为文本前景绘制
  this.background, // 设置Paint来作为文本背景绘制
  this.shadows, // 文本阴影
  this.fontFeatures, // 详见FontFeature
  this.decoration, // 文本修饰（下划线、删除线等）
  this.decorationColor, // 文本修饰的颜色
  this.decorationStyle, // 文本修饰的样式
  this.decorationThickness, // 文本修饰粗细
  this.debugLabel, // 文本样式描述，仅在调试中用到
  String fontFamily, // 设置字体
  List<String> fontFamilyFallback, // 当无法找到设置字体则从Fallback里按列表顺序依次设置兜底字体
  String package, // 引入库字体时用到
})
```

#### 2.Text

Text允许文字以单一样式来展示，会根据布局的约束来判断是多行展示还是单行展示。

```js
Text(
    String data, 
    { 
        Key key, 
        TextStyle style, // TextStyle可设置文字颜色、大小、间隙等
        StrutStyle strutStyle, // 支柱样式
        TextAlign textAlign, // 文本对齐方式
        TextDirection textDirection, // 文本排列方向
        Locale locale, // 设置特定字体语言环境
        bool softWrap, // 文字超出容器大小是否换行
        TextOverflow overflow, // 文本溢出的处理方式
        double textScaleFactor, // 每个逻辑像素的字体像素数
        int maxLines, // 文字最大行数
        String semanticsLabel, // 语义标签
        TextWidthBasis textWidthBasis // 考虑单行或多行文本不同宽度的使用方式
    }
)

// 使用
class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    Widget text = Text('Hello World!',
        style: TextStyle(
          color: Colors.black,
          fontSize: 24,
        ),
        textAlign: TextAlign.center,
        overflow: TextOverflow.ellipsis
    );

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text("Flutter Text"),
        ),
        body: text,
      )
    );
  }
}
```

如图:
![Text widget](/blog-images/screenshot-flutter-text.png)

#### 3.Text.rich和TextSpan

如果我们需要多样式的文字展示应该怎么办呢？我们可以指定text.rich, 使用TextSpan设置文字不同样式。

这里要注意的是TextSpan并不是一个Widget，TextSpan只能依赖于特定文本组件使用。
并且我们可以通过继承结构看出Text继承自Widget，而TextSpan则直接继承自DiagnosticableTree。

```js
class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    Widget text = Text.rich(
      TextSpan(
        text: 'Hello',
        style: TextStyle(
          color: Colors.black,
          fontSize: 24
        ),
        children: <TextSpan>[
          TextSpan(text: ' beautiful ', style: TextStyle(fontStyle: FontStyle.italic)),
          TextSpan(text: 'world', style: TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text("Flutter Text"),
        ),
        body: text,
      )
    );
  }
}
```

如图:
![Text.rich widget](/blog-images/screenshot-flutter-Text.rich.png)

#### 4.RichText

Text和Text.rich其实就是对RichText更上一层的封装，我们通过Text源码可以看出其build方法返回的其实就是RichText组件。

```js
@override
Widget build(BuildContext context) {
  ...
  Widget result = RichText(
    textAlign: textAlign ?? defaultTextStyle.textAlign ?? TextAlign.start,
    textDirection: textDirection,
    locale: locale,
    softWrap: softWrap ?? defaultTextStyle.softWrap,
    overflow: overflow ?? defaultTextStyle.overflow,
    textScaleFactor: textScaleFactor ?? MediaQuery.textScaleFactorOf(context),
    maxLines: maxLines ?? defaultTextStyle.maxLines,
    strutStyle: strutStyle,
    textWidthBasis: textWidthBasis ?? defaultTextStyle.textWidthBasis,
    text: TextSpan(
      style: effectiveTextStyle,
      text: data,
      children: textSpan != null ? <TextSpan>[textSpan] : null,
    ),
  );
  ...
  return result;
}
```

```js
// 与Text.rich用法类似
class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    Widget text = RichText(
      text: TextSpan(
        text: 'Hello',
        style: TextStyle(
            color: Colors.black,
            fontSize: 24
        ),
        children: <TextSpan>[
          TextSpan(text: ' beautiful ', style: TextStyle(fontStyle: FontStyle.italic)),
          TextSpan(text: 'world', style: TextStyle(fontWeight: FontWeight.bold)),
        ],
      )
    );

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text("Flutter Text"),
        ),
        body: text,
      )
    );
  }
}
```

如图:
![RichText widget](/blog-images/screenshot-flutter-RichText.png)

#### 5.DefaultTextStyle

我们可以通过DefaultTextStyle组件来设置文本默认样式，DefaultTextStyle目的是为其子元素设置统一样式，使用如下：

```js
DefaultTextStyle(
    style: TextStyle(
        fontSize: 16,
        color: Colors.black,
    ),
    child: Container(
    child: Column(
        children: <Widget>[
            Text(
                'hello 1',
            ),
            Text(
                'hello 2',
            ),
        ],
    ),
));
```

**注意**：文本样式默认是会被继承，如果我们不想继承父级样式，可以通过设置TextStyle的inherit为false即可，如下：

```js
class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    Widget text = DefaultTextStyle(
        style: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Colors.black,
        ),
        child: Container(
          child: Column(
            children: <Widget>[
              Text(
                'hello flutter',
              ),
              Text(
                'hello flutter',
                style: TextStyle(
                    inherit: false,
                    color: Colors.red
                ),
              ),
            ],
          ),
        )
    );

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text("Flutter Text"),
        ),
        body: text,
      )
    );
  }
}
```

如图:
![DefaultTextStyle widget](/blog-images/screenshot-flutter-DefaultTextStyle.png)
