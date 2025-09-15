# ES6 Class

:::tip
ES6的 class 可以看作是语法糖，它的绝大部分功能，ES5 都可以做到，新的 class 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法。
:::

```js
// es5构造函数写法
function Phone(brand, price) {
  this.brand = brand;
  this.price = price;
}

// 往原型上添加方法
Phone.prototype.call = function () {
  console.log('打电话');
}

// 创建Phone类的实例
const p1 = new Phone('苹果', 8888);
p1.call();
console.log(p1);


// es6 class写法
class Phone2 {
  
  constructor(brand, price) {
    this.brand = brand;
    this.price = price;
  }

  // 类中定义一般方法：在哪里？在原型上，供实例调用
  call() {
    console.log('打电话');
  }
}

// 创建Phone2类的实例
const p2 = new Phone2('华为', 6666);
p2.call();
console.log(p2);
```


## class静态成员

class中通过`static`关键字定义的成员，称为静态成员。

```js
// es5中静态属性和静态方法的定义方式
function Phone() {
}
Phone.name = '手机' // 静态属性
Phone.change = function() { // 静态方法
  console.log('改变世界')
}

Phone.prototype.size='5.5寸'

const nokia = new Phone()
console.log(nokia.name);
Phone.change()
console.log(nokia.size); // 5.5寸


// es6中静态属性和静态方法的定义方式
class Phone2 {
  // 静态属性
  static name = '手机'
  // 静态方法
  static change() {
    console.log('改变世界')
  }
}

const nokia2 = new Phone2()
console.log(nokia2.name); //undefined
Phone2.change()
```

## 继承

### es5构造函数继承

在 ES5 中，我们可以通过原型链和构造函数组合的方式实现继承。

```js
function Phone(brand, price) {
  this.brand = brand;
  this.price = price;
}
// 给父类添加原型方法
Phone.prototype.call = function () {
  console.log('打电话');
}

// 子类构造函数 - 智能手机
function SmartPhone(brand, price, system) {
  // 调用父类构造函数，继承属性
  Phone.call(this, brand, price);
  // 子类自己的属性
  this.system = system;
}

// 实现原型继承
SmartPhone.prototype = new Phone();
// 修正子类构造函数指向
SmartPhone.prototype.constructor = SmartPhone;


// 给子类添加自己的原型方法
SmartPhone.prototype.installApp = function (appName) {
  console.log(`${this.brand}手机(${this.system}系统)正在安装${appName}`);
};

const chuizi = new SmartPhone('锤子', 2000, '安卓');
chuizi.call(); // 继承自父类的方法
chuizi.installApp('微信'); // 子类自己的方法

console.log(chuizi instanceof SmartPhone); // true
console.log(chuizi instanceof Phone); // true
```

- 1、首先定义了父类Phone，包含brand和price属性，以及call方法
- 2、定义子类SmartPhone时：
  - 使用Phone.call(this, brand, price)调用父类构造函数，实现属性继承
  - 通过SmartPhone.prototype = new Phone()建立原型链关系
  - 修复constructor指向，确保SmartPhone.prototype.constructor指向SmartPhone本身
- 3、为子类添加特有的方法如installApp

### class的类继承

```js
class Phone {
  constructor(brand, price) {
    this.brand = brand;
    this.price = price;
  }

  call() {
    console.log('打电话');
  }
}

class SmartPhone extends Phone {
  constructor(brand, price, system) {
    super(brand, price);
    this.system = system;
  }

  installApp(appName) {
    console.log(`${this.brand}手机(${this.system}系统)正在安装${appName}`);
  }
}

const chuizi = new SmartPhone('锤子', 2000, '安卓');
chuizi.call(); // 继承自父类的方法
chuizi.installApp('微信'); // 子类自己的方法

console.log(chuizi instanceof SmartPhone); // true
console.log(chuizi instanceof Phone); // true
```

## 子类重写父类的方法

在 ES6 中，子类可以通过重写父类的方法来实现对继承行为的定制。当子类定义了与父类同名的方法时，子类的方法会覆盖父类的方法，这就是方法重写（Method Overriding）

**重写的核心要点**：

- 子类方法与父类方法同名时，会自动覆盖父类方法
- 使用`super`关键字可以在子类方法中访问父类的同名方法
- 重写可以扩展或修改父类方法的功能，而不影响父类本身的实现
- 重写是实现多态的重要手段，相同的方法调用可以根据对象类型产生不同的行为

```js
class Phone {
  constructor(brand, price) {
    this.brand = brand;
    this.price = price;
  }

  call() {
    console.log('打电话');
  }

}

// 子类：SmartPhone 继承自 Phone
class SmartPhone extends Phone {
  constructor(brand, price, system) {
    // 调用父类构造函数
    super(brand, price);
    this.system = system;
  }

  // 重写父类的call方法
  call() {
    // 可以通过super调用父类的同名方法
    super.call();
    console.log(`同时支持视频通话（${this.system}系统）`);
  }

  // 子类新增的方法
  installApp(appName) {
    console.log(`正在${this.brand}手机上安装${appName}`);
  }
}

const chuizi = new SmartPhone('锤子', 2000, '安卓');
chuizi.call(); // 调用的是子类重写后的方法
const basicPhone = new Phone("诺基亚", 399);
basicPhone.call(); // 调用的是父类的原始方法
```

## class的getter和setter

在 ES6 的 class 语法中，我们可以使用 get 和 set 关键字定义 getter（取值器）和 setter（存值器）方法，用于控制对象属性的访问和修改。

它们可以对属性的读取和赋值进行拦截，实现数据验证、计算属性或隐藏内部实现等功能。

**语法规则**

- getter 用 `get` 关键字定义，无参数，必须返回一个值。
- setter 用 `set` 关键字定义，有且仅有一个参数（表示要设置的值）。
- 调用时直接像访问普通属性一样使用（如 user.age 调用 getter，user.age = 25 调用 setter），不需要加括号

```js
class User {
  constructor(firstName, lastName) {
    // 用下划线开头表示内部属性（约定，非语法规定）
    this._firstName = firstName;
    this._lastName = lastName;
    this._age = 0; // 年龄初始值
  }

  //  getter：获取 fullName（计算属性，由 firstName 和 lastName 拼接）
  get fullName() {
    return `${this._firstName} ${this._lastName}`;
  }

  //  setter：设置 fullName（拆分传入的字符串为 firstName 和 lastName）
  set fullName(name) {
    const [first, last] = name.split(' ');
    this._firstName = first;
    this._lastName = last || ''; // 处理只有名的情况
  }

  //  getter：获取年龄
  get age() {
    return this._age;
  }

  //  setter：设置年龄（添加数据验证，确保年龄为合理数值）
  set age(value) {
    if (typeof value !== 'number' || value < 0 || value > 150) {
      throw new Error('年龄必须是 0-150 之间的数字');
    }
    this._age = value;
  }
}

const user = new User('张', '三');

// 访问 getter（直接像属性一样使用，不加括号）
console.log(user.fullName); // 输出："张 三"
console.log(user.age); // 输出：0

// 使用 setter 修改属性（直接赋值，不加括号）
user.fullName = '李 四';
console.log(user.fullName); // 输出："李 四"

user.age = 25;
console.log(user.age); // 输出：25

// 测试年龄验证（会抛出错误）
try {
  user.age = 200;
} catch (e) {
  console.log(e.message); // 输出："年龄必须是 0-150 之间的数字"
}
```