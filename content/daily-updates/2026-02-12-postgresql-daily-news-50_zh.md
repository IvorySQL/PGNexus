# PostgreSQL 每日更新#50 2026-02-12







## **热门 Hacker 邮件讨论精选**

### **[pg\_upgrade: 尽可能转移 pg\_largeobject\_metadata 的文件](https://www.postgresql.org/message-id/aYzuAz_ITUpd9ZvH@nathan)**
Nathan Bossart正在改进pg_upgrade，以便在可能的情况下传输pg_largeobject_metadata文件，而不是使用较慢的SQL命令。当前实现仅适用于从PostgreSQL v12及更新版本的升级，因为在较旧版本中，pg_largeobject_metadata是用WITH OIDS创建的，使得OID列被隐藏且不包含在转储中。Andres Freund对此推理提出质疑，指出OID列可以明确包含在输出中。Nathan承认getTableAttrs()在较旧版本上不会获取OID列，但建议可以通过调整针对v12之前版本二进制升级的查询来解决这个问题。Nathan现在已经实现了一个比最初预期更复杂的解决方案，以允许在从v12之前版本进行二进制升级时对pg_largeobject_metadata进行COPY操作。

参与者:
andres@anarazel.de, hannuk@google.com, michael@paquier.xyz, nathandbossart@gmail.com, nitinmotiani@google.com, tgl@sss.pgh.pa.us

### **[密码过期警告](https://www.postgresql.org/message-id/79a7e931-d88f-420a-97e0-3c1e517a191e@darold.net)**
Nathan Bossart已提交了一个与PostgreSQL密码过期警告相关的补丁。讨论涉及多位参与者，他们对实现进行了审查并提供了反馈。Gilles Darold对Nathan在该功能上的工作表示感谢。此次提交似乎解决了向用户警告即将到来的密码过期的功能，这是数据库管理中的一个重要安全功能。该补丁经过了PostgreSQL开发的典型审查和讨论过程，然后被提交到代码库中。

参与者:
andrew@dunslane.net, euler@eulerto.com, gilles@darold.net, japinli@hotmail.com, li.evan.chao@gmail.com, liuxh.zj.cn@gmail.com, nathandbossart@gmail.com, niushiji@gmail.com, peter@eisentraut.org, shiyuefei1004@gmail.com, tgl@sss.pgh.pa.us, tsinghualucky912@foxmail.com, zsolt.parragi@percona.com

### **[小清理：将 ProcStructLock 移动到 ProcGlobal 结构体](https://www.postgresql.org/message-id/D70D9385-7433-4BF6-AB1C-928E37C7F07E@gmail.com)**
Heikki Linnakangas提议将ProcStructLock自旋锁从独立的共享内存区域移动到ProcGlobal结构体中以获得更好的缓存局部性，认为独立分配是出于历史原因。Chao Li审查了补丁并发现重定位的自旋锁缺少SpinLockInit调用。Ashutosh Bapat确认这是必需的，并指出该更改与其他嵌入自旋锁的共享结构保持一致。Tom Lane解释说这个bug被忽略是因为现代平台将自旋锁初始化为零而共享内存以零开始，但警告这会造成测试空白，因为旧的检测方法已经消失。Heikki修复了初始化问题并推送了更改。讨论随后转向接受全零作为有效自旋锁初始化是否安全，Tom对平台假设表示担忧。

参与者:
ashutosh.bapat.oss@gmail.com, hlinnaka@iki.fi, li.evan.chao@gmail.com, tgl@sss.pgh.pa.us

### **[POC: 在不重启服务器的情况下，当 wal\_level = 'replica' 时启用逻辑解码](https://www.postgresql.org/message-id/CAA4eK1Kg5zO-BX_bTkfWJOoQ=z69mKbQbeFCVEwMaqNCP=wD7g@mail.gmail.com)**
讨论围绕一个提案展开，该提案允许PostgreSQL在创建逻辑复制槽时动态地将wal_level从'replica'更改为'logical'，而无需重启服务器。Matthias van de Meent担心具有REPLICATION权限的用户可能有效控制wal_level，通过增加WAL量和CPU消耗对所有后端造成系统范围的性能开销。Amit Kapila反驳说REPLICATION权限用户已经拥有重大的破坏性权力，包括通过磁盘耗尽和xmin范围管理导致拒绝服务和性能下降的能力。他认为允许这些用户切换逻辑日志记录是对其现有可信角色的增量添加。争论的焦点是动态wal_level变化的性能影响是否代表了一种根本上新的系统范围风险，还是现有REPLICATION权限能力的扩展。

参与者:
amit.kapila16@gmail.com, ashutosh.bapat.oss@gmail.com, bertranddrouvot.pg@gmail.com, boekewurm+postgres@gmail.com, kuroda.hayato@fujitsu.com, sawada.mshk@gmail.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com

### **[在发布中跳过模式更改](https://www.postgresql.org/message-id/CAJpy0uD5nVQ9vasP+UP=1ySdG_M64iBXVuzu1CT7b7b-KdbdPA@mail.gmail.com)**
讨论重点关注PostgreSQL逻辑复制中带有EXCEPT列表的发布处理。主要争论围绕是否允许订阅者合并具有冲突EXCEPT子句的多个发布。Shveta和vignesh主张限制这种场景以保持实现简单，特别是在处理复杂分区层次结构时，不同发布排除不同分区且具有不同的publish_via_partition_root设置。他们建议当合并具有不同EXCEPT列表的多个发布时发出错误，同时仍支持一个发布排除某个表而另一个明确包含该表的情况。David Johnston建议对check_publications_except_list函数进行优化，指出由于发布名称是唯一的，DISTINCT是不必要的，对于单个发布可以完全跳过检查。团队同意在下一个补丁版本中实现这些优化。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[通用计划和"初始"修剪](https://www.postgresql.org/message-id/CA+HiwqGn38DsKgMYKWZ6jyv3_oqCSB0j+XucTjNM0S+BFsQpVA@mail.gmail.com)**
Amit Langote发布了解决PostgreSQL通用缓存计划中分区修剪问题的v5补丁系列。该系列引入了ExecutorPrep()，将权限检查、范围表初始化和初始分区修剪从InitPlan()中提取到一个独立的可调用助手函数中。这使得GetCachedPlan()中的修剪感知锁定成为可能，只锁定存活的分区而不是所有子分区。与v4相比的关键变更包括移除ExecPrep结构体、移动PARAM_EXEC设置以及添加全面测试。该方法涉及在计划缓存验证期间而非执行期间运行修剪，这引发了对快照语义和EState内存生命周期管理的担忧。该系列包含六个补丁，涵盖重构、ExecutorPrep引入、测试、修剪感知锁定、SQL函数支持和并行工作进程优化。Amit寻求特别是在执行器生命周期和计划缓存内部机制方面的审查。

参与者:
alvherre@alvh.no-ip.org, amitlangote09@gmail.com, andres@anarazel.de, daniel@yesql.se, dgrowleyml@gmail.com, exclusion@gmail.com, li.evan.chao@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us, thom@linux.com, tndrwang@gmail.com, tomas@vondra.me



## **行业新闻**

### **[Elon Musk暗示xAI的一系列离职是被迫的，而非主动的](https://techcrunch.com/2026/02/11/senior-engineers-including-co-founders-exit-xai-amid-controversy?utm_campaign=daily_pm)**
至少有九名工程师，包括两名联合创始人，在过去一周内宣布离开xAI，引发了在线猜测，并在争议不断的情况下对Musk的AI公司的稳定性提出了质疑。这些离职发生在公司面临严格审查的时期，Elon Musk暗示这些离职是由公司主动发起的，而不是员工的自愿离职。这波高级人员离职潮对xAI来说是一个重大挑战，因为它继续在快速发展的人工智能领域中竞争。