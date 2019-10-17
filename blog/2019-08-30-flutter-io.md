---
title: Flutter之请求
author: MangoTsing
authorTitle: A flutter fans
authorURL: https://github.com/MangoTsing
authorImageURL: https://p5.ssl.qhimg.com/t01b6580ec3d65d7b7f.png
tags: [flutter, io]
---

## 1.网络请求的常见使用


### 1.创建http请求
http支持位于dart:io，所以要创建一个HTTP client， 我们需要添加一个导入：
	
	import 'dart:io';
	
	var httpClient = new HttpClient();

该 client 支持常用的HTTP操作, such as GET, POST, PUT, DELETE.

<!--truncate-->

### 2.处理异步
HTTP API 在返回值中使用了Dart Futures。 我们建议使用async/await语法来调用API。

网络调用通常遵循如下步骤：

	创建 client.
	构造 Uri.
	发起请求, 等待请求，同时您也可以配置请求headers、 body。
	关闭请求, 等待响应.
	解码响应的内容.

其中的几个步骤使用基于`Future`的API。

使用 HttpClient 发送请求之前，需要先使用 Uri 构建请求的 Uri 对象。

>Uri uri = new Uri.http('tj.nineton.cn', '/Heart/index/all', {'city': 'CHSH000000', 'language': 'zh-chs'});


	httpRequestGet() async {
	  HttpClient client = new HttpClient();
	  var authority = 'tj.nineton.cn';
	  var unencodedPath = '/Heart/index/all';
	  var params = {'city': 'CHSH000000', 'language': 'zh-chs'};
	
	  Uri uri = new Uri.http(authority, unencodedPath, params);
	  var request = await client.getUrl(uri);
	  var response = await request.close();
	  if (response.statusCode == HttpStatus.ok) {
	    var responseMessage = await response.transform(Utf8Decoder()).join();
	    
	    //response.transform(Utf8Decoder()).join()需要导入dart:convert库使用
	    
	    print(responseMessage);
	  } else {
	    print(response.toString());
	  }
	}
	

	
### 3.解码和编码JSON
使用`dart:convert`库可以简单解码和编码JSON。
	
	Map data = JSON.decode(responseBody);
	// Assume the response body is something like: ['foo', { 'bar': 499 }]
	int barValue = data[1]['bar']; // barValue is set to 499
	
要对简单的JSON进行编码，请将简单值（字符串，布尔值或数字字面量）或包含简单值的Map，list等传给encode方法：

	String encodedString = JSON.encode([1, 2, { 'a': null }]);


### 4.demo
	import 'dart:convert';
	import 'dart:io';
	
	import 'package:flutter/material.dart';
	
	void main() {
	  runApp(new MyApp());
	}
	
	class MyApp extends StatelessWidget {
	  @override
	  Widget build(BuildContext context) {
	    return new MaterialApp(
	      home: new MyHomePage(),
	    );
	  }
	}
	
	class MyHomePage extends StatefulWidget {
	  MyHomePage({Key key}) : super(key: key);
	
	  @override
	  _MyHomePageState createState() => new _MyHomePageState();
	}
	
	class _MyHomePageState extends State<MyHomePage> {
	  var _ipAddress = 'Unknown';
	
	  _getIPAddress() async {
	    var url = 'https://httpbin.org/ip';
	    var httpClient = new HttpClient();
	
	    String result;
	    try {
	      var request = await httpClient.getUrl(Uri.parse(url));
	      var response = await request.close();
	      if (response.statusCode == HttpStatus.OK) {
	        var json = await response.transform(utf8.decoder).join();
	        var data = jsonDecode(json);
	        result = data['origin'];
	      } else {
	        result =
	        'Error getting IP address:\nHttp status ${response.statusCode}';
	      }
	    } catch (exception) {
	      result = 'Failed getting IP address';
	    }
	
	    // If the widget was removed from the tree while the message was in flight,
	    // we want to discard the reply rather than calling setState to update our
	    // non-existent appearance.
	    if (!mounted) return;
	
	    setState(() {
	      _ipAddress = result;
	    });
	  }
	
	  @override
	  Widget build(BuildContext context) {
	    var spacer = new SizedBox(height: 32.0);
	
	    return new Scaffold(
	      body: new Center(
	        child: new Column(
	          mainAxisAlignment: MainAxisAlignment.center,
	          children: <Widget>[
	            new Text('Your current IP address is:'),
	            new Text('$_ipAddress.'),
	            spacer,
	            new RaisedButton(
	              onPressed: _getIPAddress,
	              child: new Text('Get IP address'),
	            ),
	          ],
	        ),
	      ),
	    );
	  }
	}

## 2.介绍一下dart:io
首先介绍一个在Flutter框架中最常用的一个核心库 `dart:io`

> File, socket, HTTP, and other I/O support for non-web applications.

这个库的核心用途如上所述，在文件，socket,http请求，以及为其他的离线应用提供io支持。
### 1.dart:io核心lib

但是官网上有一个important提醒：

> Browser-based applications can't use this library. 
	Only servers, command-line scripts, 
	and Flutter mobile apps can import and use dart:io.
	
`dart:io`这个库可以帮助开发者在服务端，命令行的脚本以及Flutter创造的移动app里通过引用的方式使用，但是不可以在基于浏览器的应用上使用。也就是说在web app上是不适用的。

**但是，这样一个的io core lib 为什么会是Flutter网络请求第一个要介绍的库呢？**

因为官方使用的是用`dart:io`中的`HttpClient`类发起的请求，但HttpClient本身功能较弱，很多常用功能都不支持。


>The dart:io library is aimed at code that runs 
	in Flutter and the standalone Dart VM.

`dart:io`库的目标是在Flutter和独立的Dart VM中运行的代码

>Note: When writing a Flutter app, 
		use Flutter-specific APIs instead of dart:io whenever possible.
	For example, use the Flutter asset support to 
		load images and other assets into your app.
		
		
官网上也给了个提示，就是说我们在使用dart:io库的时候要注意，写一个app时尽可能的使用flutter所提供的专属API，而不要在任何时候都适用dart:io库，比如可以使用Flutter asset来加载图像


**Dart是一种单线程编程语言。 如果操作阻止Dart线程，则应用程序在该操作完成之前不会进行任何操作。 因此，为了可扩展性，没有I / O操作阻塞是至关重要的。 dart：io使用受node.js， EventMachine和Twisted启发的异步编程模型，而不是阻止I / O操作。**

>	EventMachine是一個軟件系統，旨在為Ruby編寫高度可伸縮的應用程序。它使用reactor模式提供事件驅動的I / O. EventMachine是Ruby編程語言中最受歡迎的並發計算庫。
>
>	Twisted 是一个事件驱动的网络编程框架，它使用编程语言Python编写，并在MIT协议下开源。
>	
>	（reactor:     reactor设计模式，是一种基于事件驱动的设计模式。Reactor框架是ACE各个框架中最基础的一个框架，其他框架都或多或少地用到了Reactor框架。
>	在事件驱动的应用中，将一个或多个客户的服务请求分离（demultiplex）和调度（dispatch）给应用程序。在事件驱动的应用中，同步地、有序地处理同时接收的多个服务请求。 reactor模式与外观模式有点像。不过，观察者模式与单个事件源关联，而反应器模式则与多个事件源关联 。当一个主体发生改变时，所有依属体都得到通知。）

>	EventMachine is a software system designed for writing highly scalable applications for Ruby. It provides event-driven I/O using the reactor pattern. 

### 2.Dart VM和事件循环
在深入研究异步i/o操作之前，解释一下dart vm的单线程是很有必要的。

执行服务器端应用程序时，Dart VM在事件循环中运行，Timer函数作为一个异步的函数等待挂起，处于`pending`状态，单线程的处理机制很类似javascript。

尽管当代码输出`end of main`时，整个dart VM依然没有终止运行，因为Timer继续处于挂起的状态，等待`timer`输出完毕后，终止执行。当确定整个程序都已经没有挂起的操作，在这个执行队列里时，dart vm停止。

**代码如下：**

  	
  	import 'dart:async';

	void main() {
	  Timer(Duration(seconds: 1), () => print('timer'));
	  print('end of main');
	}
	
在命令行运行此示例，我们得到：

	 $ dart timer.dart 
	 	end of main 
	 	timer 
可以使用构造函数`Timer.periodic`重复计时器，VM将不会终止并继续每秒打印出'timer'。

类似javascript 的 setInterval

	void main() {
	  Timer.periodic(Duration(seconds: 2), (Timer timer){
	    print('timer');
	    timer.cancel();
	  } );
	}

### 3.dart文件访问
dart：io库通过File和Directory类提供对文件和目录的访问。

	var myFile = new File('file.txt');
	import 'dart:io';
	import 'dart:convert';
	import 'dart:async';
	
	main() {
	  final file = new File('file.txt');
	  Stream<List<int>> inputStream = file.openRead();
	
	  inputStream
	    .transform(utf8.decoder)       // Decode bytes to UTF-8.
	    .transform(new LineSplitter()) // Convert stream to individual lines.
	    .listen((String line) {        // Process results.
	        print('$line: ${line.length} bytes');
	      },
	      onDone: () { print('File is now closed.'); },
	      onError: (e) { print(e.toString()); });
	}

	下面是目录：
	var myDir = new Directory('myDir');
	import 'dart:io';

	void main() {
	  // Creates dir/ and dir/subdir/.
	  new Directory('dir/subdir').create(recursive: true)
	    // The created directory is returned as a Future.
	    .then((Directory directory) {
	      print(directory.path);
	  });
	}

我们使用`Platform`类，来打印一份本地的脚本源码：

	 import'dart：convert';
	 import'dart：io';
	
	 Future <void> main（）async {
	   var file = File（Platform.script.toFilePath（））;
	   print（“$ {await（file.readAsString（encoding：ascii））}”）;
	 } 
	 
 `readAsString()`方法是异步的, 它返回一个Future对象 ，一旦从底层系统读取文件，它就会返回文件的内容。 由于异步，可以在执行的过程中进行其他操作。

为了清晰的解释文件操作，让我们更改示例以仅读取内容直到第一个分号，然后打印它。 

可以使用`Stream`

	import 'dart:io';

	Future<void> main() async {
	  final semicolon = ';'.codeUnitAt(0);
	  var result = <int>[];
	
	  final script = File(Platform.script.toFilePath());
	  RandomAccessFile file = await script.open(mode: FileMode.read);
	
	  // Deal with each byte.
	  while (true) {
	    final byte = await file.readByte();
	    result.add(byte);
	    if (byte == semicolon) {
	      print(String.fromCharCodes(result));
	      await file.close();
	      break;
	    }
	  }
	}
当看到`async`或`await` ，可以确定使用了Future对象。 open()和readByte()方法都返回一个Future对象。

当然，这段代码是随机访问操作的一种非常简单的用法。 操作可用于写入，寻找给定位置，截断等等。

让我们使用Stream实现一个版本。 以下代码打开用于读取的文件，将内容显示为字节列表流。 像Dart中的所有流一样，可以对Stream使用await for监听，数据以`chunks`的形式给出。

>, 39, 46, 111, 109, 67, 104, 97, 114, 67, 111, 100, 101, 115, 40, 114, 101, 115, 117, 108, 116, 41, 41, 59, 10, 32, 32, 32, 32, 32, 32, 32, 32, 114, 101, 116, 117, 114, 110, 59, 10, 32, 32, 32, 32, 32, 32, 125, 10, 32, 32, 32, 32, 125, 10, 32, 32, 125, 10, 125]


  	import 'dart:io';

	Future<void> main() async {
	  var result = <int>[];
	
	  Stream<List<int>> stream = File(Platform.script.toFilePath()).openRead();
	  final semicolon = ';'.codeUnitAt(0);
	
	  await for (var data in stream) {
	    for (int i = 0; i < data.length; i++) {
	      result.add(data[i]);
	      if (data[i] == semicolon) {
	        print(String.fromCharCodes(result));
	        return;
	      }
	    }
	  }
	}
Stream通过awiat for循环监听，监听到`；`的code时，就会输出当前获取到的result。并且await for通过break,return,异常捕获可以退出循环监听。

`Stream<List<int>>`在dart:io中习惯被用在很多地方，比如stdin，文件，socket，HTTP连接等时。 同样， `IOSink`对象用于将数据流式传输到stdout，文件，socket，HTTP连接等。

### 4.交互式进程
对于简单的情况，可以使用`Process.run（）`来运行进程并收集其结果。 当不需要对进程进行交互式控制时，请使用run() 。

	import 'dart:io';
	
	Future<void> main() async {
	  ProcessResult results = await Process.run('ls', ['-l']);
	  print(results.stdout);
	}
	
	result:total 16
	-rw-r--r--  1 shangguanyanpeng  staff     4 Aug 29 15:22 file.txt
	-rw-r--r--  1 shangguanyanpeng  staff  2556 Aug 29 16:09 main.dart


**还可以使用Process.start（）创建Process对象来启动进程。**

一旦有了Process对象，就可以通过将数据写入stdin接收器，从stderr和stdout流中读取数据并终止进程来与进程交互。 当进程退出时， exitCode将来会以进程的退出代码完成。(输出输出流)

下面代码在单独的进程中运行`ls -l` ，并将进程的输出和退出代码输出到`stdout`。 由于我们希望获取行，因此我们使用Utf8Decoder （将字节块解码为字符串），然后使用LineSplitter （在行边界处拆分字符串）。

	import 'dart:convert';
	import 'dart:io';
	
	Future<void> main() async {
	  final process = await Process.start('ls', ['-l']);
	  var lineStream =
	      process.stdout.transform(Utf8Decoder()).transform(LineSplitter());
	  await for (var line in lineStream) {
	    print(line);
	  }
	
	  await process.stderr.drain();
	  print('exit code: ${await process.exitCode}');
	}
	
` exitCode`可以在处理完所有输出行之前完成。 另外没有定义进程关闭， 为了不泄漏资源，我们必须同时监听`stderr`和`stdout`流。 我们使用await for来监听stdout，并使用stderr.drain()来监听（并释放）stderr。

我们也可以输出给文件，而不是将输出打印到stdout。

 	import 'dart:io';

	Future<void> main() async {
	  final output = File('output.txt').openWrite();
	  Process process = await Process.start('ls', ['-l']);
	
	  // Wait for the process to finish; get the exit code.
	  final exitCode = (await Future.wait([
	    process.stdout.pipe(output), // Send stdout to file.
	    process.stderr.drain(), // Discard stderr.
	    process.exitCode
	  ]))[2];
	
	  print('exit code: $exitCode');
	}
	
### 5.编写Web服务器
`dart：io`可以轻松编写HTTP服务器和客户端。 要编写一个简单的Web服务器，您所要做的就是创建一个`HttpServer`并将一个监听器（使用await for ）连接到它的HttpRequest流。

这是一个简单的Web服务器，可以回答任何请求的“Hello，world”。

	import 'dart:io';
	
	Future<void> main() async {
	  final server = await HttpServer.bind('127.0.0.1', 8082);
	  await for (HttpRequest request in server) {
	    request.response.write('Hello, world');
	    await request.response.close();
	  }
	}
运行此应用程序并将浏览器指向“http://127.0.0.1:8082”，可以得到一个Hello world的字符串展示。

接下来增加代码，如果请求中未指定路径，将展示index.html。对于带路径的请求，我们将尝试查找文件并提供服务。 如果找不到该文件，我们将回复“未找到404”状态。

	import 'dart:io';
	
	Future<void> runServer(String basePath) async {
	  final server = await HttpServer.bind('127.0.0.1', 8082);
	  await for (HttpRequest request in server) {
	    await handleRequest(basePath, request);
	  }
	}
	
	Future<void> handleRequest(String basePath, HttpRequest request) async {
	  final String path = request.uri.toFilePath();
	  // PENDING: Do more security checks here.
	  final String resultPath = path == '/' ? '/index.html' : path;
	  final File file = File('$basePath$resultPath');
	  if (await file.exists()) {
	    try {
	      await request.response.addStream(file.openRead());
	    } catch (exception) {
	      print('Error happened: $exception');
	      await sendInternalError(request.response);
	    }
	  } else {
	    await sendNotFound(request.response);
	  }
	}
	
	Future<void> sendInternalError(HttpResponse response) async {
	  response.statusCode = HttpStatus.internalServerError;
	  await response.close();
	}
	
	Future<void> sendNotFound(HttpResponse response) async {
	  response.statusCode = HttpStatus.notFound;
	  await response.close();
	}
	
	Future<void> main() async {
	  // Compute base path for the request based on the location of the
	  // script, and then start the server.![]()
	  final script = File(Platform.script.toFilePath());
	  await runServer(script.parent.path);
	}
	
编写HTTP客户端与使用HttpClient类非常相似。

所以接下来就来了解一下，神奇的`HttpClient` class!

## 3.神奇的HttpClient
>	`HttpClient`是Dart SDK中提供的标准的访问网络的接口类，是`HTTP1.1/RFC2616`协议在Dart SDK上的具体实现，用于客户端发送HTTP/S 请求。HttpClient 包含了一组方法，可以发送 HttpClientRequest 到Http服务器， 并接收 HttpClientResponse 作为服务器的响应。 例如, 我们可以用 get, getUrl, post, 和 postUrl 方法分别发送 GET 和 POST 请求。

下面是一段简单的代码：

	import "dart:io";
	import 'dart:convert';
	void main() async {
	  var baidu = "http://www.baidu.com";
	  var httpClient = HttpClient();
	  HttpClientRequest request = await httpClient.getUrl(Uri.parse(baidu));
	  HttpClientResponse response = await request.close();
	  var responseBody = await response.transform(Utf8Decoder()).join();
	  httpClient.close();
	  print(responseBody);
	}


### 1.基本实现
HttpClient 及相关模块实际上实现的是TCP/IP的Http协议栈。

![](https://user-gold-cdn.xitu.io/2019/8/19/16ca7aff7bcc9356?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

 模块对上层应用暴露的接口就是HttpClient，客户端可以通过API发起Http请求并接收Http响应。 
 
 模块下层依赖的是TCP协议栈，从代码实现上而言就是依赖Socket/SecureSocket，因为在操作系统上Sockt封装了TCP/IP的所有操作，便于上层协议处理。
 
 **顶层流程分析：Step 1: HttpClient getUrl 获取 HttpClientRequest的过程：这个过程实质上是sockt建立TCP链接的过程：sockt需要通过DNS解析把域名转换为ip地址然后通过TCP的三次握手，建立socket链接，Dart中用HttpClientConnection保存这个链接。构建一个HttpClientRequest对象，并返回客户端。客户端可以在这个对象中添加更多应用相关的Http包头字段，等待发送。注意到这个过程仅仅是建立socket链路，并没有实际发送数据。Step 2: HttpClientRequest.close 表明HttpClientRequest已经构建完成，socket发送Http请求。收到响应后返回给客户端。Step 3: HttpClientRsponse被消费后，HttpClient关闭链接。socket发送TCP四次挥手信息，关闭传输，并释放所有资源。**
 
 
### 2.HttpClient
 
 作为library暴露的API，定义在/dart-sdk/lib/_http/http.dart，通过工厂方法调用实现类_HttpClient; 所以HttpClient.getUrl 调用的是 _HttpClient.getUrl;
 
### 3._HttpClient

```
    Future<HttpClientRequest> openUrl(String method, Uri url) => _openUrl(method, url);
	  Future<HttpClientRequest> get(String host, int port, String path) => open("get", host, port, path);
	  Future<HttpClientRequest> getUrl(Uri url) => _openUrl("get", url);
	  Future<HttpClientRequest> post(String host, int port, String path) => open("post", host, port, path);
	  Future<HttpClientRequest> postUrl(Uri url) => _openUrl("post", url);
	  Future<HttpClientRequest> put(String host, int port, String path) => open("put", host, port, path);
	  Future<HttpClientRequest> putUrl(Uri url) => _openUrl("put", url);
	  Future<HttpClientRequest> delete(String host, int port, String path) =>open("delete", host, port, path);
	  Future<HttpClientRequest> deleteUrl(Uri url) => _openUrl("delete", url);
	  Future<HttpClientRequest> head(String host, int port, String path) => open("head", host, port, path);
	  Future<HttpClientRequest> headUrl(Uri url) => _openUrl("head", url);
	  Future<HttpClientRequest> patch(String host, int port, String path) => open("patch", host, port, path);
	  Future<HttpClientRequest> patchUrl(Uri url) => _openUrl("patch", url);
```
	  
API 封装了常用的get，post，put，delete，head，patch等方法，统一由_HttpClient._openUrl 处理

### 4. HttpClientRequest.close
openUrl两个工作：建立链接，获取HttpClientRequest对象:

![](http://p0.qhimg.com/t01520cce774751b9b8.png)

<!--_HttpClient._openUrl第一步，_getConnection
-->

### 5.HttpClient.close


此流程比较简单，最终调用socket的close，TCP四次挥手断开链接。这里就不展开了。需要指出的是，如果不主动调用HttpClient.close，socket不会立即释放，链接会保留一段时间超时退出，因此存在资源泄漏的风险。


## 4.衍生出的网络请求框架

### 1.http框架
#### Using 
The easiest way to use this library is via the top-level functions. They allow you to make individual HTTP requests with minimal hassle:

	import 'package:http/http.dart' as http;
	
	var url = 'http://example.com/whatsit/create';
	var response = await http.post(url, body: {'name': 'doodle', 'color': 'blue'});
	print('Response status: ${response.statusCode}');
	print('Response body: ${response.body}');
	
	print(await http.read('http://example.com/foobar.txt'));
	


If you're making multiple requests to the same server, you can keep open a persistent connection by using a Client rather than making one-off requests. If you do this, make sure to close the client when you're done:

	var client = new http.Client();
	try {
	  var uriResponse = await client.post('http://example.com/whatsit/create',
	      body: {'name': 'doodle', 'color': 'blue'});
	  print(await client.get(uriResponse.bodyFields['uri']));
	} finally {
	  client.close();
	}
You can also exert more fine-grained control over your requests and responses by creating Request or StreamedRequest objects yourself and passing them to Client.send.

This package is designed to be composable. This makes it easy for external libraries to work with one another to add behavior to it. Libraries wishing to add behavior should create a subclass of BaseClient that wraps another Client and adds the desired behavior:

	class UserAgentClient extends http.BaseClient {
	  final String userAgent;
	  final http.Client _inner;
	
	  UserAgentClient(this.userAgent, this._inner);
	
	  Future<StreamedResponse> send(BaseRequest request) {
	    request.headers['user-agent'] = userAgent;
	    return _inner.send(request);
	  }
	}


### 2.强大的Flutter Http请求开源库-dio
FormData,错误处理,Lock/unlock 拦截器,转换器,设置Http代理,请求取消,Cookie管理

	dependencies:
	  dio: ^x.x.x  // latest version

	import 'package:dio/dio.dart';
	Dio dio = new Dio();
	Response response=await dio.get("https://www.google.com/");
	print(response.data);

通过对HTTPCLIENT类的封装，可以简单的处理请求到的数据，不需要再用dart convert进行编码处理，同时可以发送FormData包，对一些数据进行拦截处理，预处理一些格式等等。


>	参考文献：
>
>	https://dart.dev/guides/libraries/library-tour#dartio
>
>	https://dart.dev/articles/libraries/dart-io
>
>	https://www.jianshu.com/p/91c2511d104f
>
>	https://juejin.im/post/5d5a0733f265da03cc08ba4b#heading-15
>
>	https://api.dart.dev/stable/2.4.1/dart-io/
