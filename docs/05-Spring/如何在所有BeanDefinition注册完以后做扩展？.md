# 如何在所有 BeanDefinition 注册完以后做扩展？

可以通过实现`BeanFactoryPostProcessor` 接口重写抽象方法，修改Bean的元数据信息

```java
@Component
public class CustomBeanFactoryPostProcessor implements BeanFactoryPostProcessor {

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        // 在这里可以访问所有的 BeanDefinition，并进行扩展或修改
        String[] beanNames = beanFactory.getBeanDefinitionNames();
        for (String beanName : beanNames) {
            BeanDefinition beanDefinition = beanFactory.getBeanDefinition(beanName);
            // 对 BeanDefinition 进行自定义处理
            System.out.println("Bean Name: " + beanName + ", Class: " + beanDefinition.getBeanClassName());
        }
    }
}
```
