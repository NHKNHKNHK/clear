const bashPath = '/nginx/'

export default [
  {
    text: 'Nginx',
    items: [
      { text: '导读', link: bashPath + '' },
      { text: '通过 yum 方式安装 Nginx', link: bashPath + 'install-nginx' },
      { text: 'Nginx的常用命令？', link: bashPath + 'Nginx的常用命令？' },
      { text: 'Nginx 配置文件解读', link: bashPath + 'nginx-config' },
      { text: 'Nginx配置文件结构', link: bashPath + 'Nginx配置文件结构' },
      { text: '单服务器如何部署多个网站？', link: bashPath + 'multi-deploy' },
      { text: 'Nginx配置Gzip压缩', link: bashPath + 'nginx-gzip' },
      { text: 'Nginx如何实现跨域访问', link: bashPath + 'Nginx如何实现跨域访问' },
    ]
  },

]