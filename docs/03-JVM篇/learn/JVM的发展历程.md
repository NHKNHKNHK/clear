# JVM的发展历程

## Sun Classic VM

- 早在 1996 年 Java1.0 版本的时候，Sun 公司发布了一款名为 sun classic VM 的 Java 虚拟机，它同时也是世界上第一款商用 Java 虚拟机，JDK1.4 时完全被淘汰。
- 这款虚拟机内部只提供解释器。现在还有及时编译器，因此效率比较低，而及时编译器会把热点代码缓存起来，那么以后使用热点代码的时候，效率就比较高。
- 如果使用 JIT 编译器，就需要进行外挂。但是一旦使用了 JIT 编译器，JIT 就会接管虚拟机的执行系统。解释器就不再工作。解释器和编译器不能配合工作。
- 现在 hotspot 内置了此虚拟机。

## Exact VM

- 为了解决上一个虚拟机问题，jdk1.2 时，Sun 提供了此虚拟机。
- Exact Memory Management：准确式内存管理
  - 也可以叫 Non-Conservative/Accurate Memory Management
  - 虚拟机可以知道内存中某个位置的数据具体是什么类型。
- 具备现代高性能虚拟机的维形
  - 热点探测
  - 编译器与解释器混合工作模式
- 只在 solaris 平台短暂使用，其他平台上还是 classic vm
  - 英雄气短，终被 Hotspot 虚拟机替换

## HotSpot VM

- HotSpot 历史
  - 最初由一家名为“Longview Technologies”的小公司设计
  - 1997 年，此公司被 sun 收购；2009 年，Sun 公司被甲骨文收购。
  - JDK1.3 时，HotSpot VM 成为默认虚拟机
- 目前 Hotspot 占有绝对的市场地位，称霸武林。
  - 不管是现在仍在广泛使用的 JDK6，还是使用比例较多的 JDK8 中，默认的虚拟机都是 HotSpot
  - Sun / Oracle JDK 和 OpenJDK 的默认虚拟机
  - 因此本课程中默认介绍的虚拟机都是 HotSpot，相关机制也主要是指 HotSpot 的 Gc 机制。（比如其他两个商用虚机都没有方法区的概念）
- 从服务器、桌面到移动端、嵌入式都有应用。
- 名称中的 HotSpot 指的就是它的热点代码探测技术。
  - 通过计数器找到最具编译价值代码，触发即时编译或栈上替换
  - 通过编译器与解释器协同工作，在最优化的程序响应时间与最佳执行性能中取得平衡

## JRockit

- 专注于服务器端应用
  - 它可以不太关注程序启动速度，因此 JRockit 内部不包含解析器实现，全部代码都靠即时编译器编译后执行。
- 大量的行业基准测试显示，JRockit JVM 是世界上最快的 JVM。
  - 使用 JRockit 产品，客户已经体验到了显著的性能提高（一些超过了 70%）和硬件成本的减少（达 50%）。
- 优势：全面的 Java 运行时解决方案组合
  - JRockit 面向延迟敏感型应用的解决方案 JRockit Real Time 提供以毫秒或微秒级的 JVM 响应时间，适合财务、军事指挥、电信网络的需要
  - MissionControl 服务套件，它是一组以极低的开销来监控、管理和分析生产环境中的应用程序的工具。
- 2008 年，JRockit 被 oracle 收购。
- Oracle 表达了整合两大优秀虚拟机的工作，大致在 JDK8 中完成。整合的方式是在 HotSpot 的基础上，移植 JRockit 的优秀特性。
- 高斯林：目前就职于谷歌，研究人工智能和水下机器人

## IBM 的 J9

- 全称：IBM Technology for Java Virtual Machine，简称 IT4J，内部代号：J9
- 市场定位与 HotSpot 接近，服务器端、桌面应用、嵌入式等多用途 VM
- 广泛用于 IBM 的各种 Java 产品。
- 目前，有影响力的三大商用虚拟机之一，也号称是世界上最快的 Java 虚拟机。
- 2017 年左右，IBM 发布了开源 J9VM，命名为 openJ9，交给 EClipse 基金会管理，也称为 Eclipse OpenJ9

## KVM 和 CDC / CLDC Hotspot

- Oracle 在 Java ME 产品线上的两款虚拟机为：CDC/CLDC HotSpot Implementation VM
- KVM（Kilobyte）是 CLDC-HI 早期产品
- 目前移动领域地位尴尬，智能机被 Android 和 iOS 二分天下。
- KVM 简单、轻量、高度可移植，面向更低端的设备上还维持自己的一片市场
  - 智能控制器、传感器
  - 老人手机、经济欠发达地区的功能手机
- 所有的虚拟机的原则：一次编译，到处运行。

## Azul VM

- 前面三大“高性能 Java 虚拟机”使用在通用硬件平台上这里 Azul VW 和 BEA Liquid VM 是与特定硬件平台绑定、软硬件配合的专有虚拟机
  - 高性能 Java 虚拟机中的战斗机。
- Azul VM 是 Azul Systems 公司在 HotSpot 基础上进行大量改进，运行于 Azul Systems 公司的专有硬件 Vega 系统上的 Java 虚拟机。
- 每个 Azul VM 实例都可以管理至少数十个 CPU 和数百 GB 内存的硬件资源，并提供在巨大内存范围内实现可控的 GC 时间的垃圾收集器、专有硬件优化的线程调度等优秀特性。
- 2010 年，AzulSystems 公司开始从硬件转向软件，发布了自己的 Zing JVM，可以在通用 x86 平台上提供接近于 Vega 系统的特性。

## Liquid VM

- 高性能 Java 虚拟机中的战斗机。
- BEA 公司开发的，直接运行在自家 Hypervisor 系统上
- Liquid VM 即是现在的 JRockit VE（Virtual Edition），Liquid VM 不需要操作系统的支持，或者说它自己本身实现了一个专用操作系统的必要功能，如线程调度、文件系统、网络支持等。
- 随着 JRockit 虚拟机终止开发，Liquid vM 项目也停止了。

## Apache Harmony

- Apache 也曾经推出过与 JDK1.5 和 JDK1.6 兼容的 Java 运行平台 Apache Harmony。
- 它是 IBM 和 Intel 联合开发的开源 JVM，受到同样开源的 OpenJDK 的压制，Sun 坚决不让 Harmony 获得 JCP 认证，最终于 2011 年退役，IBM 转而参与 OpenJDK
- 虽然目前并没有 Apache Harmony 被大规模商用的案例，但是它的 Java 类库代码吸纳进了 Android SDK。

## Micorsoft JVM

- 微软为了在 IE3 浏览器中支持 Java Applets，开发了 Microsoft JVM。
- 只能在 Windows 平台下运行。但确是当时 Windows 下性能最好的 Java VM。
- 1997 年，Sun 以侵犯商标、不正当竞争罪名指控微软成功，赔了 Sun 很多钱。微软 WindowsXP SP3 中抹掉了其 VM。现在 Windows 上安装的 jdk 都是 HotSpot。

## Taobao JVM

- 由 AliJVM 团队发布。阿里，国内使用 Java 最强大的公司，覆盖云计算、金融、物流、电商等众多领域，需要解决高并发、高可用、分布式的复合问题。有大量的开源产品。
- 基于 OpenJDK 开发了自己的定制版本 AlibabaJDK，简称 AJDK。是整个阿里 Java 体系的基石。
- 基于 OpenJDK Hotspot VM 发布的国内第一个优化、深度定制且开源的高性能服务器版 Java 虚拟机。
  - 创新的 GCIH（GC invisible heap）技术实现了 off-heap，即将生命周期较长的 Java 对象从 heap 中移到 heap 之外，并且 GC 不能管理 GCIH 内部的 Java 对象，以此达到降低 GC 的回收频率和提升 GC 的回收效率的目的。
  - GCIH 中的对象还能够在多个 Java 虚拟机进程中实现共享
  - 使用 crc32 指令实现 JVM intrinsic 降低 JNI 的调用开销
  - PMU hardware 的 Java profiling tool 和诊断协助功能
  - 针对大数据场景的 ZenGc
- taobao vm 应用在阿里产品上性能高，硬件严重依赖 intel 的 cpu，损失了兼容性，但提高了性能
  - 目前已经在淘宝、天猫上线，把 oracle 官方 JvM 版本全部替换了。

## Dalvik VM

>   不是JVM的JVM

- 谷歌开发的，应用于 Android 系统，并在 Android2.2 中提供了 JIT，发展迅猛。
- Dalvik VM 只能称作虚拟机，而不能称作“Java 虚拟机”，它没有遵循 Java 虚拟机规范，不能直接执行 Java 的 Class 文件
- 基于寄存器架构，不是 jvm 的栈架构。
- 执行的是编译以后的 dex（Dalvik Executable）文件。执行效率比较高。
  - 它执行的 dex（Dalvik Executable）文件可以通过 class 文件转化而来，使用 Java 语法编写应用程序，可以直接使用大部分的 Java API 等。
- Android 5.0 使用支持提前编译（Ahead of Time Compilation，AoT）的 ART VM 替换 Dalvik VM。

## Graal VM

- 2018 年 4 月，oracle Labs 公开了 Graal VM，号称 "Run Programs Faster Anywhere"，野心勃勃。与 1995 年 java 的”write once，run anywhere"遥相呼应。
- Graal VM 在 HotSpot VM 基础上增强而成的跨语言全栈虚拟机，可以作为“任何语言” 的运行平台使用。语言包括：Java、Scala、Groovy、Kotlin；C、C++、Javascript、Ruby、Python、R 等
- 支持不同语言中混用对方的接口和对象，支持这些语言使用已经编写好的本地库文件
- 工作原理是将这些语言的源代码或源代码编译后的中间格式，通过解释器转换为能被 Graal VM 接受的中间表示。Graal VM 提供 Truffle 工具集快速构建面向一种新语言的解释器。在运行时还能进行即时编译优化，获得比原生编译器更优秀的执行效率。
- 如果说 HotSpot 有一天真的被取代，Graal VM 希望最大。但是 Java 的软件生态没有丝毫变化。

## 总结

具体 JVM 的内存结构，其实取决于其实现，不同厂商的 JVM，或者同一厂商发布的不同版本，都有可能存在一定差异。主要以 Oracle HotSpot VM 为默认虚拟机。
