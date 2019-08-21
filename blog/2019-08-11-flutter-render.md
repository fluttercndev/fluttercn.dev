---
title: Flutter 从加载到显示
author: donald99
authorTitle: A flutter fans
authorURL: https://github.com/donald99
authorImageURL: https://avatars2.githubusercontent.com/u/5173695?s=460&v=4
tags: [flutter, widget]
---

## 你将会得到什么？

1、Widget、Element、RenderObject基本概念

2、在Flutter Framework层从创建到渲染的流程

3、Flutter在构建布局方面是如何提高效率的

<!--truncate-->

## 什么是Flutter？

Flutter是谷歌的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。在全世界，Flutter正在被越来越多的开发者和组织使用，并且Flutter是完全免费、开源的。它也是构建未来的Google Fuchsia 应用的主要方式。

## 框架结构

Flutter的主要结构包括：

- Flutter engine

- Flutter framework

  我们看一下这个形象又生动的架构图片：

![Flutter](https://p0.ssl.qhimg.com/t01112f5d526c5a0a0a.png)

##### Framework层

我们来看一下有关部分：
        Material   是谷歌UI设计规范、Cupertino 是苹果UI设计规范，我们日常开发经常用这两部分。
        Widgets 应用程序用户界面的基本组件，也就是我们开发者在UI开发时着重要处理的部分，官方给到解释是描述Element的配置。
        Rendering 抽象布局层，这一层帮助我们完成渲染的初步工作，比如UI元素的位置、大小、绘制等等。
        Animation、Painting、Gestures，在代码里面对应的是Dart:UI包，属于底层UI库，主要提供动画、绘制、手势功能。
        Foundation    基础工具库

​        以上就是Framework层，这一层也正是Flutter精髓所在。

##### Engine层

Skia是2D图像渲染引擎、Dart运行时，Text文字处理引擎。

这个架构图中开发者着重关注Widget开发工作、Material与Cupertino的使用，其他不需要太关心，这些Flutter团队已经帮普通开发者完成了，但是如果稍作了解，对我们对开发还是有很大帮助的。

接下来我们一起开始源码分析之旅吧^^

![](https://p3.ssl.qhimg.com/t01cd78b2cb2616a7d1.png)
<!-- <img src="https://p3.ssl.qhimg.com/t01cd78b2cb2616a7d1.png" width=300> -->

这样的页面Flutter Framework是如何处理的？

```dart
void main() => runApp(MyApp());

class MyApp extends StatelessWidget {

  // 这个widget是应用程序的根 
  
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: MyHomePage(title: 'Hello 360'),
    );
  }
}
```

我们可以看到在main方法处，调用了runApp方法，这就是Flutter开始加载渲染的入口了。值得我们注意，调用runApp(MyApp())，一般Flutter启动时调用，之后就不再会调用了。这里的MyApp()，就是开发者自定义的rootWidget，即widget的根。也就是这里extends StatelessWidget组件。

## 简单的公式描述

我们知道Flutter的实现有Flutter Framwork 和 Engine两大部分组成，不言而喻，从加载到显示地整个渲染流程极其复杂。从进入runApp方法开始到屏幕上显示出来这个过程，我们可否用一个简单的方程式来简单描述一下呢？

![](https://p5.ssl.qhimg.com/t0104ac3c04c244b5fe.png)

1、state就是我们Application内的那些逻辑和内部状态;
2、f() 表示用来描述用户界面部分的方法，比如：build方法调用；
3、UI 屏幕上显示的布局视图；

这个方程式很形象生动的描述了这个state变化到UI渲染完成显示的过程。

## Widget

Widget ：小部件，也就是我们开发者在UI开发时着重要处理的部分，官方给到解释是：描述Element的配置信息，属于不可变对象，它的属性是final修饰。

## BuildContext

用来获取上下文的数据，它实际就是Element，BuildContext是为了开发者不直接操作Element而抽象出来的类，所有Element都继承自BuildContext这个抽象类。

## Element

表示Widget在树中特定位置的一个实例。因为widgets是不可变的，所以同一个widgets可以同时配置到多个子树。[Element]的配置表示了widget在树中的特定位置。父widget重新构建时会给该位置创建一个新的widget，与给定元素关联的widget就会更改。大多数元素都有一个惟一的子元素，但是有些widget(例如[RenderObjectElement]的子类)可以有多个子元素。

## RenderObject

表示在渲染树RenderTree上的节点对象。布局绘制工作都跟他有直接关系。

## Window

Window是Flutter Framework连接宿主操作系统的接口。这里看一下，有关Window的源码

```dart
class Window {
  // 当前设备的DPI
  double get devicePixelRatio => _devicePixelRatio;
  // Flutter绘制区域的大小
  Size get physicalSize => _physicalSize;
  // 当绘制区域大小改变回调
  VoidCallback get onMetricsChanged => _onMetricsChanged;  
  // 绘制前回调，一般会受显示器的垂直同步信号VSync驱动，当屏幕刷新时就会被调用
  FrameCallback get onBeginFrame => _onBeginFrame;
  // 绘制回调  
  VoidCallback get onDrawFrame => _onDrawFrame;
  // 调度Frame，该方法执行后，onBeginFrame和onDrawFrame将紧接着会在合适时机被调用，
  // 此方法会直接调用Flutter engine的Window_scheduleFrame方法
  void scheduleFrame() native 'Window_scheduleFrame';
  // 更新应用在GPU上的渲染,此方法会直接调用Flutter engine的Window_render方法
  void render(Scene scene) native 'Window_render';
  // 发送平台消息
  void sendPlatformMessage(String name,ByteData data,
  PlatformMessageResponseCallback callback);
}
```

# 入口执行3步走

```dart
void runApp(Widget app) {
  WidgetsFlutterBinding.ensureInitialized()
    ..attachRootWidget(app)
    ..scheduleWarmUpFrame();
}
```

渲染widget并上载到屏幕上，框架给了我们这三步骤。

##### 第一步：

```WidgetsFlutterBinding.ensureInitialized()```

WidgetsFlutterBinding初始化操作：这是一个单例模式，负责创建WidgetsFlutterBinding对象，这个对象继承抽象类BindingBase，并且附带7个mixin Binding，初始化渲染、语义化、绘制、平台消息以及手势等一系列操作；我理解这里就是做了全局调用的准备性工作，此时在还不会被触发。我们先看一下这个时序图，先有个整体概念。

![](https://p5.ssl.qhimg.com/t01402aacf4a9c0b11a.png)

1、把给定的widget渲染并贴到屏幕上去。
2、Widgets框架与应用程序绑定到一起的具体实现，就像胶水一样将framework与Flutter引擎关联在一起。
3、作为一个单例实现，也就是系统中只有这么一份。

我们一起看看Framework代码是如何处理的：

```dart
class WidgetsFlutterBinding extends BindingBase 
                            with 
                                 GestureBinding, 
                                 ServicesBinding, 
                                 SchedulerBinding, 
                                 PaintingBinding, 
                                 SemanticsBinding, 
                                 RendererBinding, 
                                 WidgetsBinding 
{
  static WidgetsBinding ensureInitialized() {
    if (WidgetsBinding.instance == null)
      WidgetsFlutterBinding();
    return WidgetsBinding.instance;
  }
}
```

此binding绑定到window上，代码内拿到的ui.window实例。

实例代码：```ui.Window get window => ui.window;```

另外，我们继续跟进代码的过程中，发现在BindingBase有初始化，并且添加持久帧的回调PersistentFrameCallback，在应用程序的生命周期内，每一帧渲染都会调用它们。

###### RenderBinding

```dart
@protected
  void drawFrame() {
  
    pipelineOwner.flushLayout();
    pipelineOwner.flushCompositingBits();
    pipelineOwner.flushPaint();
    
    // 把bits发送到GPU
    renderView.compositeFrame(); 
    
    // 同时把语义发送给操作系统
    pipelineOwner.flushSemantics(); 
  }
```

###### WidgetBinding

```dart
@override
  void drawFrame() {
    try {
      if (renderViewElement != null)
        buildOwner
        .buildScope(renderViewElement);
      super.drawFrame();
      buildOwner.finalizeTree();
    } finally {
    }
  }
```

最后代码跟踪到这个地方，我们看一下这段代码，所有压入render渲染管道的数据，都是经过这个方法生成每一帧的，在布局和画帧时会由Flutter引擎先调用handleDrawFrame，再调用这个方法。

###### 每一帧合成经历过什么？

###### 合成需要8个阶段：

###### 1、动画阶段：

在[Window.onBeginFrame]注册的[handleBeginFrame]方法，按顺序执行所有的临时帧回调[scheduleFrameCallback]。每一个动画都是由[Ticker]实例来驱动[AnimationController]执行。

###### 2、微任务：

由临时帧回调调度的微任务，在方法[handleBeginFrame]执行返回后开始执行。 通常包括完成此帧的[Ticker]s和[AnimationController]s的回调。 注册到[Window.onDrawFrame]的方法，在[handleBeginFrame], [handleDrawFrame]之后会调用持久性帧的回调方法。

###### 3、布局阶段： 

系统中所有的标记为dirty的[RenderObject]s，此时会安排妥当。

###### 4、合成bits阶段 ：

这个阶段会在dirty [RenderObject]更新时进行。

5、绘制阶段 ：

系统中所有被标记为dirty 的[RenderObject]s都会被重新绘制。 标记方法调用[RenderObject.markNeedsPaint]。

###### 6、合成图层阶段： 

图层树被转换成[Scene]并发送给GPU。Scene对象是一个数据结构，保存最终渲染后的像素信息。

###### 7、语义阶段： 

在系统内所有被标记为脏的[RenderObject]s都更新了他们的语义。此时会生成语义节点树。可以参考[RenderObject.markNeedsSemanticsUpdate]详细标明一个语义的dirty对象

###### 8、最终阶段： 

在[drawFrame]方法返回以后[handleDrawFrame]会调用到前面初始化的时候通过[addPostFrameCallback]方法注册进来的post-frame回调。

###### drawFrame方法中调用到的方法释义：

###### 1、flushLayout：

这是更新所有被标记为dirty的RenderObject对象的布局信息。 为了将对象呈现在屏幕新的位置上，此时布局信息绘制被清除掉。

2、flushComposittingBits：

这个方法在[flushLayout]之后与[flushPaint]之前调用，也就是渲染的第二关键步骤。它用来访问所有的子节点，判断是否需要组合，用[markNeedsPaint]方法来做标记哪些渲染对象发生了变化，最后完成所有需要组合的bits更新操作。 

###### 3、flushPaint：

它是用来更新显示列表的所有渲染对象。绘制阶段发生在Layout之后和Scene被重新组合之前，Scene是由每个渲染对象的最新显示列表组成。 使用深度优先策略，按相反的顺序对脏节点排序。

###### 4、compositeFrame：

首先它是renderView的方法
将所有组合好的布局树上载到引擎。也就是发送bits 到 GPU。
最后把呈现管道的输出出现在屏幕上。 这里调用了 window类的方法，```_window.render(scene);```

###### 5、flushSemantics：

把语义的变化发送到操作系统。

到此，第一步告一段落，用一副比较形象的图来表示Flutter布局渲染的整体流程：

![](https://p3.ssl.qhimg.com/t01895e71701aa19a51.png)

1、用户操作后触发更新运行动画，导致Widget State 的改变；
2、Widget State改变触发 Flutter framework 构建新的Widget树；
3、Framework根据新与旧 Widget树的差异更新Render树，从新排版界面布局；
4、新的Render树合成输出新的图层树，最后发送给到GPU显示到屏幕上；

##### 第二步：

```..attachRootWidget(app)```

进行级联调用attachRootWidget，遍历挂载整个视图树，并建立Widget、Element、RenderObject之间的连接与关系，此处Element的具体类型为RenderObjectToWidgetElement；我们先看一下这个时序图，先有个整体概念。![](https://p5.ssl.qhimg.com/t017d3101d2aa744ef5.png)

首先我们来看一下下面的这些方法：
1、attachRootWidget(app)，将获取到的widget 附加到 [renderViewElement]上，必要的时候才会去创建它。这个方法只有在[runApp]方法配置widget树时调用它。
2、RenderObjectToWidgetAdapter就是一个桥接，Widget与RenderObject之间的一个桥接类。
3、RenderObjectToWidgetAdatper这个桥接类与RenderObjectToWidgetElement涉及到几个方法分别是：attachToRenderTree、

createElement、

mount、

rebuild、

updateChild，

inflateWidget，

就是将创建出来的元素element关联到render树上，将widget、element、RenderObject建立关系。当然这里面涉及到一些构建更新渲染到策略，后面由涉及到。

###### attachToRenderTree

  ```
void attachRootWidget(Widget rootWidget) {
    _renderViewElement = RenderObjectToWidgetAdapter<RenderBox>(
      container: renderView,
      debugShortDescription: '[root]',
      child: rootWidget
    ).attachToRenderTree(buildOwner, renderViewElement);
  }
  ```

这是attachRootWidget方法，也就是上图到第一步。 由[runApp]调用将配置好的widget树关联到[renderViewElement]上。

###### attachToRenderTree

```dart
RenderObjectToWidgetElement<T> attachToRenderTree(BuildOwner owner, 
  [RenderObjectToWidgetElement<T> element]) {
    if (element == null) {
      owner.lockState(() {
        element = createElement();
        assert(element != null);
        element.assignOwner(owner);
      });
      owner.buildScope(element, () {
        element.mount(null, null);
      });
    } else {
      element._newWidget = this;
      element.markNeedsBuild();
    }
    return element;
  }
```

这里attachToRenderTree方法，主要是用于[runApp]加载应用程序，根据不同策略创建更新构建Widget、Element、RenderObject的对应关系。如果“element”为空，这个函数将创建一个新元素。否则，给定的元素Element更新对应关系到这个Widget。

下面我们一起看看每个方法的简单逻辑

###### createElement

```dart
@override
RenderObjectToWidgetElement<T> createElement() => RenderObjectToWidgetElement<T>(this);

class RenderObjectToWidgetElement<T extends RenderObject> 
extends RootRenderObjectElement {
  ///创建基于[RenderObject]托管的Element
  RenderObjectToWidgetElement(RenderObjectToWidgetAdapter<T> widget) 
  : super(widget);
```

创建基于[RenderObject]托管的Element

###### mount

```dart
@override
  void mount(Element parent, dynamic newSlot) {
    assert(parent == null);
    super.mount(parent, newSlot);
    _rebuild();
  }
```

mount过程就是将element挂载到父类到槽上去。

###### _rebuild

```
 void _rebuild() {
    try {
      _child = updateChild(_child, widget.child, _rootChildSlot);
    } catch (exception, stack) {
      final Widget error = ErrorWidget.builder(details);
      _child = updateChild(null, error, _rootChildSlot);
    }
  }
```

_rebuild的过程，调用update进行了child节点的更新操作。

###### updateChild

这个方法就不贴代码了，对child节点进行更新的策略如下图：

![](https://p0.ssl.qhimg.com/t0123993c0bd88b7dcb.png)

判断是否更新child在代码里面，就是查看当前child是否相符，也就是键值Key与运行时runtimeType是否完全一样，是的话就认为是一个类型型号的child节点。稍后会说到这一块的更新策略在Framework中怎么落地的。

###### inflateWidget

```dart
  @protected
  Element inflateWidget(Widget newWidget, dynamic newSlot) {
    final Key key = newWidget.key;
    if (key is GlobalKey) {
      final Element newChild = _retakeInactiveElement(key, newWidget);
      if (newChild != null) {
        newChild._activateWithParent(this, newSlot);
        final Element updatedChild = updateChild(newChild, newWidget, newSlot);
        return updatedChild;
      }
    }
    final Element newChild = newWidget.createElement();
    newChild.mount(this, newSlot);
    return newChild;
  }
```

看到inflateWidget方法，在GlobalKey中查找newWidget的Key，查看是否有可以复用到Element，然后就可以更新可复用的Element。当然如果有没有找到的话，就需要创建新的Element啦。

经过上面流程的分析用下图总结流程流转过程：

![](https://p4.ssl.qhimg.com/t013a3d006ac22b3240.png)

Widget部分：存放渲染内容、视图布局信息。
Element部分：存放上下文，通过Element遍历视图树，Element同时持有Widget和RenderObject。
RenderObject部分：根据Widget的布局属性进行Layout，Paint， Widget传入的内容构建Layer树。

##### 第三步：

```..scheduleWarmUpFrame();```

再次进行级联调用scheduleWarmUpFrame，这里用来调度预热帧，执行帧绘制方法handleBeginFrame和handleDrawFrame。此时会触发布局渲染工作。

这里面有一个有意思的点就是当再次调用[runApp]这个方法，会用新的widget替换屏幕上之前的旧的widget。工作机理是新旧widget树比对，将差异点应用于底层呈现树。举个直接的例子，就类似于我们写的计数器的demo，[StatefulWidget]在调用[State.setState]后重新构建[State.setState]时所发生的变化。

![](https://p0.ssl.qhimg.com/t013a7edb98c69f18f1.png)

这里方法调用就比较简单了，涉及到的方法少，但是做的事情非常重要。我们先简单看一下几个方法：
1、scheduleWarmUpFrame，执行热身帧，在SchedulerBinding内执行的方法
2、handleBeginFrame准备执行帧绘制
3、handleDrawFrame引擎调用准备出来一个新的帧
4、scheduleFrame在适当的时机，请求调用window类的[onBeginFrame]和[onDrawFrame]回调。

我们一起看一下这里的代码

###### scheduleWarmUpFrame

```dart
void scheduleWarmUpFrame() {
    ///使用定时器确认微任务执行刷新
    Timer.run(() {
      // 使用定时器准备执行帧绘制
      handleBeginFrame(null);
    });
    Timer.run(() {
      handleDrawFrame();
      //重置时间戳，避免帧跳跃
      resetEpoch();
      _warmUpFrame = false;
      if (hadScheduledFrame)
        scheduleFrame();
    });
    // 事件锁定，
    // 保证在执行期间不会有其他任务穿插入进来
    lockEvents(() async {
      await endOfFrame;
      Timeline.finishSync();
    });
  }
```

这个方法在响应到系统Vsync信号前，尽可能快的去执行一帧绘制。
先简单看一下第一个方法内代码执行的具体方法，这里有注释，可以简单看一下。

###### scheduleFrame

```dart
void scheduleFrame() {
    if (_hasScheduledFrame 
         || !_framesEnabled)
      return;
    ..........
    window.scheduleFrame();
    _hasScheduledFrame = true;
  }

在适当的时机，请求[onBeginFrame]和[onDrawFrame]回调。
void scheduleFrame() native 'Window_scheduleFrame';
```

方法[scheduleFrame]，需要注意的是：

1、在设备屏幕关闭时，调用可能会延迟；

2、当屏幕再次打开并且应用程序可见时，才会被调用。

还有特别有意思的是，在当前帧未完成情况下，如果我们调用此函数，就会强制调度到另一个帧。在通常情况下，调度帧是由操作系统发出的“Vsync”信号来触发。

在看代码的时候，还有看到过另外相关一个方法，在这里做个对比：

1、[scheduleForcedFrame], 忽略[lifecycleState]强制执行一帧；
2、[scheduleWarmUpFrame]，忽略"Vsync"信号立即尽可能早的执行一帧；

# 一些思考

### 1、Widget 变化对布局的影响

##### Widget 变化对布局的影响（情形一）

![](https://p5.ssl.qhimg.com/t017ed2d9a9788d65d0.png)

![](https://p1.ssl.qhimg.com/t01b00cbb8751ccdb50.png)

第一次完成布局后，看到是对应关系如上虚线部分。当黄色矩形发生颜色变化时，它并没有新建 Element，而是复用了之前矩形 的 Element，由于矩形并没有改变 Widget 类型，所以 Element 只需要根据新的 Widget 修改自身的颜色配置参数作为新的 Widget 距可以了。正是通过这种可变与不可变对象的组合，使得Flutter布局模式灵活而又高效。

##### Widget 变化对布局的影响（情形二）

![](https://p4.ssl.qhimg.com/t015d717353e1ba68cd.png)

情形二中，子圆形蓝色 Widget变为了 三角形红色，此时 Flutter 的布局重建会有怎样的变化呢？

![](https://p2.ssl.qhimg.com/t01fe0248d31133704a.png)

因为矩形 Widget 类型没变化，所以并没有引起 Element 与 Render Object 的实际变化。Element 照常持有了新矩形绿色 Widget 与 矩形RenderObject的引用。

![](https://p3.ssl.qhimg.com/t01a21c20bf45202528.png)

三角形红色Widget类型发生了变化，就不可以复用 由 矩形绿色 类型创建的 Element 与 RenderObject，那怎么办呢？

![](https://p3.ssl.qhimg.com/t01e9bd142b42b341e5.png)
此时，Framework 就会更新Widget、Element 与 RenderObject到关系，暂时分离相互之间的关系。我们在前面分析代码时候，看到他们在创建之前是在缓存里面查一下看有没有存在，所以这缓存策略也是优化性能的策略之一。

![](https://p0.ssl.qhimg.com/t01e1316ae4d0e8294f.png)

最后，三角形红色Widget 重新调用 createElement() 与 createRenderObject()方法进行构建，再次mount挂载到父节点的 slot 槽上。新的 Element 就与三角形 Widget 和三角形 RenderObject建立了关系。

通过上面到两个情形，我们发现了布局变化在framework层处理逻辑是不一样的。感兴趣的同学可以再看看源代码。

### 2、重布局导致性能影响

为避免某一渲染对象重布局时触发父级对象的重布局，减少不必要的性能开销，Flutter 框架给出了布局边界控制机制。即通过在某一渲染对象上设置重布局边界，避免重布局的影响范围扩散出去，那满足哪些条件，会自动设置重布局边界呢？

我们一起看看下面的代码

```dart
void layout(Constraints constraints, 
           { bool parentUsesSize = false }) {
    RenderObject relayoutBoundary;
    if (!parentUsesSize || sizedByParent 
       || constraints.isTight 
       || parent is! RenderObject) 
    {
      relayoutBoundary = this;
    } else {
      final RenderObject parent = this.parent;
      relayoutBoundary = parent._relayoutBoundary;
    }
    if (!_needsLayout 
    && constraints == _constraints 
    && relayoutBoundary==_relayoutBoundary) 
    {
      return;
    }
    _constraints = constraints;
    _relayoutBoundary = relayoutBoundary;
    if (sizedByParent) {
      try {
        performResize();
      } catch (e, stack) {
      }
    }
    。。。。。。。。。。
 }
```

看到满足边界判断的地方，就直接返回不再去调用执行。总结如下：
1、parentUsesSize 为false， 父对象大小与子对象大小无任何依赖的情况。
2、sizedByParent 为 true，子对象大小受父对象约束。
3、constraints.isTight 父对象对子对象的大小有严格限定。

下面我们看一下比较形象标识其中一个条件的图：

![](https://p3.ssl.qhimg.com/t018365849f5ed381b1.png)

如图满足constraints.isTight 父对象对子孩子的大小有严格限定，红色的弧线部分，此时子对象自动被设置隔离带布局边界，子树的重布局不会扩散到父级。可以说这也是提高性能的好办法。

# 一些问题

在总结的过程中，朋友们也提出了比较好的问题，这里列举一下：

##### 1、第三步scheduleWarmUpFrame()可以不调用吗？

这个方法的作用是，在系统Vsync信号到来之前尽可能快的执行。这个方法最好是在应用程序启动的时候调用的，目的是让第一帧尽可能多的运行几毫秒。如果不调用这个方法，App倒是也可以启动运行，只是界面布局之初可能有那么几毫秒不会进行布局渲染工作，直到系统Vsync信号到来。

###### 2、Widget、Element、RenderObject 三者对应树关系，为什么有中间这一层Element，而不是widget直接对应RenderObject呢？

开始看这部分的时候，其实我觉得好奇怪，怎么中间还多了一层Element，这是什么操作呀，在了解到框架设计者的思想后，明白了些许原因。查了一些资料了解到浏览器方面的的技术“虚拟DOM”。它是为解决渲染性能问题而生的，在DOM操作时性能损耗与局部DOM操作更新有一定麻烦，假如对网页上个别标签进行更新，如果此时直接操作整个DOM，那开销是很大的。这个时候就需要有个优化的办法，汇总各个元素的更新情况，通过“diff算法”计算出与原来 DOM 树的差异，最后通过一次 DOM 更新解决，这样的设计使得性能大大提高。在Flutter Framework层对当前需要rebuild的Element都会进行标记为dirty状态，即[markNeedsBuild]方法，这时候可以这么理解 Element 树就是用来发挥“虚拟DOM”的作用，使得视图更高效地完成构建。Element由 Widget 的“配置描述信息”构建出来的结构化组件，里面包含了各种部件的上下文信息。
