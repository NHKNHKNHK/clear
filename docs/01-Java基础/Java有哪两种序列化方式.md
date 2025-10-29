# Java有哪两种序列化方式

-   实现`Serializable`接口。该接口不包含任何抽象方法。如果需要更细粒度的控制，可以在类中手动实现 writeObject 和 readObject方法
-   实现`Externalizable`接口。该接口包含writeExternal 和 readExternal 方法