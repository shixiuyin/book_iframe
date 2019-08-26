

## 一、缓存

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











