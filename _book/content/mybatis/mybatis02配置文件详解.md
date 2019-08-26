## 一、配置文件详解



### 1.SqlMapConfig.xml配置文件

![1528038006912](img\1528038006912.png)



#### 1.1properties（属性） 

SqlMapConfig.xml可以引用java属性文件中的配置信息如下,在resource下定义db.properties文件.

```xml
jdbc.driver=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/bj1801?useUnicode=true&characterEncoding=utf8
jdbc.username=root
jdbc.password=root
```

以上定义了文件内容，可以直接在配置文件中进行引用。

SqlMapConfig.xml引用如下：

```xml
<properties resource="db.properties"/>
<environmentsdefault="development">
	<environmentid="development">
		<transactionManagertype="JDBC"/>
		<dataSourcetype="POOLED">
			<propertyname="driver"value="${jdbc.driver}"/>
			<propertyname="url"value="${jdbc.url}"/>
			<propertyname="username"value="${jdbc.username}"/>
			<propertyname="password"value="${jdbc.password}"/>
		</dataSource>
	</environment>
</environments>

```



#### 1.2settings（配置）

mybatis全局配置参数，全局参数将会影响mybatis的运行行为。 

![1528038302321](img\1528038302321.png)

![1528038362802](img\1528038362802.png)

![1528038379315](img\1528038379315.png)



#### 1.3typeAliases（类型别名）

可以设置单个类，或者包的别名。设置完之后可以直接使用别名，代替全路径。在SqlMapConfig.xml中配置： 

```xml
<typeAliases>
	<!--单个别名定义 -->
	<typeAliasalias="Users"type="com.hzit.bean.Users"/>
	<!--批量别名定义，扫描整个包下的类，别名为类名（首字母大写或小写都可以） -->
	<packagename=" com.hzit.bean"/>
</typeAliases>
```





#### 1.4mappers（映射器）

Mapper配置的几种方法：

#### a.resource方式\<mapper resource=" " />

使用相对于类路径的资源

```xml
如：<mapper resource="sqlmap/User.xml" />
```



#### b.url方式\<mapper url=" " \/>

使用完全限定路径

```xml
如：<mapper url="file:///D:\workspace_spingmvc\mybatis_01\config\sqlmap\User.xml" />
```

#### c.class方式\<mapper class=" " />

使用mapper接口类路径

```xml
如：<mapper class="com.hzit.dao.UserMapper"/>
```

**注意：此种方法要求mapper接口名称和mapper映射文件名称相同，且放在同一个目录中。**

 

#### d.package 方式\<package name=""/>

注册指定包下的所有mapper接口

```xml
<package name="com.hzit.dao"/>
```

注意：此种方法要求mapper接口名称和mapper映射文件名称相同，且放在同一个目录中。



### 2.xxxMapper.xml配置文件

SQL 映射文件结构：

```xml
-cache -  配置给定命名空间的缓存。 
-cache-ref –  从其他命名空间引用缓存配置。 
-resultMap  –  最复杂，也是最有力量的元素，用来描述如何从数据库结果集中来加载对象。 (重点)
-sql –  可以重用的 SQL 块，也可以被其他语句引用。 
-insert –  映射插入语句 
-update –  映射更新语句 
-delete –  映射删除语句 
-select –  映射查询语-
```

#### 2.1Select中的属性

| **属性**      | **描述**                                                     |
| ------------- | ------------------------------------------------------------ |
| id            | 在命名空间中唯一的标识符，可以被用于引用   该语句。          |
| parameterType | 将会传入该语句的参数类的完全限定名或别名。                   |
| resultType    | 从该语句中返回的期望类型的类的完全限定名   或别名。          |
| resultMap     | 命名引用外部的resultMap。                                    |
| flushCache    | 将其设置为true，无论语句什么时候被调用，   都会导致缓存被清空。默认值为false |
| useCache      | 将其设置为true，将会导致本条语句的结果   被缓存。默认值为true。 |
| timeout       | 该设置驱动程序等待数据库返回请求结果。                       |
| fetchSize     | 暗示驱动程序每次批量返回的结果行数。   默认不设置（驱动自行处理） |
| statementType | STATEMENT、PREPARED或CALLABLE的   一种                       |
| resultSetType | FORWARD_ONLY\|SCROLL_SENSITIVE\|   SCROLL_INSENSITIVE中的一种。默认不设置   （驱动自行处理）。 |

#### 2.2 insert、update和delete

| **属性**         | **描述**                                                     |
| ---------------- | ------------------------------------------------------------ |
| id               | 在命名空间中唯一的标识符，可以被用于引用该语句。             |
| parameterType    | 将会传入该语句的参数类的完全限定名或别名。                   |
| flushCache       | 将其设置为true，无论语句什么时候被调用，都会   导致缓存被清空。默认值为false。 |
| timeout          | 该设置驱动程序等待数据库返回请求结果，并抛出   异常时间的最大等待值。默认不设置（驱动自行处理）。 |
| statementType    | STATEMENT、PREPARED或CALLABLE的一种。   用于方便MyBatis选择使用Statement、   PreparedStatement或CallableStatement。   默认值为PREPARED |
| useGeneratedKeys | （仅对insert有用）通知MyBatis使用JDBC的   getGeneratedKeys方法来取出由数据（如MySQL   和SQL Server的数据库管理系统的自动递增字段）   内部生成的主键。默认值为false。 |
| keyProperty      | （仅对insert有用）标记一个属性，MyBatis会通过   getGeneratedKeys或insert语句的selectKey子元素设   置其值。默认不设置。 |

#### 2.3sql片段

可以将XXXMapper.xml文件中的共性部分抽取出来。然后进行引用。

```xml
	<!-- 定义sql片段 -->
	<sql id="deptCol">
		deptno,dname,loc
	</sql>

	<select id="findDeptList" resultType="Dept">
		select
		<!-- 引入指定的sql片段 -->
		<include refid="deptCol" />
		from dept
	</select> 
```

#### 2.4resultMap(明天讲)