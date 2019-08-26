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



