---
layout: post
title: PostgreSQL Daily News 2026-02-05
---

# PostgreSQL Daily News#43 2026-02-05







## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[Fix pg\_stat\_get\_backend\_wait\_event\(\) for aux processes](https://www.postgresql.org/message-id/aYL8+H+J58EbZ8Hg@ip-10-97-1-34.eu-west-3.compute.internal)**
The discussion focuses on fixing pg_stat_get_backend_wait_event() for auxiliary processes and involves moving wait event information from PGPROC to PgBackendStatus. Bertrand Drouvot notes that a patch reduces PGPROC size from 832 to 824 bytes and questions whether padding should maintain 64-byte alignment. Heikki Linnakangas suggests this isn't necessary since PostgreSQL hasn't historically optimized PGPROC for cacheline alignment, and frequently accessed fields aren't optimally positioned anyway. The conversation shifts to why wait_event_info was originally stored in PGPROC rather than PgBackendStatus - initially because auxiliary processes lacked PgBackendStatus entries, but this rationale no longer applies. Sami Imseih supports moving wait events to backend status, noting it could resolve inconsistencies in pg_stat_activity where wait events change while other fields remain frozen during transactions. Sami provides detailed code review comments including suggestions for documentation improvements and questions about unused functions.

讨论重点是修复辅助进程的pg_stat_get_backend_wait_event()功能，涉及将等待事件信息从PGPROC移动到PgBackendStatus。Bertrand Drouvot注意到补丁将PGPROC大小从832字节减少到824字节，并询问是否应该添加填充以保持64字节对齐。Heikki Linnakangas认为这不必要，因为PostgreSQL历史上没有为缓存行对齐优化PGPROC，而且频繁访问的字段位置也不是最优的。讨论转向为什么wait_event_info最初存储在PGPROC而不是PgBackendStatus中——最初是因为辅助进程没有PgBackendStatus条目，但这个理由现在不再适用。Sami Imseih支持将等待事件移动到后端状态，指出这可以解决pg_stat_activity中的不一致问题，即等待事件在事务期间会变化而其他字段保持冻结。Sami提供了详细的代码审查意见，包括文档改进建议和对未使用函数的疑问。

Participants - 参与者:
* bertranddrouvot.pg@gmail.com
* hlinnaka@iki.fi
* robertmhaas@gmail.com
* samimseih@gmail.com

### **[Pasword expiration warning](https://www.postgresql.org/message-id/1f4d0b80-3fea-4f4d-8d33-a652ea23e90b@eisentraut.org)**
The thread discusses implementation issues for a password expiration warning feature in PostgreSQL. Peter Eisentraut identified several problems with Nathan Bossart's code: INT64_FORMAT cannot be used in translatable messages (PRId64 should be used instead), TimestampTz is inappropriate for duration quantities, and the "(s)" approach for plurals is poor practice. He suggested either showing only the largest time unit (days/hours/minutes) or displaying the actual expiration timestamp. Nathan worried about timezone formatting issues with timestamps and plural handling complexity. Zsolt Parragi argued that relative time ("1 day") is more user-friendly than absolute timestamps. Jacob Champion and Euler Taveira reminded Nathan that ngettext() can handle plurals properly. Euler agreed that showing only the largest time unit would be sufficient for users to take action, noting that exact precision isn't necessary for password expiration warnings.

该线程讨论了PostgreSQL密码过期警告功能的实现问题。Peter Eisentraut发现了Nathan Bossart代码中的几个问题：INT64_FORMAT不能在可翻译消息中使用（应该使用PRId64），TimestampTz不适合用于持续时间量，以及使用"(s)"处理复数形式是不良做法。他建议要么只显示最大时间单位（天/小时/分钟），要么显示实际的过期时间戳。Nathan担心时间戳的时区格式问题和复数处理的复杂性。Zsolt Parragi认为相对时间（"1天"）比绝对时间戳对用户更友好。Jacob Champion和Euler Taveira提醒Nathan可以使用ngettext()正确处理复数形式。Euler同意只显示最大时间单位对用户采取行动来说已经足够，指出密码过期警告不需要精确的时间精度。

Participants - 参与者:
* andrew@dunslane.net
* euler@eulerto.com
* gilles@darold.net
* jacob.champion@enterprisedb.com
* japinli@hotmail.com
* liuxh.zj.cn@gmail.com
* nathandbossart@gmail.com
* niushiji@gmail.com
* peter@eisentraut.org
* shiyuefei1004@gmail.com
* tgl@sss.pgh.pa.us
* tsinghualucky912@foxmail.com
* zsolt.parragi@percona.com

### **[Flush some statistics within running transactions](https://www.postgresql.org/message-id/CAN4CZFOgx0steMN23afxauphppMzvBD3y7u8Oi6XV8Eg3D3m1Q@mail.gmail.com)**
The discussion focuses on a patch series that enables flushing certain PostgreSQL statistics during running transactions, rather than only at transaction end. The patch introduces a new flush mode system with FLUSH_ANYTIME, FLUSH_AT_TXN_BOUNDARY, and FLUSH_MIXED modes, along with a configurable interval controlled by pgstat_flush_interval GUC (default 10 seconds).

Key technical issues being addressed include proper placement of pgstat_report_mixed_anytime flag setting within conditional blocks, removal of leftover comments, and architectural concerns about the FLUSH_MIXED mode's necessity. Sami Imseih suggests consolidating callback functions and proposes creating a ScheduleAnyTimeUpdate() routine to properly handle timeout scheduling for both core and extension statistics kinds.

The review highlights problems with the current timeout scheduling logic in pgstat_prep_pending_entry, where timeouts might not be enabled if pgstat_should_count_relation() returns early. Documentation improvements are suggested to clarify terminology around "transactional" versus "non-transactional" statistics. Additional testing is recommended for track_counts behavior and custom extension integration.

讨论集中在一个补丁系列上，该系列使PostgreSQL能够在运行事务期间刷新某些统计信息，而不仅仅在事务结束时。补丁引入了一个新的刷新模式系统，包括FLUSH_ANYTIME、FLUSH_AT_TXN_BOUNDARY和FLUSH_MIXED模式，以及由pgstat_flush_interval GUC控制的可配置间隔（默认10秒）。

正在解决的关键技术问题包括在条件块内正确放置pgstat_report_mixed_anytime标志设置、移除遗留注释，以及关于FLUSH_MIXED模式必要性的架构问题。Sami Imseih建议整合回调函数，并提议创建一个ScheduleAnyTimeUpdate()例程来正确处理核心和扩展统计类型的超时调度。

审查突出了pgstat_prep_pending_entry中当前超时调度逻辑的问题，如果pgstat_should_count_relation()提前返回，超时可能不会被启用。建议改进文档以澄清"事务性"与"非事务性"统计信息的术语。推荐为track_counts行为和自定义扩展集成进行额外测试。

Participants - 参与者:
* bertranddrouvot.pg@gmail.com
* masao.fujii@gmail.com
* michael@paquier.xyz
* samimseih@gmail.com
* zsolt.parragi@percona.com

### **[AIX support](https://www.postgresql.org/message-id/c5f3e681-d7a5-4061-9f4e-b437a2d6a500@iki.fi)**
The discussion concerns PostgreSQL's AIX support and performance issues discovered during testing. Tom Lane reports extremely slow I/O performance on the GCC compile farm's AIX machine (cfarm119), where basic file operations like copying data directories take 22 seconds compared to 0.035 seconds on Linux. He questions whether supporting AIX is worthwhile given these performance problems.

Heikki Linnakangas suggests the issue may be specific to the GCC compile farm's storage system, noting that the PostgreSQL buildfarm animal 'douc' doesn't exhibit similar problems. IBM contributors Srirama Kucherlapati and Aditya Kamath explain that cfarm119 runs as a shared LPAR with virtualized storage accessed by multiple communities concurrently, which affects performance. They offer access to the 'douc' node for more representative testing.

Aditya Kamath emphasizes IBM's commitment to AIX support, explaining that AIX users need modern PostgreSQL features including extensions like pgvector for AI workloads. IBM has been contributing patches across open-source projects including PostgreSQL's meson integration. Robert Haas requests evidence that performance issues affect all AIX machines rather than just this specific setup. The discussion remains unresolved regarding whether to continue AIX support work.

讨论涉及PostgreSQL的AIX支持和测试期间发现的性能问题。Tom Lane报告在GCC编译农场的AIX机器(cfarm119)上I/O性能极慢，基本文件操作如复制数据目录需要22秒，而在Linux上只需0.035秒。他质疑支持AIX是否值得，考虑到这些性能问题。

Heikki Linnakangas建议问题可能特定于GCC编译农场的存储系统，指出PostgreSQL构建农场动物'douc'没有表现出类似问题。IBM贡献者Srirama Kucherlapati和Aditya Kamath解释cfarm119作为共享LPAR运行，使用虚拟化存储，多个社区并发访问，这影响了性能。他们提供访问'douc'节点进行更具代表性的测试。

Aditya Kamath强调IBM对AIX支持的承诺，解释AIX用户需要现代PostgreSQL功能，包括用于AI工作负载的pgvector等扩展。IBM一直在为包括PostgreSQL的meson集成在内的开源项目贡献补丁。Robert Haas要求提供证据表明性能问题影响所有AIX机器而不仅仅是这个特定设置。讨论在是否继续AIX支持工作方面仍未解决。

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

### **[Reduce timing overhead of EXPLAIN ANALYZE using rdtsc?](https://www.postgresql.org/message-id/adbdd9b2-c012-496c-9f09-b11f81e7ec17@gmail.com)**
The discussion focuses on a patch to reduce timing overhead in EXPLAIN ANALYZE by using RDTSC (CPU timestamp counter) instead of slower system calls. Lukas Fittl has reworked the patch (v4) with several improvements: a GUC named "fast_clock_source" with values "auto", "rdtsc", and "off"; automatic RDTSC usage on Linux x86 when system clocksource is "tsc"; unified RDTSC/RDTSCP handling requiring both instructions; and runtime GUC changes without restart. David Geier provides feedback on naming conventions, suggesting consistency with existing GUCs like huge_pages, and discusses cross-platform support extending beyond Linux. Performance testing shows significant speedups (45ms to 34ms execution time). Andres Freund suggests broader application beyond EXPLAIN ANALYZE to pg_stat_statements and track_io_timing, proposing alternative GUC names like "timing_clock_source". Open questions include CI test failures and optimizing pg_ticks_to_ns performance overhead when RDTSC isn't used.

讨论集中在一个补丁上，该补丁通过使用RDTSC（CPU时间戳计数器）代替较慢的系统调用来减少EXPLAIN ANALYZE中的计时开销。Lukas Fittl重新设计了补丁（v4），进行了几项改进：一个名为"fast_clock_source"的GUC，具有"auto"、"rdtsc"和"off"值；当系统clocksource为"tsc"时在Linux x86上自动使用RDTSC；统一的RDTSC/RDTSCP处理需要两个指令；以及无需重启的运行时GUC更改。David Geier对命名约定提供反馈，建议与现有GUC如huge_pages保持一致，并讨论扩展到Linux之外的跨平台支持。性能测试显示显著加速（执行时间从45ms到34ms）。Andres Freund建议将应用范围扩展到EXPLAIN ANALYZE之外的pg_stat_statements和track_io_timing，提议替代GUC名称如"timing_clock_source"。未解决的问题包括CI测试失败和在不使用RDTSC时优化pg_ticks_to_ns性能开销。

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

### **[Exit walsender before confirming remote flush in logical replication](https://www.postgresql.org/message-id/72f61df5-ff97-43c1-9e98-7ad2a23b78ae@postgrespro.ru)**
This discussion addresses the safety of a proposed change to WAL sender shutdown behavior in logical replication, specifically regarding the wal_sender_shutdown_mode parameter. Michael Paquier raised concerns about potential dangers when the mode is set to "immediate," particularly in scenarios involving version mismatches between WAL sender and receiver sides. The concern centers on whether older backend versions on the receiver side could properly handle the new shutdown behavior. Andrey Silitskiy responded that he cannot identify problematic scenarios with old-version receivers, noting that even with immediate shutdown mode, the sender still flushes a completion message to the receiver as currently done, and when this isn't possible, it terminates similarly to the existing WalSndShutdown() behavior, which older receivers already handle appropriately.

这个讨论涉及逻辑复制中WAL发送器关闭行为提议修改的安全性，特别是关于wal_sender_shutdown_mode参数。Michael Paquier对将模式设置为"immediate"时的潜在危险表示担忧，特别是在WAL发送器和接收器端存在版本不匹配的场景中。担忧的核心是接收器端的旧版本后端是否能正确处理新的关闭行为。Andrey Silitskiy回应说他无法识别旧版本接收器的问题场景，指出即使使用即时关闭模式，发送器仍会像当前所做的那样向接收器刷新完成消息，当这不可能时，它会以类似于现有WalSndShutdown()行为的方式终止，而旧接收器已经能够适当处理这种情况。

Participants - 参与者:
* a.silitskiy@postgrespro.ru
* aekorotkov@gmail.com
* amit.kapila16@gmail.com
* andres@anarazel.de
* dilipbalaut@gmail.com
* horikyota.ntt@gmail.com
* htamfids@gmail.com
* kuroda.hayato@fujitsu.com
* masao.fujii@gmail.com
* michael@paquier.xyz
* osumi.takamichi@fujitsu.com
* peter.eisentraut@enterprisedb.com
* sawada.mshk@gmail.com
* smithpb2250@gmail.com
* v.davydov@postgrespro.ru

### **[Add expressions to pg\_restore\_extended\_stats\(\)](https://www.postgresql.org/message-id/aYKnI-1eViZVwbIS@paquier.xyz)**
The discussion focuses on adding expression support to pg_restore_extended_stats() function. Michael Paquier analyzed how PostgreSQL's ANALYZE computes and stores expression statistics, discovering that serialize_expr_stats() can skip inserting pg_statistic tuples for expressions with invalid data, storing NULL values instead. This means the restore function must handle variable numbers of valid expressions flexibly.

Corey Huinker initially worried about misalignment between expressions and their statistics when some are missing, but Michael clarified that accumArrayResult() always maintains array length equal to expression count by inserting NULLs for invalid entries. They agreed the restore function should accept JSON arrays with NULL elements representing missing expression statistics, maintaining positional correspondence.

The current patch incorrectly assumes all expressions have valid statistics and creates tuples for empty objects. Michael suggested allowing NULLs in the JSON array and using accumArrayResult() with disnull=true for consistency with backend behavior. Corey agreed to implement this approach and add tests for leading/trailing missing expressions.

Additional issues discussed include improving error messages with expression context and cleaning up the patch, which Michael noted contains formatting problems, inappropriate warning message changes, and unclear comments requiring resolution before acceptance.

讨论重点是为 pg_restore_extended_stats() 函数添加表达式支持。Michael Paquier 分析了 PostgreSQL 的 ANALYZE 如何计算和存储表达式统计信息，发现 serialize_expr_stats() 可以跳过为无效数据的表达式插入 pg_statistic 元组，转而存储 NULL 值。这意味着恢复函数必须灵活处理可变数量的有效表达式。

Corey Huinker 最初担心当某些表达式缺失时，表达式与其统计信息之间会出现错位，但 Michael 澄清了 accumArrayResult() 总是通过为无效条目插入 NULL 来保持数组长度等于表达式计数。他们同意恢复函数应该接受包含 NULL 元素的 JSON 数组来表示缺失的表达式统计信息，保持位置对应关系。

当前补丁错误地假设所有表达式都有有效统计信息，并为空对象创建元组。Michael 建议允许 JSON 数组中包含 NULL，并使用带有 disnull=true 的 accumArrayResult() 以与后端行为保持一致。Corey 同意实现这种方法并添加针对前导/尾随缺失表达式的测试。

讨论的其他问题包括通过表达式上下文改进错误消息以及清理补丁，Michael 指出补丁包含格式问题、不当的警告消息更改和需要在接受前解决的不清楚注释。

Participants - 参与者:
* corey.huinker@gmail.com
* li.evan.chao@gmail.com
* michael@paquier.xyz
* tndrwang@gmail.com
* tomas@vondra.me

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CANhcyEWz2Pmcgtt73kV5E5YY=5LSM-YqCXSinoBHL_y=HYMZRQ@mail.gmail.com)**
Shlok Kyal reviewed Vignesh C's v38 patch for handling EXCEPT TABLE functionality with partitioned tables in PostgreSQL publications. Shlok identified a bug in the GetRelationPublications function call where 'pub_relid' was used instead of 'relid', causing incorrect replication behavior when partition tables are explicitly listed in EXCEPT TABLE clauses. The issue manifested when creating multiple publications with different partition hierarchies - changes from excluded partitions were still being replicated during incremental sync. Shlok provided a test case demonstrating the problem and fixed it in an updated patch version. He also addressed Peter's previous comments about the unconditional use of ONLY clause in partition handling, explaining that this behavior remains consistent with ALTER PUBLICATION ADD TABLE. Extended tests were added as a separate patch to verify the fixes.

Shlok Kyal审查了Vignesh C的v38补丁，该补丁用于处理PostgreSQL发布中分区表的EXCEPT TABLE功能。Shlok在GetRelationPublications函数调用中发现了一个bug，使用了'pub_relid'而不是'relid'，导致在EXCEPT TABLE子句中明确列出分区表时出现错误的复制行为。当创建具有不同分区层次结构的多个发布时会出现此问题——被排除分区的更改在增量同步期间仍然被复制。Shlok提供了一个演示该问题的测试用例，并在更新的补丁版本中修复了它。他还回应了Peter之前关于在分区处理中无条件使用ONLY子句的评论，解释说这种行为与ALTER PUBLICATION ADD TABLE保持一致。扩展测试作为单独的补丁添加以验证修复。

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



