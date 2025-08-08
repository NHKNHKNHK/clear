#  Kafka为什么会出现重复消费？如何解决？


## **口语化**

Kafka Broker中每个分区存储的消息都有一个offset标记，Kafka的消费者是通过offset这个标记来维护当前已经消费的数据，消费者每消费一批数据，Kafka Broker就会更新offset的值， 避免重复消费的问题。

默认情况下，消息消费完毕后会自动提交offset，避免重复消费。

Kakfa的消费端自动提交offset的时间间隔是5s

`enable.auto.commit=true`  ` auto.commit.interval.ms=5000`

如果在这5s后，应用程序宕机或强制kill掉，offset未来得及提交，就可能会出现重复消费的问题。

