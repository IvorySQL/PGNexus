---
layout: post
title: PostgreSQL Daily News 2026-01-26
---

# PostgreSQL Daily News#15 2026-01-26







## **Hacker Email Discussions**

### **[\[PATCH\] Refactor \*\_abbrev\_convert\(\) functions](https://www.postgresql.org/message-id/CAD-KL_H-jscSsTRa89W9k5+jaovTYQQv24J4f_cKi-Yr7E0PHw@mail.gmail.com)**
Aleksander Alekseev proposed a patch to refactor *_abbrev_convert() functions by simplifying the code to use murmurhash64() now that all Datums are 64-bit values. This refactoring was previously suggested by John Naylor. Aditya Gollamudi reviewed the change and confirmed it looks good, with all tests passing locally. The patch appears ready for integration, with positive feedback from the reviewer indicating no issues found during testing.

现在所有Datums都是64位值，Aleksander Alekseev提出了一个补丁来重构*_abbrev_convert()函数，通过使用murmurhash64()简化代码。这个重构之前由John Naylor建议。Aditya Gollamudi审查了这个变更并确认看起来不错，所有测试在本地都通过了。该补丁看起来已准备好集成，审查者的积极反馈表明在测试期间没有发现问题。

Participants:
* adigollamudi@gmail.com
* aleksander@tigerdata.com

### **[Some tests for TOAST, STORAGE MAIN/EXTENDED](https://www.postgresql.org/message-id/aXVn-xg0bdPc0aGM@paquier.xyz)**
Michael Paquier acknowledges feedback from Nikhil Kumar Veldanda regarding TOAST testing improvements. The discussion centers on making test assertions more robust for STORAGE EXTENDED configurations. Veldanda identified that the current `SELECT count(*) FROM :reltoastname` assertion is brittle because toast compression effectiveness can vary, potentially causing chunks to exceed expected counts. He suggests using `SELECT count(DISTINCT chunk_id)` or filtering `WHERE chunk_seq = 0` instead. Additionally, Veldanda notes that `pg_column_compression()` expects pglz compression but `default_toast_compression` isn't explicitly set, which could cause test failures on builds with different defaults. He recommends adding `SET default_toast_compression = 'pglz'`. Paquier agrees with both suggestions, stating they would address the issues he encountered while maintaining test effectiveness.
Michael Paquier 确认了 Nikhil Kumar Veldanda 关于 TOAST 测试改进的反馈。讨论围绕使 STORAGE EXTENDED 配置的测试断言更加稳健。Veldanda 指出当前的 `SELECT count(*) FROM :reltoastname` 断言很脆弱，因为 toast 压缩效果可能有所不同，可能导致块数超出预期计数。他建议改用 `SELECT count(DISTINCT chunk_id)` 或过滤 `WHERE chunk_seq = 0`。此外，Veldanda 注意到 `pg_column_compression()` 期望 pglz 压缩，但 `default_toast_compression` 没有显式设置，这可能在使用不同默认值的构建中导致测试失败。他建议添加 `SET default_toast_compression = 'pglz'`。Paquier 同意这两个建议，表示它们能解决他遇到的问题，同时保持测试有效性。

Participants:
* michael@paquier.xyz
* veldanda.nikhilkumar17@gmail.com

### **[Custom oauth validator options](https://www.postgresql.org/message-id/CAOYmi+nhh-fChn-8K7HV4kwVwsTm_gVy5jBgUBMqfM6Hm5E4zg@mail.gmail.com)**
Jacob Champion discusses PostgreSQL's custom OAuth validator options, focusing on potential naming conflicts between HBA (Host-Based Authentication) options and GUC (Grand Unified Configuration) variables. He suggests namespacing GUCs instead of making HBA options reserved names, proposing syntax like `guc.log_connections` since most HBA settings will be method-specific parameters rather than GUCs. Champion expresses concerns about consistency with the pg_hosts.conf file for SNI (Server Name Indication) and questions whether it should use similar customizable GUC contexts. He acknowledges that pg_hosts.conf currently lacks key=value pair support like pg_ident.conf. Champion shows interest in exploring a DefineCustomValidatorStringVariable function that could potentially forward to DefineCustomStringVariable in future implementations, suggesting this approach might work for gradual migration toward a more unified configuration system.
Jacob Champion 讨论了 PostgreSQL 的自定义 OAuth 验证器选项，重点关注 HBA（基于主机的身份验证）选项与 GUC（大统一配置）变量之间的潜在命名冲突。他建议对 GUC 进行命名空间化，而不是将 HBA 选项设为保留名称，提出像 `guc.log_connections` 这样的语法，因为大多数 HBA 设置将是特定于方法的参数而不是 GUC。Champion 对与用于 SNI（服务器名称指示）的 pg_hosts.conf 文件的一致性表示担忧，并质疑它是否应该使用类似的可定制 GUC 上下文。他承认 pg_hosts.conf 目前像 pg_ident.conf 一样缺乏键值对支持。Champion 对探索 DefineCustomValidatorStringVariable 函数表示兴趣，该函数可能在未来实现中转发到 DefineCustomStringVariable，表明这种方法可能适用于向更统一的配置系统的渐进迁移。

Participants:
* david.g.johnston@gmail.com
* jacob.champion@enterprisedb.com
* myon@debian.org
* robertmhaas@gmail.com
* vasukianand0119@gmail.com
* zsolt.parragi@percona.com

### **[eliminate xl\_heap\_visible to reduce WAL \(and eventually set VM on\-access\)](https://www.postgresql.org/message-id/7ib3sa55sapwjlaz4sijbiq7iezna27kjvvvar4dpgkmadml6t@gfpkkwmdnepx)**


Participants:
* andres@anarazel.de
* hlinnaka@iki.fi
* li.evan.chao@gmail.com
* melanieplageman@gmail.com
* reshkekirill@gmail.com
* robertmhaas@gmail.com
* x4mmm@yandex-team.ru
* xunengzhou@gmail.com

### **[\[oauth\] Stabilize the libpq\-oauth ABI \(and allow alternative implementations?\)](https://www.postgresql.org/message-id/CAOYmi+mQeneEuoWsO1uOZszrE_tMuF51sKNzT0Z=cevpV5H3_g@mail.gmail.com)**
Jacob Champion responds to Zsolt Parragi's questions about OAuth authentication implementation in PostgreSQL. Champion clarifies that client-side issuer validation is essential for protection against malicious servers, not just server-side validation. He explains that while plaintext password methods like LDAP can tunnel arbitrary data similar to Bearer tokens, OAUTHBEARER is not the appropriate layer for implementing arbitrary non-OAuth authentication systems. Champion agrees that pluggable authentication would be valuable but suggests SASL as the correct layer for generic authentication plugins rather than misusing OAuth mechanisms. He acknowledges specific use cases like CI environments where GitHub provides OAuth tokens as environment variables and promises to investigate GitHub and Cirrus implementations further.
Jacob Champion回应了Zsolt Parragi关于PostgreSQL中OAuth认证实现的问题。Champion澄清客户端发行者验证对于防护恶意服务器至关重要，仅有服务器端验证是不够的。他解释虽然像LDAP这样的明文密码方法可以像Bearer令牌一样传输任意数据，但OAUTHBEARER不是实现任意非OAuth认证系统的合适层级。Champion同意可插拔认证很有价值，但建议SASL作为通用认证插件的正确层级，而不是滥用OAuth机制。他承认CI环境等特定用例中GitHub将OAuth令牌作为环境变量提供，并承诺进一步调研GitHub和Cirrus的实现。

Participants:
* jacob.champion@enterprisedb.com
* li.evan.chao@gmail.com
* zsolt.parragi@percona.com

### **[docs: clarify ALTER TABLE behavior on partitioned tables](https://www.postgresql.org/message-id/CAKFQuwZwAuO3qXEeqxwV6vM+89BkB-aSkcXqDGG8e_xBy_Q3Xw@mail.gmail.com)**
The discussion focuses on improving PostgreSQL documentation for ALTER TABLE behavior on partitioned tables. David G. Johnston responds to Zsolt Parragi's review feedback, addressing grammatical issues and clarifying technical wording. Key points include: correcting missing conjunctions in constraint descriptions, clarifying that partition columns and constraints are implicitly renamed without ONLY specification, and refining language about inheritance behavior. Johnston proposes removing redundant sentences and suggests more precise wording for constraint propagation. A significant correction emerges regarding DROP COLUMN behavior in multi-parent inheritance scenarios, where descendant columns can be marked as both dependent and independent. The discussion involves detailed wordsmithing to ensure accurate technical documentation while maintaining clarity about partition inheritance rules and constraint handling.

讨论集中在改进PostgreSQL分区表ALTER TABLE行为的文档。David G. Johnston回应Zsolt Parragi的审查反馈，解决语法问题并澄清技术措辞。关键点包括：纠正约束描述中缺失的连词，澄清分区列和约束在没有ONLY规范时隐式重命名，以及完善继承行为的语言表述。Johnston提议删除冗余句子并建议更精确的约束传播措辞。关于多父继承场景中DROP COLUMN行为出现重要修正，其中后代列可以同时标记为依赖和独立。讨论涉及详细的措辞修改，以确保准确的技术文档同时保持分区继承规则和约束处理的清晰性。

Participants:
* amit.kapila16@gmail.com
* david.g.johnston@gmail.com
* li.evan.chao@gmail.com
* zsolt.parragi@percona.com

### **[ON CONFLICT DO SELECT \(take 3\)]()**
Jian He provides feedback on v19 of the ON CONFLICT DO SELECT patch, identifying several issues. He notes whitespace problems detectable with `git diff --check` and provides a fix. A key concern is incorrect test comments regarding row-level security policies - the test failure relates to SELECT policy p1_select_novels rather than UPDATE rights as suggested. He proposes removing or rephrasing these tests. He suggests modifying the UPDATE WITH CHECK policy to `WITH CHECK (dauthor = current_user AND false)` for better testing, noting that UPDATE WITH CHECK clauses are never evaluated in ON CONFLICT DO SELECT FOR UPDATE scenarios. Additional issues include unclear comments in ExecOnConflictSelect->ExecWithCheckOptions, problems with Assert macro optimization in release builds, and needed adjustments to WCOKind comments. He recommends updating discussion links and mentioning authors in the commit message.

贾恒对ON CONFLICT DO SELECT补丁的v19版本提供反馈，识别出几个问题。他指出可通过`git diff --check`检测的空白字符问题并提供修复。一个关键问题是关于行级安全策略的错误测试注释——测试失败与SELECT策略p1_select_novels相关，而非建议的UPDATE权限。他建议移除或重新表述这些测试。他建议将UPDATE WITH CHECK策略修改为`WITH CHECK (dauthor = current_user AND false)`以便更好地测试，注意到在ON CONFLICT DO SELECT FOR UPDATE场景中UPDATE WITH CHECK子句从不被评估。其他问题包括ExecOnConflictSelect->ExecWithCheckOptions中不清楚的注释、发布版本中Assert宏优化问题，以及需要调整WCOKind注释。他建议更新讨论链接并在提交消息中提及作者。

Participants:
* andreas@proxel.se
* dean.a.rasheed@gmail.com
* jian.universality@gmail.com
* marko@joh.to
* v@viktorh.net

### **[Remove PG\_MMAP\_FLAGS](https://www.postgresql.org/message-id/aXQydVFtu3LTAdqG@paquier.xyz)**
Michael Paquier expresses approval ("WFM" - Works For Me) of Ashutosh Bapat's revised patch to remove PG_MMAP_FLAGS. The revision involved removing unnecessary parentheses around the macro definition that were not required in the assignment context, and improving the commit message. This appears to be a simple code cleanup patch that has received positive feedback from a reviewer. The discussion seems to be concluding with the patch ready for potential commit, as no further changes or concerns were raised.
移除PG_MMAP_FLAGS的补丁获得了Michael Paquier的批准("WFM" - 适合我)。Ashutosh Bapat修订了补丁，移除了宏定义中在赋值语句中不需要的括号，并改进了提交信息。这似乎是一个简单的代码清理补丁，已经得到审核者的积极反馈。讨论似乎即将结束，补丁已准备好可能的提交，因为没有提出进一步的修改或关注点。

Participants:
* ashutosh.bapat.oss@gmail.com
* michael@paquier.xyz
* peter@eisentraut.org
* tgl@sss.pgh.pa.us

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/90bd2cbb-49ce-4092-9f61-5ac2ab782c94@gmail.com)**
A PostgreSQL patch (fcb9c977a) introduced runtime crashes in SPGist operations. Alexander Lakhin reported a reproducible crash during index insertions involving a buffer locking assertion failure. The crash occurs when SPGist attempts to conditionally lock a buffer that is already exclusively locked by the same process. Andres Freund initially suspected a SPGist bug but later acknowledged the issue may require accepting conditional lock failures for already-locked buffers. Tom Lane argued that the previous LWLock implementation allowed this behavior and that recursive index modifications legitimately need this pattern. Peter Geoghegan noted similar patterns exist in btree's free space management. The discussion centers on whether to remove the assertion or redesign the locking logic, with consensus leaning toward allowing conditional locks to fail when buffers are already locked by the same backend.

一个PostgreSQL补丁(fcb9c977a)在SPGist操作中引入了运行时崩溃。Alexander Lakhin报告了在涉及缓冲区锁断言失败的索引插入过程中出现可重现的崩溃。当SPGist尝试条件性锁定一个已被同一进程独占锁定的缓冲区时发生崩溃。Andres Freund最初怀疑是SPGist的错误，但后来承认该问题可能需要接受对已锁定缓冲区的条件锁失败。Tom Lane认为之前的LWLock实现允许这种行为，递归索引修改合理地需要这种模式。Peter Geoghegan指出btree的空闲空间管理中存在类似模式。讨论围绕是否移除断言或重新设计锁定逻辑展开，共识倾向于允许当缓冲区已被同一后端锁定时条件锁失败。

Participants:
* andres@anarazel.de
* boekewurm+postgres@gmail.com
* exclusion@gmail.com
* hlinnaka@iki.fi
* li.evan.chao@gmail.com
* melanieplageman@gmail.com
* michael.paquier@gmail.com
* noah@leadboat.com
* pg@bowt.ie
* reshkekirill@gmail.com
* robertmhaas@gmail.com
* tgl@sss.pgh.pa.us
* thomas.munro@gmail.com

### **[\[PATCH\] Align verify\_heapam\.c error message offset with test expectations](https://www.postgresql.org/message-id/tencent_556F0A9A3E4C0D1E2E20B32F@qq.com)**
Man Zeng responds to feedback on his patch to align verify_heapam.c error message offsets with test expectations. He expresses appreciation for the thorough review and approval of both patches. However, he indicates he doesn't plan to make further revisions to Patch 1 and suggests that Patch 2 alone might be sufficient. He acknowledges that the final decision will depend on the committers. The discussion appears to be in a concluding phase with positive feedback received.
Man Zeng回应了关于对齐verify_heapam.c错误消息偏移量与测试期望的补丁的反馈。他对彻底的审查和两个补丁的批准表示感谢。然而，他表示不打算对补丁1进行进一步修订，并建议仅补丁2可能就足够了。他承认最终决定将取决于提交者。讨论似乎已进入收尾阶段，收到了积极的反馈。

Participants:
* khoaduynguyen@gmail.com
* zengman@halodbtech.com

### **[libpq: Bump protocol version to version 3\.2 at least until the first/second beta](https://www.postgresql.org/message-id/CAGECzQTtBa6u2-dxv83g_-7ssop-Ds5-DFibrUin+RfDOtsJFg@mail.gmail.com)**
Jelte Fennema-Nio provides feedback on Jacob Champion's proposal to bump the libpq protocol version to 3.2. He approves the overall changes and documentation split, suggesting it's ready for commit. For documentation improvements, he recommends creating a consistent table format for protocol extensions, adding a dedicated section header for extensions, considering "extension name" vs "parameter name" as column headers, and mentioning the "_pq_." prefix earlier in documentation. On implementation, he suggests renaming the reserved protocol extension to include a suffix for future compatibility and adding error handling for duplicate keys in NegotiateProtocolVersion.
Jelte Fennema-Nio对Jacob Champion提议将libpq协议版本升级到3.2版本提供了反馈。他总体上赞同这些变更和文档拆分，认为可以提交。在文档改进方面，他建议为协议扩展创建一致的表格格式，为扩展添加专门的章节标题，考虑使用"扩展名称"而非"参数名称"作为列标题，并在文档中更早地提及"_pq_."前缀。在实现方面，他建议重命名保留的协议扩展以包含后缀以确保未来兼容性，并在NegotiateProtocolVersion中添加重复键的错误处理。

Participants:
* andres@anarazel.de
* hlinnaka@iki.fi
* jacob.champion@enterprisedb.com
* postgres@jeltef.nl
* robertmhaas@gmail.com

### **[proposal: plpgsql \- FOREACH t IN JSON ARRAY expr](https://www.postgresql.org/message-id/CAFj8pRB858EmA2xqaWQMUs_bYmLNZY8eBS2zP+wrg0vyT97gDA@mail.gmail.com)**
Pavel Stehule proposes adding native support for iterating over JSON arrays in PL/pgSQL through a new FOREACH syntax. Currently, developers must use combinations of jsonb_array_elements function with FOR IN SELECT loops, which creates significant performance overhead. The proposed syntax would be "FOREACH target IN JSON ARRAY expression LOOP .. END LOOP" where the target variable can be any type using JSON_TABLE cast rules. Performance testing demonstrates the current workaround is approximately 10 times slower than native array iteration - processing 10,000 elements 1,000 times took 25.8 seconds for JSON arrays versus 2.7 seconds for regular arrays. This proposal aims to provide efficient native JSON array iteration without high implementation costs.

Pavel Stehule 提议在 PL/pgSQL 中添加对 JSON 数组迭代的原生支持，通过新的 FOREACH 语法实现。目前，开发者必须使用 jsonb_array_elements 函数与 FOR IN SELECT 循环的组合，这会产生显著的性能开销。提议的语法是 "FOREACH target IN JSON ARRAY expression LOOP .. END LOOP"，其中目标变量可以是任何类型，使用 JSON_TABLE 转换规则。性能测试表明当前的替代方案比原生数组迭代慢约 10 倍——处理 10,000 个元素 1,000 次，JSON 数组需要 25.8 秒，而常规数组仅需 2.7 秒。该提议旨在提供高效的原生 JSON 数组迭代，而不需要高实现成本。

Participants:
* pavel.stehule@gmail.com

### **[unclear OAuth error message](https://www.postgresql.org/message-id/202601241015.y5uvxd7oxnfs@alvherre.pgsql)**
Álvaro Herrera raises concerns about unclear OAuth error messaging in PostgreSQL's authentication code. He questions whether the errdetail_log message "Validator failed to authorize the provided token" is appropriate when the OAuth validator successfully determined that a user should not be authorized, suggesting the detail message implies validator failure rather than proper authorization denial. He also notes a separate case where the same main error message is used when the validator fails to provide required identity information, asking if different error messages should distinguish between validator operational failure versus proper authorization denial. The issue involves improving error message clarity for OAuth authentication debugging and auditing purposes.

阿尔瓦罗·埃雷拉对PostgreSQL身份验证代码中不清楚的OAuth错误消息表达了担忧。他质疑当OAuth验证器成功确定用户不应被授权时，errdetail_log消息"验证器未能授权提供的令牌"是否合适，认为详细消息暗示验证器失败而不是正确的授权拒绝。他还注意到当验证器未能提供所需身份信息时使用相同主错误消息的另一种情况，询问是否应使用不同的错误消息来区分验证器操作失败与正确的授权拒绝。该问题涉及改进OAuth身份验证调试和审计目的的错误消息清晰度。

Participants:
* alvherre@kurilemu.de
* jacob.champion@enterprisedb.com

### **[Converting README documentation to Markdown](https://www.postgresql.org/message-id/202601240907.ccskdsdc5smx@alvherre.pgsql)**
PostgreSQL developers are discussing converting README files to Markdown format. Álvaro Herrera discovered that Doxygen documentation now properly renders README.md files in the documentation hierarchy, while plain README files lack this treatment. This observation provides additional motivation for adding .md extensions to README files. Robert Haas previously expressed support for converting to Markdown, though Daniel Gustafsson noted limited interest in full conversion. Junwang Zhao highlighted that GitHub also provides enhanced rendering for Markdown files, referencing the existing aio/README.md as an example. The discussion centers on whether improved documentation rendering justifies converting existing README files to Markdown format, with technical evidence supporting the change.

PostgreSQL开发者正在讨论将README文件转换为Markdown格式。Álvaro Herrera发现Doxygen文档现在能正确渲染README.md文件到文档层次结构中，而普通README文件缺乏这种处理。这一发现为给README文件添加.md扩展名提供了额外的动机。Robert Haas此前表示支持转换为Markdown，尽管Daniel Gustafsson指出对完全转换的兴趣有限。Junwang Zhao强调GitHub也为Markdown文件提供增强渲染，并引用现有的aio/README.md作为例子。讨论的核心是改进的文档渲染是否证明将现有README文件转换为Markdown格式的合理性，技术证据支持这一变更。

Participants:
* alvherre@kurilemu.de
* daniel@yesql.se
* peter@eisentraut.org
* robertmhaas@gmail.com
* zhjwpku@gmail.com

### **[Time to drop RADIUS support?](https://www.postgresql.org/message-id/CA+hUKGKXHBCptORqu2jZf5o0Gw45Q7YMW9wKmrXYDm35uQStoA@mail.gmail.com)**
The PostgreSQL team has reached consensus to remove direct RADIUS authentication support from HEAD (version 19) while keeping it in back branches. Thomas Munro created community-maintained PAM-based RADIUS migration documentation on the PostgreSQL wiki after testing on Debian and FreeBSD. The plan includes pointing to this wiki documentation from v19 release notes and adding deprecation notices to v14-18 documentation. Tom Lane suggests maintaining a short tombstone section in the current documentation location to prevent 404 errors, redirecting users to the wiki page rather than completely removing the auth-radius.html page.

PostgreSQL团队已达成共识，将从HEAD（版本19）中移除直接RADIUS身份验证支持，但在后续分支中保留。Thomas Munro在Debian和FreeBSD上测试后，在PostgreSQL wiki上创建了社区维护的基于PAM的RADIUS迁移文档。计划包括在v19发布说明中指向此wiki文档，并在v14-18文档中添加弃用通知。Tom Lane建议在当前文档位置保留一个简短的墓碑章节，以防止404错误，将用户重定向到wiki页面，而不是完全删除auth-radius.html页面。

Participants:
* alvherre@kurilemu.de
* jacob.champion@enterprisedb.com
* mbanck@gmx.net
* tgl@sss.pgh.pa.us
* thomas.munro@gmail.com

### **[Add SQL/JSON ON MISMATCH clause to JSON\_VALUE](https://www.postgresql.org/message-id/CA+v5N42Kn65HauYbZJ=bAVHjzdp=wCg64dd+WzRmtu=Uu1z+Ow@mail.gmail.com)**
Florents Tselai proposes adding the SQL/JSON ON MISMATCH clause to JSON_VALUE, starting with a smaller scope before implementing it for JSON_TABLE. The initial v1 patch passes tests for JSON_VALUE but encounters issues with JSON_QUERY due to executor-side problems. The author identifies the root cause: incorrect placement of the on_mismatch check in ExecEvalJsonExprPath and failure to set jsestate->escontext.details_wanted early enough, preventing proper soft error context capture. A v2 patch extends ON MISMATCH support to JSON_QUERY and JSON_TABLE. However, the author acknowledges that ON ERROR/MISMATCH/EMPTY semantics are complex and expects experts familiar with the standard may identify edge cases, particularly regarding precedence handling.

Florents Tselai 提议为 JSON_VALUE 添加 SQL/JSON ON MISMATCH 子句，在为 JSON_TABLE 实现之前先从较小的范围开始。初始 v1 补丁通过了 JSON_VALUE 的测试，但由于执行器端问题在 JSON_QUERY 上遇到困难。作者识别出根本原因：在 ExecEvalJsonExprPath 中错误放置了 on_mismatch 检查，并且未能及早设置 jsestate->escontext.details_wanted，导致软错误上下文无法正确捕获。v2 补丁将 ON MISMATCH 支持扩展到 JSON_QUERY 和 JSON_TABLE。然而，作者承认 ON ERROR/MISMATCH/EMPTY 语义复杂，预期熟悉标准的专家可能会发现边缘情况，特别是在优先级处理方面。

Participants:
* florents.tselai@gmail.com

### **[Add WALRCV\_CONNECTING state to walreceiver](https://www.postgresql.org/message-id/aXVxSXBMKN1XrqxB@paquier.xyz)**
Michael Paquier responded to Xuneng Zhou's proposal to add a WALRCV_CONNECTING state to the walreceiver functionality in PostgreSQL. Zhou had indicated plans to post patches and potentially start a new discussion thread. Paquier acknowledged this plan and specifically recommended that Zhou create an entirely new thread for the startup proposal to ensure clarity in the discussion. The brief exchange suggests this is part of a larger ongoing discussion about walreceiver state management, with the conversation transitioning toward a more formal patch submission and review process.

Michael Paquier回应了Xuneng Zhou关于在PostgreSQL的walreceiver功能中添加WALRCV_CONNECTING状态的提案。Zhou表示计划发布补丁并可能开启新的讨论线程。Paquier确认了这个计划，并特别建议Zhou为启动提案创建一个全新的线程以确保讨论的清晰性。这个简短的交流表明这是关于walreceiver状态管理的更大讨论的一部分，对话正在转向更正式的补丁提交和审查过程。

Participants:
* li.evan.chao@gmail.com
* michael@paquier.xyz
* noah@leadboat.com
* rahilasyed90@gmail.com
* xunengzhou@gmail.com

### **[\[PATCH\] Add monitoring guidance to replication slot documentation](https://www.postgresql.org/message-id/CADFU1-1O_xNZQHZMXsNDk0zX3Wd3KKaFpGN2+-3OLpmK6+qH8A@mail.gmail.com)**
Venkat Venkatakrishnan proposes a documentation patch for PostgreSQL's replication slots section (26.2.6) to add monitoring guidance. The current documentation warns about WAL accumulation filling pg_wal space and mentions max_slot_wal_keep_size as mitigation, but lacks proactive monitoring recommendations. The patch adds specific monitoring advice including disk space monitoring for pg_wal directory, replication lag metrics from pg_stat_replication, and slot status checks from pg_replication_slots. Based on production experience with EFM clusters, Venkat explains that inactive standbys commonly cause WAL accumulation when slots remain active but standbys disconnect, leading to potential primary failures. The patch aims to help database administrators detect this condition early through monitoring restart_lsn and active flags before disk space becomes critical.
Venkat Venkatakrishnan 提议为 PostgreSQL 复制槽文档章节 (26.2.6) 添加监控指导的补丁。当前文档警告 WAL 累积会填满 pg_wal 空间，并提及 max_slot_wal_keep_size 作为缓解措施，但缺乏主动监控建议。该补丁添加了具体的监控建议，包括 pg_wal 目录磁盘空间监控、pg_stat_replication 的复制延迟指标以及 pg_replication_slots 的槽状态检查。基于 EFM 集群的生产经验，Venkat 解释说当槽保持活跃但备机断开连接时，非活跃备机通常会导致 WAL 累积，可能导致主机故障。该补丁旨在帮助数据库管理员通过监控 restart_lsn 和活跃标志在磁盘空间变得关键之前早期检测此状况。

Participants:
* tvvraghavan@gmail.com

### **[pg\_stat\_statements: add missing tests for nesting\_level](https://www.postgresql.org/message-id/82dd02bb-4e0f-40ad-a60b-baa1763ff0bd@gmail.com)**
A patch was proposed to add missing test coverage for nesting_level functionality in pg_stat_statements, specifically for pgss_planner and pgss_ExecutorFinish hooks when track_planning is enabled. Alexander Lakhin identified that the new tests fail under CLOBBER_CACHE_ALWAYS mode due to query normalization differences, where parameter placeholders ($2, $3) appear instead of literal values (3, 1) in the expected output. Michael Paquier reproduced the issue and developed a solution using DISCARD PLANS before the first function call to force query revalidation, ensuring normalized queries are consistently stored regardless of CLOBBER_CACHE_ALWAYS mode while maintaining the test's ability to verify correct nesting level calculation in the planner hook.

提出了一个补丁来为pg_stat_statements中的nesting_level功能添加缺失的测试覆盖，特别是针对启用track_planning时的pgss_planner和pgss_ExecutorFinish钩子。Alexander Lakhin发现新测试在CLOBBER_CACHE_ALWAYS模式下失败，这是由于查询规范化差异导致的，期望输出中出现参数占位符($2, $3)而不是字面值(3, 1)。Michael Paquier重现了这个问题并开发了一个解决方案，在第一次函数调用前使用DISCARD PLANS来强制查询重新验证，确保无论CLOBBER_CACHE_ALWAYS模式如何都能一致地存储规范化查询，同时保持测试验证计划器钩子中正确嵌套级别计算的能力。

Participants:
* exclusion@gmail.com
* michael@paquier.xyz
* samimseih@gmail.com

### **[Fix a reference error for window functions: In the function 'find\_window\_functions', the deduplication logic should be removed](https://www.postgresql.org/message-id/CAErYLFAuxmW0UVdgrz7iiuNrxGQnFK_OP9hBD5CUzRgjrVrz=Q@mail.gmail.com)**
Meng Zhang reported a reference error in PostgreSQL's window function handling where deduplication logic in `find_window_functions` causes `winref` fields to remain unmodified in `optimize_window_clauses`. Tender Wang analyzed the issue, tracing it to commit ed1a88d which allowed window functions to adjust frameOptions. The problem occurs when window references are set to NIL, causing certain window functions to be skipped during processing due to duplicate handling. David Rowley confirmed the bug exists because deduplication logic broke after Andres' 2017 expression evaluation changes (b8d7f053c). While removing deduplication fixes the issue in master, it could affect query costing and cause plan changes in backbranches. David proposed a patch using `list_uniquify()` for backbranches but suggests direct duplicate removal in `optimize_window_clauses` might be safer.

张孟报告了PostgreSQL窗口函数处理中的引用错误，其中`find_window_functions`中的去重逻辑导致`optimize_window_clauses`中的`winref`字段保持未修改状态。Tender Wang分析了该问题，将其追溯到允许窗口函数调整frameOptions的提交ed1a88d。当窗口引用被设置为NIL时出现问题，导致某些窗口函数由于重复处理而被跳过。David Rowley确认该错误存在，因为去重逻辑在Andres 2017年表达式评估更改(b8d7f053c)后失效。虽然在主分支中移除去重可以修复问题，但可能影响查询成本计算并在后续分支中引起计划变更。David提出了在后续分支中使用`list_uniquify()`的补丁，但建议在`optimize_window_clauses`中直接移除重复项可能更安全。

Participants:
* dgrowleyml@gmail.com
* mza117jc@gmail.com
* tndrwang@gmail.com

### **[Extended Statistics set/restore/clear functions\.](https://www.postgresql.org/message-id/CAEG8a3+6ibpVjnGiw6AWcM4roMYoge=aOuw1JP7RV5Wv+q4xvA@mail.gmail.com)**
The discussion centers on extended statistics functions for PostgreSQL, particularly the restore functionality. Junwang Zhao reports a typo in v30-0003 patch ("incorect" should be "incorrect"). Michael Paquier suggests splitting the complex patch into smaller, manageable pieces using a divide-and-conquer approach: separate patches for ndistinct, dependencies, MCV, and expressions, followed by dump/restore functionality. He recommends creating simpler extended statistics objects for testing rather than relying on one comprehensive object. Corey Huinker agrees to implement a local static version of statatt_get_type() to avoid complexity issues and proposes a 9-patch structure. The main technical challenge involves handling multirange text representation parsing for MCV/expression statistics, where the export format differs from attribute statistics. The team aims to ensure each component is sound before integration to reduce reversion risks.
讨论围绕PostgreSQL的扩展统计函数，特别是恢复功能。Junwang Zhao报告了v30-0003补丁中的拼写错误（"incorect"应为"incorrect"）。Michael Paquier建议采用分而治之的方法将复杂补丁拆分为更易管理的小块：为ndistinct、dependencies、MCV和表达式分别创建补丁，然后是转储/恢复功能。他建议创建更简单的扩展统计对象进行测试，而不是依赖一个综合对象。Corey Huinker同意实现statatt_get_type()的本地静态版本以避免复杂性问题，并提出了9个补丁的结构。主要技术挑战涉及处理MCV/表达式统计的多范围文本表示解析，其中导出格式与属性统计不同。团队旨在确保每个组件在集成前都是健全的，以降低回滚风险。

Participants:
* corey.huinker@gmail.com
* li.evan.chao@gmail.com
* michael@paquier.xyz
* tndrwang@gmail.com
* zhjwpku@gmail.com

### **[Proposal: Adding compression of temporary files](https://www.postgresql.org/message-id/CAFjYY+J+TN-Ovi=ToGG4CcJweY_a6Hb6xL67fMESqKpT=FXuJQ@mail.gmail.com)**
Filip Janus has submitted an updated patch for PostgreSQL temporary file compression, addressing feedback from reviewers. The patch incorporates documentation improvements from Lakshmi, who noted that the new temp_file_compression GUC wasn't documented and suggested clarifying that compression effectiveness depends on workload characteristics. Zsolt Parragi provided detailed code review feedback, identifying typos ("Disaled", "mathods"), redundant constant definitions, unused variables, and structural issues with ifdef handling for compression methods. Key concerns include proper error handling for unsupported compression types, seek/tell functionality limitations with compressed files, and inconsistent comments about pglz support. The patch appears to build and pass tests, with hash join spill testing showing expected behavior where compression may not reduce logged file sizes due to fixed-size chunking.

Filip Janus 提交了PostgreSQL临时文件压缩的更新补丁，解决了审查者的反馈意见。该补丁整合了Lakshmi的文档改进，她指出新的temp_file_compression GUC缺少文档，并建议说明压缩效果取决于工作负载特性。Zsolt Parragi提供了详细的代码审查反馈，发现了拼写错误（"Disaled"，"mathods"）、重复的常量定义、未使用的变量以及压缩方法ifdef处理的结构性问题。主要关注点包括不支持的压缩类型的正确错误处理、压缩文件的seek/tell功能限制以及pglz支持的不一致注释。补丁似乎能够构建并通过测试，哈希连接溢出测试显示预期行为，即由于固定大小分块，压缩可能不会减少记录的文件大小。

Participants:
* fjanus@redhat.com
* lakshmigcdac@gmail.com
* zsolt.parragi@percona.com

### **[\[BUG\] \[PATCH\] pg\_basebackup produces wrong incremental files after relation truncation in segmented tables](https://www.postgresql.org/message-id/274e0a1a-d7d2-4bc8-8b56-dd09f285715e@gmail.com)**
Alexander Lakhin reports that the recently committed test 011_incremental_backup_truncation_block (commit ecd275718) is failing on Windows buildfarm animal fairywren due to Windows path length limitations. The test failure occurs because the generated file path exceeds Windows' maximum path length when the PostgreSQL source tree is located in a deep directory structure. The target filename for WAL summary operations becomes too long, causing "could not rename file" errors. Lakhin demonstrates that the issue can be reproduced locally with long source paths and notes that the test passes on the master branch because "master" is 7 characters shorter than "REL_18_STABLE". The problem specifically affects the pg_combinebackup test suite and suggests a need for shorter test names or path handling adjustments for Windows compatibility.

Alexander Lakhin报告最近提交的测试011_incremental_backup_truncation_block（提交ecd275718）在Windows构建农场动物fairywren上因Windows路径长度限制而失败。当PostgreSQL源代码树位于深层目录结构中时，生成的文件路径超过了Windows的最大路径长度，导致测试失败。WAL摘要操作的目标文件名变得过长，引起"无法重命名文件"错误。Lakhin演示该问题可以通过长源路径在本地重现，并注意到测试在主分支上通过，因为"master"比"REL_18_STABLE"短7个字符。该问题特别影响pg_combinebackup测试套件，建议需要更短的测试名称或Windows兼容性的路径处理调整。

Participants:
* andrew@dunslane.net
* exclusion@gmail.com
* oatkachenko@gmail.com
* robertmhaas@gmail.com
* stanislav.bashkyrtsev@elsci.io
* sulamul@gmail.com

### **[RFC: adding pytest as a supported test framework](https://www.postgresql.org/message-id/DFXOP22NFAEV.3T0VD64AW2C1H@jeltef.nl)**
The PostgreSQL development team is discussing adding pytest as a supported test framework. In the latest update (v11), Jelte Fennema-Nio addressed reviewer feedback from Aleksander Alekseev, who tested patches 0001-0003 on Linux x64. Key improvements include implementing proper string quoting logic to replace a TODO placeholder, moving the local_server fixture and associated test to patch 0004 (marked as work-in-progress), and switching from TAP 13 to TAP 12 implementation by removing the version line requirement. The reviewer noted the code is in good shape overall. Patches 0004-0005 remain as proof-of-concept work by Jacob Champion, demonstrating extended functionality but not intended for the initial merge.
PostgreSQL开发团队正在讨论将pytest添加为支持的测试框架。在最新的更新(v11)中，Jelte Fennema-Nio回应了Aleksander Alekseev的审查反馈，后者在Linux x64上测试了补丁0001-0003。主要改进包括实现适当的字符串引用逻辑以替换TODO占位符，将local_server固件和相关测试移至补丁0004(标记为正在进行的工作)，以及通过删除版本行要求从TAP 13切换到TAP 12实现。审查者指出代码整体状况良好。补丁0004-0005仍作为Jacob Champion的概念验证工作，展示扩展功能但不打算用于初始合并。

Participants:
* aleksander@tigerdata.com
* andres@anarazel.de
* byavuz81@gmail.com
* daniel@yesql.se
* jacob.champion@enterprisedb.com
* peter@eisentraut.org
* postgres@jeltef.nl
* robertmhaas@gmail.com
* tgl@sss.pgh.pa.us

### **[Cleaning up PREPARE query strings?](https://www.postgresql.org/message-id/aXYTOw_1GXq0oMaq@jrouhaud)**
The discussion focuses on a patch that cleans up PREPARE query strings but introduces error reporting issues. Sami Imseih identified that the patch breaks cursor positioning in error messages because rawstmt->stmt_location/length no longer accurately represent the original query text. When errors occur, the cursor points to incorrect locations in the cleaned-up text rather than the original query. Julien Rouhaud acknowledges this issue was previously reported by Tom Lane for execution-time errors, and the same problem now affects parse-analysis errors. Rouhaud proposes two potential solutions: updating positions of every element (undesirable) or implementing a "query offset" mechanism for parser_errposition and executor_errposition to report correct locations. A rebase (v3) has been provided while awaiting feedback on the preferred approach. The core challenge is maintaining accurate error location reporting while cleaning up query strings.
该讨论集中在一个清理PREPARE查询字符串的补丁上，但该补丁引入了错误报告问题。Sami Imseih发现补丁破坏了错误消息中的光标定位，因为rawstmt->stmt_location/length不再准确代表原始查询文本。当发生错误时，光标指向清理后文本中的错误位置而非原始查询。Julien Rouhaud承认这个问题之前被Tom Lane报告过用于执行时错误，现在同样的问题影响了解析分析错误。Rouhaud提出两个潜在解决方案：更新每个元素的位置（不理想）或为parser_errposition和executor_errposition实现"查询偏移"机制以报告正确位置。在等待首选方法的反馈时提供了重新基准版本（v3）。核心挑战是在清理查询字符串的同时保持准确的错误位置报告。

Participants:
* rjuju123@gmail.com
* samimseih@gmail.com
* tgl@sss.pgh.pa.us

### **[unnecessary executor overheads around seqscans](https://www.postgresql.org/message-id/CA+HiwqEUDeBaydqYOq4uK6Rz9PBpOagfZqQevD71=JZrmgE3CQ@mail.gmail.com)**
Andres Freund identified several performance overheads in PostgreSQL's sequential scan executor. The main issues include: repeated variable fetching and null checks in SeqNext() during every loop iteration, expensive checkXidAlive checks in table_scan_getnextslot() that are rarely reachable, redundant TupIsNull(slot) checks that compilers don't optimize, repeated table OID storage in slots, and suboptimal function call patterns preventing sibling call optimization in heap_getnextslot(). Amit Langote proposed using an ExecSeqScanFirst() approach similar to ExecProcNodeFirst() to eliminate the scandesc null check overhead. David Rowley implemented a patch moving the scan initialization to ExecInitSeqScan(), achieving a 4% performance improvement and suggesting pg_attribute_always_inline for SeqNext(). Amit Kapila explained that checkXidAlive exists for logical decoding safety but agreed it could potentially be moved to beginscan or converted to an assertion. Discussion continues on optimizing return values and addressing a comment about parallel scan execution that may be outdated.
Andres Freund 识别出PostgreSQL顺序扫描执行器中的几个性能开销。主要问题包括：SeqNext()在每次循环迭代中重复获取变量和空值检查，table_scan_getnextslot()中昂贵但很少触发的checkXidAlive检查，编译器无法优化的冗余TupIsNull(slot)检查，在插槽中重复存储表OID，以及heap_getnextslot()中阻止同级调用优化的次优函数调用模式。Amit Langote提议使用类似ExecProcNodeFirst()的ExecSeqScanFirst()方法来消除scandesc空值检查开销。David Rowley实现了一个补丁，将扫描初始化移到ExecInitSeqScan()，获得4%性能提升，并建议对SeqNext()使用pg_attribute_always_inline。Amit Kapila解释checkXidAlive的存在是为了逻辑解码安全，但同意可能将其移到beginscan或转换为断言。关于优化返回值和处理一个可能过时的并行扫描执行注释的讨论仍在继续。

Participants:
* amit.kapila16@gmail.com
* amitlangote09@gmail.com
* andres@anarazel.de
* dgrowleyml@gmail.com
* robertmhaas@gmail.com

### **[RFC: Allow EXPLAIN to Output Page Fault Information](https://www.postgresql.org/message-id/DFXQUHHKZN5U.2IAL4TGTP32IG@jeltef.nl)**
Jelte Fennema-Nio provides a detailed review of torikoshia's rebased patch for adding page fault information to EXPLAIN output. The review identifies ten issues including: a copy-paste error labeling storage I/O write as read, unclear comments in pgStorageIOUsageParallel, questionable "times" suffix usage, missing StorageIOUsageDiff call in prepared statement planning, lack of test coverage since worker became default io_method, and documentation issues. Fennema-Nio finds the feature useful and provides a fixup patch addressing six of the identified problems. Key remaining issues include removing unnecessary test files, adding proper test coverage using alternative io_method in Perl TAP tests, and simplifying documentation by removing overly detailed kernel configuration information.

Jelte Fennema-Nio对torikoshia重新提交的为EXPLAIN输出添加页面错误信息的补丁进行了详细审查。审查发现了十个问题，包括：将存储I/O写操作错误标记为读操作的复制粘贴错误、pgStorageIOUsageParallel中注释不清晰、"times"后缀使用存疑、预处理语句规划中缺少StorageIOUsageDiff调用、由于worker成为默认io_method导致测试覆盖不足，以及文档问题。Fennema-Nio认为该功能很有用，并提供了修复补丁解决其中六个问题。剩余关键问题包括删除不必要的测试文件、使用替代io_method在Perl TAP测试中添加适当的测试覆盖，以及通过删除过于详细的内核配置信息来简化文档。

Participants:
* andres@anarazel.de
* bruce@momjian.us
* postgres@jeltef.nl
* rjuju123@gmail.com
* tgl@sss.pgh.pa.us
* torikoshia@oss.nttdata.com

### **[Adding REPACK \[concurrently\]](https://www.postgresql.org/message-id/CADzfLwUEH5+LjCN+6kRfSsXwuou8rKXyVV42Wi-O_TG0360Kug@mail.gmail.com)**
Mihail reports on work rebasing MVCC-safe REPACK CONCURRENTLY on top of multi-snapshot version, finding it complex. He proposes an alternative approach using a mechanism similar to indcheckxmin for indexes, recording rewriting transaction XID in pg_class to prevent access by older snapshots with error instead of achieving true MVCC-safety. This approach avoids performance regression in normal cases and automatically clears via VACUUM when transaction ID is frozen. The solution also fixes ALTER TABLE issues beyond REPACK. Stress testing shows success with basic REPACK CONCURRENTLY and relcheckxmin additions, but multiple snapshots configuration fails with various errors including file read failures, division by zero, and cache lookup failures for relations.

Mihail报告了在多快照版本基础上重新构建MVCC安全REPACK CONCURRENTLY的工作，发现其复杂性。他提出了一种替代方法，使用类似于索引indcheckxmin的机制，在pg_class中记录重写事务XID，通过错误阻止旧快照访问，而非实现真正的MVCC安全。该方法在正常情况下避免性能回归，并在事务ID被冻结时通过VACUUM自动清除。该解决方案还修复了REPACK之外的ALTER TABLE问题。压力测试显示基本REPACK CONCURRENTLY和relcheckxmin添加成功，但多快照配置失败，出现各种错误，包括文件读取失败、除零错误和关系缓存查找失败。

Participants:
* ah@cybertec.at
* alvherre@alvh.no-ip.org
* mihailnikalayeu@gmail.com
* rob@xzilla.net

### **[\[PATCH\] Replace COUNT\(NULL\) with '0'::bigint](https://www.postgresql.org/message-id/CAEG8a3K1OZJm2k2W9ijasqQr3qkM2Ggy2LfB0ZP+cwLhEYzbeQ@mail.gmail.com)**
Junwang Zhao proposed a patch to replace COUNT(NULL) with '0'::bigint based on David Rowley's earlier suggestion. David responded that while he had already posted similar code, he didn't commit it because COUNT(NULL) is extremely unlikely to be used in real-world queries. He questioned whether this optimization is useful to anyone or just an academic exercise. Junwang acknowledged he may have misunderstood the context and agreed that COUNT(1) is more common than COUNT(NULL). Tom Lane concurred that such rare usage doesn't justify the planner overhead and maintenance costs, noting that other COUNT() optimizations target common real-world patterns. The consensus appears to be against implementing this optimization.

赵俊旺基于David Rowley早期建议，提议将COUNT(NULL)替换为'0'::bigint的补丁。David回应称虽然他已发布过类似代码，但未提交是因为COUNT(NULL)在实际查询中极不可能使用。他质疑这种优化是否对任何人有用，还是仅仅是学术练习。赵俊旺承认可能误解了上下文，并同意COUNT(1)比COUNT(NULL)更常见。Tom Lane赞同这种罕见用法不值得计划器开销和维护成本，指出其他COUNT()优化针对的是常见的实际使用模式。共识似乎反对实施此优化。

Participants:
* dgrowleyml@gmail.com
* tgl@sss.pgh.pa.us
* zhjwpku@gmail.com

### **[alignas \(C11\)](https://www.postgresql.org/message-id/862bad1f-b94e-403d-b730-8af435f3cf58@eisentraut.org)**
The discussion centers on fixing a compiler compatibility issue with the C11 alignas keyword in PostgreSQL. Peter Eisentraut and Tom Lane are addressing a problem where older GCC versions (particularly version 6) don't properly support alignas with large alignment values. They initially agreed on a workaround using __attribute__((aligned(a))) as a macro replacement, with Tom suggesting to extend the version cutoff to GCC 9 based on bug report #70066 evidence. However, after Peter implemented this solution, Tom reports that the fix caused new problems - various buildfarm animals are failing in the LLVM JIT backend because the macro definition conflicts with alignas() usage in LLVM header files. Tom now proposes a more targeted approach: defining the alignas macro only for the specific problematic usages and then immediately undefining it afterward.
讨论的重点是修复PostgreSQL中C11 alignas关键字的编译器兼容性问题。Peter Eisentraut和Tom Lane正在解决旧版GCC（特别是第6版）不能正确支持大对齐值alignas的问题。他们最初同意使用__attribute__((aligned(a)))作为宏替换的解决方案，Tom根据错误报告#70066的证据建议将版本截止点扩展到GCC 9。然而，在Peter实施此解决方案后，Tom报告该修复引起了新问题——各种构建农场动物在LLVM JIT后端失败，因为宏定义与LLVM头文件中的alignas()使用冲突。Tom现在提出了一个更有针对性的方法：仅为特定的问题用法定义alignas宏，然后立即取消定义。

Participants:
* peter@eisentraut.org
* tgl@sss.pgh.pa.us

### **[Optional skipping of unchanged relations during ANALYZE?]()**
The discussion centers on a proposed PostgreSQL feature for selectively running ANALYZE operations. The original "SMART ANALYZE" proposal would skip relations unchanged since last analysis using n_mod_since_analyze == 0, but reviewers find this approach too simplistic. Key concerns include analyzing tables after minimal modifications (even single row changes) and handling edge cases like new columns added after last analysis. Robert Treat proposes splitting functionality into two separate options: MISSING_STATS (for tables without any statistics, similar to vacuumdb --missing-stats-only) and MODIFIED_STATS (using autoanalyze threshold calculations). Sami Imseih supports this direction, suggesting GUC-based threshold configuration for flexibility. Additional considerations include handling system tables, empty tables that always appear to have missing stats, and the fact that pg_statistic persists through crashes while pg_stat_all_tables timestamps don't. The discussion reflects ongoing refinement toward a more nuanced approach than the original binary skip/analyze decision.

讨论围绕PostgreSQL的一个建议功能展开，用于有选择地运行ANALYZE操作。原始的"SMART ANALYZE"提案使用n_mod_since_analyze == 0来跳过自上次分析以来未更改的关系，但审阅者认为这种方法过于简单。主要关切包括在最小修改（甚至单行更改）后分析表，以及处理边缘情况如在上次分析后添加新列。Robert Treat提议将功能拆分为两个独立选项：MISSING_STATS（用于没有任何统计信息的表，类似于vacuumdb --missing-stats-only）和MODIFIED_STATS（使用自动分析阈值计算）。Sami Imseih支持这个方向，建议基于GUC的阈值配置以增加灵活性。其他考虑包括处理系统表、始终显示缺少统计信息的空表，以及pg_statistic在崩溃后持续存在而pg_stat_all_tables时间戳不会的事实。讨论反映了从原始的二进制跳过/分析决策向更细致方法的持续改进。

Participants:
* dgrowleyml@gmail.com
* ilya.evdokimov@tantorlabs.com
* myon@debian.org
* rob@xzilla.net
* robertmhaas@gmail.com
* samimseih@gmail.com
* vasukianand0119@gmail.com

### **[Issues with ON CONFLICT UPDATE and REINDEX CONCURRENTLY](https://www.postgresql.org/message-id/CADzfLwWZjWqeX6fF5=iKq_PJiw7G+k01CBu5xB8X_Z+nN1gqqA@mail.gmail.com)**
Mikhail Nikalayeu responds to Álvaro with attached fixes for issues related to ON CONFLICT UPDATE and REINDEX CONCURRENTLY operations. The proposed solution includes two commits: the first addresses the core problem with appropriate comment explanations, while the second adds a syscache for pg_inherits to improve performance. Mikhail expresses some uncertainty about the syscache implementation but believes it's the correct approach. He suggests alternative approaches, including storing parent information differently or creating a batched version of get_partition_ancestors that uses the same snapshot for multiple indexes to optimize performance further.

Mikhail Nikalayeu 回复 Álvaro，提供了修复 ON CONFLICT UPDATE 和 REINDEX CONCURRENTLY 操作相关问题的补丁。建议的解决方案包含两个提交：第一个解决核心问题并提供适当的注释说明，第二个为 pg_inherits 添加系统缓存以提高性能。Mikhail 对系统缓存实现表示一些不确定性，但认为这是正确的方法。他建议了替代方案，包括以不同方式存储父级信息，或创建 get_partition_ancestors 的批处理版本，为多个索引使用相同快照以进一步优化性能。

Participants:
* alvherre@kurilemu.de
* exclusion@gmail.com
* michael@paquier.xyz
* mihailnikalayeu@gmail.com
* noah@leadboat.com

### **[Make copyObject work in C\+\+](https://www.postgresql.org/message-id/DFXOG2P1QMS8.3L7MCAL0E6MVJ@jeltef.nl)**
The discussion centers on making PostgreSQL's PG_MODULE_MAGIC work with C++ extensions on MSVC. Peter Eisentraut committed an initial patch but disabled MSVC support temporarily. Jelte Fennema-Nio proposed reverting to positional initializers in PG_MODULE_MAGIC_DATA to enable C++11 compatibility on MSVC, since designated initializers require C++20. However, this approach causes compiler warnings when mixing designated and non-designated initializers in PG_MODULE_MAGIC_EXT calls. Andres Freund expressed skepticism about reverting to positional initializers, arguing that designated initializers were chosen to facilitate future field additions and removals. He noted that named arguments provide better error handling and only break extensions actually using removed options, rather than causing silent field misassignment. The core tension is between maintaining C++11 compatibility on MSVC versus preserving the maintainability benefits of designated initializers for future PostgreSQL development.
讨论的焦点是让PostgreSQL的PG_MODULE_MAGIC在MSVC上支持C++扩展。Peter Eisentraut提交了初始补丁但暂时禁用了MSVC支持。Jelte Fennema-Nio提议在PG_MODULE_MAGIC_DATA中恢复使用位置初始化器以实现MSVC上的C++11兼容性，因为指定初始化器需要C++20。然而，这种方法在PG_MODULE_MAGIC_EXT调用中混合指定和非指定初始化器时会导致编译器警告。Andres Freund对恢复位置初始化器表示怀疑，认为选择指定初始化器是为了便于未来字段的添加和删除。他指出命名参数提供更好的错误处理，只会破坏实际使用已删除选项的扩展，而不是导致静默的字段错误分配。核心冲突在于维持MSVC上的C++11兼容性与保持指定初始化器对未来PostgreSQL开发的可维护性优势之间。

Participants:
* andres@anarazel.de
* peter@eisentraut.org
* postgres@jeltef.nl
* thomas.munro@gmail.com

### **[ABI Compliance Checker GSoC Project](https://www.postgresql.org/message-id/3451994.1769277248@sss.pgh.pa.us)**
Tom Lane proposed a patch to improve ABI compliance checking by adding a --headers-dir option to the abidw call. This change addresses false positives where intentionally abstract structs are incorrectly reported as ABI breaks. The patch helps the tool focus on globally-accessible structures rather than internal implementation details. David Wheeler applied the changes to the baza buildfarm member, encountering initial disk space issues that were resolved. However, ABI failures persisted due to Dean Rasheed's recent commit that modified the TransitionCaptureState structure for MERGE trigger transition table fixes. Wheeler discovered that older libabigail versions require explicitly passing --drop-private-types alongside --headers-dir. The discussion clarified that current ABI complaints about TransitionCaptureState are expected and legitimate, while complaints about AfterTriggersTableData should be filtered out. Dean prepared a patch for .abi-compliance-history to address the legitimate ABI change but is holding off on pushing it until the tooling improvements are fully deployed.

汤姆·莱恩提出了一个补丁，通过在abidw调用中添加--headers-dir选项来改进ABI兼容性检查。这个更改解决了误报问题，即故意抽象的结构体被错误地报告为ABI破坏。该补丁帮助工具专注于全局可访问的结构体，而不是内部实现细节。大卫·惠勒将更改应用到baza构建农场成员，遇到了最初的磁盘空间问题但已解决。然而，由于迪恩·拉希德最近提交的修改TransitionCaptureState结构体以修复MERGE触发器过渡表的代码，ABI失败仍然存在。惠勒发现较旧的libabigail版本需要在--headers-dir的同时显式传递--drop-private-types。讨论澄清了当前关于TransitionCaptureState的ABI投诉是预期的和合理的，而关于AfterTriggersTableData的投诉应该被过滤掉。迪恩准备了一个.abi-compliance-history的补丁来处理合理的ABI更改，但在工具改进完全部署之前暂缓推送。

Participants:
* andres@anarazel.de
* andrew@dunslane.net
* david@justatheory.com
* dean.a.rasheed@gmail.com
* mankiratsingh1315@gmail.com
* tgl@sss.pgh.pa.us

### **[Add GoAway protocol message for graceful but fast server shutdown/switchover](https://www.postgresql.org/message-id/DFY0RHAZTTXJ.15AD95RE6A5N5@jeltef.nl)**
Jelte Fennema-Nio has updated their patch for adding a GoAway protocol message to PostgreSQL, which enables graceful but fast server shutdown and switchover capabilities. Following community feedback that opposed introducing additional minor protocol versions, the author pivoted from using a version bump approach to implementing this feature as a protocol extension instead. The latest update addresses remaining artifacts from the previous version-based implementation, specifically removing leftover references in the libpq_pipeline tests that were still using the old version bump methodology. This change maintains the core functionality while conforming to community preferences for protocol extension mechanisms over versioning changes.

Jelte Fennema-Nio已更新其为PostgreSQL添加GoAway协议消息的补丁，该功能可实现优雅但快速的服务器关闭和切换。在社区反对引入额外次要协议版本的反馈后，作者从使用版本升级方法转向将此功能实现为协议扩展。最新更新解决了先前基于版本实现的剩余痕迹，特别是删除了libpq_pipeline测试中仍在使用旧版本升级方法的遗留引用。此更改保持了核心功能，同时符合社区对协议扩展机制而非版本控制更改的偏好。

Participants:
* davecramer@gmail.com
* hlinnaka@iki.fi
* jacob.champion@enterprisedb.com
* me@jeltef.nl
* postgres@jeltef.nl

### **[Safer hash table initialization macro](https://www.postgresql.org/message-id/DFY2DVPSXAZX.1BAGDNB27D0F2@jeltef.nl)**
Jelte Fennema-Nio has submitted version 7 of a patch for safer hash table initialization macros. This revision is rebased and incorporates changes to hash_create calls that were introduced by commit 282b1cde9de. The patch appears to address wording improvements and includes a NOTE directive as previously requested. The submission follows earlier feedback and represents an iterative refinement of the proposed hash table initialization safety improvements. No specific technical details about the macro changes or safety enhancements are provided in this brief update message.

Jelte Fennema-Nio 提交了用于更安全的哈希表初始化宏的第7版补丁。此修订版本已重新基于最新代码，并合并了对由提交 282b1cde9de 引入的 hash_create 调用的更改。该补丁似乎解决了措辞改进问题，并包含了之前请求的 NOTE 指令。此次提交遵循了早期反馈，代表了对提议的哈希表初始化安全改进的迭代完善。此简短更新消息中未提供关于宏更改或安全增强的具体技术细节。

Participants:
* bertranddrouvot.pg@gmail.com
* postgres@jeltef.nl
* thomas.munro@gmail.com