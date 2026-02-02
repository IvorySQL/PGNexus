---
layout: post
title: PostgreSQL Daily News 2026-01-27
---

# PostgreSQL Daily News#29 2026-01-27



## **PostgreSQL Articles - PostgreSQL 技术博客**

### **[Strategies for upgrading Amazon Aurora PostgreSQL and Amazon RDS for PostgreSQL from version 13](https://aws.amazon.com/blogs/database/strategies-for-upgrading-amazon-aurora-postgresql-and-amazon-rds-for-postgresql-from-version-13/)**
This AWS blog post outlines upgrade strategies for PostgreSQL version 13 on Amazon Aurora and RDS before standard support ends February 28, 2026. It details benefits of upgrading to newer versions including performance enhancements like vacuum emergency mode, improved I/O performance, and memory efficiency improvements. Key features in newer versions include advanced monitoring tools like pg_stat_io, logical replication improvements with failover support, developer experience enhancements like JSONB subscripting, and security improvements. The post highlights breaking changes in system catalog views and configuration parameters between versions. Four upgrade strategies are presented: in-place upgrades, blue/green deployments, logical replication, and AWS DMS. For organizations unable to upgrade immediately, AWS offers Extended Support for up to three years with additional costs.

这篇 AWS 博客文章概述了在标准支持于 2026 年 2 月 28 日结束之前，为 Amazon Aurora 和 RDS 上的 PostgreSQL 版本 13 制定升级策略。文章详细介绍了升级到新版本的好处，包括性能增强，如 vacuum 紧急模式、改进的 I/O 性能和内存效率提升。新版本的关键功能包括高级监控工具如 pg_stat_io、支持故障转移的逻辑复制改进、开发者体验增强如 JSONB 下标访问，以及安全改进。文章重点介绍了版本间系统目录视图和配置参数的重大变更。提出了四种升级策略：就地升级、蓝绿部署、逻辑复制和 AWS DMS。对于无法立即升级的组织，AWS 提供最多三年的 Extended Support，但需额外付费。

`Abhimanyu Tomar`

### **[Phenomenology through PostgreSQL Documentation](https://www.cybertec-postgresql.com/en/phenomenology-through-postgresql-documentation/)**
The author explores how PostgreSQL documentation excels by applying phenomenological principles - the idea that understanding depends on perspective and context. Unlike documentation that only describes current behavior, PostgreSQL's docs preserve the design context and reasoning behind features. Contributors document not just what they implemented, but why changes were made and under what constraints. This approach creates a historical record that helps developers understand intent rather than just functionality. The author contrasts this with API documentation like Stripe's, noting PostgreSQL serves as a foundational building block requiring deeper contextual understanding. The documentation succeeds because the people experiencing problems, designing solutions, and documenting them often overlap, creating grounded explanations rooted in actual engineering decisions rather than retrospective descriptions.

作者探讨了PostgreSQL文档如何通过应用现象学原理而表现出色——即理解取决于视角和背景的观点。与仅描述当前行为的文档不同，PostgreSQL的文档保留了功能背后的设计背景和推理过程。贡献者不仅记录他们实现的内容，还记录为什么进行更改以及在什么约束条件下进行。这种方法创建了历史记录，帮助开发者理解意图而不仅仅是功能。作者将此与Stripe等API文档进行对比，指出PostgreSQL作为基础构建块需要更深层的背景理解。该文档之所以成功，是因为遇到问题、设计解决方案和记录文档的人员经常重叠，创造了植根于实际工程决策而非回顾性描述的扎实解释。

`Abhisek Goswami`



## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[Remaining dependency on setlocale\(\)](https://www.postgresql.org/message-id/94a8ba10943adb3cca0a3718e74a090cacdde241.camel@j-davis.com)**
Jeff Davis has committed a patch addressing remaining dependencies on setlocale() in PostgreSQL. The patch was specifically backported to REL_18_STABLE branch only, as the master branch was already fine. While the main commitfest entry has been closed, several loose ends remain unresolved. These include handling strerror and gettext functions, which could potentially be wrapped with uselocale() calls, with special setlocale() mode for Windows and uncertain approach for NetBSD. Additionally, pg_strcasecmp() is still widely used in the backend and should be replaced with either an ASCII variant or database collation-based implementation. Various places in the code continue relying on functions like isalpha() for simple parsing operations, such as in ltree functionality.

Jeff Davis已提交了一个解决PostgreSQL中剩余setlocale()依赖的补丁。该补丁仅回移植到REL_18_STABLE分支，因为master分支已经正常。虽然主要的commitfest条目已关闭，但仍有几个未解决的问题。这些包括处理strerror和gettext函数，可能需要用uselocale()调用包装，Windows使用特殊的setlocale()模式，NetBSD的处理方式尚不确定。此外，pg_strcasecmp()在后端仍被广泛使用，应该替换为ASCII变体或基于数据库排序规则的实现。代码中的各个地方仍然依赖isalpha()等函数进行简单解析操作，例如在ltree功能中。

Participants - 参与者:
* a.kozhemyakin@postgrespro.ru
* li.evan.chao@gmail.com
* peter@eisentraut.org
* pgsql@j-davis.com
* tgl@sss.pgh.pa.us
* thomas.munro@gmail.com

### **[unnecessary executor overheads around seqscans](https://www.postgresql.org/message-id/qugnsw6pkl3ab4ttke3b2kwiq3kur46xegx5omuvv6z3vwcznh@562ojlz2oqia)**
Andres Freund initiated a discussion about optimizing PostgreSQL executor overhead in sequential scans. He identified multiple performance bottlenecks: repeated fetching of variables in SeqNext() during ExecScanExtended loops, unnecessary checkXidAlive checks in table_scan_getnextslot(), and redundant setting of econtext->ecxt_scantuple. Heikki Linnakangas suggested restructuring ExecScanExtended() or passing parameters as arguments to callbacks. Andres prototyped passing parameters to callbacks and found it effective. Dilip Kumar proposed moving checkXidAlive checks from table_scan_getnextslot() to table_beginscan*() functions, providing a patch with table_scan_begin_wrapper(). Andres agreed but suggested implementing the wrapper in tableam.h for potential inlining benefits. The discussion also covered deeper optimization opportunities including expression evaluation overhead, memory context switching costs, and function call interface improvements. Amit Langote tested patches but saw minimal performance differences in VM testing.

Andres Freund发起了关于优化PostgreSQL执行器在顺序扫描中开销的讨论。他识别了多个性能瓶颈：在ExecScanExtended循环期间SeqNext()中重复获取变量、table_scan_getnextslot()中不必要的checkXidAlive检查，以及冗余设置econtext->ecxt_scantuple。Heikki Linnakangas建议重构ExecScanExtended()或将参数作为参数传递给回调函数。Andres原型化了向回调函数传递参数的方法并发现其有效。Dilip Kumar提议将checkXidAlive检查从table_scan_getnextslot()移至table_beginscan*()函数，并提供了带有table_scan_begin_wrapper()的补丁。Andres同意但建议在tableam.h中实现包装器以获得潜在的内联优势。讨论还涵盖了更深层的优化机会，包括表达式评估开销、内存上下文切换成本和函数调用接口改进。Amit Langote测试了补丁，但在VM测试中看到的性能差异微小。

Participants - 参与者:
* amit.kapila16@gmail.com
* amitlangote09@gmail.com
* andres@anarazel.de
* dgrowleyml@gmail.com
* dilipbalaut@gmail.com
* hlinnaka@iki.fi

### **[pgsql: Prevent invalidation of newly synced replication slots\.](https://www.postgresql.org/message-id/CA+TgmobdVhO0ckZfsBZ0wqDO4qHVCwZZx8sf=EinafvUam-dsQ@mail.gmail.com)**
A recent commit by Amit Kapila to prevent invalidation of newly synced replication slots has broken CI on Windows platforms. Robert Haas reported that the test 046_checkpoint_logical_slot_standby.pl fails with a "Permission denied" error when trying to rename "backup_label" to "backup_label.old" during standby startup. The failure occurs specifically on Windows Server 2022 with VS 2019 using Meson & ninja build. Tom Lane noted that the buildfarm appears unaffected because Windows buildfarm animals don't run injection point tests, creating a blind spot in coverage. Investigation reveals the error involves a 13-second retry loop in pgrename(), suggesting another process has the backup_label file open, but the root cause remains unclear since the test code appears standard. Greg Burd offered to enable injection points on the unicorn buildfarm animal to provide Windows coverage. Despite debugging efforts including adding delays and verbose logging, developers haven't identified what's keeping the file locked on Windows.

Amit Kapila最近提交的一个防止新同步复制槽失效的commit在Windows平台上破坏了CI。Robert Haas报告说测试046_checkpoint_logical_slot_standby.pl在备用服务器启动期间尝试将"backup_label"重命名为"backup_label.old"时失败，出现"Permission denied"错误。这个失败特别发生在使用Meson & ninja构建的Windows Server 2022与VS 2019环境中。Tom Lane注意到buildfarm看起来没有受到影响，因为Windows buildfarm机器不运行注入点测试，这在覆盖范围上造成了盲点。调查显示错误涉及pgrename()中的13秒重试循环，表明另一个进程打开了backup_label文件，但根本原因仍不清楚，因为测试代码看起来很标准。Greg Burd提议在unicorn buildfarm机器上启用注入点以提供Windows覆盖。尽管进行了调试努力，包括添加延迟和详细日志记录，开发人员仍未确定是什么在Windows上保持文件锁定。

Participants - 参与者:
* akapila@postgresql.org
* amit.kapila16@gmail.com
* andres@anarazel.de
* dbryan.green@gmail.com
* greg@burd.me
* robertmhaas@gmail.com
* tgl@sss.pgh.pa.us
* thomas.munro@gmail.com

### **[Report bytes and transactions actually sent downtream](https://www.postgresql.org/message-id/okmdepbsub6toaplj4o5i5f4xa4ckeihfihbk5x7ebbijpzzyu@dpmhunl4pupq)**
Andres Freund reviews a patch for tracking bytes and transactions sent downstream in PostgreSQL logical replication. He suggests simplifying the initial implementation to only track sent bytes, which he considers the most useful statistic. He has concerns about the "filteredBytes" metric, calling it "bogus" because the output plugin size and ReorderBufferChangeSize() are only loosely related, making it difficult to interpret. For transaction tracking, he believes the implementation is at the wrong layer and advocates for explicit output plugin support to filter transactions earlier, avoiding costly tuple decoding and disk restoration for filtered transactions. He questions the utility of transaction counting since filtering typically occurs per-change rather than per-transaction, and suggests the current approach would break all existing output plugins.

Andres Freund审查了一个用于跟踪PostgreSQL逻辑复制中下游发送字节数和事务数的补丁。他建议简化初始实现，只跟踪发送的字节数，认为这是最有用的统计数据。他对"filteredBytes"指标表示担忧，称其为"虚假的"，因为输出插件大小与ReorderBufferChangeSize()只是松散相关，难以解释。对于事务跟踪，他认为实现层次有误，主张为输出插件提供明确支持来更早地过滤事务，避免对被过滤事务进行昂贵的元组解码和磁盘恢复操作。他质疑事务计数的实用性，因为过滤通常按变更而非按事务进行，并指出当前方法会破坏所有现有的输出插件。

Participants - 参与者:
* amit.kapila16@gmail.com
* andres@anarazel.de
* ashu.coek88@gmail.com
* ashutosh.bapat.oss@gmail.com
* bertranddrouvot.pg@gmail.com
* shveta.malik@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CALDaNm3kX=16L-72m13CqXL9uAiHURNZ+BLo-HfTEYHDFejj-A@mail.gmail.com)**
The discussion focuses on implementing EXCEPT functionality for partitioned tables in PostgreSQL publications. Three approaches are being evaluated: Approach 1 would exclude entire subtrees when a partitioned table is specified in EXCEPT; Approach 2 would introduce ONLY and '*' keywords to provide granular control over partition exclusion; Approach 3 would only allow root tables in EXCEPT clauses, rejecting partition specifications. The main challenge involves handling publish_via_partition_root scenarios where excluded partitions complicate table synchronization. vignesh C proposes a solution where excluded partitions are recorded in pg_publication_rel with an excluded flag, and tablesync workers construct UNION queries to copy only non-excluded partition data. This preserves publish_via_partition_root semantics while supporting selective partition exclusion. A patch implementing this approach has been provided for review.

讨论的焦点是在PostgreSQL发布中为分区表实现EXCEPT功能。正在评估三种方法：方法1在EXCEPT中指定分区表时会排除整个子树；方法2会引入ONLY和'*'关键字以提供对分区排除的细粒度控制；方法3只允许在EXCEPT子句中使用根表，拒绝分区规范。主要挑战涉及处理publish_via_partition_root场景，其中排除的分区使表同步复杂化。vignesh C提出了一个解决方案，将排除的分区记录在pg_publication_rel中并设置excluded标志，tablesync工作进程构造UNION查询以仅复制非排除分区的数据。这在支持选择性分区排除的同时保持了publish_via_partition_root的语义。已提供实现此方法的补丁供审查。

Participants - 参与者:
* 1518981153@qq.com
* amit.kapila16@gmail.com
* barwick@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* dilipbalaut@gmail.com
* houzj.fnst@fujitsu.com
* shlok.kyal.oss@gmail.com
* shveta.malik@gmail.com
* smithpb2250@gmail.com
* vignesh21@gmail.com

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CABRHmyvLPcx_K1T9Cwg4tFHiyh95fQU9tUhDwEFtvJiDsQDdaA@mail.gmail.com)**
Ajay Pal reported testing issues with pg_plan_advice v12 patch, presenting two cases where the advice didn't work as expected. The first involved a grouped hash join attempt where the planner showed "partially matched" because there was no join clause between dim1 and dim2 tables. Robert Haas clarified this is correct behavior - the planner cannot be forced to create arbitrary plans it wouldn't naturally consider. The second case involved multiple instances of the same table in subqueries with incorrect relation identifiers. Haas explained that relation identifiers must be based on aliases, not table names, as documented. He emphasized that pg_plan_advice is primarily a plan stability feature, not a tool for creating novel plans from scratch. Users should adapt generated plan advice rather than writing custom advice, as the optimizer may never have considered certain plan alternatives.

Ajay Pal 报告了 pg_plan_advice v12 补丁的测试问题，展示了两个建议未按预期工作的案例。第一个涉及分组哈希连接尝试，规划器显示"部分匹配"，因为 dim1 和 dim2 表之间没有连接子句。Robert Haas 澄清这是正确行为 - 规划器无法被强制创建它本来不会考虑的任意计划。第二个案例涉及子查询中同一表的多个实例，使用了错误的关系标识符。Haas 解释关系标识符必须基于别名而非表名，这在文档中有说明。他强调 pg_plan_advice 主要是计划稳定性功能，而非从零开始创建新颖计划的工具。用户应该调整生成的计划建议而非编写自定义建议，因为优化器可能从未考虑过某些计划替代方案。

Participants - 参与者:
* ajay.pal.k@gmail.com
* di@nmfay.com
* jacob.champion@enterprisedb.com
* jakub.wartak@enterprisedb.com
* lukas@fittl.com
* matheusssilv97@gmail.com
* robertmhaas@gmail.com

### **[Newly created replication slot may be invalidated by checkpoint](https://www.postgresql.org/message-id/CAA4eK1KHObZ-giSMwrTchtvjXs8yj0sQw9Jt-x2M9Nqxapkjvg@mail.gmail.com)**
The discussion centered on fixing an issue where newly created replication slots could be invalidated by checkpoint operations. Hayato Kuroda tested patches across all PostgreSQL versions and confirmed the issue was present before the fix and resolved after applying the patches. He noted a behavioral difference in pg_sync_replication_slots() on HEAD due to commit 0d2d4a0, but clarified this was unrelated to the current fix. Chao Li agreed that version 4 of the patches was solid, mentioning only minor nitpicks. The patches addressed the core problem of replication slot invalidation timing. Amit Kapila concluded the thread by pushing the patches after making minor cosmetic changes, indicating the fix has been committed to the PostgreSQL codebase.

讨论集中于修复一个问题，即新创建的复制槽可能被检查点操作无效化。Hayato Kuroda在所有PostgreSQL版本上测试了补丁，并确认问题在修复前存在，应用补丁后得到解决。他注意到HEAD版本中pg_sync_replication_slots()的行为差异是由于提交0d2d4a0造成的，但澄清这与当前修复无关。Chao Li同意第4版补丁是可靠的，只提到了一些小问题。补丁解决了复制槽无效化时机的核心问题。Amit Kapila通过推送补丁（进行了少量外观更改）结束了讨论，表明修复已提交到PostgreSQL代码库。

Participants - 参与者:
* aekorotkov@gmail.com
* amit.kapila16@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* houzj.fnst@fujitsu.com
* kuroda.hayato@fujitsu.com
* li.evan.chao@gmail.com
* mengjuan.cmj@alibaba-inc.com
* michael@paquier.xyz
* sawada.mshk@gmail.com
* tomas@vondra.me
* v.davydov@postgrespro.ru
* vignesh21@gmail.com

### **[Proposal: Cascade REPLICA IDENTITY changes to leaf partitions](https://www.postgresql.org/message-id/aXhhm1i-ERVRXFjx@paquier.xyz)**
Chao Li identified a bug where the indisreplident flag of indexes on child partitions is lost after index rebuild operations. This flag is crucial for replica identity functionality in PostgreSQL partitioning. Michael Paquier confirmed this appears to be a legitimate problem that needs addressing. Chao Li has started a separate discussion thread specifically focused on this bug, providing detailed analysis and proposing a fix. The issue affects the proper functioning of replica identity settings on partitioned tables, which is important for logical replication and change data capture scenarios. The bug discovery emerged during work on cascading replica identity changes to leaf partitions, highlighting the complexity of maintaining consistent replica identity behavior across partition hierarchies.

Chao Li发现了一个bug，即在索引重建操作后，子分区上索引的indisreplident标志会丢失。这个标志对于PostgreSQL分区中的replica identity功能至关重要。Michael Paquier确认这看起来是一个需要解决的合法问题。Chao Li已经启动了一个专门针对此bug的单独讨论线程，提供了详细分析并提出了修复方案。这个问题影响了分区表上replica identity设置的正常功能，这对于逻辑复制和变更数据捕获场景很重要。这个bug的发现出现在将replica identity更改级联到叶子分区的工作过程中，突显了在分区层次结构中维持一致的replica identity行为的复杂性。

Participants - 参与者:
* 9erthalion6@gmail.com
* alvherre@kurilemu.de
* amit.kapila16@gmail.com
* euler@eulerto.com
* houzj.fnst@fujitsu.com
* li.evan.chao@gmail.com
* michael@paquier.xyz
* peter@eisentraut.org
* robertmhaas@gmail.com

### **[Implement waiting for wal lsn replay: reloaded](https://www.postgresql.org/message-id/CABPTF7Wdq6KbvC3EhLX3Pz=ODCCPEX7qVQ+E=cokkB91an2E-A@mail.gmail.com)**
Xuneng Zhou reports a bug fix for the WAL LSN replay waiting feature. Heikki identified that a wake-up call for replay waiters was misplaced in PerformWalRecovery function. The issue could cause missed wake-ups when recovery operations stop, pause, or promote. Heikki suggested moving the WaitLSNWakeup call to immediately after WAL records are applied to prevent this timing problem. Xuneng agrees with the analysis and has provided a patch to implement the fix. This appears to be a straightforward bug correction to ensure proper signaling of waiting processes during WAL replay scenarios.

Xuneng Zhou 报告了 WAL LSN 重放等待功能的一个错误修复。Heikki 发现在 PerformWalRecovery 函数中重放等待者的唤醒调用位置错误。该问题可能导致在恢复操作停止、暂停或提升时错过唤醒信号。Heikki 建议将 WaitLSNWakeup 调用移动到 WAL 记录应用之后立即执行，以防止这种时序问题。Xuneng 同意这一分析并提供了实现修复的补丁。这似乎是一个直接的错误修正，用于确保在 WAL 重放场景中正确向等待进程发送信号。

Participants - 参与者:
* aekorotkov@gmail.com
* alvherre@kurilemu.de
* andres@anarazel.de
* hlinnaka@iki.fi
* jian.universality@gmail.com
* li.evan.chao@gmail.com
* michael@paquier.xyz
* peter@eisentraut.org
* thomas.munro@gmail.com
* tomas@vondra.me
* xunengzhou@gmail.com
* y.sokolov@postgrespro.ru