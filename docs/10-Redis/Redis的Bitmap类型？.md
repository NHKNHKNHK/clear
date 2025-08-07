# Redis的Bitmap类型？

>   **Redis中是利用string类型数据结构实现BitMap**，因此最大上限是512M，转换为bit则是 2^32个bit位。

BitMap的操作命令有：

-   SETBIT：向指定位置（offset）存入一个0或1
-   GETBIT ：获取指定位置（offset）的bit值
-   BITCOUNT ：统计BitMap中值为1的bit位的数量
-   BITFIELD ：操作（查询、修改、自增）BitMap中bit数组中的指定位置（offset）的值
    -   它的修改比较繁琐，因此直接用SETBIT修改即可
    -   查询，可以批量查询。GETBIT只能单个查询
-   BITFIELD_RO ：获取BitMap中bit数组，并以十进制形式返回
-   BITOP ：将多个BitMap的结果做位运算（与 、或、异或）
-   BITPOS ：查找bit数组中指定范围内第一个0或1出现的位置

```shell
# 1.模拟用户一周7天的签到情况，其中星期4未签到
127.0.0.1:6379> SETBIT bm1 0 1		# 0 表示bitmap中第一位，相当于星期一； 1表示签到
(integer) 0
127.0.0.1:6379> SETBIT bm1 1 1		# 1 表示bitmap中第二位，相当于星期二； 1表示签到
(integer) 0
127.0.0.1:6379> SETBIT bm1 2 1
(integer) 0
127.0.0.1:6379> SETBIT bm1 5 1
(integer) 0
127.0.0.1:6379> SETBIT bm1 6 1
(integer) 0

# 2.查询用户星期三、星期四是否签到
127.0.0.1:6379> GETBIT bm1 2
(integer) 1
127.0.0.1:6379> GETBIT bm1 3
(integer) 0			# 表示未签到

# 3.统计用户一周内的签到天数（即：统计BitMap中值为1的bit位的数量）
127.0.0.1:6379> BITCOUNT bm1 
(integer) 5

# 4.查询用户星期一到星期三三天的签到情况
127.0.0.1:6379> BITFIELD bm1 get u3 0		# u3表示无符号，显示3位； 0表示offset偏移量
1) (integer) 7	# 7（十进制）==> 111（二进制）

# 5.查询用户一周内第一次未签到是在哪一天
127.0.0.1:6379> BITPOS bm1 0
(integer) 3		# 3表示bitmap中第四位，即星期四
# 5.查询用户一周内第一次签到是在哪一天
127.0.0.1:6379> BITPOS bm1 1
(integer) 0		# 0表示bitmap中第一位，即星期一
```

