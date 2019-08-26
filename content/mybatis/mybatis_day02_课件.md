# mybatis_day02_课件

## 一、动态sql

MyBatis 的强大特性之一便是它的动态 SQL。如果你有使用 JDBC 或其它类似框架的经验，你就能体会到根据不同条件拼接 SQL 语句的痛苦。例如拼接时要确保不能忘记添加必要的空格，还要注意去掉列表最后一个列名的逗号。利用动态 SQL 这一特性可以彻底摆脱这种痛苦



动态 SQL 元素和 JSTL 或基于类似 XML 的文本处理器相似。在 MyBatis 之前的版本中，有很多元素需要花时间了解。MyBatis 3 大大精简了元素种类，现在只需学习原来一半的元素便可。MyBatis 采用功能强大的基于 OGNL 的表达式来淘汰其它大部分元素。

- if
- choose (when, otherwise)
- trim (where, set)
- foreach

### 1.1 if标签

```xml
<!--传递pojo综合查询用户信息 -->
	<select id="findUserList"parameterType="user"resultType="user">
		select * from user
		where 1=1 
		<if test="id!=null and id!=''">
		and id=#{id}
		</if>
		<if test="username!=null and username!=''">
		and username like '%${username}%'
		</if>
	</select>
```

**注意要做不等于空字符串校验。**

 

### 1.2 Where标签

上边的sql也可以改为：

```xml
<selectid="findUserList"parameterType="user"resultType="user">
		select * from user
		<where>
		<iftest="id!=null and id!=''">
		and id=#{id}
		</if>
		<iftest="username!=null and username!=''">
		andusername like '%${username}%'
		</if>
		</where>
	</select>
```

\<where />可以自动处理第一个and。

 

### 1.3 Set标签

set元素可以被用于动态包含需要更新的列，而舍去其他的。比如：

```xml
<update id="updateAuthorIfNecessary">
  update Author
<set>
      <if test="username != null">username=#{username},</if>
      <if test="password != null">password=#{password},</if>
      <if test="email != null">email=#{email},</if>
      <if test="bio != null">bio=#{bio}</if>
    </set>
  where id=#{id}
</update>
```



### 1.4 choose, when, otherwise

​       

有时我们不想应用到所有的条件语句，而只想从中择其一项。针对这种情况，MyBatis 提供了 choose 元素，它有点像 Java 中的 switch 语句。



```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <choose>
    <when test="title != null">
      AND title like #{title}
    </when>
    <when test="author != null and author.name != null">
      AND author_name like #{author.name}
    </when>
    <otherwise>
      AND featured = 1
    </otherwise>
  </choose>
</select> 
```



### 1.5 foreach

动态 SQL 的另外一个常用的操作需求是对一个集合进行遍历，通常是在构建 IN 条件语句的时候

```xml
标签相关属性:
index：为数组的下标。
item：为数组每个元素的名称，名称随意定义
open：循环开始
close：循环结束
separator：中间分隔输出
```



#### 1.5.1通过pojo传递list

在pojo中定义list属性ids存储多个用户id，并添加getter/setter方法

```xml
<if test="ids!=null and ids.size>0">
		<foreach collection="ids" open=" and id in(" close=")" item="id"separator=",">
			#{id}
		</foreach>
</if>
```



#### 1.5.2传递单个List

传递List类型在编写mapper.xml没有区别，唯一不同的是只有一个List参数时它的参数名为list。

```xml
<select id="selectUserByList" parameterType="java.util.List" resultType="user">
		select * from user
		<where>
		<!--传递List，List中是pojo -->
		<if test="list!=null">
		<foreach collection="list"item="item"open="and id in("separator=","close=")">
		#{item.id} 	
		</foreach>
		</if>
		</where>
	</select>

```

```java
public List<User> selectUserByList(List userlist) throws Exception;
```



#### 1.5.3传递单个数组（数组中是pojo)

sql只接收一个数组参数，这时sql解析参数的名称mybatis固定为array，如果数组是通过一个pojo传递到sql则参数的名称为pojo中的属性名。

```xml
<!--传递数组综合查询用户信息 -->
	<selectid="selectUserByArray"parameterType="Object[]"resultType="user">
		select * from user
		<where>
		<!--传递数组 -->
		<iftest="array!=null">
		<foreachcollection="array"index="index"item="item"open="and id in("separator=","close=")">
		#{item.id} 
		</foreach>
		</if>
		</where>
	</select>
```

```java
public List<User> selectUserByArray(Object[] userlist) throws Exception;
```



## 二、对应关系

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



## 三、缓存

mybatis提供了缓存机制减轻数据库压力，提高数据库性能

mybatis的缓存分为两级：一级缓存、二级缓存

Mybatis一级缓存的作用域是同一个SqlSession，在同一个sqlSession中两次执行相同的sql语句，第一次执行完毕会将数据库中查询的数据写到缓存（内存），第二次会从缓存中获取数据将不再从数据库查询，从而提高查询效率。当一个sqlSession结束后该sqlSession中的一级缓存也就不存在了。Mybatis默认开启一级缓存。

 

Mybatis二级缓存是多个SqlSession共享的，其作用域是mapper的同一个namespace，不同的sqlSession两次执行相同namespace下的sql语句且向sql中传递参数也相同即最终执行相同的sql语句，第一次执行完毕会将数据库中查询的数据写到缓存（内存），第二次会从缓存中获取数据将不再从数据库查询，从而提高查询效率。Mybatis默认没有开启二级缓存需要在setting全局参数中配置开启二级缓存。

![1558169459811](img\1558169459811.png)

### 1.一级缓存

一级缓存默认开启的，所以可以直接使用.

``` java
	/**
	 * 一级缓存
	 */
	@Test
	public void test01() {
	
		//使用同一个 openSession1 即可
		SqlSession openSession1 = sqlSessionFactory.openSession();
		UsersMapper usersMapper = openSession1.getMapper(UsersMapper.class);
		Users users = usersMapper.findUserByid(1001);
		System.out.println(users);
		UsersMapper usersMapper2 = openSession1.getMapper(UsersMapper.class);
		Users users2 = usersMapper2.findUserByid(1001);
		System.out.println(users2);
	}
```



### 2.二级缓存

默认不开启二级缓存，需要自己去手动开启；

二级缓存是针对整个mapper下所有的语句

主要步骤:

#### a.实体类需要序列化

实体类必须实现Serializable接口

``` java
public class Users implements Serializable{}
```



#### b.设置核心配置文件

SqlMapConfig.xml

``` xml
<settings>
    <!--开启缓存 -->
	<setting name="cacheEnabled" value="true" />
</settings>
```



#### c.设置XXXMapper文件

二级

``` xml
<!--默认  -->
<cache></cache>

<!--也可以设置参数  -->
<cache eviction="LRU" flushInterval="60000" size="512" readOnly="true" />
<!-- 配置了一个LRU缓存，并每隔60秒刷新，最大存储512个对象，而却返回的对象是只读的 -->
<!--LRU(Least recently used,最近最少使用):算法根据数据的历史访问记录来进行淘汰数据, -->
```



#### d.测试

``` java
	@Test
	public void test02() {
		SqlSession openSession1 = sqlSessionFactory.openSession();
		SqlSession openSession2 = sqlSessionFactory.openSession();
		SqlSession openSession3 = sqlSessionFactory.openSession();

		UsersMapper usersMapper = openSession1.getMapper(UsersMapper.class);
		Users users = usersMapper.findUserByid(1001);
		System.out.println(users);

		openSession1.commit(); //提交 才会往缓存中 存数据

		//users.setUserName("小花");
		//UsersMapper usersMapper3 = openSession3.getMapper(UsersMapper.class);
		//usersMapper3.updateUser(users);
		//openSession3.commit();

		UsersMapper usersMapper2 = openSession2.getMapper(UsersMapper.class);
		Users users2 = usersMapper2.findUserByid(1001);
		System.out.println(users2);

	}
```

测试结果:

两次查询，但是只打印了一次sql,第二次直接从缓存中获取

``` java
DEBUG [main] - Setting autocommit to false on JDBC Connection [com.mysql.jdbc.JDBC4Connection@6acdbdf5]
DEBUG [main] - ==>  Preparing: select * from users where userid = ? 
DEBUG [main] - ==> Parameters: 1001(Integer)
DEBUG [main] - <==      Total: 1
Users [userId=1001, userName=小花, userPwd=123, userAge=20, userSex=男, addr=null]
DEBUG [main] - Cache Hit Ratio [com.hzit.mapper.UsersMapper]: 0.5
Users [userId=1001, userName=小花, userPwd=123, userAge=20, userSex=男, addr=null]

```











