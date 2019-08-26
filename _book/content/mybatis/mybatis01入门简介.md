# mybatis_day01

## 一、简介

### 1.概述

​	 MyBatis 本是apache的一个开源项目iBatis, 2010年这个项目由apache software foundation 迁移到了google code*，*并且改名为MyBatis 。2013年11月迁移到Github 

​	MyBatis 是支持普通 SQL查询，存储过程和高级映射的优秀持久层框架。ORM框架(Hibernate也是orm框架)，MyBatis 消除了几乎所有的JDBC代码和参数的手工设置以及结果集的检索。

​	MyBatis 使用简单的 XML或注解用于配置和原始映射，将接口和 Java 的POJOs（Plain Old Java Objects，普通的 Java对象）映射成数据库中的记录； 



### 2.作用

```xml
-MyBatis 是一个ORM框架 对象关系映射（Object Relational Mapping），是一个半自动化的ORM框架,			(Hibernate也是全自动化的orm框架)： 
–易于学习，几乎消除了所有的JDBC代码； 
–原生sql存在Xml文件中，便于管理； 
–解除sql与程序代码的耦合； 
–支持对象关系映射； 
–支持编写动态sql，比如一些条件查询； 
–对JDBC进行封装。
```

### 3.架构

![1528073023791](img\1528073023791.png)

```xml
1、	mybatis配置
	SqlMapConfig.xml，此文件作为mybatis的全局配置文件，配置了mybatis的运行环境等信息。
	mapper.xml文件即sql映射文件，配置了操作数据库的sql语句。此文件需要在SqlMapConfig.xml中加载。

2、	通过mybatis环境等配置信息构造SqlSessionFactory即会话工厂

3、	由会话工厂创建sqlSession即会话，操作数据库需要通过sqlSession进行。

4、	mybatis底层自定义了Executor执行器接口操作数据库，Executor接口有两个实现，一个是基本执行器、一个是	 缓存执行器。

5、	Mapped Statement也是mybatis一个底层封装对象，它包装了mybatis配置信息及sql映射信息等。mapper.xml	  文件中一个sql对应一个Mapped Statement对象，sql的id即是Mapped statement的id。

6、	Mapped Statement对sql执行输入参数进行定义，包括HashMap、基本类型、pojo，Executor通过Mapped 	Statement在执行sql前将输入的java对象映射至sql中，输入参数映射就是jdbc编程中对preparedStatement设	置参数。

7、	Mapped Statement对sql执行输出结果进行定义，包括HashMap、基本类型、pojo，Executor通过Mapped 	Statement在执行sql后将输出结果映射至java对象中，输出结果映射过程相当于jdbc编程中对结果的解析处理过程。

```



### 4.下载使用

> mybaits的代码由github.com管理，

地址：https://github.com/mybatis/mybatis-3/releases



## 二、入门程序

```xml
基本步骤:
	  1.创建项目导入相关的jar包（核心包，依赖包，数据库驱动包）
      2.创建mybatis核心的xml配置文件
      3.单个的sqlmapper的xml文件，必须被核心文件加载
      4.创建pojo的java对象和sql语句
      5.测试程序
```

### 1.步骤一

创建项目，并导入相关的jar包

mybaits核心包；

数据库启动包;

```xml
		<!-- 添加mybatis核心配置文件 -->
		<dependency>
			<groupId>org.mybatis</groupId>
			<artifactId>mybatis</artifactId>
			<version>3.2.7</version>
		</dependency>
		
		
		<!-- 添加数据库驱动包 -->
		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
			<version>5.1.39</version>
		</dependency>

         <!-- junit单元测试 -->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>

```

### 2.步骤二

在resources目录下创建mybaits核心配置文件。

SqlMapConfig.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
	<!-- 和spring整合后 environments配置将废除 -->
	<environments default="development">
		<environment id="development">
			<!-- 使用jdbc事务管理 或者JTA事务管理 -->
			<transactionManager type="JDBC" />
			<!-- 数据库连接池 第三方组件：c3p0 -->
			<dataSource type="POOLED">
				<property name="driver" value="com.mysql.jdbc.Driver" />
				<property name="url" value="jdbc:mysql://localhost:3306/bj1801" />
				<property name="username" value="root" />
				<property name="password" value="root" />
			</dataSource>
		</environment>
	</environments>
	<mappers>
		<mapper resource="UserMapper.xml" />
	</mappers>
</configuration>
```

注：重点关注\<dataSource type="POOLED">的type属性、其有三种取值： 

- POOLED：使用Mybatis自带的数据库连接池来管理数据库连接
- UNPOOLED：不使用任何数据库连接池来管理数据库连接
- JNDI：jndi形式使用数据库连接、主要用于项目正常使用的时候



### 3.步骤三 

创建对应的mapper文件，用来存放对应的sql语句

#### a.创建Users.xml文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="test">
 <!--sql语句 -->
</mapper>
```

namespace ：命名空间(可以理解为java中package包，用来区分对象)，用于隔离sql语句

在Users.xml中添加：半自动化，自己主要负责的是具体的sql的编写，添加到mapper中



#### b.编写对应的sql语句

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="test">
	<!--sql语句 -->
	<!--sql语句 -->
	<!-- 查询所有的用户 -->
	<select id="findUsers" resultType="com.hzit.bean.Users">
		select * from users
	</select>
	<!-- 根据id获取用户信息 -->
	<select id="findUserById" parameterType="int" resultType="com.hzit.bean.Users">
		select
		* from users where userid = #{userid}
	</select>
	<!-- 自定义条件查询用户列表 -->
	<select id="findUserByUsername" parameterType="java.lang.String"
		resultType="com.hzit.bean.Users">
		select * from users where userName like '%${value}%'
	</select>
</mapper>
```

parameterType：定义输入(参数类型)到sql中的映射类型，

\#{id}表示使用preparedstatement设置占位符号并将输入变量id传到sql。

resultType：定义结果(返回值)映射类型。



#### c.将Users.xml添加SqlMapConfig.xml

mybatis框架需要加载映射文件，将Users.xml添加在SqlMapConfig.xml，如下：

 ```xml
<mappers>
	<mapper resource="UserMapper.xml" />
</mappers>
 ```

该节点放在\<environments>节点后面，和该节点是同辈节点。



### 4.步骤四

#### a.sql语句

```sql
CREATE TABLE `users` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `userName` varchar(255) DEFAULT NULL,
  `userPwd` varchar(255) DEFAULT NULL,
  `userAge` int(11) DEFAULT NULL,
  `userSex` varchar(255) DEFAULT NULL,
  `userAddr` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;
```

#### b.实体类

```java
public class Users {
	pricom.hzit.bean.Usersvate Integer userId;// ID数据库自增
	private String userName;
	private String userPwd;
	private Integer userAge;
	private String userSex;
	private String addr;
	
    //get and set
}
```

### 5.步骤五

测试

```java
@Test
	public void test1() throws Exception {
		// 会话工厂
		SqlSessionFactory sqlSessionFactory = null;
		// 配置文件
		String resource = "SqlMapConfig.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		// 使用SqlSessionFactoryBuilder从xml配置文件中创建SqlSessionFactory
		sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
		SqlSession sqlSession = null;
		try {
			// 创建数据库会话实例sqlSession
			sqlSession = sqlSessionFactory.openSession();
			// 查询单个记录，根据用户id查询用户信息
			Users user = sqlSession.selectOne("test.findUserById", 3);
			// 输出用户信息
			System.out.println(user);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (sqlSession != null) {
				sqlSession.close();
			}
		}
	}
```

输出结果:

```java
Users [userId=3, userName=小花, userPwd=123, userAge=12, userSex=m, addr=null]
```



```java
常见参数
#{}表示一个占位符号，通过#{}可以实现preparedStatement向占位符中设置值。
	自动进行java类型和jdbc类型转换；
	#{}可以有效防止sql注入。 
	#{}可以接收简单类型值或pojo属性值。 
	如果parameterType传输单个简单类型值，#{}括号中可以是value或其它名称。p

${}表示拼接sql串，通过${}可以将parameterType 传入的内容拼接在sql中且不进行jdbc类型转换，
	${}可以接收简单类型值或pojo属性值，
	如果parameterType传输单个简单类型值，${}括号中只能是value。

parameterType：指定输入参数类型，mybatis通过ognl从输入对象中获取参数值拼接在sql中。
resultType：指定输出结果类型，mybatis将sql查询结果的一行记录数据映射为resultType指定类型的对象。

selectOne:查询一条记录，如果使用selectOne查询多条记录则抛出异常：
org.apache.ibatis.exceptions.TooManyResultsException: Expected one result (or null) to be returned by selectOne(), but found: 3
	at org.apache.ibatis.session.defaults.DefaultSqlSession.selectOne(DefaultSqlSession.java:70)

 selectList:可以查询一条或多条记录。
```



## 三、操作数据

1.为了方便演示使用junit进行测试。首先第一步需要导入junit相对应的jar包。上面已经导入

2.mybaits所有的操作都需要得到SqlSession对象。

```java
	SqlSession sqlSession = null; //全局变量
	@Before
	public void init() throws Exception {
		// 会话工厂
		SqlSessionFactory sqlSessionFactory = null;
		// 配置文件
		String resource = "SqlMapConfig.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		// 使用SqlSessionFactoryBuilder从xml配置文件中创建SqlSessionFactory
		sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
		// 创建数据库会话实例sqlSession
		sqlSession = sqlSessionFactory.openSession();
	}
```

@Before注解，表示每次@Test 之前都会调用该方法，这么表示每次都会去创建 sqlSession，所有后面可以直接使用



### 1.删除数据

a.在UserMapper.xml中添加sql语句：

```xml
<!-- 删除用户 -->
<delete id="deleteUsersById" parameterType="int">
	delete from Users where userid = #{userid}
</delete>
```

b.测试类

```java
//删除
@Test
public void test01() {
    //test.deleteUsersById 调用对应sql   13:实参
	int row = sqlSession.delete("test.deleteUsersById", 13);
	System.out.println(row);
	sqlSession.commit();// 增删改需要提交事务
}
```



### 2.修改数据

a.sql语句

```xml
<!-- 更改用户 -->
	<update id="updateUser" parameterType="com.hzit.bean.Users">
		update Users set
		userName=#{userName},userPwd=#{userPwd},userAge=#{userAge},userSex=#		{userSex},userAddr=#{addr}
		where
		userId=#{userId}
	</update>
```

b.测试语句

```java
// 修改
	@Test
	public void test02() {

		// 可以去获取一个对象 也可以new一个新对象
		Users users = sqlSession.selectOne("test.findUserById", 4);
		System.out.println("修改之前:" + users);

		// 修改
		users.setUserName("赵子龙他哥");
		sqlSession.update("test.updateUser", users);
		sqlSession.commit();

		Users newUser = sqlSession.selectOne("test.findUserById", 4);
		System.out.println("修改之后:" + newUser);

	}
```

c.结果

```java
修改之前:Users [userId=4, userName=赵子龙, userPwd=123, userAge=88, userSex=m, addr=null]
修改之后:Users [userId=4, userName=赵子龙他哥, userPwd=123, userAge=88, userSex=m, addr=null]
```

### 3.添加数据

#### 3.1普通添加(不考虑主键)

a.sql语句

```xml
<!-- 1. 添加普通对象，不考虑id自动增长: -->
	<insert id="addUser" parameterType="com.hzit.bean.Users">
		insert into Users
		values(#{userId},#{userName},#{userPwd},#{userAge},#{userSex},#{addr})
	</insert>

```

b.测试

```java
// 添加1
	@Test
	public void test03() {

		Users users = new Users();
		users.setUserId(1001);
		users.setUserName("来耍");
		users.setUserPwd("123");
		users.setUserSex("m");
		users.setUserAge(20);
		users.setAddr("广东深圳");

		int row = sqlSession.insert("test.addUser", users);
		System.out.println(row);
		sqlSession.commit();
	}
```

c.结果

![1527922616310](img\1527922616310.png)



#### 3.2使用数据库自增主键

a.sql语句

```xml
	<!-- 2. 添加普通对象，使用mysql自动增长: -->
	<insert id="addUserByKey" parameterType="com.hzit.bean.Users">
		insert into
		Users(userName,userPwd,userAge,userSex,userAddr)
		values(#{userName},#{userPwd},#{userAge},#{userSex},#{addr})
	</insert>

```

b.测试

```java
@Test
	public void test04() {
		Users users = new Users();
		users.setUserName("旺财");
		users.setUserPwd("123");
		users.setUserSex("m");
		users.setUserAge(20);
		users.setAddr("广东深圳");

		int row = sqlSession.insert("test.addUserByKey", users);
		System.out.println(row);
		sqlSession.commit();
	}
```



#### 3.3使用程序自增主键

a.sql语句

```xml
<!-- 3.通过程序生成key,支持数据库自增，也支持Oracle序列 -->
	<insert id="addUserByGenKey" parameterType="com.hzit.bean.Users">
		<selectKey keyProperty="userId" resultType="int" order="BEFORE">
			SELECT
			LAST_INSERT_ID()
		</selectKey>

		insert into
		Users(userId,userName,userPwd,userAge,userSex,userAddr)
		values(#{userId},#{userName},#{userPwd},#{userAge},#{userSex},#{addr})
	</insert>
```

b.测试

```java
@Test
	public void test05() {
		Users users = new Users();
		users.setUserName("赵大锤");
		users.setUserPwd("123");
		users.setUserSex("m");
		users.setUserAge(20);
		users.setAddr("广东深圳");

		int row = sqlSession.insert("test.addUserByGenKey", users);
		System.out.println(row);
		sqlSession.commit();
	}

```



#### 3.4相关参数

> SelectKey在Mybatis中为了解决Insert数据时不支持主键自动生成的问题，他可以随意的设置生成主键的方式

| 属性          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| keyProperty   | selectKey 语句结果应该被设置的目标属性                       |
| resultType    | 结果的类型。MyBatis 通常可以算出来,但是写上也没有.<br/>MyBatis 允许任何简单类型用作主键的类型,包括字符串 |
| statementType | 和前面的相 同,MyBatis 支持 STATEMENT ,PREPARED 和<br/>CALLABLE 语句的映射类型,分别代表 PreparedStatement 和CallableStatement 类型 |
| SelectKey     | 需要注意order属性，像Mysql一类支持自动增长类型的数据库中，<br/>order需要设置为after才会取到正确的值。 <br/> 像Oracle这样取序列的情况，需要设置为before，否则会报错 > |





## 四、log4j日志文件

Mybatis使用log4j作为默认的日志。可以在项目中添加log4j信息

### a.  第一步导入相应的log4j需要的jar包信息

```xml
<!-- log4j日志文件 -->
       <dependency>
           <groupId>log4j</groupId>
           <artifactId>log4j</artifactId>
           <version>1.2.17</version>
       </dependency>
```



### b.  第二步，创建log4j.properties配置文件，

注意：名称不能改变，必须log4j.properties

​      必须放在resource目录下面

log4j.properties配置文件信息：

```xml
# Global logging configuration 开发时候建议使用 debug
log4j.rootLogger=DEBUG, stdout
# Console output...
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%5p [%t] - %m%n
```



#### 