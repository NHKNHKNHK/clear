---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Clear有点意思"
  text: "经典老哥的成长之路"
  tagline: 前端 · 后端 · 大数据
  # 首页hero右侧logo
  image: {
    src: /favicon.ico,
    alt: logo
  }
  actions:
    # - theme: brand
    #   text: Clear的Gitee（给个star吧）
    #   link: https://gitee.com/ninghongkang
    # - theme: alt
    #   text: API Examples
    #   link: /api-examples
    #   target: _blank
    #   rel: noopener
    # - theme: alt
    #   text: 面试题库
    #   link: /api-examples
    # - theme: alt
    #   text: 支持老哥
    #   link: /zhichi

features:
  - title: Java基础
    link: /01-Java基础/
    # linkText: 查看
    icon:
      dark: /svg/java-dark.svg
      light: /svg/java-light.svg
      width: 40
      height: 40
  - title: Java集合
    link: /02-Java集合篇
    icon:
      dark: /svg/collection-dark.svg
      light: /svg/collection-light.svg
      width: 40
      height: 40
  - title: Java并发
    link: /04-Java并发篇
    icon:
      dark: /svg/concurrent-dark.svg
      light: /svg/concurrent-light.svg
      width: 40
      height: 40
  - title: JVM
    link: /03-JVM篇
    icon:
      dark: /svg/JVM-dark.svg
      light: /svg/JVM-light.svg
      width: 40
      height: 40
  - title: Spring
    link: /05-Spring
    icon: 
      dark: /svg/spring-dark.svg
      light: /svg/spring-light.svg
      width: 40
      height: 40
  - title: SpringMVC
    link: /06-SpringMVC
    icon: 
      dark: /svg/springmvc-dark.svg
      light: /svg/springmvc-light.svg
      width: 40
      height: 40
  - title: SpringBoot
    link: /07-SpringBoot
    icon: 
      dark: /svg/springboot-dark.svg
      light: /svg/springboot-light.svg
      width: 40
      height: 40
  - title: SpringCloud
    link: /08-SpringCloud、微服务
    icon: 
      dark: /svg/springcloud-dark.svg
      light: /svg/springcloud-light.svg
      width: 40
      height: 40
  - title: MySQL
    link: /09-MySQL
    icon: 
      dark: /svg/mysql-dark.svg
      light: /svg/mysql-light.svg
      width: 40
      height: 40
  - title: ORM
    link: /11-ORM
    icon: 
      dark: /svg/mybatis-dark.svg
      light: /svg/mybatis-light.svg
      width: 40
      height: 40
  - title: Redis
    link: /10-Redis
    icon: 
      dark: /svg/Redis-dark.svg
      light: /svg/Redis-light.svg
      width: 40 
      height: 40
  - title: 分布式
    link: /12-分布式
    icon: 
      dark: /svg/Distributed-dark.svg
      light: /svg/Distributed-light.svg
      width: 40
      height: 40
  - title: Zookeeper
    link: /13-Zookeeper
    icon: 
      dark: /svg/Zookeeper-dark.svg
      light: /svg/Zookeeper-light.svg
      width: 40
      height: 40
  - title: 消息队列
    link: /15-MQ/common/index
    icon: 
      dark: /svg/Kafka-dark.svg
      light: /svg/Kafka-light.svg
      width: 40
      height: 40
  - title: ElasticSearch
    link: /14-ElasticSearch
    icon: 
      dark: /svg/es-dark.svg
      light: /svg/es-light.svg
      width: 40
      height: 40
  - title: MongoDB
    link: /16-MongoDB
    icon: 
      dark: /svg/mongodb-dark.svg
      light: /svg/mongodb-light.svg
      width: 40
      height: 40
  - title: Vue
    link: /25-Vue
    icon: 
      dark: /svg/vue-dark.svg
      light: /svg/vue-light.svg
      width: 40
      height: 40
  - title: React
    link: /26-React
    icon: 
      dark: /svg/react-dark.svg
      light: /svg/react-light.svg
      width: 40
      height: 40
  - title: JavaScript
    link: /27-JavaScript
    icon: 
      dark: /svg/js-dark.svg
      light: /svg/js-light.svg
      width: 40
      height: 40
  - title: CSS
    link: /30-CSS
    icon: 
      dark: /svg/css-dark.svg
      light: /svg/css-light.svg
      width: 40
      height: 40
  - title: HTML
    link: /29-HTML
    icon: 
      dark: /svg/html-dark.svg
      light: /svg/html-light.svg
      width: 40
      height: 40
  - title: 敬请期待...
    icon: 
      dark: /svg/please-await-dark.svg
      light: /svg/please-await-light.svg
      width: 40
      height: 40

---

<style>
/* 首页hero中文字无法选中 */
.container>.main  {
  user-select: none;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE/Edge */
}

/* feature中内容居中 */
.container .item .VPFeature .box {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* feature */
.container .item .VPFeature {
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 平滑过渡效果 */
}

.container .item .VPFeature:hover {
  outline: 1px solid var(--vp-c-brand-1);
  transform: translateY(-5px); /* 放大效果 */

  /* 底部阴影 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

/* /* feature title放大效果 */ */
.container .item .VPFeature .box .title {
  transition: transform 0.3s ease;
}

.container .item .VPFeature:hover .box .title {
  color: var(--vp-c-brand-1);
  transform: scale(1.2);
}

/* feature图片放大效果 */
.container .item .VPFeature .box .VPImage {
  transition: transform 0.3s ease;
}

.container .item .VPFeature:hover .box .VPImage {
  transform: scale(1.5);
}
</style>

<!-- 烟火效果 -->
<Confetti/>
<!-- 首页文字下划线效果 -->
<HomeUnderline/>


## 一些额外的内容

You can get started using VitePress right away using `npx`!

```sh
npm init
npx vitepress init
```
