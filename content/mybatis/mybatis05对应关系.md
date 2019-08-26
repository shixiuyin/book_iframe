

## 一、对应关系

### 一对一查询

案例：查询所有宠物信息，并查询出对应的主人信息。

 

注意：因为宠物只属于一个主人，所以从宠物信息出发关联主人信息为一，因为一个宠物信息只属于一个主人。所以是一对一关系；相反的如果从主人信息出发，那就是一对多了，因为一个主人可以拥有多个宠物。



#### 方法一：

使用resultType，定义宠物信息实体类，此实体类包含了宠物信息，主人信息

##### 1.1定义PetMsg实体类

实体类具体的字段，如下：

```java
public class PetMsg extends Pet {
	private int ownerId;
	private String ownerName;
	//get set....
}
```

PetMsg继承了Pet宠物信息类，包含了所有的宠物信息，所以只需要定义主人需要的信息即可。

##### 1.2Mapper.xml

![1528127366532](img\1528127366532.png)



##### 1.3Mapper接口：

![1528127417811](img\1528127417811.png)



##### 1.4测试:

![1528127439060](img\1528127439060.png)

##### 1.5总结：

>  定义专门的实体类作为输出类型，其中定义了sql查询结果集所有的字段。此方法较为简单，企业中使用普遍。



#### 方法二：

使用resultMap，定义专门的resultMap用于映射一对一查询结果。

##### 1.1定义实体类

​         在Pet类中加入petOwner属性，petOwner属性中用于存储关联查询的主人信息，因为宠物查询主人是一对一关系，所以这里使用单个PetOwner对象存储关联查询的主人信息。



![1528127502373](img\1528127502373.png)



##### 1.2Mapper.xml

![1528127529869](img\1528127529869.png)



##### 1.3定义resultMap

需要关联查询映射的是用户信息，使用association将主人信息映射到宠物对象的petOwner属性中。

![1528127561902](img\1528127561902.png)

```xml
association：表示进行关联查询单条记录
property：表示关联查询的结果存储在com.hzit.bean.Pet的petOwner属性中
javaType：表示关联查询的结果类型
```

##### 1.4 mapper接口：

![1528127591309](img\1528127591309.png)



##### 1.5 测试：

![1528127614846](img\1528127614846.png)



##### 1.6小结：

> 使用association完成关联查询，将关联查询信息映射到实体对象中





### 一对多查询



```xml
案例：查询宠物对应类型下的宠物信息
宠物类型（PetType）与宠物信息(Pet)为一对多关系。
```

使用resultMap实现如下：



#### 1.定义实体类

在PetType类中加入petList属性。

![1528127657058](img\1528127657058.png)

#### 2.Mapper.xml

![1528127685348](img\1528127685348.png)

#### 3.定义resultMap

![1528127707499](img\1528127707499.png)

```xml
collection部分定义了查询订单明细信息。
collection：表示关联查询结果集
property="petlist"**：关联查询的结果集存储在com.hzit.bean.PetType上哪个属性。
ofType="com.hzit.bean.Pet "**：指定关联查询的结果集中的对象类型即List中的对象类型。
<id/>及<result/>的意义同一对一查询。
```

#### 4.Mapper接口：

![1528127735476](img\1528127735476.png)



#### 5.测试：

![1528127772860](img\1528127772860.png)



#### 6.resultMap小结

```xml
resultType：	作用：将查询结果按照sql列名pojo属性名一致性映射到pojo中。
resultMap： 使用association和collection完成一对一和一对多高级映射（对结果有特殊的映射要求）。
association：作用：
         将关联查询信息映射到一个pojo对象中。
         使用resultType无法将查询结果映射到pojo对象的pojo属性中，根据对结果集查询遍历的需要选择使用			resultType还是resultMap。
collection：作用：将关联查询信息映射到一个list集合中。
场合：  为了方便查询遍历关联信息可以使用collection将关联信息映射到list集合中。
```



