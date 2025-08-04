# 多次调用shutDown或shutDownNow 会怎么样？

调用shutDown或shutDownNow后，再次调用它们不会有额外的效果，也不会抛出异常。