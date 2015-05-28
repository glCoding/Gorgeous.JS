# Gorgeous.JS #

Gorgeous.JS是一个基于Canvas的图像处理库，它可以直接在浏览器中操作图像，内置多种滤镜，还可以方便地添加自定义效果。

## 已有特性 ##

 * 滤镜效果：支持多种平滑、锐化、边缘检测等基础操作，内置多种常用滤镜；
 * 图像存储：支持直接使用Canvas进行绘制，也可输出为HTML的<img>方便用户保存；
 * 方便扩展：所有的处理操作都可以注册别名，支持中文命名，而且可以方便地添加自定义滤镜；

## 计划中特性 ##

 * 空间操作：支持图片的旋转、缩放等空间操作；
 * 图片叠加：支持图片叠加方法以及透明度运算；
 * 频域操作：支持傅里叶变换，可以在频域对图片进行处理。

## Demo ##

```
//注册自定义效果“灰色浮雕”为组合使用“Emboss”和“gray”两种效果
g.register('灰色浮雕', ['emboss'], ['gray']);

//加载图片并进行处理
g.loadImage('img/baboon.png', function (oimg) {
    var imd = new g.ImageData(oimg);
    imd.use('灰色浮雕').getImage(function (rimg) {
        //展示处理前后的图像
        document.body.appendChild(oimg);
        document.body.appendChild(rimg);
    });
})
```
效果如下：
![原始图像][1]


![处理后的图像][2]


  [1]: test/img/baboon.png
  [2]: test/img/baboon-emboss.png