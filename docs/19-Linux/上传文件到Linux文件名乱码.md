# 上传文件到Linux文件名乱码

:::tip 场景说明
Windows 的文件名中文编码默认为`GBK`，压缩或者上传后，文件名还会是`GBK`编码，而Linux中默认文件名编码为`UTF-8`，由于编码不一致所以导致了文件名乱码的问题，解决这个问题需要对文件名进行转码
:::

:::warning 注意

`convmv` 命令在 CentOS 7 中默认是没有安装的，需要手动安装。

```sh
yum install convmv
```

:::

```sh
# 1. 进入乱码文件所在目录
cd /path/to/directory

# 2. 模拟转换，看是否正确（非常重要！）
convmv -f GBK -t UTF-8 -r --nosmart .

# 3. 确认模拟结果无误后，执行真实转换
convmv -f GBK -t UTF-8 -r --notest --nosmart .

# 参数说明：
# -f GBK：源编码
# -t UTF-8：目标编码
# . ：当前目录
```

常用参数：

- `-f GBK` 指定源编码
- `-t UTF-8` 指定目标编码
- `-r` 递归处理子目录
- `--notest` 实际执行转换（不加则只测试，不对文件进行真实操作）
- `--nosmart` 忽略已经是 UTF-8 的文件，强制转换
- `–list` 显示所有支持的编码
- `–unescap` 可以做一下转义，比如把%20变成空格
- `-i` 交互模式（询问每一个转换，防止误操作）

## 扩展

linux下有许多方便的小工具来转换编码：

文本内容转换 `iconv`

文件名转换 `convmv`

mp3标签转换 `python-mutagen`
