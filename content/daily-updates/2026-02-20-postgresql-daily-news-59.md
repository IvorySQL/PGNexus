# PostgreSQL Daily News#59 2026-02-20



## **PostgreSQL Articles**

### **[apt.postgresql.org: changelogs, build logs and Ubuntu releases resolute and plucky](https://www.postgresql.org/about/news/aptpostgresqlorg-changelogs-build-logs-and-ubuntu-releases-resolute-and-plucky-3238/)**
The PostgreSQL APT repository has introduced several improvements. Changelog files are now automatically retrievable through apt commands like "apt changelog postgresql-18", though currently only recent packages have changelogs available. Build logs are now stored as .build.xz files alongside packages in the pool directory, without automated download tools. Support for Ubuntu 26.04 "resolute" has begun with packages now available, while Ubuntu 25.04 "plucky" has reached end-of-life and moved to the archive repository.

`www.postgresql.org`

### **[Hacking Workshop for March 2026](http://rhaas.blogspot.com/2026/02/hacking-workshop-for-march-2026.html)**
Robert Haas is organizing a hacking workshop for March 2026 featuring discussions on Tomas Vondra's "Performance Archaeology" talk from 2024.PGConf.EU. The workshop will include 2-3 discussion sessions with Vondra participating. Interested participants can sign up through a provided form to receive session invites. This represents a community effort to dive deeper into PostgreSQL performance analysis techniques and methodologies presented at the European PostgreSQL conference.

`rhaas.blogspot.com`

### **[How Glooko Turns 3B+ Data Points/Month into Lifesaving Diabetes Healthcare with Tiger Data](https://www.tigerdata.com/blog/how-glooko-turns-3b-data-points-per-month-into-lifesaving-diabetes-healthcare-tiger-data)**
Glooko, a diabetes monitoring platform serving over 1 million patients, migrated their critical medical data workload from a document database to Tiger Data's managed PostgreSQL solution. The company processes over 100 million glucose measurements daily from continuous glucose monitors, generating 3+ billion data points monthly. Their previous system faced sluggish ingestion, 30TB of data bloat from index overhead, slow 14-day and 90-day query rollups, and no retention policies. By switching to Tiger Cloud's time-series optimized PostgreSQL with TimescaleDB hypertables, automatic partitioning, and policy-based compression, Glooko achieved 95-97% compression ratios, 480x faster queries (from 4 minutes to 0.5 seconds), 40% cost reduction, and more stable ingestion while maintaining HIPAA/GDPR compliance across their global data centers.

`Per Grapatin`

### **[PostgreSQL Anonymizer 3.0 : Parallel Static Masking + JSON import / export](https://www.postgresql.org/about/news/postgresql-anonymizer-30-parallel-static-masking-json-import-export-3236/)**
PostgreSQL Anonymizer 3.0 has been released by Dalibo, introducing significant performance and usability improvements. The major new feature is parallel static masking using PostgreSQL background workers, which can dramatically reduce masking time for large databases by processing multiple tables simultaneously while respecting foreign key constraints. The release also adds JSON import/export functionality for masking rules, making it easier to manage complex masking policies programmatically. Version 3.0 includes critical security fixes for two CVEs that could allow privilege escalation, particularly affecting PostgreSQL 14 installations. The release drops support for PostgreSQL 13 and removes legacy static masking features. Users should upgrade immediately due to the security vulnerabilities.

`www.postgresql.org`



## **Popular Hacker Email Discussions**

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CAK98qZ1zWzRB0ABG7ULzTeWKRR5C7-FxLqM-6v8wQDiFM+DNAg@mail.gmail.com)**
Robert Haas and Alexandra Wang are discussing the pg_plan_advice patch series. Robert has committed patches 0001 and 0002, with the main patch now being 0002 in version 15. Alexandra is halfway through reviewing 0002 and confirms that 0001 looks good, promising more feedback by week's end. Robert released version 17, having committed the previously separate 0004 patch that Richard reviewed. A key bug fix was implemented: pga_identifier.c was incorrectly using planner_rt_fetch() instead of rt_fetch(). The former uses simple_rte_array which can be mutated by self-join elimination and join removal, while rt_fetch() uses the Query's rtable directly, which never changes. Since pg_plan_advice needs stable identifiers, the immutable approach was necessary. This change fixed test failures when running with pg_plan_advice.feedback_warnings=on. Additional XXX comments were also cleaned up.

Participants:
alexandra.wang.oss@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us

### **[Optional skipping of unchanged relations during ANALYZE?](https://www.postgresql.org/message-id/CAA5RZ0v02tJ9uBnhR4Uf4EEte4fsLiL3uKXxO+Fcs_-D2kESUw@mail.gmail.com)**
Sami Imseih provides a detailed code review of the v5 MISSING_STATS_ONLY patch for PostgreSQL's ANALYZE command. He identifies a significant inefficiency where examine_attribute() is called twice for each attribute - once during the early missing stats check and again during normal processing. Imseih suggests restructuring the code by making relation_has_missing_column_stats() take an attribute number parameter and integrating the missing stats check directly into examine_attribute() with a boolean flag. He also recommends moving the relation-skipping logic to occur after attribute analysis when attr_cnt equals zero. Additional feedback includes requests for more comprehensive test coverage including inheritance partitions, declarative partitions, and expression indexes; improving logging by using INFO level and ereport formatting; and running pgindent for code formatting. He confirms that autoanalyze uses threshold-based decisions rather than modified stats detection.

Participants:
andreas@proxel.se, corey.huinker@gmail.com, dgrowleyml@gmail.com, ilya.evdokimov@tantorlabs.com, myon@debian.org, rob@xzilla.net, robertmhaas@gmail.com, samimseih@gmail.com, vasukianand0119@gmail.com

### **[add assertion for palloc in signal handlers](https://www.postgresql.org/message-id/CALdSSPiPw2QadBpDK0g+AswfxCagK=05U_bJAuVO4_Jr_1mU7Q@mail.gmail.com)**
The discussion centers on safety issues with using ereport() and palloc() inside PostgreSQL signal handlers. Kirill Reshke's patch adds assertions to detect palloc usage in signal handlers, but testing reveals that die() and quickdie() functions commonly call ereport() from signal handlers, which can lead to unsafe memory allocation.

Andres Freund argues that ereport() calls in signal handlers are problematic, especially with TLS/OpenSSL state corruption risks. He suggests restricting ereport() usage to single-user mode only, though notes even that isn't truly safe. Heikki Linnakangas agrees and proposes a patch to narrow the exception to only when actually stuck in uninterruptible getc() operations.

The participants discuss several alternatives: completely removing ereport() from quickdie() (losing client error messages), adding more safety checks before ereporting, or handling SIGQUIT more like SIGTERM with delayed processing. There's also discussion about improving pipe support in waiteventset.c for better interrupt handling, particularly on Windows where completion-based IO complicates readiness-based interfaces.

The core issue remains unresolved - balancing safety against informative error reporting in signal handlers.

Participants:
andres@anarazel.de, hlinnaka@iki.fi, nathandbossart@gmail.com, reshkekirill@gmail.com, thomas.munro@gmail.com

### **[Flush some statistics within running transactions](https://www.postgresql.org/message-id/aZaKVOrRO_bHsevn@paquier.xyz)**
The patch proposes flushing certain statistics during running transactions to improve visibility for monitoring tools. Michael Paquier expresses concerns about the design, particularly the new pgstat_schedule_anytime_update() requirement and timeout-based approach, suggesting these add complexity and potential bugs. He proposes an alternative client-side API using PROCSIG mechanisms, similar to LOG_MEMORY_CONTEXT, which would give applications more control over timing stats flushes.

Bertrand Drouvot addresses performance concerns raised by Jakub Wartak about get_timeout_active() function calls in hot paths, showing through pgbench testing that the performance impact is minimal (about 0.45%). A new version replaces the function with a boolean flag. Bertrand argues that client-side responsibility wouldn't address the original concerns that led to commit 039549d70f6.

Discussion includes technical issues with hardcoded sleeps in tests and injection point usage. Sami Imseih suggests using INJECTION_POINT_LOAD during pgstat_initialize() to avoid critical section memory allocation problems. The debate centers on whether timeout-based backend flushing or client-controlled mechanisms better serve monitoring needs.

Participants:
bertranddrouvot.pg@gmail.com, jakub.wartak@enterprisedb.com, masao.fujii@gmail.com, michael@paquier.xyz, samimseih@gmail.com, zsolt.parragi@percona.com

### **[\[PATCH\] Expose checkpoint reason to completion log messages\.](https://www.postgresql.org/message-id/CAHGQGwEeLpeCSffn=i0s0-zbHc4XLO9sF72hVE=9+RCGYS6=xQ@mail.gmail.com)**
Fujii Masao has pushed a patch that exposes checkpoint reasons to completion log messages in PostgreSQL. The patch was developed by Soumya S Murali, who expressed gratitude for refinements made to the implementation, particularly the simplification of flag construction logic using snprintf(). The reviewer noted that the updated approach maintains consistency with PostgreSQL coding style and includes clear formatting and behavior. The commit message was also improved to better explain the motivation behind the change, making it easier to understand in context. The patch has been successfully committed to the PostgreSQL codebase.

Participants:
alvherre@kurilemu.de, andres@anarazel.de, juanjo.santamaria@gmail.com, masao.fujii@gmail.com, mbanck@gmx.net, melanieplageman@gmail.com, soumyamurali.work@gmail.com, vasukianand0119@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAHut+PtbpKn4CUbUg11VdtzOBnu-NhZVCiVfHqZRaPaw4b=cRw@mail.gmail.com)**
Peter Smith raises concerns about confusing function naming patterns in pg_publication.c, triggered by recent function name change suggestions during review of an EXCEPT patch. He identifies ambiguity in the GetYyyyXxxx naming pattern, where "Yyyy" sometimes represents search criteria and other times represents attributes of what's being retrieved. For example, GetRelationPublications means "get publications containing specified relid" while GetAllTablesPublications means "get FOR ALL TABLES publications." This creates confusion about function purpose, requiring frequent reference to comments. Smith proposes systematic renaming of existing functions to follow a clearer pattern where GetXXX consistently indicates what type of object is returned, suggesting names like GetPubsByRelid, GetRelsOfPubsMarkedForAll, and GetPubByName. He acknowledges others may find current names acceptable or timing inappropriate for such changes, but wanted to explain the rationale behind his naming suggestions for maintaining consistency with new EXCEPT patch functions.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, david.g.johnston@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com



## **Industry News**

### **[OpenAI reportedly finalizing $100B deal at more than $850B valuation](https://techcrunch.com/2026/02/19/openai-reportedly-finalizing-100b-deal-at-more-than-850b-valuation?utm_campaign=daily_pm)**
OpenAI is reportedly nearing completion of a massive $100 billion funding round that would value the ChatGPT maker at $850 billion. The deal includes backing from major technology companies and investors such as Amazon, Nvidia, SoftBank, and Microsoft. This represents a significant milestone for the AI company and underscores the enormous investor interest in artificial intelligence technologies. The valuation would make OpenAI one of the most valuable private companies in the world, reflecting the market's confidence in its AI capabilities and future growth potential. The funding round highlights the competitive landscape in AI development and the substantial capital being deployed in this sector.

### **[These former Big Tech engineers are using AI to navigate Trump's trade chaos](https://techcrunch.com/2026/02/19/this-former-big-tech-engineers-are-using-ai-to-navigate-trumps-trade-chaos?utm_campaign=daily_pm)**
Amari AI, founded by former Big Tech engineers, is developing custom AI-powered software to help customs brokers modernize their operations and navigate constantly shifting trade policies under the Trump administration. The company is targeting the complex challenges faced by customs brokers who must stay current with frequently changing trade regulations and tariff structures. By leveraging artificial intelligence, Amari AI aims to streamline customs processes and reduce compliance risks for businesses engaged in international trade. The startup represents how AI technology is being applied to address specific industry pain points, particularly in areas where regulatory complexity and frequent policy changes create operational challenges for businesses.