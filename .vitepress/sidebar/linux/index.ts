const bashPath = '/19-Linux/'
const learnPath = bashPath + 'learn/'

export default [
  {
    text: '《Linux简明教程》',
    items: [
      { text: 'Linux-管道与重定向', link: learnPath + '02-Linux-管道与重定向' },
      { text: 'Linux环境变量说明', link: learnPath + '03-Linux环境变量说明' },
      { text: 'Linux文件与磁盘管理', link: learnPath + '04-Linux文件与磁盘管理' },
      { text: 'Linux系统管理-进程管理', link: learnPath + '05-Linux系统管理-进程管理' },
      { text: 'Linux时间日期', link: learnPath + '06-Linux时间日期' },
      { text: 'Linux搜索查找', link: learnPath + '07-Linux搜索查找' },
      { text: 'Linux网络服务', link: learnPath + '08-Linux网络服务' },
      { text: 'Linux文本处理工具', link: learnPath + '09-Linux文本处理工具' },
      { text: 'Linux用户与组管理', link: learnPath + '10-Linux用户与组管理' },
      { text: 'RedHat软件包管理', link: learnPath + '11-RedHat软件包管理' },
      { text: 'Linux-系统定时任务-crontab', link: learnPath + '12-Linux-系统定时任务-crontab' },
      { text: 'vim编辑器', link: learnPath + '13-vim编辑器' },
      { text: 'LinuxShell', link: learnPath + '14-LinuxShell' },
    ]
  },
  {
    text: 'Linux',
    items: [
      { text: '导读', link: '/19-Linux/' },
    ]
  },
  {
    text: '遇到的问题',
    items: [
      { text: '上传文件到Linux文件名乱码', link: '/19-Linux/上传文件到Linux文件名乱码' },
    ]
  }
]