

## 一、dao层Mapper动态代理开发

以上是通过手动的去调用对应的方法，例如selectOne(),selectList()等等。这种方式需要自己去实现代码。

Mapper接口开发方法只需要程序员编写Mapper接口（相当于Dao接口），由Mybatis框架根据接口定义创建接口的动态代理对象

Mapper接口开发需要遵循以下规范：

```xml
1、	Mapper.xml文件中的namespace与mapper接口的类路径相同。
2、	Mapper接口方法名和Mapper.xml中定义的每个statement的id相同
3、	Mapper接口方法的输入参数类型和mapper.xml中定义的每个sql 的parameterType的类型相同
4、	Mapper接口方法的输出参数类型和mapper.xml中定义的每个sql的resultType的类型相同
```

### 4.1定义dao层接口

``` java
public interface UsersMapper {
	public Users findUserByid(int uid);
	public List<Users> findUserList();
	public List<Users> findUserByUsername(String uname);
	public int addUsers(Users users);
	public int updateUser(Users users);
}
```



### 4.2定义对应sql语句

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.hzit.mapper.UsersMapp">

	<!-- 通过指定ID查找对应数据 -->
	<select id="findUserByid" parameterType="int" resultType="com.hzit.bean.Users">
		select
		uId,uName,uPwd,phone uPhone,address
		from users where uId=#{uId}
	</select>

	<!-- 查询所有的数据 -->
	<select id="findUserList" resultType="com.hzit.bean.Users">
		select * from users
	</select>

	<!-- 自定义条件查询用户列表 -->
	<select id="findUserByUsername" parameterType="java.lang.String"
		resultType="com.hzit.bean.Users">
		select * from users where uName like '%${value}%'
	</select>

	<!-- 添加 使用mysql数据库自己维护主键 useGeneratedKeys:true 表示开启自动生成 keyProperty:主键属性值 -->
	<insert id="addUsers" parameterType="com.hzit.bean.Users" useGeneratedKeys="true"
		keyProperty="uId">
		insert into users(uName,uPwd,phone,address)
		values(#{uName},#{uPwd},#{uPhone},#{address})
	</insert>
</mapper>

```

### 4.3测试代码

```java
public static void main(String[] args) throws Exception {
		// 会话工厂
		SqlSessionFactory sqlSessionFactory = null;
		// 配置文件
		String resource = "SqlMapConfig.xml";
		InputStream inputStream = Resources.getResourceAsStream(resource);
		sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
		SqlSession sqlSession = null;
		sqlSession = sqlSessionFactory.openSession(true);
		// 获取 mapper代理对象
		UsersMapp mapper = sqlSession.getMapper(UsersMapp.class);
		
		System.out.println(">>>获取所有信息");
		List<Users> userList = mapper.findUserList();
		System.out.println(userList);

		System.out.println(">>>通过ID获取信息");
		Users users = mapper.finUserByid(105);
		System.out.println(users);

		System.out.println(">>>通过uName模糊查询");
		List<Users> findUserByUsername = mapper.findUserByUsername("zhang");
		System.out.println(findUserByUsername);

		System.out.println(">>>添加数据,ID自动增长");
		Users users2 = new Users();
		users2.setuName("hello");
		users2.setuPwd("8888");
		users2.setuPhone("1881123");
		users2.setAddress("china");
		int addUsers = mapper.addUsers(users2);
		System.out.println(addUsers);

	}
```

以上代码必须符号以上四种规则，否则会报错。
