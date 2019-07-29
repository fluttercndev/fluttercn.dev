---
title: Flutter组件之Image
author: handoing
authorTitle: A flutter fans
authorURL: https://github.com/handoing
authorImageURL: https://p5.ssl.qhimg.com/t01b6580ec3d65d7b7f.png
tags: [flutter, widget]
---


在flutter中，我们可以通过Image Widget来展示我们的图片，
以下是Image提供的几个构造方法，来为我们以不同方式加载图片。
- Image：通过ImageProvider获取图像
- Image.asset：通过AssetBundle获取图像
- Image.network：通过URL获取图像，用于加载网络图片
- Image.file：通过本地文件获取图像
- Image.memory：通过Uint8List获取图像  

目前支持的图片格式有JPEG, PNG, GIF, GIF, WebP, BMP, WBMP。

#### 1.Image
我们先来看下Image的构造方法：
```js
const Image({
  Key key,
  @required this.image, // ImageProvider, 下面会说明
  this.semanticLabel, // 语义化标签
  this.excludeFromSemantics = false, // 是否从语义描述中排除此图像
  this.width, // 图片宽度
  this.height, // 图片高度
  this.color, // 混合颜色，如果设置了该值，则会使用colorBlendMode把该颜色与图像每个像素进行混合
  this.colorBlendMode, // 与color配合使用，采用哪种混合模式
  this.fit, // 以何种布局来展示图像
  this.alignment = Alignment.center, // 对齐方式
  this.repeat = ImageRepeat.noRepeat, // 重复绘制图像
  this.centerSlice, // 可通过设置可水平和垂直拉伸的中心区域，来实现android中.9图像效果
  this.matchTextDirection = false, // 是否按文本方向绘制图像
  this.gaplessPlayback = false, // 当ImageProvider变化时，是否显示旧图像
  this.filterQuality = FilterQuality.low, // 当使用maskFilter或者Canvas.drawImageRect等图像绘制时，用来对性能和图像质量做权衡
})
```

例子：
```js
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    ImageProvider _assetImageProvider = new AssetImage('assets/images/flutter-logo.png'); // 记得将资源路径加入pubspec.yaml
    Image _image = new Image(
      image: _assetImageProvider,
      width: 200,
    );

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text("Flutter Image"),
        ),
        body: _image,
      )
    );
  }
}
```

如图:
<img src="/blog-images/screenshot-flutter-Image.png" width="300"/>

#### 2.Image.asset
用于加载本地项目图片资源
```js
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Image _image = new Image.asset('assets/images/flutter-logo.png');

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text("Flutter Image"),
        ),
        body: _image,
      )
    );
  }
}
```

#### 3.Image.network
用于加载网络图片资源
```js
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Image _image = new Image.network('http://xxx.com/xxx.png');

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text("Flutter Image"),
        ),
        body: _image,
      )
    );
  }
}
```

#### 4.Image.file
用于加载设备本地图片资源
```js
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Image _image = new Image.file('/sdcard/xxx.png');

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text("Flutter Image"),
        ),
        body: _image,
      )
    );
  }
}
```

#### 5.Image.memory
用于加载Uint8List数据
```js
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    String imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAACsElEQVR4Ae3W30tTYRjA8a9zO0sHoU0PirZ/QBIhNP07CsSLAnFodCsuLYQu+t2NqWlR3SpaCUkE/QtBYmYX5Y9qVlBq01k5d7NuHh4ObefHNgoEP+/d+zzv8+6873k448C+UEobF5nhLZukSbPJIk/o5wQ+ihbhFl/J2Iw1rlFHwUwekCbjMvYYJ0wBzpAg43Fs0E5eAjy0FiDJBFGaCWNgUEUzUSZJWnMYx49HIV5YFr6jkzJyKaeLJUvmM81zFLCU/00vfpfsPnYtW/hxpYfDexrwopFly0G5OK2pc1Tjlcm8rmt3Tkzor68mH6Y+xTpHsHVfkn7RQL4a9S7uYCOibdVLIWKyOmXX3Tf1xfQDAIcYI8k2owRRtrGAHtNVcvDxRcKdIMb06kZQDrGozMQpIUubBLcpQ1h6dQvlEAuxI3MtZLkgoQlQ21okgXKMTclcP1lmJBQFNapFhlCOsR6Ze0SWRQk1gwoywhYJhjBQjrFWqbJAlk0JhSmGqe2mhPaAQTGC+hn67xvoEVX9qyPSS6YYesnOr2mBnF/TAQlNgjiszeQ8fhACMS1z5+0fLkk5iEFPG8RAhPhpf9A+PkuwC4TBnGv5lwRAdMvcJ0rI4YaElyxLIsQdy3+gDoTBisxeIaej2gt9oCLM25Z/RX2OW0xRi427+nflGKggl/RsdZBkEANUEymJDGOrStttGROrSs4xS5w0aeLMcpYKrGpYlZXfqcRBh/7CeUy8quG1rjuFi3uaukwjXjSxav18uvHzXNN3iRHAicEAKc2fpRQPypEt5DmihMglRDcrlsynlOGRXw5KBjtM0UMrJkGCmLTSw/Rfb9YwpeSlgw0yHsc3TlKAMOPsuRZPcZsKClbPddZsi3/kMrUUzUcLAzzmDRvskWKdBaaJcZwSDuwDfwCocWGlJHBmcAAAAABJRU5ErkJggg==';
    Uint8List bytes = base64Decode(imageBase64);
    Image _image = new Image.memory(bytes);

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text("Flutter Image"),
        ),
        body: _image,
      )
    );
  }
}
```

如图：
<img src="/blog-images/screenshot-flutter-Image.memory.png" width="300"/>

#### 6.ImageProvide
我们通过源码可以知道Image.asset、Image.network、Image.file、Image.memory内部也是通过ImageProvider来处理图像。

ImageProvider子类继承关系如下：
![ImageProvider](/blog-images/ImageProvider-extends.png)

拿Image.asset举例，以下两种方式是一样的
```js
new Image.asset('assets/images/flutter-logo.png');
// or
new Image(image: new AssetImage('assets/images/flutter-logo.png'));
```

#### 7.其他
大多数情况我们可能会用到占位图，在图片资源加载过程中展示一张占位图，这时候可以使用
```js
new FadeInImage.assetNetwork(
  placeholder: 'assets/images/default-img.png', // 本地占位图
  image: 'http://xxx.com/xxx.png'
);
// or
new FadeInImage.memoryNetwork(
  placeholder: kTransparentImage, // 透明占位图
  image: 'http://xxx.com/xxx.png'
)
```
**注意**：无法设置当图片加载失败时显示的图片，我们可以通过自定义一个图片加载组件或使用第三方库提供的组件来解决。

**关于图片缓存**  

Image组件内部其实已经对图片资源进行了缓存处理，源码如下：
```js
// 部分代码已省略
class ImageCache {
  final Map<Object, _PendingImage> _pendingImages = <Object, _PendingImage>{};
  final Map<Object, _CachedImage> _cache = <Object, _CachedImage>{};

  ...

  ImageStreamCompleter putIfAbsent(Object key, ImageStreamCompleter loader(), { ImageErrorListener onError }) {
    ImageStreamCompleter result = _pendingImages[key]?.completer;
    if (result != null)
      return result;

    final _CachedImage image = _cache.remove(key);
    if (image != null) {
      _cache[key] = image;
      return image.completer;
    }
    try {
      result = loader();
    } catch (error, stackTrace) {
      if (onError != null) {
        onError(error, stackTrace);
        return null;
      } else {
        rethrow;
      }
    }
    void listener(ImageInfo info, bool syncCall) {
      final int imageSize = info?.image == null ? 0 : info.image.height * info.image.width * 4;
      final _CachedImage image = _CachedImage(result, imageSize);
      if (maximumSizeBytes > 0 && imageSize > maximumSizeBytes) {
        _maximumSizeBytes = imageSize + 1000;
      }
      _currentSizeBytes += imageSize;
      final _PendingImage pendingImage = _pendingImages.remove(key);
      if (pendingImage != null) {
        pendingImage.removeListener();
      }

      _cache[key] = image;
      _checkCacheSize();
    }
    if (maximumSize > 0 && maximumSizeBytes > 0) {
      _pendingImages[key] = _PendingImage(result, listener);
      result.addListener(listener);
    }
    return result;
  }

  ...

}
```
通过源码可以看出Image内部是通过key来记录图片是否缓存，但是这样会存在一个问题，这种缓存机制是通过内存进行缓存，如果当前应用进程被杀死，再次进入应用后，网络图片资源还是会去重新加载。  

理论上我们可以通过自定义一个ImageProvide，将图片缓存到磁盘来进行优化。

### 参考
[https://api.flutter.dev/flutter/widgets/Image-class.html](https://api.flutter.dev/flutter/widgets/Image-class.html)  
[https://api.flutter.dev/flutter/painting/ImageProvider-class.html](https://api.flutter.dev/flutter/painting/ImageProvider-class.html)  
[https://flutter.dev/docs/cookbook/images/fading-in-images](https://flutter.dev/docs/cookbook/images/fading-in-images)