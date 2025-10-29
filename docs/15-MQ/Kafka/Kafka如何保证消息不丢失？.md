---
permalink: /mq/kafka/ensure-data-not-lost
---

# Kafka如何保证消息不丢失？

## 口语化

要保证Kafka中的消息不丢失，我们需要从生产者、Broker和消费者三个方面来考虑。

生成者可以使用ack机制来确保消息已经被成功写入到Broker中。具体来说，你可以设置`acks=all`，这样生产者在收到所有副本的确认后才认为消息发送成功。

Broker会确保消息被写入到磁盘中，并确保消息被复制到其他副本中。具体来说，你可以设置`log.retention.hours`和`log.retention.bytes`来设置消息的保留时间和大小。

消费者可以使用offset机制来确保消息被成功消费。如手动提交offset，或者在消费过程中捕获异常并重新尝试。