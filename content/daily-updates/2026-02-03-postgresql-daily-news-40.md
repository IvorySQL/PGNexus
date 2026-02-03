---
layout: post
title: PostgreSQL Daily News 2026-02-03
---

# PostgreSQL Daily News#40 2026-02-03



## **PostgreSQL Articles - PostgreSQL 技术博客**

### **[It’s 2026, Just Use Postgres](https://www.tigerdata.com/blog/its-2026-just-use-postgres)**
This blog post argues that PostgreSQL with extensions can replace multiple specialized databases, reducing operational complexity while maintaining performance. The author claims that for 99% of companies, PostgreSQL extensions like pg_textsearch (full-text search), pgvector (vector search), TimescaleDB (time-series), and others provide the same algorithms as specialized databases like Elasticsearch, Pinecone, and InfluxDB. The key benefits highlighted are simplified operations (one database instead of seven), easier AI agent workflows, reduced infrastructure complexity, and lower costs. The post includes code examples showing how PostgreSQL extensions can handle search, vectors, time-series data, caching, queues, documents, and geospatial data, positioning PostgreSQL as a unified solution for modern applications.

这篇博客文章论证了使用扩展的PostgreSQL可以替代多个专业数据库，在保持性能的同时降低运营复杂性。作者声称对于99%的公司，PostgreSQL扩展如pg_textsearch（全文搜索）、pgvector（向量搜索）、TimescaleDB（时序数据）等提供了与Elasticsearch、Pinecone和InfluxDB等专业数据库相同的算法。文章强调的主要优势包括简化运营（一个数据库而不是七个）、更简单的AI代理工作流、降低基础设施复杂性和成本。文章包含代码示例，展示了PostgreSQL扩展如何处理搜索、向量、时序数据、缓存、队列、文档和地理空间数据，将PostgreSQL定位为现代应用的统一解决方案。

`Raja Rao DV`

### **[Importance of Tuning Checkpoint in PostgreSQL](https://www.percona.com/blog/importance-of-tuning-checkpoint-in-postgresql/)**
This article by Jobin Augustine emphasizes the critical importance of properly tuning PostgreSQL checkpoints, which are often left misconfigured leading to resource waste and performance issues. Checkpoints are periodic operations where PostgreSQL writes all dirty buffers from shared memory to disk and creates a recovery point. Poor checkpoint configuration can cause performance spikes, excessive I/O, and inefficient resource utilization. The article targets new PostgreSQL users who may not understand checkpoint mechanics and provides detailed guidance on optimization strategies to improve database performance and stability.

这篇由Jobin Augustine撰写的文章强调了正确调优PostgreSQL检查点的重要性，检查点配置经常被忽视，导致资源浪费和性能问题。检查点是PostgreSQL定期将共享内存中的所有脏缓冲区写入磁盘并创建恢复点的操作。检查点配置不当可能导致性能峰值、过度I/O和资源利用效率低下。文章面向可能不了解检查点机制的PostgreSQL新用户，提供了详细的优化策略指导，以改善数据库性能和稳定性。

`Jobin Augustine`



## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[libpq: Bump protocol version to version 3\.2 at least until the first/second beta](https://www.postgresql.org/message-id/CAGECzQQdb7bLOZncDUNWGvSqK1QetYZWa8sn1x_RYYN1tSoP9w@mail.gmail.com)**
The discussion focuses on protocol version handling in libpq, specifically addressing minor version randomization complexity. Jelte Fennema-Nio explains why randomizing non-consecutive protocol versions may not be worth implementing, citing three problematic scenarios: requesting very high versions that servers can easily check with >=, requesting low versions that force downgrades, or middle-range versions that only postpone issues. He argues that server authors are unlikely to use exact version matches instead of proper range checks. Jacob Champion agrees to abandon the complexity of version randomization. There's also discussion about documentation structure, with Jacob defending keeping the _pq_ namespace in registry tables for clarity, similar to TLS extension documentation, while others prefer moving it to introductory paragraphs.

讨论集中在libpq中的协议版本处理，特别是解决次版本随机化的复杂性问题。Jelte Fennema-Nio解释了为什么随机化非连续协议版本可能不值得实现，他列举了三个问题场景：请求很高的版本号使服务器可以轻松用>=检查，请求低版本号会强制降级，或者中等范围的版本号只是推迟问题。他认为服务器作者不太可能使用精确版本匹配而不是适当的范围检查。Jacob Champion同意放弃版本随机化的复杂性。还讨论了文档结构，Jacob Champion为在注册表中保留_pq_命名空间以保持清晰性进行辩护，类似于TLS扩展文档，而其他人更倾向于将其移到介绍段落中。

Participants - 参与者:
* andres@anarazel.de
* david.g.johnston@gmail.com
* hlinnaka@iki.fi
* jacob.champion@enterprisedb.com
* postgres@jeltef.nl
* robertmhaas@gmail.com

### **[eliminate xl\_heap\_visible to reduce WAL \(and eventually set VM on\-access\)](https://www.postgresql.org/message-id/CAAKRu_ZjW987oL7492N4T618V92SrexhZn_DMetigDUkL4YxkQ@mail.gmail.com)**
Melanie Plageman announced that a fix has been pushed for an issue related to eliminating xl_heap_visible WAL records. The discussion involved debugging efforts to reduce WAL overhead by removing xl_heap_visible records and potentially setting the visibility map on-access instead. Kirill Reshke confirmed that a proposed solution addressed the problem. The fix has now been committed, concluding this phase of the optimization work. Melanie thanked all participants who contributed to identifying and resolving the issue. This change represents progress toward reducing PostgreSQL's write-ahead logging overhead for heap visibility operations.

Melanie Plageman宣布已推送了与消除xl_heap_visible WAL记录相关问题的修复。讨论涉及调试工作，旨在通过移除xl_heap_visible记录来减少WAL开销，并可能改为在访问时设置可见性映射。Kirill Reshke确认提议的解决方案解决了问题。修复现已提交，完成了这一阶段的优化工作。Melanie感谢所有参与识别和解决问题的参与者。这一更改代表了减少PostgreSQL堆可见性操作的预写日志开销方面的进展。

Participants - 参与者:
* andres@anarazel.de
* exclusion@gmail.com
* hlinnaka@iki.fi
* li.evan.chao@gmail.com
* melanieplageman@gmail.com
* reshkekirill@gmail.com
* robertmhaas@gmail.com
* x4mmm@yandex-team.ru
* xunengzhou@gmail.com

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/5ubipyssiju5twkb7zgqwdr7q2vhpkpmuelxfpanetlk6ofnop@hvxb4g2amb2d)**
Andres Freund is working on cleaning up commits related to buffer locking changes, particularly simplifying MarkSharedBufferDirtyHint(). The key improvements include eliminating the need for DELAY_CHKPT_START and switching to normal WAL logging order (marking buffer dirty first, then WAL logging) instead of the previous abnormal order that was required when using shared locks. With the new share-exclusive locking, hint bit operations now conflict with page flushing, enabling standard checkpoint behavior. Additional changes include removing BM_JUST_DIRTIED flag since buffers can no longer be dirtied during IO, and modifying heap_inplace_update_and_unlock() to use an alternative approach that only delays buffer content updates. Andres seeks review from Heikki on checkpoint-related explanations and from Noah on the heap_inplace_update changes.

Andres Freund正在清理与缓冲区锁定变更相关的提交，特别是简化MarkSharedBufferDirtyHint()。主要改进包括：消除对DELAY_CHKPT_START的需求，转换为正常的WAL日志记录顺序（先标记缓冲区为脏，然后进行WAL日志记录），而不是之前使用共享锁时需要的异常顺序。使用新的共享-排他锁定后，提示位操作现在与页面刷新冲突，使得标准检查点行为成为可能。其他变更包括移除BM_JUST_DIRTIED标志，因为缓冲区在IO期间不再能被标记为脏，以及修改heap_inplace_update_and_unlock()使用仅延迟缓冲区内容更新的替代方法。Andres寻求Heikki对检查点相关解释的审查和Noah对heap_inplace_update变更的审查。

Participants - 参与者:
* andres@anarazel.de
* boekewurm+postgres@gmail.com
* hlinnaka@iki.fi
* melanieplageman@gmail.com
* michael.paquier@gmail.com
* noah@leadboat.com
* reshkekirill@gmail.com
* robertmhaas@gmail.com
* thomas.munro@gmail.com

### **[getting "shell command argument contains a newline or carriage return:" error with pg\_dumpall when db name have new line in double quote](https://www.postgresql.org/message-id/CAKYtNAr0TcS4NWgduwdqTcApTs_RBaiRY+C+WAay3-xXjkDC_w@mail.gmail.com)**
Mahendra Singh Thalor is working on patches to address pg_dumpall errors when database or role names contain newlines or carriage returns. Tom Lane and Andrew Dunstan provided feedback on code improvements, including renaming functions, fixing error messages for better translatability, improving test cases, and adding version checks. Álvaro Herrera questioned why tablespace names should be exempt from these restrictions when databases and roles are restricted, suggesting consistency across all object types. The discussion also covers whether to implement checks in individual locations or use a centralized validation approach like adding checks to namein/namerecv/namestrcpy functions. Nathan Bossart referenced a 2016 thread on similar issues and emphasized that applications like pg_dump will need to handle these restrictions across all server versions, with option 2 (handling names appropriately) being fragile.

Mahendra Singh Thalor 正在开发补丁以解决当数据库或角色名称包含换行符或回车符时 pg_dumpall 出现的错误。Tom Lane 和 Andrew Dunstan 对代码改进提供了反馈，包括重命名函数、修复错误消息以提高可翻译性、改进测试用例以及添加版本检查。Álvaro Herrera 质疑为什么当数据库和角色受到限制时，表空间名称应该免于这些限制，建议在所有对象类型中保持一致性。讨论还涉及是在各个位置实现检查，还是使用集中式验证方法，如向 namein/namerecv/namestrcpy 函数添加检查。Nathan Bossart 引用了 2016 年关于类似问题的讨论串，并强调像 pg_dump 这样的应用程序需要在所有服务器版本中处理这些限制，其中选项 2（适当处理名称）是脆弱的。

Participants - 参与者:
* alvherre@alvh.no-ip.org
* andrew@dunslane.net
* mahi6run@gmail.com
* nathandbossart@gmail.com
* srinath2133@gmail.com
* tgl@sss.pgh.pa.us

### **[Pasword expiration warning](https://www.postgresql.org/message-id/aYDZA3r3lG2oKc5D@nathan)**
Nathan Bossart has prepared a revised version of Gilles Darold's password expiration warning patch for commit. The patch introduces a new parameter `password_expiration_warning_threshold` that warns users when their passwords are about to expire. Nathan's changes include renaming the parameter for clarity, changing units from seconds to minutes initially, adding reusable connection warnings infrastructure, moving warning messages to Port, and relocating tests to 001_password.pl. Gilles agreed with most changes but requested keeping the parameter name shorter and using seconds as units for flexibility. Nathan accepted the seconds change and acknowledged the long parameter name but justified it for clarity. Zsolt Parragi identified documentation errors in the commit message and parameter description. Nathan's latest version uses seconds as units and raises two implementation questions: optimal WARNING placement timing and whether to emit warnings for special client backends like logical replication connections.

Nathan Bossart准备了Gilles Darold的密码过期警告补丁的修订版本以供提交。该补丁引入了一个新参数`password_expiration_warning_threshold`，用于在用户密码即将过期时发出警告。Nathan的修改包括重命名参数以提高清晰度，最初将单位从秒改为分钟，添加可重用的连接警告基础设施，将警告消息移动到Port，以及将测试重新定位到001_password.pl。Gilles同意大部分修改，但要求保持参数名更短并使用秒作为单位以提供灵活性。Nathan接受了秒的修改，并承认参数名很长但为了清晰度而证明其合理性。Zsolt Parragi在提交消息和参数描述中发现了文档错误。Nathan的最新版本使用秒作为单位，并提出了两个实现问题：最佳WARNING放置时机以及是否对逻辑复制连接等特殊客户端后端发出警告。

Participants - 参与者:
* andrew@dunslane.net
* gilles@darold.net
* japinli@hotmail.com
* liuxh.zj.cn@gmail.com
* nathandbossart@gmail.com
* niushiji@gmail.com
* shiyuefei1004@gmail.com
* tgl@sss.pgh.pa.us
* tsinghualucky912@foxmail.com
* zsolt.parragi@percona.com

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CAK98qZ16UG0A8GNp4D_DD9Hect30XbsM190Br6uY-zx3KHg8ew@mail.gmail.com)**
Alexandra Wang provides detailed code review feedback on Robert Haas's pg_plan_advice patch series. For patch 0001, she suggests adding test cases to exercise subplan origin display functionality in pg_overexplain, proposing specific EXPLAIN queries to test both named and unnamed subqueries. She approves patch 0002 without issues. For patch 0003, she raises technical questions about the accumulate_append_subpath() function, specifically questioning why it uses both lappend() and list_concat() operations while get_singleton_append_subpath() only uses lappend(), and seeks clarification on child_append_relid_sets population in add_paths_to_append_rel(). She has begun reviewing patch 0004 but only completed the README and documentation portions. Robert had previously requested continued code review, particularly emphasizing the need for more technical feedback on the implementation details.

Alexandra Wang对Robert Haas的pg_plan_advice补丁系列提供了详细的代码审查反馈。对于补丁0001，她建议添加测试用例来测试pg_overexplain中的子计划源显示功能，提出了特定的EXPLAIN查询来测试命名和未命名子查询。她批准了补丁0002。对于补丁0003，她对accumulate_append_subpath()函数提出了技术问题，特别是质疑为什么它同时使用lappend()和list_concat()操作，而get_singleton_append_subpath()只使用lappend()，并寻求对add_paths_to_append_rel()中child_append_relid_sets填充的澄清。她已开始审查补丁0004，但只完成了README和文档部分。Robert之前请求继续进行代码审查，特别强调需要更多关于实现细节的技术反馈。

Participants - 参与者:
* alexandra.wang.oss@gmail.com
* di@nmfay.com
* jacob.champion@enterprisedb.com
* jakub.wartak@enterprisedb.com
* lukas@fittl.com
* matheusssilv97@gmail.com
* robertmhaas@gmail.com

### **[AIX support](https://www.postgresql.org/message-id/391167.1769994234@sss.pgh.pa.us)**
The discussion focuses on reviving AIX support for PostgreSQL after it was dropped in version 17. Tom Lane surveys the current landscape and notes that conditions have improved: AIX 7.1 is EOL, there's consensus on supporting only GCC (not xlc) with 64-bit builds, a buildfarm animal (douc) runs AIX 7.3, and IBM provides support. Key technical issues are being addressed: int8/float8 alignment problems may require dump-and-reload upgrades, s_lock.h changes affecting non-AIX platforms are resolved using gcc's "%=" feature for assembler labels, and the -D_H_FLOAT hack is no longer needed. The mkldexport.sh script remains necessary for AIX's symbol export requirements. Aditya Kamath from IBM submits updated patches (v2, v3) incorporating Tom's feedback, with improved documentation and meson build changes. Tom emphasizes proper patch organization and systematic naming conventions. The discussion suggests AIX support is approaching a committable state, with most technical hurdles resolved.

讨论重点关注在PostgreSQL第17版中被移除后重新恢复AIX支持。Tom Lane审视当前状况并指出情况已有改善：AIX 7.1已停止支持，社区对仅支持GCC（而非xlc）和64位构建达成共识，buildfarm动物（douc）运行AIX 7.3，且IBM提供支持。关键技术问题正在解决：int8/float8对齐问题可能需要转储和重新加载升级，影响非AIX平台的s_lock.h更改通过使用gcc的"%="功能生成汇编标签得到解决，不再需要-D_H_FLOAT hack。mkldexport.sh脚本对AIX的符号导出要求仍然必要。IBM的Aditya Kamath提交了包含Tom反馈的更新补丁（v2、v3），改进了文档和meson构建更改。Tom强调适当的补丁组织和系统命名约定。讨论表明AIX支持接近可提交状态，大多数技术障碍已解决。

Participants - 参与者:
* aditya.kamath1@ibm.com
* andres@anarazel.de
* hlinnaka@iki.fi
* michael@paquier.xyz
* noah@leadboat.com
* peter@eisentraut.org
* postgres-ibm-aix@wwpdl.vnet.ibm.com
* robertmhaas@gmail.com
* sriram.rk@in.ibm.com
* tgl@sss.pgh.pa.us
* tristan@partin.io

### **[Reduce timing overhead of EXPLAIN ANALYZE using rdtsc?](https://www.postgresql.org/message-id/CAKZiRmzF50+drGgm6F-K1dQnuT=Khob0Q_dfZdv0-1iq4TVa4Q@mail.gmail.com)**
Jakub Wartak reviews Lukas Fittl's v5 patch for reducing EXPLAIN ANALYZE timing overhead using RDTSC. Jakub suggests alternatives to the low-level CPUID intrinsics for VM detection, including systemd-detect-virt or D-Bus API, but notes these approaches would be more complex. He recommends using systemd's vm_table approach with memcmp() for more elegant VM type detection. Jakub suggests renaming "fast_clock_source" to "clock_source" or "explain_clock_source" and requests a way to report which clock source was actually used when AUTO mode is selected, similar to huge_pages_status or via elog(DEBUG). Lukas responds positively to the feedback, agreeing that systemd's vm_table approach is more elegant but defending the direct CPUID approach since they need hypervisor-specific TSC frequency data. He's open to the naming suggestions and agrees about adding clock source reporting functionality.

Jakub Wartak评审了Lukas Fittl用于减少EXPLAIN ANALYZE时间开销的v5补丁，该补丁使用RDTSC。Jakub建议使用替代方案来替换低级CPUID内联函数进行VM检测，包括systemd-detect-virt或D-Bus API，但指出这些方法会更复杂。他推荐使用systemd的vm_table方法配合memcmp()来实现更优雅的VM类型检测。Jakub建议将"fast_clock_source"重命名为"clock_source"或"explain_clock_source"，并请求在选择AUTO模式时提供一种报告实际使用的时钟源的方法，类似于huge_pages_status或通过elog(DEBUG)。Lukas对反馈表示积极回应，同意systemd的vm_table方法更优雅，但为直接CPUID方法进行辩护，因为他们需要特定于hypervisor的TSC频率数据。他对命名建议持开放态度，并同意添加时钟源报告功能。

Participants - 参与者:
* andres@anarazel.de
* geidav.pg@gmail.com
* hannuk@google.com
* ibrar.ahmad@gmail.com
* jakub.wartak@enterprisedb.com
* lukas@fittl.com
* m.sakrejda@gmail.com
* michael@paquier.xyz
* pavel.stehule@gmail.com
* robertmhaas@gmail.com
* vignesh21@gmail.com

### **[race condition when writing pg\_control](https://www.postgresql.org/message-id/202602021426.ztjk2wp6sgiy@alvherre.pgsql)**
Álvaro Herrera is following up on a race condition issue when writing pg_control that was previously discussed in May 2024. Thomas Munro had proposed a "proto-controlfile" approach to avoid the race condition by passing a copy of the control file read early in postmaster startup to child processes, allowing them to extract necessary settings without calling LocalProcessControlFile(). However, the problem appears unresolved, as buildfarm failures continue to occur, with the most recent being on 2026-01-21. Álvaro notes that Noah had suggested a more sophisticated solution involving setting values to garbage to prevent reading invalid values, which would build upon Thomas' patch. Álvaro has rebased Thomas' patch and moved it to the next commitfest for further consideration.

Álvaro Herrera正在跟进此前在2024年5月讨论的写入pg_control时的竞态条件问题。Thomas Munro曾提出"proto-controlfile"方法来避免竞态条件，通过向子进程传递在postmaster启动早期读取的控制文件副本，使其能够提取必要设置而无需调用LocalProcessControlFile()。然而，该问题似乎仍未解决，因为构建农场故障仍在继续发生，最近一次发生在2026年1月21日。Álvaro注意到Noah曾建议一个更复杂的解决方案，涉及将值设置为垃圾以防止读取无效值，这将建立在Thomas的补丁基础上。Álvaro已经变基了Thomas的补丁并将其移至下一个提交节进行进一步考虑。

Participants - 参与者:
* alvherre@kurilemu.de
* andres@anarazel.de
* masao.fujii@oss.nttdata.com
* melanieplageman@gmail.com
* michael@paquier.xyz
* nathandbossart@gmail.com
* tgl@sss.pgh.pa.us
* thomas.munro@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAJpy0uAOvtMBP-oV9Tgoznt5-UsE2dzAjZW3eJmgKcU-X-vEzg@mail.gmail.com)**
The discussion centers on implementing EXCEPT TABLE functionality for PostgreSQL publications, specifically addressing patch structure and partition handling approaches. Peter Smith criticized the current patch structure as muddled, noting that patch 0001 lacks proper partition handling and doesn't align with any specific approach. He suggested combining patches to create self-contained, independently reviewable components.

Shveta Malik agreed and proposed a new three-patch structure: patch 0001 implementing EXCEPT syntax and CREATE PUBLICATION changes, patch 0002 enabling publishing/subscription support, and patch 0003 handling pg_dump, tests, and documentation. The discussion focuses on Approach 1 for partition handling, with Approach 3 as a fallback if needed.

Peter Smith emphasized that each patch should be self-contained with its own tests, allowing independent review and application. Shveta agreed on including tests in relevant patches but suggested keeping documentation in patch 0003 initially.

Shlok Kyal provided detailed review comments on the v38-0002 patch, identifying several issues: changes being published when they shouldn't be, incorrect behavior with publish_via_partition_root settings, unnecessary code assignments, and inconsistencies between tablesync and incremental replication behavior. He questioned the proper handling when a partitioned table is published by one publication but excluded by another, comparing it to row_filter behavior.

讨论围绕为PostgreSQL发布实现EXCEPT TABLE功能展开，特别关注补丁结构和分区处理方法。Peter Smith批评当前补丁结构混乱，指出补丁0001缺乏适当的分区处理且不符合任何特定方法。他建议合并补丁以创建自包含的、可独立审查的组件。

Shveta Malik表示同意并提出新的三补丁结构：补丁0001实现EXCEPT语法和CREATE PUBLICATION更改，补丁0002启用发布/订阅支持，补丁0003处理pg_dump、测试和文档。讨论重点关注分区处理的方法1，如有需要将方法3作为备选方案。

Peter Smith强调每个补丁都应该是自包含的并带有自己的测试，允许独立审查和应用。Shveta同意在相关补丁中包含测试，但建议最初将文档保留在补丁0003中。

Shlok Kyal对v38-0002补丁提供了详细的审查意见，识别出几个问题：在不应该发布时却发布了更改、publish_via_partition_root设置的不正确行为、不必要的代码赋值，以及表同步和增量复制行为之间的不一致。他质疑当分区表被一个发布发布但被另一个发布排除时的正确处理方式，并将其与row_filter行为进行比较。

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

### **[Improve pg\_sync\_replication\_slots\(\) to wait for primary to advance](https://www.postgresql.org/message-id/TY4PR01MB169070C1BC6D29C546AB172DD949AA@TY4PR01MB16907.jpnprd01.prod.outlook.com)**
The discussion focuses on improving the pg_sync_replication_slots() function to make it wait and retry when slots cannot be synchronized immediately. Zhijie Hou (Fujitsu) has submitted patches addressing feedback from shveta malik and Chao Li. Key issues resolved include updating documentation comments, fixing copy-paste errors in tests, and clarifying function behavior. The main enhancement allows the SQL function to wait for slots that aren't sync-ready due to various conditions like physical replication lag or slot state issues, rather than immediately returning. Reviewers suggest minor improvements: making comments clearer about waiting only for slots existing at function start, updating file-level documentation, and improving test case descriptions to better distinguish scenarios. The patches handle slot acquisition requirements properly and include comprehensive testing for the new waiting behavior.

讨论重点是改进pg_sync_replication_slots()函数，使其在无法立即同步slots时等待并重试。Zhijie Hou (Fujitsu)提交了补丁，解决了shveta malik和Chao Li的反馈。解决的关键问题包括更新文档注释、修复测试中的复制粘贴错误以及澄清函数行为。主要改进允许SQL函数等待因各种条件（如物理复制滞后或slot状态问题）而未准备好同步的slots，而不是立即返回。审查者建议进行小的改进：使注释更清楚地说明只等待函数开始时存在的slots，更新文件级文档，改进测试用例描述以更好地区分场景。补丁正确处理slot获取要求，并包含新等待行为的全面测试。

Participants - 参与者:
* amit.kapila16@gmail.com
* ashu.coek88@gmail.com
* ashutosh.bapat.oss@gmail.com
* houzj.fnst@fujitsu.com
* itsajin@gmail.com
* japinli@hotmail.com
* jiezhilove@126.com
* li.evan.chao@gmail.com
* shveta.malik@gmail.com

### **[walsender: Assert MyReplicationSlot is set before use](https://www.postgresql.org/message-id/6E7BD4F7-C22A-4B6C-A9BD-62877390DF86@gmail.com)**
Chao Li identified a potential issue in walsender.c where the function NeedToWaitForStandbys() dereferences MyReplicationSlot->data.failover without checking if MyReplicationSlot is NULL. This occurs in the call chain from logical_read_xlog_page() through WalSndWaitForWal() to NeedToWaitForStandbys(). Li proposes adding an Assert(MyReplicationSlot) check to make the assumption explicit, following patterns seen elsewhere in the codebase. He also suggested adding an assertion in StartLogicalReplication() after ReplicationSlotAcquire() to verify MyReplicationSlot is properly set. Zhijie Hou agreed with the first assertion but considered the second unnecessary since ReplicationSlotAcquire() has retry logic. Hou suggested instead checking for slot type mismatches, noting potential race conditions where logical slots could be replaced with physical slots. Li agreed to verify this scenario further.

Chao Li在walsender.c中发现了一个潜在问题，函数NeedToWaitForStandbys()在解引用MyReplicationSlot->data.failover时没有检查MyReplicationSlot是否为NULL。这发生在从logical_read_xlog_page()到WalSndWaitForWal()再到NeedToWaitForStandbys()的调用链中。Li提议添加Assert(MyReplicationSlot)检查来明确这个假设，这遵循了代码库其他地方的模式。他还建议在StartLogicalReplication()中ReplicationSlotAcquire()后添加断言来验证MyReplicationSlot是否正确设置。Zhijie Hou同意第一个断言，但认为第二个不必要，因为ReplicationSlotAcquire()有重试逻辑。Hou建议检查slot类型不匹配的情况，指出可能存在逻辑slot被物理slot替换的竞争条件。Li同意进一步验证这个场景。

Participants - 参与者:
* houzj.fnst@fujitsu.com
* li.evan.chao@gmail.com
* vignesh21@gmail.com



## **Industry News - 行业新闻**

### **[Elon Musk's SpaceX officially acquires Elon Musk's xAI with plan to build data centers in space](TechCrunch Daily News)**
SpaceX has officially acquired xAI in a major merger that creates the world's most valuable private company. The acquisition brings together Musk's space exploration company with his artificial intelligence venture, paving the way for an ambitious plan to build and operate data centers in space. This merger represents a significant consolidation of Musk's business empire and could revolutionize how AI infrastructure is deployed. The combined entity aims to leverage SpaceX's launch capabilities and space expertise to establish orbital data processing facilities, potentially offering new solutions for AI computing that bypass terrestrial limitations like power consumption and cooling requirements.

SpaceX正式收购xAI，计划在太空建设数据中心。这次重大合并创造了世界上最有价值的私人公司。此次收购将Musk的太空探索公司与他的人工智能企业结合起来，为在太空建设和运营数据中心的雄心勃勃计划铺平了道路。这次合并代表了Musk商业帝国的重大整合，可能彻底改变AI基础设施的部署方式。合并后的实体旨在利用SpaceX的发射能力和太空专业知识建立轨道数据处理设施，可能为AI计算提供新的解决方案，绕过功耗和散热要求等地面限制。