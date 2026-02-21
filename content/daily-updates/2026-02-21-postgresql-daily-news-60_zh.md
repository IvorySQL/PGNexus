# PostgreSQL 每日更新#60 2026-02-21







## **热门 Hacker 邮件讨论精选**

### **[消除 xl\_heap\_visible 以减少 WAL（最终设置 VM on\-access）](https://www.postgresql.org/message-id/bqc4kh5midfn44gnjiqez3bjqv4zogydguvdn446riw45jcf3y@4ez66il7ebvk)**
Andres Freund对Melanie Plageman的补丁系列提供详细反馈，该系列旨在消除xl_heap_visible WAL记录并启用访问时可见性映射设置。关键点包括对变量命名的担忧（建议使用"all_visible"而非"vm_new_visible_pages"）、听起来只读但执行修改的函数名称，以及在WAL日志记录之前放置损坏修复以防止备用服务器分歧。

Andres质疑计算快照冲突范围的逻辑，建议一致性地跟踪所有范围而不是优化条件赋值。他建议为已冻结页面引入快速路径以提高修剪性能。对于访问时VM设置功能，他质疑使用vmbuffer参数的信号机制，以及是否应该推迟VM缓冲区固定直到实际需要时。

讨论涵盖可见性检查、使用GlobalVisState与单个XID进行事务ID比较，以及通过es_modified_relids跟踪修改关系等技术细节。Andres建议几个代码结构改进，并询问评估访问时VM更新成功频率的基准测试结果。

参与者:
andres@anarazel.de, hlinnaka@iki.fi, li.evan.chao@gmail.com, melanieplageman@gmail.com, reshkekirill@gmail.com, robertmhaas@gmail.com, x4mmm@yandex-team.ru, xunengzhou@gmail.com

### **[PGPROC 对齐（曾是 Re: pgsql: 将 RecoveryConflictReasons 与 procsignals 分离）](https://www.postgresql.org/message-id/f7bd155e-0bd4-4b09-86b3-92140af98654@iki.fi)**
Heikki Linnakangas推送了一个补丁，将PGPROC的'links'字段拆分为两个独立字段以提高清晰度，解决了Bertrand Drouvot关于PrintLockQueue()中缺失更改和注释更新的审查反馈。讨论重点是PGPROC结构体对齐优化以提高性能。Bertrand对字段分组和注释格式一致性提供了详细反馈。Heikki调整了注释分隔符并解决了样式问题。剩余补丁涉及在编译器支持时使用pg_attribute_aligned()进行缓存行对齐，对不支持的编译器提供回退行为。与使用联合填充的WALInsertLockPadded不同，PGPROC对齐被认为在没有填充的情况下是可接受的。Heikki认为剩余补丁已准备好提交，但承认缺乏进行性能测试的硬件，指出将相关字段分组通常对性能有益。

参与者:
andres@anarazel.de, bertranddrouvot.pg@gmail.com, hlinnaka@iki.fi

### **[流式复制和 WAL 归档交互](https://www.postgresql.org/message-id/41D301A5-AB81-4B21-8AC1-9DD602362D31@apple.com)**
来自Apple的Harinath Kanchu重新提起了关于生产环境中WAL归档间隙问题的讨论，引用了他去年的帖子。他对Andrey解决此问题的补丁表示支持。讨论的核心是在备用服务器上暴露last_archived_wal信息，这将有助于从外部识别和解决WAL归档间隙。Kanchu建议，即使完整的共享模式实现目前过于复杂，仅仅通过pg_stat_wal_receiver或类似机制使last_archived_wal在备用服务器上可查询也是有价值的。这将允许用户在流式复制环境中更有效地监控和处理WAL归档问题。该提议旨在提高WAL归档状态的可见性，以便更好地进行生产监控。

参与者:
andres@anarazel.de, hkanchu@apple.com, hlinnaka@iki.fi, masao.fujii@gmail.com, michael.paquier@gmail.com, nag1010@gmail.com, nkak@vmware.com, reshkekirill@gmail.com, rkhapov@yandex-team.ru, robertmhaas@gmail.com, root@simply.name, shirisharao@vmware.com, x4mmm@yandex-team.ru

### **[ecdh support 导致不必要的往返](https://www.postgresql.org/message-id/7BEC1173-B919-4BEC-AADB-D998B8AD8B90@yesql.se)**
Daniel Gustafsson发现在最近的ECDH更改后，SSL测试在启用FIPS的OpenSSL配置上失败了。虽然他最初修复了主要的SSL测试，但同事Nazir Bilal Yavuz发现还有两个额外的测试套件需要FIPS调整。Tom Lane提议通过使用PG_FIPS_COMPLIANT编译时标志有条件地更改默认SSL组配置来系统性地解决这个问题，认为这样可以避免持续的"打地鼠"式测试修复。Daniel不同意，他更倾向于确保测试在启用FIPS时始终通过，并提议设置一个使用启用FIPS的OpenSSL的CI作业进行持续测试。他们讨论了创建一个Cluster.pm函数来检测FIPS模式并自动调整测试配置。Tom Lane同意这种方法，如果FIPS检测可行的话，并建议在当前重新发布完成后将修复反向移植到v18。

参与者:
adrian.klaver@gmail.com, andres@anarazel.de, daniel@yesql.se, hlinnaka@iki.fi, jacob.champion@enterprisedb.com, markokr@gmail.com, peter_e@gmx.net, tgl@sss.pgh.pa.us

### **[在发布中跳过架构更改](https://www.postgresql.org/message-id/CAFiTN-vVFbzNQ__CppQdB6hJ3r+bLuy1XYUL0gou=UY4aeR5wg@mail.gmail.com)**
讨论围绕为PostgreSQL发布实现EXCEPT子句，以从FOR ALL TABLES发布中排除特定表。最近的补丁（v46-v47）已处理了各种审查意见，包括函数命名一致性、内存泄漏修复和代码组织。关键技术问题包括在EXCEPT子句中处理分区表、避免双重缓存失效以及解决函数命名歧义。Peter Smith对pg_publication.c中令人困惑的函数名称表示担忧，建议系统性重命名以提高清晰度。Ashutosh Sharma发现了几个错误，包括内存泄漏、缺少结果清理以及pg_get_publication_effective_tables的SIGABRT崩溃。Amit Kapila提议拆分补丁以单独处理分区逻辑，便于审查。补丁包含用于检查排除关系的新辅助函数和目录函数的更新，但仍需修复报告的崩溃并改进测试覆盖率。

参与者:
1518981153@qq.com, amit.kapila16@gmail.com, ashu.coek88@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com

### **[在ANALYZE期间可选择跳过未更改的关系?](https://www.postgresql.org/message-id/c84ac92f-cf37-4398-a0f3-719274cb8c90@tantorlabs.com)**
PostgreSQL补丁讨论专注于为ANALYZE实现MISSING_STATS_ONLY选项，该选项将跳过分析已有统计信息的关系。当前的讨论集中在日志实现细节上。Sami Imseih建议当关系被跳过时，日志应该使用INFO级别而不是DEBUG1，并使用ereport()而不是elog()以与现有ANALYZE日志模式保持一致。Ilia Evdokimov同意这种方法，提出了具体的消息格式："INFO: Skipping analyzing 'database.namespace.relation'"，该消息将在VERBOSE模式下显示。这种消息格式将与do_analyze_rel()中使用的现有风格保持一致。讨论强调保持日志简单，因为当关系被跳过时不会发生实际的统计信息收集，只需要一个信息行而不是详细输出。

参与者:
andreas@proxel.se, corey.huinker@gmail.com, dgrowleyml@gmail.com, ilya.evdokimov@tantorlabs.com, myon@debian.org, rob@xzilla.net, robertmhaas@gmail.com, samimseih@gmail.com, vasukianand0119@gmail.com



## **行业新闻**

### **[xAI的好消息:Grok现在可以很好地回答关于Baldur's Gate的问题](https://techcrunch.com/2026/02/20/great-news-for-xai-grok-is-now-pretty-good-at-answering-questions-about-baldurs-gate?utm_campaign=daily_pm)**
根据Business Insider的一份新报告，xAI的高级工程师从其他项目中被调配出来，专注于改善Grok回答视频游戏Baldur's Gate详细问题的能力。这一发展突显了AI公司如何投入大量工程资源来增强其模型在特定领域的表现，甚至包括视频游戏内容这样的细分领域。此举表明xAI正在优先考虑Grok的专业知识能力，这可能是改善AI系统对话能力和领域专业知识的更广泛努力的一部分。

### **[InScope获得1450万美元融资以解决财务报告的难题](https://techcrunch.com/2026/02/20/inscope-nabs-14-5m-to-solve-the-pain-of-financial-reporting?utm_campaign=daily_pm)**
InScope这家由曾在Flexport、Miro、Hopin和Thrive Global等公司工作过的会计师创立的初创公司获得了1450万美元的融资。该公司旨在自动化财务报表编制过程中的困难，解决财务报告流程中的一个重大痛点。这笔资金将帮助InScope开发和扩展其财务报表编制自动化解决方案，目标是那些在复杂耗时的财务报告要求方面遇到困难的企业。

### **[OpenAI黑手党：18家由校友创办的初创公司](https://techcrunch.com/2026/02/20/the-openai-mafia-15-of-the-most-notable-startups-founded-by-alumni?utm_campaign=daily_pm)**
自OpenAI十年前成立以来，许多前员工已经创立了自己的初创公司。在这些企业中，有些已成为OpenAI的主要竞争对手，如Anthropic，而另一些仅凭投资者兴趣就成功筹集了数十亿美元资金，甚至在推出实际产品之前。这篇文章审视了由OpenAI校友创立的18家著名初创公司，展示了从该公司涌现的重要创业人才，以及流入由前OpenAI人员领导的AI初创公司的大量风险投资。