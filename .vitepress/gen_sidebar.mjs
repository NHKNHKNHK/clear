import path from 'node:path'
import fs from 'node:fs'

// 文件根目录
const DIR_PATH = path.resolve(process.cwd(), 'docs')
// 白名单，过滤掉不是文章的文件和文件夹
const WHITE_LIST = ['index.md', '.vitepress', 'node_modules', '.git', '.idea', 'assets']

// 判断是否是文件夹
const isDirectory = (path) => fs.lstatSync(path).isDirectory()

// 取差值
const intersections = (arr1, arr2) => {
  return Array.from(new Set(arr1.filter(item => !new Set(arr2).has(item))))
}

function getList(params, path1, pathname) {
  const res = []
  for (let file in params) {
    // 拼接目录路径
    const dir = path.join(path1, params[file])
    // 判断是否是文件夹
    const isDir = isDirectory(dir)
    if (isDir) {
      // 如果是文件夹，则递归调用
      const files = fs.readdirSync(dir)
      res.push({
        text: params[file],
        collapsable: true,
        items: getList(files, dir, `${pathname}/${params[file]}`),
      })
    } else {
      // 获取文件名
      const name = path.basename(params[file])
      // 排除非 md 文件
      const suffix = path.extname(params[file])
      if (suffix !== '.md') {
        continue
      }

      let link = `${pathname}/${name}`
      link = link.replace('/docs', '').replace('.md', '')
      res.push({
        text: name.replace('.md', ''),
        link,
      })
    }
  }
  // 目录排序
  const resSort = res.sort((a, b) => {
    return a.text.split('-')[0] - b.text.split('-')[0]
  })
  return resSort
}


export const setSidebar = (pathname) => {
  console.log(pathname, '~~~~')
  // 获取pathname的路径
  const dirPath = pathname.join(DIR_PATH, pathname)
  console.log(dirPath, '~~~~')
  // 读取pathname路径下的文件列表（包括文件或文件夹）
  const files = fs.readdirSync(dirPath)
  // 过滤
  const items = intersections(files, WHITE_LIST)
  console.log(items)
  return getList(items, dirPath, pathname)
}


console.log(setSidebar('02-Java集合篇'))