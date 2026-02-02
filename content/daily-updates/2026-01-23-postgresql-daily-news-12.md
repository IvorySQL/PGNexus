---
layout: post
title: PostgreSQL Daily News 2026-01-23
---

# PostgreSQL Daily News#12 2026-01-23







## **Hacker Email Discussions**

### **[Remove redundant AssertVariableIsOfType uses in pg\_upgrade](https://www.postgresql.org/message-id/c1b79178-ab7c-461e-8359-bf400d8f1684@eisentraut.org)**
Peter Eisentraut proposed removing redundant AssertVariableIsOfType uses in pg_upgrade code. These assertions were meant to ensure function signatures match upgrade_task_add_step() requirements, but the function already performs this check internally, making the additional assertions unnecessary and confusing. Nathan Bossart noted that similar assertions were previously removed from logical decoding output plugins in commit 30b789eafe, providing supportive context. Both developers agreed the assertions are redundant, and Peter confirmed the change has been committed to remove them.

Peter Eisentraut提议移除pg_upgrade代码中冗余的AssertVariableIsOfType用法。这些断言原本用于确保函数签名符合upgrade_task_add_step()的要求，但该函数内部已经执行此检查，使得额外的断言变得不必要且令人困惑。Nathan Bossart指出类似的断言之前已在提交30b789eafe中从逻辑解码输出插件中移除，提供了支持性背景。两位开发者都同意这些断言是冗余的，Peter确认已提交更改将其移除。

Participants:
* nathandbossart@gmail.com
* peter@eisentraut.org

### **[Adding REPACK \[concurrently\]](https://www.postgresql.org/message-id/CADzfLwVZ_DeU_3avD=G4ZHFJJgZ0EOFzxnmWxwyB23zsS-uxjA@mail.gmail.com)**
The discussion focuses on implementing a REPACK feature with concurrent execution capabilities in PostgreSQL. Mikhail raises technical concerns about snapshot handling, particularly regarding WAL decoding and visibility checks when building multiple snapshots for the same slot. He suggests using GetLatestSnapshot() instead of GetTransactionSnapshot() and proposes introducing a new process flag rather than reusing PROC_IN_VACUUM. The conversation addresses visibility checking complexities, including handling dead tuples and HOT versions with SnapshotAny. Mikhail clarifies that unique index building uses a single snapshot, making it acceptable for the current approach, while referencing related patch work on building unique indexes with multiple snapshots.

讨论重点是在PostgreSQL中实现具有并发执行能力的REPACK功能。Mikhail提出了关于快照处理的技术问题，特别是在为同一个槽构建多个快照时的WAL解码和可见性检查。他建议使用GetLatestSnapshot()而不是GetTransactionSnapshot()，并提议引入新的进程标志而不是重用PROC_IN_VACUUM。对话涉及可见性检查的复杂性，包括使用SnapshotAny处理死元组和HOT版本。Mikhail澄清了唯一索引构建使用单一快照，使其适用于当前方法，同时引用了关于使用多个快照构建唯一索引的相关补丁工作。

Participants:
* ah@cybertec.at
* alvherre@alvh.no-ip.org
* mihailnikalayeu@gmail.com
* rob@xzilla.net

### **[commented out code](https://www.postgresql.org/message-id/a690f6d3-c53e-41cf-8a26-756b1ef16442@eisentraut.org)**
The PostgreSQL development team discussed approaches for handling commented-out code in the codebase. Heikki Linnakangas proposed using "#if 0" to disable code blocks while preserving indentation and syntax highlighting, making them easier to read compared to traditional comment blocks. Peter Eisentraut initially supported this approach after reflection, appreciating how it maintains code readability. However, Tom Lane suggested using "#ifdef NOT_USED" instead, noting this as the project's more established convention. Following this feedback, Peter Eisentraut committed the changes using the "#ifdef NOT_USED" style as recommended by Tom Lane.

PostgreSQL开发团队讨论了处理代码库中注释代码的方法。Heikki Linnakangas提议使用"#if 0"来禁用代码块，同时保持缩进和语法高亮，使其比传统注释块更易阅读。Peter Eisentraut经过思考后最初支持这种方法，认为它能保持代码可读性。然而，Tom Lane建议使用"#ifdef NOT_USED"，指出这是项目更为成熟的惯例。根据这一反馈，Peter Eisentraut按照Tom Lane的建议使用"#ifdef NOT_USED"样式提交了更改。

Participants:
* hlinnaka@iki.fi
* peter@eisentraut.org
* tgl@sss.pgh.pa.us

### **[let ALTER COLUMN SET DATA TYPE cope with trigger dependency](https://www.postgresql.org/message-id/CACJufxH-Ngr9e7_bT+7d-bFMACqd-efAV3YSgPJyfMp4T9P5AQ@mail.gmail.com)**
The patch proposes making ALTER COLUMN SET DATA TYPE handle trigger dependencies more elegantly. Version 3 introduces a cleaner approach that mirrors how PostgreSQL handles statistics during column data type changes. The solution involves calling transformStatsStmt in ATPostAlterTypeParse for statistics, and similarly implementing transformTriggerStmt for trigger WHEN clauses. The new transformTriggerStmt function is placed in src/backend/commands/trigger.c and will be invoked from CreateTriggerFiringOn. This architectural approach provides consistency with existing PostgreSQL mechanisms for handling dependencies during schema changes, specifically addressing how triggers with WHEN clauses should be processed when their referenced column types are altered.

该补丁提议让 ALTER COLUMN SET DATA TYPE 更优雅地处理触发器依赖关系。第3版引入了一种更清洁的方法，模仿了PostgreSQL在列数据类型更改期间处理统计信息的方式。解决方案涉及在ATPostAlterTypeParse中为统计信息调用transformStatsStmt，并类似地为触发器WHEN子句实现transformTriggerStmt。新的transformTriggerStmt函数放置在src/backend/commands/trigger.c中，将从CreateTriggerFiringOn调用。这种架构方法与现有的PostgreSQL机制保持一致，用于处理模式更改期间的依赖关系，特别解决了当引用列类型被更改时，带有WHEN子句的触发器应如何处理的问题。

Participants:
* jian.universality@gmail.com

### **[\[PATCH\] psql: add \\dcs to list all constraints](https://www.postgresql.org/message-id/CAOKkKFuL-VGw+hUSdXwwnONB=t4BU+x6OJ38ian4XgJNDStAZg@mail.gmail.com)**
Tatsuro Yamada submitted v8 of a patch adding \dcs command to psql for listing constraints. The patch addresses reviewer feedback from Chao and Álvaro about the exec_command_d() function's argument parsing approach. Initially, exec_command_d() only checked the third character following existing command patterns, but reviewers suggested passing all arguments to listConstraints() for more comprehensive validation. Yamada acknowledged this feedback and updated the implementation accordingly. Additional improvements in v8 include clarified documentation specifying what the pattern string matches and modifications to the case statement using predefined variables when converting constraint types to strings. The patch continues the review process with these refinements.
山田达郎提交了为psql添加\dcs命令以列出约束的补丁v8版本。该补丁解决了Chao和Álvaro关于exec_command_d()函数参数解析方法的审查反馈。最初，exec_command_d()仅检查第三个字符以遵循现有命令模式，但审查者建议将所有参数传递给listConstraints()以进行更全面的验证。山田认可了这一反馈并相应更新了实现。v8版本的其他改进包括：澄清了文档中模式字符串匹配的内容，以及修改case语句在将约束类型转换为字符串时使用预定义变量。该补丁在这些改进基础上继续审查过程。

Participants:
* alvherre@kurilemu.de
* jim.jones@uni-muenster.de
* li.evan.chao@gmail.com
* tgl@sss.pgh.pa.us
* yamatattsu@gmail.com

### **[CREATE TABLE LIKE INCLUDING TRIGGERS](https://www.postgresql.org/message-id/CAN4CZFNPE_UeTEy5TH9wwc6mBAtX7vnBhLSL47jRiHXA=6yXjQ@mail.gmail.com)**
The discussion focuses on whether CREATE TABLE LIKE INCLUDING TRIGGERS should preserve the enabled/disabled state of triggers when copying them to a new table. Initially, there was consideration to document this as a limitation, but after further analysis, the consensus shifted toward properly copying the trigger state. The key argument is consistency with existing behavior: INCLUDING CONSTRAINTS already correctly preserves the enabled/disabled status of constraints, including marking CHECK constraints as "NOT ENFORCED" when appropriate. The participant argues it would be inconsistent for INCLUDING TRIGGERS to behave differently, suggesting the feature should maintain trigger states rather than documenting it as a limitation.

讨论的焦点是CREATE TABLE LIKE INCLUDING TRIGGERS在将触发器复制到新表时是否应该保留触发器的启用/禁用状态。最初考虑将此记录为限制，但经过进一步分析后，共识转向正确复制触发器状态。关键论点是与现有行为的一致性：INCLUDING CONSTRAINTS已经正确保留约束的启用/禁用状态，包括在适当时将CHECK约束标记为"NOT ENFORCED"。参与者认为INCLUDING TRIGGERS的行为不同会不一致，建议该功能应该维护触发器状态而不是将其记录为限制。

Participants:
* jian.universality@gmail.com
* x4mmm@yandex-team.ru
* zsolt.parragi@percona.com

### **[Change COPY \.\.\. ON\_ERROR ignore to ON\_ERROR ignore\_row](https://www.postgresql.org/message-id/CACJufxGYPXQ_Jz1avF5eSh_XJRsxhPSUZ+=RzG3Hz4_XNAc32g@mail.gmail.com)**
The PostgreSQL development team is reviewing changes to the COPY command's ON_ERROR functionality, specifically transitioning from "ignore" to "ignore_row" and implementing a new "set_null" option. The discussion focuses on code review feedback including error message consistency, memory allocation improvements using palloc_array, and the interaction between FORCE_NOT_NULL and ON_ERROR set_null options. A key debate centers on whether FORCE_NOT_NULL should be blocked when using ON_ERROR set_null, with the author arguing they are unrelated features that can coexist. Documentation updates are needed for pg_stat_progress_copy to clarify that tuples_skipped only advances with the "ignore" option, not "set_null". The REJECT_LIMIT feature with ON_ERROR set_null is being considered for a separate future patch.
PostgreSQL开发团队正在审查COPY命令的ON_ERROR功能更改，特别是从"ignore"过渡到"ignore_row"并实现新的"set_null"选项。讨论集中在代码审查反馈上，包括错误消息一致性、使用palloc_array改进内存分配，以及FORCE_NOT_NULL与ON_ERROR set_null选项之间的交互。关键争议在于使用ON_ERROR set_null时是否应该阻止FORCE_NOT_NULL，作者认为它们是可以共存的不相关功能。需要更新pg_stat_progress_copy的文档以明确tuples_skipped仅在"ignore"选项下前进，而非"set_null"。带有ON_ERROR set_null的REJECT_LIMIT功能正在考虑作为单独的未来补丁。

Participants:
* david.g.johnston@gmail.com
* jian.universality@gmail.com
* jim.jones@uni-muenster.de
* masao.fujii@oss.nttdata.com
* matheusssilv97@gmail.com
* nagata@sraoss.co.jp
* reshkekirill@gmail.com
* sawada.mshk@gmail.com
* torikoshia@oss.nttdata.com
* vignesh21@gmail.com

### **[SQL Property Graph Queries \(SQL/PGQ\)](https://www.postgresql.org/message-id/CABRHmyvnDbm1s7ZZNzU9=XXzHRS41t3uMu9bezKhXeWymAC-Cg@mail.gmail.com)**
Ajay Pal reported a potential security vulnerability in the SQL/PGQ GRAPH_TABLE implementation, where row-level security (RLS) policies appeared to be bypassed. He demonstrated that a low-privilege user could access sensitive data through GRAPH_TABLE queries despite RLS restrictions. Henson Choi investigated and determined this is not a GRAPH_TABLE-specific bug but expected PostgreSQL behavior with table inheritance. When querying a parent table, only the parent's RLS policies apply, not the child table's policies. Ashutosh Bapat confirmed this explanation, referencing the PostgreSQL documentation on inheritance behavior. The issue stems from the test setup using inheritance where RLS was enabled only on the child table, not the parent.

Ajay Pal报告了SQL/PGQ GRAPH_TABLE实现中的一个潜在安全漏洞，其中行级安全(RLS)策略似乎被绕过。他演示了低权限用户尽管有RLS限制，仍可通过GRAPH_TABLE查询访问敏感数据。Henson Choi调查后确定这不是GRAPH_TABLE特有的错误，而是PostgreSQL表继承的预期行为。查询父表时，只应用父表的RLS策略，不应用子表的策略。Ashutosh Bapat确认了这一解释，引用了PostgreSQL继承行为的文档。问题源于测试设置使用了继承，其中RLS仅在子表而非父表上启用。

Participants:
* ajay.pal.k@gmail.com
* amitlangote09@gmail.com
* ashutosh.bapat.oss@gmail.com
* assam258@gmail.com
* imran.zhir@gmail.com
* peter@eisentraut.org
* vik@postgresfriends.org
* zhjwpku@gmail.com

### **[SQL:2011 Application Time Update & Delete](https://www.postgresql.org/message-id/4606deaa-7d65-4f22-8a78-356c3180be9d@eisentraut.org)**
Peter Eisentraut has committed the pg_range patch related to SQL:2011 Application Time features. Paul Jungwirth asked about adding regression tests to confirm proper setup for user-defined types, but Eisentraut noted existing tests in type_sanity should cover this. Jungwirth outlined future extensibility needs for temporal features including type support functions for primary/unique constraints to reject invalid values like empty ranges, intersect operators for foreign keys, and foo_minus_multi functions for UPDATE/DELETE FOR PORTION OF operations. He suggested a constructor function facility could be added later. Kirill Reshke proposed adding additional type validation checks, but Eisentraut considered this outside the current patch scope, noting similar considerations exist for arrays and domains.

Peter Eisentraut 已提交与 SQL:2011 应用时间功能相关的 pg_range 补丁。Paul Jungwirth 询问是否应添加回归测试来确认用户定义类型的正确设置，但 Eisentraut 指出 type_sanity 中的现有测试应该涵盖这一点。Jungwirth 概述了时态功能未来的扩展性需求，包括用于主键/唯一约束的类型支持函数以拒绝空范围等无效值、用于外键的交集运算符，以及用于 UPDATE/DELETE FOR PORTION OF 操作的 foo_minus_multi 函数。他建议稍后可以添加构造函数功能。Kirill Reshke 提议添加额外的类型验证检查，但 Eisentraut 认为这超出了当前补丁的范围，并指出对数组和域也存在类似考虑。

Participants:
* li.evan.chao@gmail.com
* peter@eisentraut.org
* pj@illuminatedcomputing.com
* reshkekirill@gmail.com

### **[Mystery with REVOKE PRIVILEGE](https://www.postgresql.org/message-id/c8e166a6-173b-4637-8e94-4b447b49adab@garret.ru)**
The discussion focuses on fixing PostgreSQL's REVOKE privilege behavior, specifically addressing issues with the GRANTED BY clause and grantor selection. Tom Lane and Nathan Bossart are working on a patch to ensure that when GRANTED BY is explicitly specified, the system uses exactly that grantor without applying select_best_grantor logic. This change is particularly important for pg_dump functionality. Konstantin Knizhnik suggests extending the fix to handle cases where no grantor is specified, proposing that "REVOKE ALL PRIVILEGES" should remove all grants from any grantor. However, Tom Lane explains this would violate SQL specification, which mandates REVOKE only affects privileges granted directly by the calling user or specified GRANTED BY role. The current select_best_grantor behavior already extends beyond the spec by allowing inherited role privileges.

讨论重点是修复PostgreSQL的REVOKE权限行为，特别是解决GRANTED BY子句和授权者选择的问题。Tom Lane和Nathan Bossart正在开发一个补丁，确保当明确指定GRANTED BY时，系统准确使用该授权者而不应用select_best_grantor逻辑。这个更改对pg_dump功能特别重要。Konstantin Knizhnik建议扩展修复以处理未指定授权者的情况，提议"REVOKE ALL PRIVILEGES"应该移除来自任何授权者的所有授权。然而，Tom Lane解释这会违反SQL规范，规范要求REVOKE只影响调用用户或指定GRANTED BY角色直接授予的权限。当前的select_best_grantor行为通过允许继承角色权限已经超出了规范范围。

Participants:
* knizhnik@garret.ru
* nathandbossart@gmail.com
* peter@eisentraut.org
* tgl@sss.pgh.pa.us

### **[Likely undefined behavior with some flexible arrays](https://www.postgresql.org/message-id/yjtlufdn6kaoctydjrryzt267xnls2t4lizslnbgqzhtsnohkj@fvvr3dbtvbrc)**
Andres Freund discusses challenges in teaching compilers about PostgreSQL's palloc memory allocation to enable better static analysis warnings for memory safety issues. He responds to Andrey Borodin's question about compiler awareness of short-lived memory contexts, explaining that this would likely require a compiler plugin and isn't feasible in the near term. However, Freund expresses interest in achieving more basic compiler warnings for obvious memory errors such as use-after-free bugs (including indirect cases through pfree) and buffer overruns beyond allocated memory boundaries. He also mentions that improving sanitizer integration with memory contexts could help, though this approach requires actually triggering problematic code paths during testing to be effective.

Andres Freund讨论了在教导编译器理解PostgreSQL的palloc内存分配方面的挑战，以便启用更好的内存安全问题静态分析警告。他回应了Andrey Borodin关于编译器对短生命周期内存上下文感知的问题，解释说这可能需要编译器插件，在近期内不太可行。然而，Freund表示有兴趣实现更基本的编译器警告，用于检测明显的内存错误，如释放后使用的错误（包括通过pfree的间接情况）和超出分配内存边界的缓冲区溢出。他还提到改进与内存上下文的清理器集成可能有帮助，尽管这种方法需要在测试期间实际触发有问题的代码路径才能生效。

Participants:
* andres@anarazel.de
* tgl@sss.pgh.pa.us
* x4mmm@yandex-team.ru

### **[ReadRecentBuffer\(\) doesn't scale well](https://www.postgresql.org/message-id/wbmtz3b4cm3zwcsfunymbaauu7dlwbimzma7tsyjtg3npqy546@tj6oqcktgjvh)**
Andres Freund seeks clarification on which ReadRecentBuffer() patch Ian Ilyasov tested in his benchmark. Ian had reported excellent performance results on a 96-core, 1.5TB RAM system but referenced multiple different patches from various email threads. Freund notes that one patch (0001) has already been committed as 819dc118c0f, and asks whether Ian tested the btree root page patch (0002) from a specific thread. Ian confirms he tested the "0002-Use-ReadRecentBuffer-for-btree-root-page.patch" from the second thread mentioned. Regarding backporting to PostgreSQL 18, Freund explains that performance improvements are only backpatched when they address severe performance issues that essentially constitute bugs.

Andres Freund寻求澄清Ian Ilyasov在基准测试中测试了哪个ReadRecentBuffer()补丁。Ian在96核心、1.5TB内存的系统上报告了出色的性能结果，但引用了来自不同邮件线程的多个不同补丁。Freud指出一个补丁(0001)已作为819dc118c0f提交，并询问Ian是否测试了特定线程中的btree根页补丁(0002)。Ian确认他测试了第二个线程中提到的"0002-Use-ReadRecentBuffer-for-btree-root-page.patch"。关于向PostgreSQL 18反向移植，Freund解释性能改进只有在解决本质上构成错误的严重性能问题时才会被反向移植。

Participants:
* amitlangote09@gmail.com
* andres@anarazel.de
* ianilyasov@outlook.com
* thomas.munro@gmail.com

### **[Flush some statistics within running transactions](https://www.postgresql.org/message-id/CAHGQGwHttst8tv_WWYNoGGfL1UAq4kiy6dpFXoxEkJwHMS9FtQ@mail.gmail.com)**
The discussion centers on a patch to flush PostgreSQL statistics within running transactions rather than only at transaction boundaries. Fujii Masao tested patch 0001 and discovered an unintended side effect: log_lock_waits messages are emitted every second during lock waits. He demonstrated this by creating a scenario where two sessions compete for the same row lock, resulting in frequent "process still waiting for ShareLock" messages. Bertrand Drouvot acknowledged the issue, explaining that WaitLatch() in ProcSleep() is being awakened every second due to ANYTIME_STATS_UPDATE_TIMEOUT being set unconditionally in ProcessInterrupts(). He committed to fixing this by being more restrictive about when to enable the timeout. Sami Imseih contributed to documentation discussions, suggesting that time-related statistics fields should remain non-anytime fields due to overhead concerns, while proposing clearer documentation about which statistics require transactional consistency versus those that can be updated during transactions.

讨论围绕一个在运行事务中刷新PostgreSQL统计信息而不是仅在事务边界处刷新的补丁展开。Fujii Masao测试了补丁0001并发现了意外的副作用：在锁等待期间每秒都会发出log_lock_waits消息。他通过创建两个会话竞争同一行锁的场景演示了这个问题，导致频繁出现"进程仍在等待ShareLock"消息。Bertrand Drouvot承认了这个问题，解释说WaitLatch()在ProcSleep()中每秒被唤醒是因为ANYTIME_STATS_UPDATE_TIMEOUT在ProcessInterrupts()中被无条件设置。他承诺通过更严格地限制何时启用超时来修复此问题。Sami Imseih参与了文档讨论，建议时间相关的统计字段由于开销问题应保持为非随时字段，同时提议更清楚地记录哪些统计信息需要事务一致性而哪些可以在事务期间更新。

Participants:
* bertranddrouvot.pg@gmail.com
* masao.fujii@gmail.com
* michael@paquier.xyz
* samimseih@gmail.com
* zsolt.parragi@percona.com

### **[Inval reliability, especially for inplace updates](https://www.postgresql.org/message-id/CAHgHdKvTv6knvzmtumdzAqF9_PykaUc6b-6c80VpMZEV0UuyZQ@mail.gmail.com)**
Mark Dilger reports that recent PostgreSQL back-patches fixing invalidation reliability for inplace updates have broken the ABI for four Table Access Methods he maintains. The changes affect CacheInvalidateHeapTupleInplace() and PrepareToInvalidateCacheTuple() functions across multiple major versions (v14-v18). While the patches address serious data loss issues involving relhasindex, relfrozenxid, and datfrozenxid updates, Dilger questions whether code cleanup aspects like removing unused function parameters should be back-patched, causing packaging difficulties without clear benefit. Noah Misch acknowledges the concern and suggests encouraging packagers to test builds early against stable branches. He also requests source code examples to better understand tableam module usage of these functions and recommends uploading modules to PGXN for future ABI break detection.

Mark Dilger 报告称，最近 PostgreSQL 修复就地更新失效可靠性的反向移植破坏了他维护的四个表访问方法的 ABI。这些更改影响多个主要版本（v14-v18）中的 CacheInvalidateHeapTupleInplace() 和 PrepareToInvalidateCacheTuple() 函数。虽然这些补丁解决了涉及 relhasindex、relfrozenxid 和 datfrozenxid 更新的严重数据丢失问题，但 Dilger 质疑是否应该反向移植代码清理方面的内容（如删除未使用的函数参数），这会在没有明确好处的情况下造成打包困难。Noah Misch 承认了这一担忧，并建议鼓励打包人员尽早针对稳定分支测试构建。他还请求源代码示例以更好地理解表访问方法模块对这些函数的使用，并建议将模块上传到 PGXN 以便将来检测 ABI 破坏。

Participants:
* andres@anarazel.de
* mark.dilger@enterprisedb.com
* nitinmotiani@google.com
* noah@leadboat.com

### **[refactor architecture\-specific popcount code](https://www.postgresql.org/message-id/aXJjbkp2_glyfy6z@nathan)**
Nathan Bossart responds to John Naylor's proposals for refactoring PostgreSQL's architecture-specific popcount code. He agrees that bitmapset functions like select_best_grantor() should use pg_popcount() instead of word-sized functions, though notes potential performance trade-offs for bms_member_index(). For x86 optimizations, Nathan's patch 0002 removes alignment detection complexity from SSE4.2 variants but suggests keeping AVX-512 alignment optimizations due to proven benefits. He explains that inlined small-case handling avoids function call overhead and showed significant benchmark improvements during AVX-512 development. Nathan acknowledges code duplication could be reduced with static inline functions but considers the current ~2-line duplications minimal. The discussion focuses on balancing code simplification with performance optimization across different CPU architectures.

Nathan Bossart回应John Naylor关于重构PostgreSQL架构特定popcount代码的提案。他同意bitmapset函数如select_best_grantor()应使用pg_popcount()而非字长函数，但指出bms_member_index()可能存在性能权衡。对于x86优化，Nathan的补丁0002从SSE4.2变体中移除了对齐检测复杂性，但建议保留AVX-512对齐优化，因为已证明有益。他解释内联小情况处理避免了函数调用开销，在AVX-512开发期间基准测试显示显著改进。Nathan承认代码重复可通过静态内联函数减少，但认为当前约2行的重复很少。讨论重点是在不同CPU架构上平衡代码简化与性能优化。

Participants:
* hlinnaka@iki.fi
* johncnaylorls@gmail.com
* nathandbossart@gmail.com

### **[Speed up COPY FROM text/CSV parsing using SIMD](https://www.postgresql.org/message-id/CA+K2RumUD+aJ3vuD+05aDWj6geek5DCPYD5peXrRU41QjtORFA@mail.gmail.com)**
The discussion focuses on optimizing PostgreSQL's COPY FROM text/CSV parsing using SIMD instructions. Manni Wood shared benchmarks from a Raspberry Pi 5 showing v3 COPY FROM patch achieves 19-35% speedup for files without special characters, with minimal regression (under 1%) for files with special characters, while v4.2 performs worse in regression cases. Ayoub explains that v4.2's 3-4% regression stems from sampling overhead and branch prediction effects when detecting special characters. Neil Conway suggested a simpler approach using vector8_has() similar to JSON escaping code, but Ayoub's testing revealed this method causes significant regressions (20-33%) for files with special characters. The consensus appears to favor the v3 COPY FROM patch for moving forward due to its superior performance characteristics.

讨论集中在使用SIMD指令优化PostgreSQL的COPY FROM文本/CSV解析。Manni Wood分享了来自树莓派5的基准测试结果，显示v3 COPY FROM补丁对于没有特殊字符的文件实现了19-35%的加速，对于含有特殊字符的文件回归最小（不到1%），而v4.2在回归情况下表现更差。Ayoub解释v4.2的3-4%回归源于采样开销和检测特殊字符时的分支预测效应。Neil Conway建议使用类似JSON转义代码的vector8_has()的更简单方法，但Ayoub的测试显示这种方法对含有特殊字符的文件造成显著回归（20-33%）。共识倾向于推进v3 COPY FROM补丁，因为它具有优越的性能特性。

Participants:
* andrew@dunslane.net
* byavuz81@gmail.com
* ma_kazar@esi.dz
* manni.wood@enterprisedb.com
* markwkm@gmail.com
* nathandbossart@gmail.com
* neil.conway@gmail.com
* shinya11.kato@gmail.com

### **[\[BUG\] \[PATCH\] Allow physical replication slots to recover from archive after invalidation](https://www.postgresql.org/message-id/CAF8B20Dr28H3pdH472SHSYHdkaOX12BsvBe7D06ssMKmwvqCxQ@mail.gmail.com)**
Joao Foltran proposes allowing physical replication slots to recover from archive after invalidation. He addresses Amit Kapila's concerns about xmin handling, noting that physical slots typically have null xmin unless hot_standby_feedback is enabled. Even when enabled, xmin becomes irrelevant once the standby catches up using archived WALs since those rows no longer need visibility protection. Foltran has attached a patch and test that revalidates lost slots, currently filtering only between physical and logical slots but acknowledging the need for more specific invalidation reason filtering. The discussion continues around whether slots can be made valid when required WAL becomes available later and handling removed rows due to slot xmin values.

João Foltran 提议允许物理复制槽在失效后从归档中恢复。他回应了 Amit Kapila 关于 xmin 处理的担忧，指出除非启用 hot_standby_feedback，否则物理槽通常具有空的 xmin。即使启用该参数，一旦备库使用归档 WAL 追上后，xmin 就变得无关紧要，因为这些行不再需要可见性保护。Foltran 已附上一个补丁和测试来重新验证丢失的槽位，目前仅在物理槽和逻辑槽之间进行过滤，但承认需要针对特定失效原因进行更精确的过滤。讨论继续围绕是否可以在所需 WAL 后续可用时使槽位生效，以及如何处理由于槽位 xmin 值而被移除的行。

Participants:
* amit.kapila16@gmail.com
* houzj.fnst@fujitsu.com
* joao@foltrandba.com

### **[Extensible storage manager API \- SMGR hook Redux](https://www.postgresql.org/message-id/CAN4CZFNe1GSAuqWi62UOrpt+M7-Auwiz5V9iF6VavNT=GuPqyQ@mail.gmail.com)**
The patch for extensible storage manager API has been rebased with all reviewer comments addressed. Key changes include adding new assertions for smgr_registersync, smgr_init, and the new startreadv function. The author maintains that requiring extension authors to implement prefetch is reasonable, as empty implementations are acceptable. Patches 0001 and 0002 have been merged as suggested. The fsync_checker module has been relocated from contrib to src/test/modules, as it's intended for testing rather than production use. The author plans to enhance it for actual testing in future versions. Patch 0005 received a more detailed commit message explaining the rationale for the changes. The modifications aim to make the storage manager API more extensible while maintaining compatibility.
该可扩展存储管理器API补丁已重新基于最新代码，并处理了所有审阅者的意见。主要变更包括为smgr_registersync、smgr_init和新的startreadv函数添加新的断言。作者坚持认为要求扩展开发者实现prefetch是合理的，因为可以接受空实现。按建议将补丁0001和0002合并。fsync_checker模块已从contrib移至src/test/modules，因为它用于测试而非生产环境。作者计划在后续版本中增强其实际测试功能。补丁0005获得了更详细的提交信息，解释了变更的原理。这些修改旨在使存储管理器API更具可扩展性，同时保持兼容性。

Participants:
* andreas@proxel.se
* andres@anarazel.de
* boekewurm+postgres@gmail.com
* hlinnaka@iki.fi
* nitinjadhavpostgres@gmail.com
* tristan@neon.tech
* vignesh21@gmail.com
* zsolt.parragi@percona.com

### **[\[PATCH\] Align verify\_heapam\.c error message offset with test expectations](https://www.postgresql.org/message-id/CAKQ9eTHCcn++hVDK6TRFqgSyvRx_EnZS7KjXZV9ERaGnm70jNw@mail.gmail.com)**
Khoa Nguyen reviewed a two-patch submission by zengman addressing error message offsets in PostgreSQL's verify_heapam.c. Patch 1 updates test expectations from wildcard matching to exact offset values, making tests more precise and revealing the underlying bug. Patch 2 fixes the actual issue where error messages incorrectly report the current tuple's offset (ctx.offnum) instead of the successor tuple's offset (nextoffnum) at lines 777, 793, and 799. The reviewer confirms both patches are correct, noting that the test data was engineered to be deterministic and that the error message format requires the successor's offset. The reviewer suggests addressing similar issues in other test cases, particularly at line 693 for offnum == 33.

Khoa Nguyen审查了zengman提交的两个补丁，用于解决PostgreSQL的verify_heapam.c中错误消息偏移量问题。补丁1将测试期望从通配符匹配更新为精确的偏移值，使测试更加精确并揭示了潜在的错误。补丁2修复了实际问题，即错误消息在第777、793和799行错误地报告当前元组的偏移量(ctx.offnum)而不是后继元组的偏移量(nextoffnum)。审查者确认两个补丁都是正确的，指出测试数据是经过设计的确定性数据，错误消息格式需要后继者的偏移量。审查者建议处理其他测试案例中的类似问题，特别是第693行的offnum == 33。

Participants:
* khoaduynguyen@gmail.com
* zengman@halodbtech.com

### **[\[PATCH\] llvmjit: always add the simplifycfg pass](https://www.postgresql.org/message-id/DFVDQRXJX7QW.KLYVOJSQW08Y@gmail.com)**
Pierre Ducroquet proposes adding the LLVM simplifycfg pass to PostgreSQL's JIT compilation to eliminate unnecessary jump instructions in generated assembly code. The original patch showed significant performance improvements (7ms runtime savings with only 0.1ms extra optimization cost) by removing redundant basic block jumps in tuple deforming operations. Matheus Alcantara reviewed the patch, noting it needed rebasing due to recent commits and questioning whether simplifycfg should be added when PGJIT_INLINE is set. Pierre provided a rebased version, confirming that O3 optimization already includes simplifycfg, but O0-based compilation heavily depends on it. Matheus conducted TPCH benchmarks showing mixed results - Q4 showed substantial execution time improvement (19.5s to 16.0s) while Q1 remained similar. Both agreed the patch makes sense without major regressions, with Matheus suggesting consolidating comments in the if/else blocks for better code clarity.

Pierre Ducroquet 提议在 PostgreSQL 的 JIT 编译中添加 LLVM simplifycfg 优化通道，以消除生成汇编代码中的不必要跳转指令。原始补丁通过移除元组变形操作中的冗余基本块跳转，显示出显著的性能改进（运行时间节省 7ms，仅增加 0.1ms 优化成本）。Matheus Alcantara 审查了补丁，指出由于最近的提交需要重新基线，并质疑是否应在设置 PGJIT_INLINE 时添加 simplifycfg。Pierre 提供了重新基线的版本，确认 O3 优化已包含 simplifycfg，但基于 O0 的编译严重依赖它。Matheus 进行了 TPCH 基准测试，结果不一 - Q4 显示出显著的执行时间改进（从 19.5s 到 16.0s），而 Q1 基本相同。双方都同意该补丁合理且没有重大回归，Matheus 建议整合 if/else 块中的注释以提高代码清晰度。

Participants:
* matheusssilv97@gmail.com
* p.psql@pinaraf.info

### **[Having problems generating a code coverage report](https://www.postgresql.org/message-id/aXKgf6G7Osvta8Js@paquier.xyz)**
Michael Paquier reports progress on generating code coverage reports in PostgreSQL. He found that adding `--ignore-errors` with multiple error patterns (inconsistent, gcov, range, empty, usage, path) to the genhtml invocation allows an unpatched HEAD build to work properly. However, VPATH builds remain problematic with a broken directory structure where the top-level incorrectly includes src/ and /home/ contents, with /home/ pointing to contrib/. Despite these VPATH build issues, Michael considers this a significant improvement over the previous non-functional state and expresses gratitude to Andres for the guidance.
Michael Paquier报告了在PostgreSQL中生成代码覆盖率报告的进展。他发现在genhtml调用中添加`--ignore-errors`并使用多个错误模式（inconsistent、gcov、range、empty、usage、path）可以让未打补丁的HEAD构建正常工作。然而，VPATH构建仍然存在问题，目录结构被破坏，顶级目录错误地包含src/和/home/内容，/home/指向contrib/。尽管存在这些VPATH构建问题，Michael认为这比之前无法工作的状态有了显著改进，并感谢Andres的指导。

Participants:
* aleksander@timescale.com
* andres@anarazel.de
* jian.universality@gmail.com
* michael@paquier.xyz
* pg@bowt.ie

### **[Some tests for TOAST, STORAGE MAIN/EXTENDED](https://www.postgresql.org/message-id/aXMdX1UTHnzYPkHk@paquier.xyz)**
Michael Paquier proposes adding regression tests for PostgreSQL's TOAST functionality, specifically for STORAGE MAIN/EXTENDED configurations. While working with TOAST code, he broke the handling of inline compressible entries but noticed the main regression test suite didn't detect this failure. His proposed patch includes tests for both MAIN and EXTENDED storage types with checks for the TOAST table itself. Nikhil Veldanda provides feedback on two issues: the `SELECT count(*) FROM :reltoastname` assertion could be brittle for EXTENDED storage due to variable chunk counts, suggesting `SELECT count(DISTINCT chunk_id)` instead, and the `pg_column_compression()` test assumes 'pglz' compression but `default_toast_compression` isn't pinned, recommending an explicit `SET default_toast_compression = 'pglz'` statement.
Michael Paquier提议为PostgreSQL的TOAST功能添加回归测试，特别是针对STORAGE MAIN/EXTENDED配置。在使用TOAST代码时，他破坏了内联可压缩条目的处理，但注意到主回归测试套件没有检测到这个故障。他提议的补丁包括对MAIN和EXTENDED存储类型的测试，并检查TOAST表本身。Nikhil Veldanda对两个问题提供反馈：对于EXTENDED存储，`SELECT count(*) FROM :reltoastname`断言可能由于可变的块数量而不稳定，建议使用`SELECT count(DISTINCT chunk_id)`；`pg_column_compression()`测试假设使用'pglz'压缩，但`default_toast_compression`未固定，建议显式设置`SET default_toast_compression = 'pglz'`语句。

Participants:
* michael@paquier.xyz
* veldanda.nikhilkumar17@gmail.com

### **[Assert when executing query on partitioned table](https://www.postgresql.org/message-id/3008134.1769125434@sss.pgh.pa.us)**
Tom Lane reviewed a patch addressing an assertion failure when executing queries on partitioned tables. He agreed with Joseph Koshakow's earlier proposal to simply delete the faulty Assert rather than implementing a more complex fix. Lane reasoned that allowing the caller to retry produces the same behavior as non-partition-movement cases, which users apparently find acceptable since no complaints have been received about the production behavior despite the code being old. He noted that introducing error throwing where none existed before would likely generate user complaints. Lane also discovered that the assertion failure can be demonstrated without injection points by having another session lock the tuple with SELECT FOR UPDATE before starting the INSERT, making the test simpler and back-patchable. The fix was committed as 4b760a181.

Tom Lane 审查了一个解决分区表查询执行时断言失败的补丁。他同意 Joseph Koshakow 早前提出的建议，即简单删除错误的断言而不是实施更复杂的修复。Lane 认为允许调用者重试会产生与非分区移动情况相同的行为，用户显然认为这是可接受的，因为尽管代码很旧，但没有收到关于生产环境行为的投诉。他指出，在以前没有错误的地方引入错误抛出可能会产生用户投诉。Lane 还发现，无需注入点即可演示断言失败，只需让另一个会话在开始 INSERT 之前使用 SELECT FOR UPDATE 锁定元组，这使测试更简单且可向后移植。修复已作为 4b760a181 提交。

Participants:
* d.koval@postgrespro.ru
* koshy44@gmail.com
* tgl@sss.pgh.pa.us

### **[UPDATE run check constraints for affected columns only](https://www.postgresql.org/message-id/CACJufxFimkvG8B+h1cNB7PoPHQiGVxe9-S=poWbJPtbi58XuOA@mail.gmail.com)**
Jian He provided an update on a PostgreSQL patch for optimizing UPDATE operations to run check constraints only for affected columns. The code has been further simplified and made more organized. However, the accompanying test has become more verbose in the process. This appears to be an ongoing development effort to improve UPDATE performance by avoiding unnecessary constraint checks on unchanged columns. No specific technical details about the implementation or further review feedback were provided in this brief update message.
Jian He就一个PostgreSQL补丁提供了更新，该补丁用于优化UPDATE操作，仅对受影响的列运行检查约束。代码已进一步简化并变得更加整洁。然而，伴随的测试变得更加冗长。这似乎是一个持续的开发工作，旨在通过避免对未更改列进行不必要的约束检查来提高UPDATE性能。在这个简短的更新消息中没有提供关于实现的具体技术细节或进一步的审查反馈。

Participants:
* jian.universality@gmail.com
* tgl@sss.pgh.pa.us

### **[Patch: dumping tables data in multiple chunks in pg\_dump](https://www.postgresql.org/message-id/CAMT0RQQ8DX+K7OTw3Lg+Yp2ew8TsZduiqtPszfiBixcpxKbz-A@mail.gmail.com)**
A patch for pg_dump to dump table data in multiple chunks is being reviewed, now at version 10. The patch adds a --max-table-segment-pages flag to split large heap tables during dumps. Recent changes include renaming the flag, adding heap table checks, using pg_relation_size for page calculations, and including documentation and tests. However, reviewer David Rowley has provided harsh feedback, citing multiple serious issues: potential integer overflow problems with tables >= 16TB due to mixing INT and BIGINT types, poor code quality with inconsistent formatting and style violations, inadequate documentation mentioning heap-only limitation, copy-paste errors in comments, and unnecessary boolean flags in data structures. The reviewer demands significant quality improvements before version 11 or threatens to withdraw from the review process.
针对pg_dump中按多个块转储表数据的补丁正在进行审查，目前已到第10版。该补丁添加了--max-table-segment-pages标志来在转储期间分割大型堆表。最近的更改包括重命名标志、添加堆表检查、使用pg_relation_size进行页面计算，以及包含文档和测试。然而，审查员David Rowley提供了严厉的反馈，指出多个严重问题：由于混合使用INT和BIGINT类型导致表>=16TB时的潜在整数溢出问题、代码质量差且格式和样式不一致、文档不足未提及仅限堆表的限制、注释中的复制粘贴错误，以及数据结构中不必要的布尔标志。审查员要求在第11版之前显著提高质量，否则威胁退出审查过程。

Participants:
* ashutosh.bapat.oss@gmail.com
* dgrowleyml@gmail.com
* hannuk@google.com
* nathandbossart@gmail.com
* zsolt.parragi@percona.com

### **[Refactor recovery conflict signaling a little]()**
Heikki Linnakangas proposes a series of patches to refactor PostgreSQL's recovery conflict signaling for improved readability without functional changes. The patches include: (1) removing the unused errdetail_abort() function that was supposed to add recovery conflict details to aborted transactions but appears unreachable in current code, (2) removing misleading reconnection hints when databases are being dropped during recovery, (3-4) separating recovery conflict reasons from process signals by introducing a dedicated enum and using a single PROCSIG_RECOVERY_CONFLICT flag with reasons communicated via PGPROC bitmask, and (5) refactoring ProcessRecoveryConflictInterrupt to eliminate confusing switch-statement fallthrough logic. Chao Li provides detailed technical review feedback, confirming the first two changes while identifying several issues in patches 3-5, including variable scoping suggestions, logic changes that need explanation, comment clarity improvements, inconsistent void casting, a typo, and a missing comparison operator in the final patch.

Heikki Linnakangas提出一系列补丁来重构PostgreSQL的恢复冲突信号处理，以提高可读性而不改变功能。补丁包括：(1) 移除未使用的errdetail_abort()函数，该函数本应为中止事务添加恢复冲突详细信息但在当前代码中似乎无法访问，(2) 移除在恢复期间删除数据库时的误导性重连提示，(3-4) 通过引入专用枚举将恢复冲突原因与进程信号分离，使用单个PROCSIG_RECOVERY_CONFLICT标志，原因通过PGPROC位掩码通信，(5) 重构ProcessRecoveryConflictInterrupt以消除令人困惑的switch语句穿透逻辑。Chao Li提供详细技术审查反馈，确认前两个更改，同时识别补丁3-5中的几个问题，包括变量作用域建议、需要解释的逻辑更改、注释清晰度改进、不一致的void强制转换、拼写错误以及最终补丁中缺少比较运算符。

Participants:
* hlinnaka@iki.fi
* li.evan.chao@gmail.com

### **[Fix a typo in comment](https://www.postgresql.org/message-id/5cfb747.2f21.19be8d77431.Coremail.dingyi_yale@163.com)**
Yi Ding reported finding a comment error in multixact.c and submitted a patch to fix the typo. The patch details were provided in an attached file. Michael Paquier acknowledged the report and confirmed he picked it up for later review. This is a straightforward documentation fix with no complex technical discussion or controversy. The issue appears resolved with maintainer acceptance, though the actual patch implementation is pending.
Yi Ding报告在multixact.c中发现注释错误，并提交了修复该拼写错误的补丁。补丁详情在附件中提供。Michael Paquier确认收到报告并表示已接受，将稍后审查。这是一个直接的文档修复，没有复杂的技术讨论或争议。问题似乎已通过维护者接受得到解决，但实际补丁实施仍在等待中。

Participants:
* dingyi_yale@163.com
* michael@paquier.xyz

### **[Assert the timestamp is available for ORIGN\_DIFFERS conflicts](https://www.postgresql.org/message-id/CAJpy0uCLKRqi0vOJAEGKoOzj6WR32Dxi4mvewjE4_2SE3uEOug@mail.gmail.com)**
The discussion centers on a PostgreSQL patch that adds assertions to verify that local timestamps are available for ORIGIN_DIFFERS conflicts. Shveta initially approved Hayato Kuroda's v2 patch after formatting improvements. However, Chao Li identified three issues: code duplication, unclear comments, and non-explicit assertion conditions. He suggested consolidating the assertions at the function's beginning with more explicit conditions. Amit Kapila acknowledged the suggestion to use `Assert(localts != 0)` for clarity but expressed concerns about type-specific checks making code harder to follow. Kuroda disagreed with moving assertions to the top, preferring to keep them within relevant switch-case branches to avoid cluttering other cases. He submitted v3 addressing the comment clarity and assertion explicitness while maintaining the current structure. Chao Li approved v3, indicating the patch is ready for further review.

该讨论围绕一个PostgreSQL补丁展开，该补丁添加断言来验证ORIGIN_DIFFERS冲突的本地时间戳可用性。Shveta最初在格式改进后批准了Hayato Kuroda的v2补丁。然而，Chao Li发现了三个问题：代码重复、注释不清晰和非显式断言条件。他建议在函数开头合并断言并使用更显式的条件。Amit Kapila认可使用`Assert(localts != 0)`提高清晰度的建议，但担心类型特定检查会使代码难以理解。Kuroda不同意将断言移至顶部，更倾向于将其保留在相关的switch-case分支内以避免干扰其他情况。他提交了v3版本，解决了注释清晰度和断言显式性问题，同时保持当前结构。Chao Li批准了v3版本，表明补丁已准备好进行进一步审核。

Participants:
* amit.kapila16@gmail.com
* kuroda.hayato@fujitsu.com
* li.evan.chao@gmail.com
* shveta.malik@gmail.com

### **[DOCS \- "\\d mytable" also shows any publications that publish mytable]()**
Fujii Masao has committed a documentation patch to clarify that PostgreSQL's `\d` command output lists are illustrative rather than exhaustive. The patch adds phrases like "such as" and "for example" to make clear that associated objects (indexes, constraints, rules, publications, triggers) shown with table descriptions are examples, not complete lists. Peter Smith originally proposed the patch after initially believing the documentation implied exhaustive listings. Fujii made several refinements to avoid redundant phrasing, removing "and so on" when "such as" was already present, and replacing some instances of "such as" with "for example" for better readability. Chao Li identified a missing whitespace before "triggers" in the final version, and Peter Smith confirmed the patch looks good aside from this formatting issue.
Fujii Masao已提交文档补丁，明确PostgreSQL的`\d`命令输出列表是示例性的而非详尽的。补丁添加了"such as"和"for example"等短语，明确表明与表描述一起显示的关联对象（索引、约束、规则、发布、触发器）是示例而非完整列表。Peter Smith最初提出该补丁，因为他之前认为文档暗示了详尽列表。Fujii进行了几项改进以避免冗余措辞，在已有"such as"时删除"and so on"，并将某些"such as"替换为"for example"以提高可读性。Chao Li发现最终版本中"triggers"前缺少空格，Peter Smith确认补丁看起来不错，除了这个格式问题。

Participants:
* li.evan.chao@gmail.com
* masao.fujii@gmail.com
* smithpb2250@gmail.com

### **[Limit memory usage by postgres\_fdw batches](https://www.postgresql.org/message-id/e39d964cb5ed91ede13a87109376a463@postgrespro.ru)**
Alexander Pyhalov proposes a solution to limit memory usage in postgres_fdw batches by introducing a new parameter called cursor_fetch_limit. This parameter restricts data fetching on the foreign server side based on both record count and estimated memory consumption. In testing with large record tables, this approach successfully limited backend memory usage to approximately 2GB instead of the previous 8GB without the patch. However, the implementation requires additional logic to handle cases where fewer tuples are retrieved than expected, introducing an es_eof EState field to signal when no more tuples are available. Pyhalov acknowledges uncertainty about whether this approach represents the optimal solution for the memory limitation problem.

Alexander Pyhalov 提出了一个解决方案来限制 postgres_fdw 批处理中的内存使用，通过引入名为 cursor_fetch_limit 的新参数。该参数基于记录数量和估计内存消耗在外部服务器端限制数据获取。在使用大记录表的测试中，该方法成功地将后端内存使用限制在约 2GB，而不是未打补丁时的 8GB。然而，该实现需要额外的逻辑来处理检索到的元组少于预期的情况，引入了 es_eof EState 字段来表示没有更多元组可用。Pyhalov 承认对于这种方法是否代表内存限制问题的最佳解决方案存在不确定性。

Participants:
* a.pyhalov@postgrespro.ru
* tomas@vondra.me

### **[Extended Statistics set/restore/clear functions\.](https://www.postgresql.org/message-id/CADkLM=c3JivzHNXLt-X_JicYknRYwLTiOCHOPiKagm2_vdrFUg@mail.gmail.com)**
The discussion centers on improvements to Extended Statistics set/restore/clear functions in PostgreSQL. The main focus is addressing issues with multirange handling in extended_statistics_update() for the mcv/expression path, which has been added. There's uncertainty about import_expressions() complaints regarding statatt_set_slot() with histograms. Style inconsistencies in error messages are being addressed in patch 0003, including typo fixes. Documentation needs expansion for most_common_val fields and their relationships. The key technical challenge involves statatt_get_type() function handling multirange text representations differently for MCVlist versus attribute stats. A proposed solution suggests refactoring examine_attribute() functions to unify them while allowing VacAttrStats generation even with zero attstattarget. The patches remain un-squashed for clarity.

关于PostgreSQL扩展统计集合/恢复/清除函数的改进讨论。主要焦点是解决extended_statistics_update()中mcv/表达式路径的多范围处理问题，该问题已得到解决。对于import_expressions()关于带直方图的statatt_set_slot()的投诉存在不确定性。错误消息的样式不一致问题正在0003补丁中解决，包括拼写错误修复。文档需要扩展most_common_val字段及其关系的说明。关键技术挑战涉及statatt_get_type()函数对MCVlist与属性统计的多范围文本表示的不同处理。提议的解决方案建议重构examine_attribute()函数以统一它们，同时允许即使在零attstattarget下也能生成VacAttrStats。补丁保持未压缩状态以保持清晰度。

Participants:
* corey.huinker@gmail.com
* li.evan.chao@gmail.com
* michael@paquier.xyz
* tndrwang@gmail.com

### **[display hot standby state in psql prompt](https://www.postgresql.org/message-id/d81c08f6-1a4f-48ee-b1ff-e78b145c9e12@uni-muenster.de)**
The discussion centers on a proposal to display hot standby state information in the psql prompt to help administrators manage multiple PostgreSQL servers. Fujii Masao supports the initial proposal to show "primary" or "standby" status in the prompt, finding it helpful for server management, but questions the utility of displaying read-only transaction status. Jim Jones responds by noting the lack of objections from other reviewers and asks whether they should revert to the original "primary" or "standby" proposal. The thread appears to be seeking consensus on the final implementation approach, with the simpler primary/standby indicator gaining favor over more complex transaction state information.
讨论围绕在psql提示符中显示热备状态信息的提案展开，以帮助管理员管理多个PostgreSQL服务器。Fujii Masao支持在提示符中显示"主服务器"或"备服务器"状态的初始提案，认为这对服务器管理很有帮助，但质疑显示只读事务状态的实用性。Jim Jones回应说其他审查者没有提出反对意见，并询问是否应该回到原来的"主服务器"或"备服务器"提案。该讨论似乎在寻求对最终实现方法的共识，较简单的主/备指示器比复杂的事务状态信息更受青睐。

Participants:
* andreas@proxel.se
* htamfids@gmail.com
* jim.jones@uni-muenster.de
* li.evan.chao@gmail.com
* masao.fujii@gmail.com
* nathandbossart@gmail.com
* srinath2133@gmail.com

### **[pg\_upgrade: optimize replication slot caught\-up check](https://www.postgresql.org/message-id/CAD21AoBQ7aRwfiizn4FFm9d9Lf9uEmn7-66L4eKsCAd17Gy=7g@mail.gmail.com)**
Masahiko Sawada has proposed an optimization for pg_upgrade's replication slot caught-up check. The patch introduces a faster method using binary_upgrade_check_logical_slot_pending_wal() for PostgreSQL 19+ instead of the slower binary_upgrade_logical_slot_has_caught_up() function used in PG18 and earlier. Shveta Malik provided detailed feedback on function naming, predicate ordering, version checks, and test validation. She suggested adding sanity checks and clarifying comments about test behavior. Chao Li reviewed the latest version (v7) and found it mostly good, noting only a minor documentation issue about pointer notation. Shveta confirmed the approach looks good after Sawada's updates, suggesting one small comment improvement. The optimization aims to reduce upgrade time by efficiently checking slot status in bulk rather than individually.

Masahiko Sawada 提出了对 pg_upgrade 复制槽追赶检查的优化方案。该补丁为 PostgreSQL 19+ 版本引入了更快的方法，使用 binary_upgrade_check_logical_slot_pending_wal() 函数替代 PG18 及更早版本中较慢的 binary_upgrade_logical_slot_has_caught_up() 函数。Shveta Malik 对函数命名、谓词排序、版本检查和测试验证提供了详细反馈，建议添加健全性检查并澄清测试行为的注释。Chao Li 审查了最新版本（v7）并认为总体良好，仅指出了关于指针表示法的小文档问题。在 Sawada 更新后，Shveta 确认该方法看起来不错，建议进行一个小的注释改进。该优化旨在通过批量而非逐个检查槽状态来减少升级时间。

Participants:
* li.evan.chao@gmail.com
* sawada.mshk@gmail.com
* shveta.malik@gmail.com

### **[tablecmds: reject CLUSTER ON for partitioned tables earlier]()**
Chao Li (Evan) proposes a patch to reject ALTER TABLE CLUSTER ON and SET WITHOUT CLUSTER commands for partitioned tables earlier in the command preparation phase rather than at execution time. The patch uses the existing ATSimplePermissions() infrastructure in ATPrepCmd() to make error handling consistent with other unsupported ALTER TABLE actions on partitioned tables. This changes the error message from "cannot mark index clustered in partitioned table" to a more standardized format. The patch evolved through multiple versions, with v2 adding similar treatment for INHERIT/NO INHERIT commands, fixing header comments, and ensuring NO INHERIT calls proper validation. Zsolt Parragi reviews the patch positively but suggests adding documentation mentions for unsupported operations, adding test cases for partitioned NO INHERIT, fixing trailing whitespace, removing redundant checks, and addressing leftover comments. Chao acknowledges the feedback and mentions working on related documentation updates in another patch.

李超（Evan）提出一个补丁，将ALTER TABLE CLUSTER ON和SET WITHOUT CLUSTER命令对分区表的拒绝从执行时提前到命令准备阶段。该补丁使用ATPrepCmd()中现有的ATSimplePermissions()基础设施，使错误处理与分区表上其他不支持的ALTER TABLE操作保持一致。这将错误消息从"cannot mark index clustered in partitioned table"改为更标准化的格式。补丁经历多个版本演进，v2版本添加了对INHERIT/NO INHERIT命令的类似处理，修复了标题注释，并确保NO INHERIT调用适当的验证。Zsolt Parragi积极评价该补丁，但建议为不支持的操作添加文档说明，为分区NO INHERIT添加测试用例，修复尾随空白符，移除冗余检查，并处理遗留注释。李超确认了反馈意见，并提到正在另一个补丁中处理相关文档更新。

Participants:
* li.evan.chao@gmail.com
* zsolt.parragi@percona.com

### **[Race conditions in logical decoding](https://www.postgresql.org/message-id/124728.1769077978@localhost)**
PostgreSQL developers are discussing race conditions in logical decoding where commit WAL records are decoded before CLOG (commit log) is updated, potentially causing incorrect visibility checks. Antonin Houska proposed a fix that waits for CLOG updates before building snapshots, using a polling mechanism with WaitLatch(). However, this approach causes deadlocks in synchronous replication scenarios where the publisher waits for subscriber confirmation while the subscriber cannot proceed without the commit being finalized. Álvaro Herrera analyzed the transaction commit sequence and suggested the deadlock occurs because transactions remain in procarray during synchronous replica waiting. He recommended algorithm improvements, restructuring nested loops to wait per transaction rather than restarting checks for all transactions. The discussion centers on finding an approach that ensures CLOG consistency without creating circular dependencies in synchronous replication.

PostgreSQL开发者正在讨论逻辑解码中的竞态条件问题，即在CLOG（提交日志）更新之前就解码了提交WAL记录，可能导致错误的可见性检查。Antonin Houska提出了一个修复方案，在构建快照前等待CLOG更新，使用WaitLatch()的轮询机制。然而，这种方法在同步复制场景中会导致死锁，发布者等待订阅者确认而订阅者无法在提交完成前继续处理。Álvaro Herrera分析了事务提交序列，建议死锁发生是因为事务在等待同步副本期间仍保留在procarray中。他建议改进算法，重构嵌套循环以按事务等待而不是重新检查所有事务。讨论的核心是找到既能确保CLOG一致性又不会在同步复制中产生循环依赖的方法。

Participants:
* ah@cybertec.at
* alvherre@kurilemu.de
* andres@anarazel.de
* mihailnikalayeu@gmail.com

### **[Remove redundant initialization of smgr pointer for relcache](https://www.postgresql.org/message-id/CAN4CZFP4zaFWXx2cP=X=6+VoDnoJ8Dh9cTpT4SjGdAAp=Ui2AQ@mail.gmail.com)**
The discussion focuses on removing redundant initialization of the smgr pointer in relcache code. While the proposed change is technically sound and should work correctly, concerns are raised about broader code clarity issues. The AllocateRelationDesc function has only one caller, and its documentation is incomplete and inconsistent between the function comment and call site. The reviewer suggests improving comments for better documentation or potentially removing the function entirely to make it more generally usable. The change itself is simple, but the surrounding code structure could benefit from refactoring for better maintainability and clarity.

讨论的重点是移除relcache代码中smgr指针的冗余初始化。虽然提议的更改在技术上是正确的并且应该能正常工作，但提出了关于更广泛代码清晰度问题的担忧。AllocateRelationDesc函数只有一个调用者，其文档不完整且在函数注释和调用点之间不一致。审查者建议改进注释以获得更好的文档，或者可能完全移除该函数以使其更通用。更改本身很简单，但周围的代码结构可以通过重构来提高可维护性和清晰度。

Participants:
* mrdrivingduck@gmail.com
* zsolt.parragi@percona.com

### **[warning: dereferencing type\-punned pointer](https://www.postgresql.org/message-id/ujkndaqmyvahxm6ob3jnljqu5ihtfzm64ndewpra3t3dpgvsoj@e2jrtgjnkn7x)**
Peter Eisentraut initially concluded that casting Node * to different pointer-to-struct types in PostgreSQL always violates C aliasing rules, explaining that compiler warnings appear mainly within translation units rather than across file boundaries. Andres Freund challenges this interpretation, citing C23 specifications about structure pointer conversions and initial member access rules. He argues that casting between structs with equivalent initial sequences may be legal under certain conditions, referencing aggregate type aliasing rules. Peter responds by clarifying that the cited C23 rule about aggregate types works in the opposite direction from what PostgreSQL needs - allowing access to Plan objects via Append pointers, not Append objects via Plan pointers. The discussion reveals uncertainty about C standard interpretations regarding struct casting and aliasing violations in PostgreSQL's Node system.
Peter Eisentraut最初认为在PostgreSQL中将Node *转换为不同的结构体指针类型总是违反C别名规则，解释编译器警告主要出现在翻译单元内而非跨文件边界。Andres Freund质疑这一解释，引用C23规范中关于结构体指针转换和初始成员访问规则的条款。他认为在某些条件下，具有等价初始序列的结构体之间的转换可能是合法的，并引用聚合类型别名规则。Peter回应澄清，所引用的C23规则关于聚合类型的工作方向与PostgreSQL需要的相反——允许通过Append指针访问Plan对象，而不是通过Plan指针访问Append对象。讨论揭示了对PostgreSQL节点系统中结构体转换和别名违规的C标准解释存在不确定性。

Participants:
* andres@anarazel.de
* ishii@postgresql.org
* peter@eisentraut.org
* tgl@sss.pgh.pa.us

### **[Hackorum \- a new mailing list frontend](https://www.postgresql.org/message-id/CAG0qCNhxpzE4hHozO2fgQ13oeqkWgkAGv4kUfnqxbPRxke-1PA@mail.gmail.com)**
Kai Wagner announced improvements to Hackorum, a PostgreSQL mailing list frontend, focusing on mobile view enhancements for better usability on smaller screens. The discussion addresses previous feedback including performance issues with thread loading, which have been resolved through optimization fixes. Visual improvements were made to connect thread outlines with messages using color coding and highlighting of currently visible messages. The team considered but decided against multiple listing options due to potential confusion between outline and message ordering. New features include automatic patchset download as tar.gz files and a downloadable script for local git integration. Questions remain about subscription options for approved senders and potential IMAP/JMAP server implementation, though the latter is considered complex for current implementation.

Kai Wagner宣布了对PostgreSQL邮件列表前端Hackorum的改进，重点是移动端视图优化以提升小屏幕设备的可用性。讨论回应了之前的反馈，包括线程加载性能问题，这些问题已通过优化修复得到解决。通过颜色编码和高亮显示当前可见消息，改善了线程大纲与消息之间的视觉连接。团队考虑但决定不采用多种列表选项，因为可能导致大纲和消息排序之间的混乱。新功能包括自动下载补丁集为tar.gz文件，以及用于本地git集成的可下载脚本。关于已批准发送者的订阅选项和潜在的IMAP/JMAP服务器实现仍存在疑问，但后者被认为对当前实现过于复杂。

Participants:
* kai.wagner@percona.com
* zsolt.parragi@percona.com

### **[Add WALRCV\_CONNECTING state to walreceiver](https://www.postgresql.org/message-id/aXKqm-mDNlAD_DT0@paquier.xyz)**
The discussion centers on a patch adding a WALRCV_CONNECTING state to PostgreSQL's WAL receiver. Michael Paquier reviews Xuneng Zhou's implementation, pointing out that the proposed assertion and fast-exit logic for handling race conditions is problematic. He argues against increasing exit paths between the startup process and WAL receiver process, suggesting instead a simpler approach: only transition to STREAMING state when the current state is CONNECTING, otherwise leave it unchanged. Both Chao Li and Xuneng Zhou agree with this feedback. Xuneng provides patch v7 implementing the minimal change as suggested. Michael tests the patch with injection points to verify WAL receiver control behavior and applies it as commit a36164e7465f. Xuneng concludes by mentioning plans to work on exposing XLogRecoveryCtlData metrics at SQL level.

讨论围绕为PostgreSQL的WAL接收器添加WALRCV_CONNECTING状态的补丁展开。Michael Paquier审查了Xuneng Zhou的实现，指出提议的断言和快速退出逻辑处理竞态条件是有问题的。他反对增加启动进程和WAL接收器进程之间的退出路径，建议采用更简单的方法：仅在当前状态为CONNECTING时才转换到STREAMING状态，否则保持不变。Chao Li和Xuneng Zhou都同意这一反馈。Xuneng提供了按建议实现最小更改的补丁v7。Michael使用注入点测试补丁以验证WAL接收器控制行为，并将其应用为提交a36164e7465f。Xuneng最后提到计划在SQL级别公开XLogRecoveryCtlData指标。

Participants:
* li.evan.chao@gmail.com
* michael@paquier.xyz
* noah@leadboat.com
* rahilasyed90@gmail.com
* xunengzhou@gmail.com

### **[Newly created replication slot may be invalidated by checkpoint](https://www.postgresql.org/message-id/TY4PR01MB169074400DA851B425BA5D4219494A@TY4PR01MB16907.jpnprd01.prod.outlook.com)**
The discussion focuses on a patch addressing replication slot invalidation during checkpoint operations. Hou Zhijie responds to code review comments from Kuroda Hayato, making several adjustments: removing unnecessary header inclusion, confirming that checkpoint_timeout changes aren't needed since concurrent checkpoints won't invalidate slots, and switching from psql() to safe_psql() in tests. The patch removes retry logic similar to commit 3510ebe and eliminates XLogGetOldestSegno() calls since race conditions are prevented. Amit Kapila provides additional feedback requesting expanded comments explaining why both RedoRecPtr and slot minimum LSN are needed, clearer test case documentation, and questioning the necessity of DEBUG2 logging. The issue affects PostgreSQL versions back to PG17, with backpatches planned once the main patch stabilizes.

该讨论专注于解决检查点操作期间复制槽失效问题的补丁。侯志杰回应了黑田隼人的代码审查意见，进行了几项调整：删除不必要的头文件包含，确认不需要更改checkpoint_timeout因为并发检查点不会使槽失效，并在测试中将psql()改为safe_psql()。该补丁删除了类似于提交3510ebe的重试逻辑，并消除了XLogGetOldestSegno()调用，因为可以防止竞态条件。Amit Kapila提供了额外反馈，要求扩展注释说明为什么需要RedoRecPtr和槽最小LSN，澄清测试用例文档，并质疑DEBUG2日志的必要性。该问题影响PostgreSQL版本直至PG17，一旦主补丁稳定将计划向后移植。

Participants:
* aekorotkov@gmail.com
* amit.kapila16@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* houzj.fnst@fujitsu.com
* kuroda.hayato@fujitsu.com
* mengjuan.cmj@alibaba-inc.com
* michael@paquier.xyz
* sawada.mshk@gmail.com
* tomas@vondra.me
* v.davydov@postgrespro.ru
* vignesh21@gmail.com

### **[\[PATCH\] Avoid potential NULL dereference in LIKE/ILIKE with C locale](https://www.postgresql.org/message-id/CABg3sZo30PKF-AYZ_eih=5snxqp73bVOGX7O_hBMqoFhcOWbjQ@mail.gmail.com)**
Eugeny Goryachev identified a potential NULL pointer dereference in PostgreSQL's LIKE/ILIKE operations when using the C locale. The issue occurs in the MatchText function in like_match.c, where the GETCHAR macro unconditionally passes a locale pointer to MATCH_LOWER, but this pointer can be NULL for C collation. This could cause crashes in configurations where MATCH_LOWER attempts to dereference the NULL locale pointer. The proposed patch adds an explicit NULL check in the GETCHAR macro, falling back to pg_ascii_tolower() for NULL locales, which is safe and appropriate for C locale behavior. This approach aligns with existing patterns in other PostgreSQL collation-aware functions that treat NULL locale as equivalent to C/POSIX behavior.
Eugeny Goryachev发现了PostgreSQL在使用C语言环境时LIKE/ILIKE操作中潜在的NULL指针解引用问题。该问题出现在like_match.c文件的MatchText函数中，GETCHAR宏无条件地将语言环境指针传递给MATCH_LOWER，但对于C排序规则，该指针可能为NULL。这可能在MATCH_LOWER尝试解引用NULL语言环境指针的配置中导致崩溃。提议的补丁在GETCHAR宏中添加了显式的NULL检查，对于NULL语言环境回退到pg_ascii_tolower()函数，这对于C语言环境行为是安全且合适的。这种方法与PostgreSQL中其他排序规则感知函数的现有模式一致，将NULL语言环境视为等同于C/POSIX行为。

Participants:
* gorcom2012@gmail.com

### **[ALTER TABLE: warn when actions do not recurse to partitions]()**
The discussion focuses on a PostgreSQL patch that adds warning notices when ALTER TABLE actions don't recurse to partitions. Jim Jones reviews Chao Li's code implementation, finding it generally acceptable but suggesting improvements. Key feedback includes fixing the errhint message capitalization per PostgreSQL's Error Message Style Guide, with Jim proposing a clearer hint: "To update partitions, apply the command to each one individually, or specify ONLY to suppress this message." A critical issue emerges during testing where the NOTICE is emitted before command validation, causing confusing output when commands fail (e.g., showing partition warnings before compression errors). Jim suggests moving the EmitPartitionNoRecurseNotice() call to ATExecCmd after successful execution rather than during preparation. The patch affects many regression tests, primarily adding ONLY keywords to suppress notices. Chao acknowledges the feedback and plans to integrate suggestions in the next version.
该讨论围绕一个PostgreSQL补丁展开，该补丁在ALTER TABLE操作不递归到分区时添加警告通知。Jim Jones审查了Chao Li的代码实现，认为总体可接受但建议改进。关键反馈包括根据PostgreSQL错误消息风格指南修正errhint消息大小写，Jim提出了更清晰的提示："要更新分区，请对每个分区单独应用命令，或指定ONLY来抑制此消息。"测试中出现一个关键问题，即在命令验证前就发出NOTICE，导致命令失败时输出混乱（如在压缩错误前显示分区警告）。Jim建议将EmitPartitionNoRecurseNotice()调用移至ATExecCmd中成功执行后，而非准备阶段。该补丁影响许多回归测试，主要是添加ONLY关键字来抑制通知。Chao确认了反馈并计划在下一版本中整合建议。

Participants:
* david.g.johnston@gmail.com
* htamfids@gmail.com
* jim.jones@uni-muenster.de
* li.evan.chao@gmail.com

### **[Remove PG\_MMAP\_FLAGS](https://www.postgresql.org/message-id/CAExHW5vTWABxuM5fbQcFkGuTLwaxuZDEE2vtx2WuMUWk6JnF4g@mail.gmail.com)**
Ashutosh Bapat proposed removing the PG_MMAP_FLAGS macro from portability/mem.h, citing Peter's observation that despite its placement in a portability header, it's only used in sysv_shmem.c and doesn't serve the intended portability purpose. Tom Lane initially noted that Ashutosh attached the wrong patch. Michael Paquier suggested making PG_MMAP_FLAGS local to sysv_shmem.c instead of complete removal, arguing the current approach avoids code duplication. However, Ashutosh clarified that the macro's placement and name misleadingly suggests it affects all mmap calls, when different mmap operations actually use different flag sets. Michael accepted this reasoning and agreed with Ashutosh's revised patch proposal. Ashutosh then provided an updated patch removing unnecessary parentheses from the macro definition and revising the commit message.
Ashutosh Bapat提议从portability/mem.h中移除PG_MMAP_FLAGS宏，引用Peter的观察，尽管该宏放置在可移植性头文件中，但实际只在sysv_shmem.c中使用，并未实现预期的可移植性目的。Tom Lane最初指出Ashutosh附加了错误的补丁。Michael Paquier建议将PG_MMAP_FLAGS设为sysv_shmem.c的本地宏而非完全移除，认为当前方法避免了代码重复。然而，Ashutosh澄清说该宏的位置和名称误导性地暗示它影响所有mmap调用，而实际上不同的mmap操作使用不同的标志集。Michael接受了这一理由并同意Ashutosh的修订补丁建议。Ashutosh随后提供了更新的补丁，移除了宏定义中不必要的括号并修订了提交消息。

Participants:
* ashutosh.bapat.oss@gmail.com
* michael@paquier.xyz
* peter@eisentraut.org
* tgl@sss.pgh.pa.us

### **[docs: clarify ALTER TABLE behavior on partitioned tables](https://www.postgresql.org/message-id/CAN4CZFNoLSUcVKcOOJgOtTkDuOseCL5j9MQr3tGjb3btD=jHNQ@mail.gmail.com)**
A PostgreSQL documentation patch aims to clarify ALTER TABLE behavior on partitioned tables. The reviewer provides detailed feedback on the proposed changes, identifying several grammatical and clarity issues. Key concerns include missing words ("and" in constraint alteration description), unclear wording for "partition columns constraints," and inconsistent documentation across different sub-commands. The reviewer notes that some existing documentation was removed without replacement, specifically about nonrecursive DROP COLUMN behavior. They highlight inconsistencies in how different constraint operations are documented, particularly regarding whether individual partitions can independently modify constraints. The reviewer suggests more explicit language about what properties new partitions inherit from their parent tables, recommending clearer descriptions of structural properties like column definitions, constraints, and storage settings.

一个PostgreSQL文档补丁旨在澄清分区表上的ALTER TABLE行为。审阅者对提议的更改提供了详细反馈，识别出几个语法和清晰度问题。主要关注点包括缺少词语（约束更改描述中缺少"and"）、"partition columns constraints"措辞不清楚，以及不同子命令间文档不一致。审阅者指出某些现有文档被删除而没有替换，特别是关于非递归DROP COLUMN行为的内容。他们强调了不同约束操作文档记录方式的不一致性，特别是关于各个分区是否可以独立修改约束。审阅者建议对新分区从父表继承的属性使用更明确的语言，推荐对列定义、约束和存储设置等结构属性进行更清晰的描述。

Participants:
* amit.kapila16@gmail.com
* david.g.johnston@gmail.com
* li.evan.chao@gmail.com
* zsolt.parragi@percona.com

### **[Reduce build times of pg\_trgm GIN indexes](https://www.postgresql.org/message-id/ef8782c9-68b7-4915-9f79-497765a8e205@gmail.com)**
David Geier seeks guidance on handling backwards-compatibility breaking changes for a pg_trgm GIN index optimization patch. Matthias van de Meent explains PostgreSQL's standard approach: when fixing bugs that affect index correctness, changes are documented in release notes with warnings for users to reindex affected indexes post-upgrade. He clarifies that pg_upgrade doesn't automatically reindex structures, as it only transfers catalogs and data files without validating data structure validity. Since only specific GIN opclasses would be affected (not all GIN indexes), automatic reindexing during upgrade would be inappropriate. David acknowledges the guidance and commits to updating his patch accordingly.

David Geier就pg_trgm GIN索引优化补丁的向后兼容性破坏变更寻求指导。Matthias van de Meent解释了PostgreSQL的标准做法：修复影响索引正确性的错误时，变更会记录在发行说明中，并警告用户在升级后重建受影响的索引。他澄清pg_upgrade不会自动重建索引结构，因为它只负责传输目录和数据文件而不验证数据结构有效性。由于只有特定的GIN操作符类会受影响（而非所有GIN索引），升级期间自动重建索引是不合适的。David确认了指导意见并承诺相应更新补丁。

Participants:
* boekewurm+postgres@gmail.com
* geidav.pg@gmail.com
* hlinnaka@iki.fi

### **[Time to drop RADIUS support?](https://www.postgresql.org/message-id/CA+hUKG+SH309V8KECU5=xuLP9Dks0v9f9UVS2W74fPAE5O21dg@mail.gmail.com)**
Thomas Munro proposes removing PostgreSQL's RADIUS authentication support due to security vulnerabilities and apparent lack of users. He notes that PostgreSQL's implementation may have accidental resilience through short timeouts, but the underlying RADIUS/UDP protocol has fundamental security issues highlighted in recent research. The RADIUS vulnerability mitigation he previously worked on lost momentum because: the protocol uses deprecated MD5-based technology, major RADIUS servers now issue warnings without mitigations, and no users have complained about compatibility issues. Munro suggests users can achieve better RADIUS authentication through PAM modules maintained by the FreeRADIUS project, which would handle standards compliance externally. He provides detailed configuration examples for RADIUS via PAM and proposes adding deprecation notices while removing the native RADIUS code and associated Windows/UDP workarounds.
Thomas Munro提议移除PostgreSQL的RADIUS认证支持，原因是存在安全漏洞且似乎缺乏用户。他指出PostgreSQL的实现可能通过短超时意外获得了弹性，但底层的RADIUS/UDP协议存在最近研究突出的根本性安全问题。他之前致力于的RADIUS漏洞缓解工作失去动力，因为：该协议使用已弃用的基于MD5的技术，主要RADIUS服务器现在在没有缓解措施时发出警告，且没有用户抱怨兼容性问题。Munro建议用户可以通过FreeRADIUS项目维护的PAM模块实现更好的RADIUS认证，这将在外部处理标准合规性。他提供了通过PAM进行RADIUS配置的详细示例，并提议在移除原生RADIUS代码和相关Windows/UDP变通方法的同时添加弃用通知。

Participants:
* thomas.munro@gmail.com

### **[Proposal: Conflict log history table for Logical Replication](https://www.postgresql.org/message-id/CAFiTN-t_4XvofM3an-WmykqnPE+9wf9U+o2M7p1CWd9eXkN88Q@mail.gmail.com)**
The discussion focuses on a PostgreSQL patch proposal for implementing a conflict log history table for logical replication. Dilip Kumar has addressed review comments from Peter Smith regarding documentation improvements, specifically fixing terminology to consistently use "Conflict log table" and reorganizing caution text placement. Vignesh C reported test failures where conflict record counts exceeded expected values, suggesting the tests should check for counts >= 1 rather than exact matches. Dilip confirmed fixing the test issues and addressing Shveta's comments, noting that only Peter's documentation suggestions remain pending. The patch appears to be in active development with ongoing code reviews and test refinements.
该讨论集中在PostgreSQL逻辑复制冲突日志历史表的补丁提案上。Dilip Kumar已经处理了Peter Smith关于文档改进的审查意见，具体包括修正术语以统一使用"Conflict log table"并重新组织警告文本的位置。Vignesh C报告了测试失败问题，其中冲突记录数超出预期值，建议测试应检查计数>=1而不是精确匹配。Dilip确认已修复测试问题并处理了Shveta的意见，指出只剩下Peter的文档建议待处理。该补丁似乎正在积极开发中，持续进行代码审查和测试改进。

Participants:
* amit.kapila16@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* dilipbalaut@gmail.com
* sawada.mshk@gmail.com
* shveta.malik@gmail.com
* smithpb2250@gmail.com
* vignesh21@gmail.com

### **[Fix gistkillitems & add regression test to microvacuum](https://www.postgresql.org/message-id/CALdSSPiGnqgvpfQDCydBf-=0hzyUs6Y0o0xNvd53BbcMWTVO=w@mail.gmail.com)**
Kirill Reshke submitted a v2 patch to fix a bug in GiST's killtuples functionality for root pages and add a regression test. Andrey Borodin reviewed the patch and confirmed that killtuples for GiST root pages is indeed broken, with the patch providing the correct fix. Borodin recommended against backpatching since the bug is harmless, but approved the patch for master. The discussion included minor suggestions about variable assignment in gistScanPage() and improving the test comment to explicitly mention the bug fix. Reshke requested clarification on the optimal wording for the test comment. The patch appears ready for integration with positive review feedback.

Kirill Reshke 提交了 v2 补丁，修复 GiST 根页面 killtuples 功能的错误并添加回归测试。Andrey Borodin 审查了补丁，确认 GiST 根页面的 killtuples 确实存在问题，补丁提供了正确的修复。Borodin 建议不要向后移植，因为该错误无害，但批准了主分支的补丁。讨论包括关于 gistScanPage() 中变量赋值的小建议以及改进测试注释以明确提及错误修复。Reshke 询问测试注释的最佳措辞。补丁在获得积极审查反馈后似乎已准备好集成。

Participants:
* reshkekirill@gmail.com
* x4mmm@yandex-team.ru

### **[Deadlock detector fails to activate on a hot standby replica](https://www.postgresql.org/message-id/b178ea8d-9ed9-48b3-b4f7-5cfc3ff6ee44@postgrespro.ru)**
Vitaly Davydov proposes a patch to fix a deadlock detector issue on hot standby replicas. The problem stems from spontaneous SIGALRM signals that occur while waiting for timeouts, preventing proper deadlock detection. His solution involves ignoring these spurious signals and continuing to wait for expected timeouts or buffer unpinning by conflicting backends. The patch is not finalized as he plans to add TAP tests. He expresses concerns about placing buffer-specific function calls in ResolveRecoveryConflictWithBufferPin but notes that alternative approaches would require more extensive changes. Davydov also suggests adding documentation about the timeout optimization introduced in commit 09cf1d52267644cdbdb734294012cf1228745aaa, as it creates non-obvious consequences for signal handling behavior.
Vitaly Davydov提出了一个补丁来修复热备副本上死锁检测器的问题。该问题源于在等待超时时出现的自发SIGALRM信号，这些信号阻止了正确的死锁检测。他的解决方案是忽略这些虚假信号，继续等待预期的超时或冲突后端的缓冲区解锁。补丁尚未完成，因为他计划添加TAP测试。他对在ResolveRecoveryConflictWithBufferPin中放置缓冲区特定函数调用表示担忧，但指出替代方法需要更广泛的更改。Davydov还建议为提交09cf1d52267644cdbdb734294012cf1228745aaa中引入的超时优化添加文档，因为它对信号处理行为产生了不明显的后果。

Participants:
* v.davydov@postgrespro.ru

### **[Checkpointer write combining](https://www.postgresql.org/message-id/CAMtXxw-2xFGrFzQ7O_9_a0zSJytkh6v-se5JvroCCQXtXUt=VA@mail.gmail.com)**
Soumya S Murali implemented checkpointer write combining patches to reduce checkpoint writeback overhead by batching buffer writes instead of issuing writebacks per buffer. The implementation combines refactoring, batching behavior, and instrumentation in a single patch targeting BufferSync(). Performance testing shows significant improvements: batching reduced checkpoint time from 0.754s to 0.625s and decreased sync files from 30 to 3. Additional testing compared batch sizes 8, 16, and 32, with batch size 32 providing the best balance - achieving lowest total checkpoint time (0.442s) while maintaining low sync fragmentation. Debug instrumentation confirms proper batching behavior with approximately 16 buffers per writeback call, while preserving WAL ordering and durability semantics. The author seeks feedback on the conservative approach.

Soumya S Murali 实现了检查点写入合并补丁，通过批处理缓冲区写入而非按缓冲区发出写回来减少检查点写回开销。该实现将重构、批处理行为和监控在单个补丁中结合，针对 BufferSync()。性能测试显示显著改进：批处理将检查点时间从 0.754 秒减少到 0.625 秒，同步文件数从 30 减少到 3。额外测试比较了批处理大小 8、16 和 32，批处理大小 32 提供最佳平衡 - 实现最低总检查点时间（0.442 秒）同时保持低同步碎片化。调试监控确认了正确的批处理行为，每次写回调用约处理 16 个缓冲区，同时保持 WAL 排序和持久性语义。作者寻求对保守方法的反馈。

Participants:
* andres@anarazel.de
* byavuz81@gmail.com
* li.evan.chao@gmail.com
* melanieplageman@gmail.com
* soumyamurali.work@gmail.com