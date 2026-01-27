---
layout: post
title: PostgreSQL Daily News 2026-01-27
---

# PostgreSQL Daily News#28 2026-01-27



## **PostgreSQL Articles - PostgreSQL 技术博客**

### **[Strategies for upgrading Amazon Aurora PostgreSQL and Amazon RDS for PostgreSQL from version 13](https://aws.amazon.com/blogs/database/strategies-for-upgrading-amazon-aurora-postgresql-and-amazon-rds-for-postgresql-from-version-13/)**
AWS is ending standard support for Amazon Aurora PostgreSQL and Amazon RDS for PostgreSQL version 13 on February 28, 2026. The post outlines upgrade strategies and benefits of newer PostgreSQL versions (14-17), including performance enhancements like vacuum emergency mode, improved I/O performance, and memory efficiency improvements. Key new features include advanced monitoring tools (pg_stat_io, pg_wait_events), logical replication improvements with failover support, and security enhancements. The upgrade brings system catalog changes that may affect applications. Four upgrade strategies are available: in-place upgrade, blue/green deployment, logical replication, and AWS DMS. AWS offers Extended Support for up to 3 years as a paid service for organizations needing more time to upgrade.

AWS将于2026年2月28日结束对Amazon Aurora PostgreSQL和Amazon RDS for PostgreSQL版本13的标准支持。该文章概述了升级策略和新版本PostgreSQL（14-17）的优势，包括性能增强如vacuum紧急模式、改进的I/O性能和内存效率提升。主要新功能包括高级监控工具（pg_stat_io、pg_wait_events）、支持故障转移的逻辑复制改进以及安全增强功能。升级带来的系统目录更改可能会影响应用程序。提供四种升级策略：就地升级、蓝绿部署、逻辑复制和AWS DMS。对于需要更多时间升级的组织，AWS提供长达3年的付费Extended Support服务。

`Abhimanyu Tomar`

### **[Phenomenology through PostgreSQL Documentation](https://www.cybertec-postgresql.com/en/phenomenology-through-postgresql-documentation/)**
The author explores how phenomenology applies to PostgreSQL documentation, arguing that good documentation preserves design context and perspective rather than claiming objective truth. They highlight PostgreSQL's documentation strength: contributors document their own changes close to implementation time, preserving the reasoning behind features like MVCC. This creates traceable archaeology instead of speculative guesswork for future developers. The author contrasts this with behavioral APIs like Stripe, noting PostgreSQL serves as a foundational building block requiring exposed assumptions and constraints. The documentation succeeds because it maintains contributor context, links features to their origins, and preserves decision-making rationale through integrated docs-as-code culture and public discussions.

作者探讨了现象学如何应用于PostgreSQL文档，认为好的文档应该保留设计背景和视角，而不是声称客观真理。他们强调了PostgreSQL文档的优势：贡献者在接近实现时记录自己的更改，保留了MVCC等功能背后的推理过程。这为未来开发者创造了可追溯的考古学，而非推测性的猜测。作者将其与Stripe等行为API进行对比，指出PostgreSQL作为基础构建块需要暴露假设和约束。该文档的成功在于它保持了贡献者背景，将功能与其起源联系起来，并通过集成的docs-as-code文化和公开讨论保留了决策制定的理由。

`Abhisek Goswami`



## **Popular Hacker Email Discussions - 热门 Hacker 邮件讨论精选**

### **[Remaining dependency on setlocale\(\)](https://www.postgresql.org/message-id/94a8ba10943adb3cca0a3718e74a090cacdde241.camel@j-davis.com)**
Jeff Davis has committed a patch addressing remaining setlocale() dependencies, which was backported to REL_18_STABLE only since master was already fine. The commitfest entry has been closed, but several loose ends remain unresolved. These include handling strerror and gettext functions, potentially wrapping them with uselocale() calls, though Windows would use a special setlocale() mode and NetBSD handling remains uncertain. Additionally, pg_strcasecmp() is still widely used in the backend and should be replaced with ASCII variants or database collation-aware versions. Various parsing functions like isalpha() in components such as ltree also continue relying on locale-dependent behavior that needs addressing.

Jeff Davis 已提交了一个解决剩余 setlocale() 依赖的补丁，该补丁仅回移到 REL_18_STABLE，因为 master 分支已经没有问题。commitfest 条目已关闭，但仍有几个问题待解决。这些包括处理 strerror 和 gettext 函数，可能需要用 uselocale() 调用包装它们，不过 Windows 会使用特殊的 setlocale() 模式，NetBSD 的处理方式仍不确定。此外，pg_strcasecmp() 在后端中仍被广泛使用，应该替换为 ASCII 变体或数据库排序规则感知版本。各种解析函数如 ltree 等组件中的 isalpha() 也继续依赖于需要解决的区域设置相关行为。

Participants - 参与者:
* a.kozhemyakin@postgrespro.ru
* li.evan.chao@gmail.com
* peter@eisentraut.org
* pgsql@j-davis.com
* tgl@sss.pgh.pa.us
* thomas.munro@gmail.com