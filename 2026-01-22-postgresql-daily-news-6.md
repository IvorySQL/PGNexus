---
layout: post
title: PostgreSQL Daily News 2026-01-22
---

# PostgreSQL Daily News#6 2026-01-22



## **PostgreSQL Articles**

### **[pg_utl_smtp v1.0 released](https://www.postgresql.org/about/news/pg_utl_smtp-v10-released-3217/)**
HexaCluster Corp. released pg_utl_smtp v1.0.0, a PostgreSQL extension that provides Oracle UTL_SMTP package compatibility for sending email notifications from database triggers and stored procedures. The extension works with PostgreSQL 12 through current versions and uses plperl stored procedures based on the Net::SMTP Perl module. Part of the HexaRocket migration solution, it enables data-driven email actions like security alerts and threshold notifications directly from the database without application intervention. The open-source extension is available under PostgreSQL license.

`www.postgresql.org`

### **[PostgreSQL Contributor Story: Florin Irion](https://enterprisedb.com/blog/postgresql-contributor-story-florin-irion)**
EDB launched a program in 2025 to help promising colleagues become PostgreSQL contributors. This post features Florin Irion's journey, a Staff Software Development Engineer at EDB based in Italy, as part of their contributor development initiative.

`enterprisedb.com`



## **Hacker Email Discussions**

### **[Remaining dependency on setlocale\(\)](https://www.postgresql.org/message-id/eb7e194b3ae2386988dae4b5a7cee128c3f0a628.camel@j-davis.com)**
Jeff Davis responded to Александр Кожемякин's bug report about a crash in REL_18_STABLE branch (commit 806555e) when executing a specific query. Davis identified that the issue stems from a dependency problem where the master branch commit relied on a refactoring patch that allows pg_strfold() to work on any pg_locale_t object, even when ctype_is_c is true. However, version 18 lacks this refactoring commit, causing the crash. Davis confirmed the functionality works correctly in master and noted that the problematic commit was only backported to version 18. He provided an attached patch specifically targeting REL_18_STABLE to resolve this dependency issue.

Participants:
* a.kozhemyakin@postgrespro.ru
* li.evan.chao@gmail.com
* peter@eisentraut.org
* tgl@sss.pgh.pa.us
* thomas.munro@gmail.com

### **[Fix accidentally cast away qualifiers]()**
The discussion centers on compiler warnings related to "accidentally cast away qualifiers" in PostgreSQL code. Bertrand Drouvot reported warnings with gcc 14.1.0 using specific CFLAGS including -Wdiscarded-qualifiers, and provided CI evidence showing the issue. Chao Li confirmed the same warnings, showing specific examples in varatt.h where functions return 'const char[]' from functions with 'char *' result type, discarding qualifiers. The warnings appear in VARDATA_4B, VARDATA_1B, VARDATA_1B_E macros and related code. Multiple developers can reproduce the issue with different compiler setups, confirming it's a legitimate problem that needs fixing. The warnings indicate potential const-correctness issues in the codebase that should be addressed.

Participants:
* bertranddrouvot.pg@gmail.com
* peter@eisentraut.org

### **[proposal: parentid and naturalid for plpgsql nodes](https://www.postgresql.org/message-id/CAFj8pRDwT=5UV9cKzCGxpo9ksYghcTm_h+8t_cWebaJDrN0vww@mail.gmail.com)**
Pavel Stehule proposes two enhancements to the PLpgSQL_stmt structure to improve plpgsql_check functionality. First, adding a "parentid" field to store the statement ID of the nearest outer statement, which would help handle exceptions by maintaining a proper statement execution stack without external arrays. Currently, exception handling requires complex workarounds since exceptions aren't supported by the plpgsql debug API. Second, introducing a "naturalid" field that provides sequential numbering based on tree traversal order, making statement IDs more intuitive for users compared to the current parser-assigned stmtid which follows a somewhat irregular sequence. The proposed changes aim to reduce plpgsql_check complexity and potentially benefit other tools using the PL debug API.

Participants:
* tgl@sss.pgh.pa.us

### **[Use correct collation in pg\_trgm](https://www.postgresql.org/message-id/CALdSSPi1o=mYL-wWKfb-AZC+ozUKd-pRkHYqzi_yK9+vtT+V0Q@mail.gmail.com)**
David Geier identified an issue where pg_trgm extension ignores explicit collation settings and always uses DEFAULT_COLLATION_OID for trigram conversion to lowercase. This causes incorrect behavior with locale-specific collations like Turkish, where capital 'I' should convert to 'ı' instead of 'i'. The examples demonstrate that similarity calculations between 'ıstanbul' and 'ISTANBUL' return 0.5 with default collation but correctly return 1.0 when the database is initialized with Turkish locale. Geier's proposed patch modifies pg_trgm to use the function's actual collation OID instead of DEFAULT_COLLATION_OID throughout the code. Kirill Reshke reviewed the patch and provided approval with "LGTM" (looks good to me). The regression tests pass successfully with the proposed changes.

Participants:
* geidav.pg@gmail.com
* hlinnaka@iki.fi

### **[tablecmds: reject CLUSTER ON for partitioned tables earlier]()**
Chao Li proposes moving validation for unsupported ALTER TABLE commands on partitioned tables from execution time to preparation time. Currently, "ALTER TABLE ... CLUSTER ON" and "SET WITHOUT CLUSTER" commands are allowed through ATPrepCmd() but fail later during execution. The patch uses the existing ATSimplePermissions() infrastructure to reject these commands earlier, making behavior consistent with other unsupported operations like SET LOGGED/SET UNLOGGED. This changes the error message to a more standardized format indicating the operation is not supported for partitioned tables. A second patch applies the same approach to INHERIT/NO INHERIT commands, fixing a copy-paste error in ATPrepAddInherit() header comment and ensuring NO INHERIT also calls early validation checks to avoid unnecessary processing.

Participants:

### **[Optional skipping of unchanged relations during ANALYZE?](https://www.postgresql.org/message-id/CAE2r8H7BwgYX61eiz4XrkWThxNhKKbp9N3Vty9HCrT3JTaVmzA@mail.gmail.com)**
VASUKI M presents a revised v2 patch introducing an optional SMART mode for ANALYZE that skips relations when they have been previously analyzed and have not been modified since (n_mod_since_analyze = 0). The feature aims to reduce unnecessary ANALYZE work in databases with many static tables while keeping behavior strictly opt-in. Key changes in v2 include ensuring never-analyzed tables are never skipped by checking last_analyze_time/last_autoanalyze_time, relying on pg_stat_user_tables counters for skip decisions, and adding regression tests. The patch intentionally limits scope to regular relations using existing pg_stat statistics, excluding partitioned tables, inheritance, foreign tables, and extended statistics for potential future work. Test examples demonstrate the feature working correctly with empty and populated tables, showing proper statistics creation behavior.

Participants:
* dgrowleyml@gmail.com
* ilya.evdokimov@tantorlabs.com
* myon@debian.org
* rob@xzilla.net
* robertmhaas@gmail.com

### **[DOC: fixes multiple errors in alter table doc]()**
Chao Li is proposing documentation fixes for the ALTER TABLE command page. The original patch addressed three issues: missing brackets around optional keywords, inconsistent formatting for "ADD COLUMN" and "DROP COLUMN" syntax, and omitted "ALTER [COLUMN]" prefixes in sub-command descriptions. After discussion with Robert Treat, who provided feedback about potential verbosity concerns, Chao Li reduced the scope to focus only on fixing the missing brackets around "COLUMN" in the "ADD COLUMN [IF NOT EXISTS]" syntax documentation, making it clear that "COLUMN" is optional. Robert Treat approved this narrower fix as technically correct and useful. The patch has been marked as "Ready for Committer" in the commitfest entry, and Chao Li has provided a v3 rebased patch with reviewer information included.

Participants:
* rob@xzilla.net

### **[\[PATCH\] ANALYZE: hash\-accelerate MCV tracking for equality\-only types]()**
Chengpeng Yan addresses review feedback on their patch to optimize PostgreSQL's ANALYZE command by using hash-based lookup to accelerate MCV (Most Common Values) tracking for equality-only types. The patch addresses an O(N^2) bottleneck in MCV array processing. Regarding memory management concerns, Yan explains that the hash table is allocated in the per-column temporary memory context which is automatically reset after each column, following existing conventions. For the eviction logic concern, Yan clarifies that the original O(n) shifting behavior for singleton values has been replaced with a FIFO eviction cursor mechanism to avoid repeated shifts while preserving original FIFO semantics. A v2 patch was submitted that adjusts the eviction cursor when count=1 values are promoted, making the cursor-based eviction exactly equivalent to the original shift-based behavior with updated clarifying comments.

Participants:
* ilya.evdokimov@tantorlabs.com

### **[Add WALRCV\_CONNECTING state to walreceiver](https://www.postgresql.org/message-id/aXHbCO9dwRO54duf@paquier.xyz)**
The discussion focuses on adding a WALRCV_CONNECTING state to PostgreSQL's WAL receiver to split the current STREAMING state into distinct connection establishment and streaming phases. Chao Li provided code review feedback addressing documentation redundancy, suggesting "upstream server" instead of "primary" for accuracy, and identifying a race condition with Assert() in state transitions where the startup process might set STOPPING state. Xuneng Zhou agreed with the feedback and updated the patch to handle the race condition by checking current state before proceeding rather than using Assert(). Michael Paquier applied the first part of the patch (0001) to HEAD after removing documentation about the "stopped" state and fixing markup issues, noting that "stopped" would never show up in the view anyway.

Participants:
* li.evan.chao@gmail.com
* michael@paquier.xyz
* noah@leadboat.com
* rahilasyed90@gmail.com
* xunengzhou@gmail.com

### **[Remove redundant AssertVariableIsOfType uses in pg\_upgrade](https://www.postgresql.org/message-id/c1b79178-ab7c-461e-8359-bf400d8f1684@eisentraut.org)**
Peter Eisentraut proposed removing redundant AssertVariableIsOfType assertions from pg_upgrade code, which were used to verify function signatures for upgrade_task_add_step(). These assertions check that callback functions match the expected UpgradeTaskProcessCB signature, but upgrade_task_add_step() already performs this verification internally, making the additional checks unnecessary and confusing. Nathan Bossart noted these assertions were borrowed from logical decoding output plugins, where similar redundant checks were previously removed in commit 30b789eafe. After this discussion providing helpful context, Eisentraut committed the change to remove these redundant assertions from pg_upgrade.

Participants:
* nathandbossart@gmail.com

### **[Import Statistics in postgres\_fdw before resorting to sampling\.](https://www.postgresql.org/message-id/CAExHW5vmTR1DQKa6yCOt1bU4KY+AkMmWrAa_kd6RAPg5Hpaw=g@mail.gmail.com)**
Ashutosh Bapat reviewed Corey Huinker's updated patchset for importing statistics in postgres_fdw before sampling. The patches split generic analyze changes from postgres_fdw-specific code, convert errors to warnings for fallback capability, and require all local attributes with attstatarget > 0 to have matching remote statistics. Bapat identified a significant limitation: the statistics import facility only works in analyze_rel() but not in acquire_inherited_sample_rows(), which handles partitioned tables with foreign table partitions. This excludes a major postgres_fdw use case involving sharding. Combining statistics from multiple child relations appears complex, requiring different handling similar to partial aggregates. Bapat suggests either fixing this drawback or documenting the limitation, as current documentation implies all foreign tables can use this facility. He also provided a documentation build fix.

Participants:
* corey.huinker@gmail.com
* etsuro.fujita@gmail.com
* jkatz@postgresql.org
* michael@paquier.xyz
* nathandbossart@gmail.com

### **[Adding REPACK \[concurrently\]](https://www.postgresql.org/message-id/74802.1769071060@localhost)**
Antonin Houska addresses Mihail Nikalayeu's technical review comments on patch 0006 for concurrent REPACK functionality. Key discussion points include: WAL replay behavior with snapshot creation (changes prior to snapshot are visible, not replayed); proper handling of first_block variable to account for synchronized sequential scans and empty space issues; use of SnapshotAny with separate visibility checks following CLUSTER's approach; buffer pinning protection against tuple pruning during snapshot switches; addition of PROC_IN_VACUUM status flag and xmin assertions; filtering changes before writing to files; snapshot management with GetLatestSnapshot() vs GetTransactionSnapshot(); and unique index building considerations. Mihail suggests introducing a new flag instead of PROC_IN_VACUUM and confirms unique index building uses single snapshots. Several implementation details remain under consideration, including assertion placement and filtering optimization strategies.

Participants:
* ah@cybertec.at
* alvherre@alvh.no-ip.org
* mihailnikalayeu@gmail.com
* rob@xzilla.net

### **[Change COPY \.\.\. ON\_ERROR ignore to ON\_ERROR ignore\_row](https://www.postgresql.org/message-id/CACJufxGYPXQ_Jz1avF5eSh_XJRsxhPSUZ+=RzG3Hz4_XNAc32g@mail.gmail.com)**
Jian He responds to Matheus Alcantara's review comments on the COPY ON_ERROR set_null patch. He agrees to remove "invalid values in" from error messages for consistency and use palloc_array instead of palloc0. Regarding FORCE_NOT_NULL compatibility with ON_ERROR set_null, Jian argues they are unrelated features - FORCE_NOT_NULL handles NULL string processing while ON_ERROR set_null deals with data type incompatibility during InputFunctionCallSafe. He suggests updating pg_stat_progress_copy documentation to specify that tuples_skipped only advances when ON_ERROR ignore is used, removing references to unsupported set_null option. Jian indicates REJECT_LIMIT + ON_ERROR set_null combination could be implemented in a separate future patch.

Participants:
* david.g.johnston@gmail.com
* jim.jones@uni-muenster.de
* masao.fujii@oss.nttdata.com
* matheusssilv97@gmail.com
* nagata@sraoss.co.jp
* reshkekirill@gmail.com
* sawada.mshk@gmail.com
* torikoshia@oss.nttdata.com
* vignesh21@gmail.com

### **[commented out code](https://www.postgresql.org/message-id/a690f6d3-c53e-41cf-8a26-756b1ef16442@eisentraut.org)**
The discussion centers on the appropriate style for commenting out code in PostgreSQL. Heikki Linnakangas suggested using `#if 0` to comment out unused code, noting it preserves indentation but lacks compiler checking. Peter Eisentraut initially favored this approach for its readability benefits, particularly syntax highlighting and maintained indentation. Tom Lane agreed with the concept but recommended using `#ifdef NOT_USED` instead, stating this is PostgreSQL's more established convention for such cases. Peter Eisentraut accepted this feedback and committed the change using the `#ifdef NOT_USED` style as suggested by Tom Lane.

Participants:
* hlinnaka@iki.fi
* tgl@sss.pgh.pa.us

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CANhcyEWTxqsrZsaqHwHO_eGD5=mrT=+RLGkCJ4cRvfua_fSdRQ@mail.gmail.com)**
The discussion centers on implementing schema change exclusion in PostgreSQL publications, specifically for partitioned tables. The conversation evaluates different approaches to handle the "EXCEPT" clause when publish_via_partition_root is enabled. Shveta Malik explains that with publish_via_partition_root=false, each leaf partition gets its own tablesync worker and is copied independently. The proposed Approach 4 suggests excluding leaf partitions from pg_publication_tables when their parent appears in the EXCEPT list. Dilip Kumar agrees that Approach 3 is the right direction and supports extending it with Approach 4, noting that when partitioning via root, users treat the entire partition tree as a single entity, making individual child partition exclusion inappropriate. Shlok Kyal confirms they have prepared a patch for Approach-3 and are evaluating other approaches' feasibility.

Participants:
* 1518981153@qq.com
* amit.kapila16@gmail.com
* barwick@gmail.com
* bharath.rupireddyforpostgres@gmail.com
* dilipbalaut@gmail.com
* houzj.fnst@fujitsu.com
* shveta.malik@gmail.com
* smithpb2250@gmail.com
* vignesh21@gmail.com

### **[let ALTER COLUMN SET DATA TYPE cope with trigger dependency](https://www.postgresql.org/message-id/CACJufxH-Ngr9e7_bT+7d-bFMACqd-efAV3YSgPJyfMp4T9P5AQ@mail.gmail.com)**
This patch (V3) addresses handling trigger dependencies when using ALTER COLUMN SET DATA TYPE. The approach now mirrors how statistics handle column data type changes. In ATPostAlterTypeParse, statistics call transformStatsStmt, and similarly this patch requires calling an equivalent function for trigger WHEN clauses. The author introduced transformTriggerStmt in src/backend/commands/trigger.c, which will be invoked from within CreateTriggerFiringOn. This design follows the established pattern used by statistics functionality, making the implementation more consistent with existing PostgreSQL code structure for handling column type alterations that affect dependent database objects.

Participants:

### **[Assert the timestamp is available for ORIGN\_DIFFERS conflicts](https://www.postgresql.org/message-id/CAJpy0uCLKRqi0vOJAEGKoOzj6WR32Dxi4mvewjE4_2SE3uEOug@mail.gmail.com)**
The discussion centers on a patch that adds assertions to ensure timestamp availability for UPDATE_ORIGIN_DIFFERS and DELETE_ORIGIN_DIFFERS conflicts in PostgreSQL logical replication. Shveta initially approved the patch after Hayato Kuroda addressed pgindent formatting requirements. However, Chao Li identified several issues with the current approach: the assertion code appears redundantly in two locations, the comment is unclear about the relationship between track_commit_timestamp GUC and localts validation, and the assertion should explicitly check "localts != 0" rather than just "Assert(localts)". Chao suggests consolidating the logic into a single assertion at the function's beginning with clearer commentary explaining that these conflict types only occur when track_commit_timestamp is enabled and valid local timestamps are available. The patch requires revision to address these concerns.

Participants:
* amit.kapila16@gmail.com
* kuroda.hayato@fujitsu.com
* shveta.malik@gmail.com

### **[\[PATCH\] psql: add \\dcs to list all constraints](https://www.postgresql.org/message-id/CAOKkKFuL-VGw+hUSdXwwnONB=t4BU+x6OJ38ian4XgJNDStAZg@mail.gmail.com)**
The discussion focuses on a proposed psql patch adding a `\dcs` command to list database constraints. A key implementation detail was debated: whether `exec_command_d()` should only check the third character (consistent with existing commands) or pass full argument validation to `listConstraints()`. Initially, the patch author defended the third-character approach for consistency, but after review acknowledged the feedback was correct. Version 8 of the patch was created with updated argument handling, allowing `listConstraints()` to perform complete validation. Additional improvements include clarified documentation explaining what the pattern string matches and modified case statements using predefined variables when converting constraint types to strings. The patch appears ready for further review.

Participants:
* alvherre@kurilemu.de
* jim.jones@uni-muenster.de
* li.evan.chao@gmail.com
* tgl@sss.pgh.pa.us

### **[CREATE TABLE LIKE INCLUDING TRIGGERS](https://www.postgresql.org/message-id/CAN4CZFNPE_UeTEy5TH9wwc6mBAtX7vnBhLSL47jRiHXA=6yXjQ@mail.gmail.com)**
The discussion centers on whether CREATE TABLE LIKE INCLUDING TRIGGERS should preserve the enabled/disabled state of triggers when copying them to a new table. Initially, there was consideration to document this as a limitation, but after further analysis, the consensus shifts toward copying the trigger state properly. The key argument is consistency with existing behavior: INCLUDING CONSTRAINTS already correctly copies constraint enabled/disabled status, including marking CHECK constraints as disabled when not enforced. The participant argues it would be inconsistent for INCLUDING TRIGGERS to behave differently. Test suite examples demonstrate how INCLUDING CONSTRAINTS preserves states like "NOT ENFORCED" for check constraints. The discussion suggests implementing proper state preservation for triggers to maintain consistency with the existing constraint copying mechanism.

Participants:
* jian.universality@gmail.com
* x4mmm@yandex-team.ru

### **[SQL Property Graph Queries \(SQL/PGQ\)](https://www.postgresql.org/message-id/CABRHmyvnDbm1s7ZZNzU9=XXzHRS41t3uMu9bezKhXeWymAC-Cg@mail.gmail.com)**
Ajay Pal reported that GRAPH_TABLE queries in the SQL/PGQ patch v20260113-0001 appear to bypass Row-Level Security (RLS) checks, allowing a low-privilege user to access sensitive data that should be restricted by RLS policies. He provided a reproducible test case showing that a GRAPH_TABLE query returns all rows from a child table despite an RLS policy that should filter out sensitive rows. However, Henson Choi investigated and determined this is expected PostgreSQL behavior rather than a GRAPH_TABLE-specific issue. When querying a parent table, child table RLS policies are not applied - only the parent's policies take effect. Ashutosh Bapat confirmed this behavior is documented in PostgreSQL's inheritance documentation, noting that parent table row security policies apply to rows from child tables during inherited queries, while child table policies are ignored. The solution would be enabling RLS on the parent table instead of the child table.

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
Peter Eisentraut has committed the pg_range patch for SQL:2011 Application Time functionality. Paul Jungwirth questioned whether regression tests should verify that range type properties are set correctly for user-defined types, but Eisentraut noted existing type_sanity tests already cover this. Jungwirth discussed future extensibility needs for temporal features, including type support functions for primary/unique constraints to reject invalid values like empty ranges, intersect operators for foreign keys, and foo_minus_multi functions for UPDATE/DELETE FOR PORTION OF operations. He suggested adding constructor functions for building targeted portions from FROM/TO bounds, though acknowledged this isn't strictly necessary given existing syntax. Eisentraut agreed these represent future project opportunities. Kirill Reshke proposed adding additional validation checks for range type functions, but Eisentraut suggested this falls outside the current patch scope.

Participants:
* li.evan.chao@gmail.com
* pj@illuminatedcomputing.com
* reshkekirill@gmail.com

### **[AIX support](https://www.postgresql.org/message-id/SJ4PPFB81778326E995FAD5945ECF752FA1DB96A@SJ4PPFB81778326.namprd15.prod.outlook.com)**
Sriram acknowledges Peter's feedback on AIX support patch development. Peter has created a separate patch for disabling static libraries in meson that's nearing consensus, which will simplify Sriram's upcoming rebase. A critical bug was identified where `.disabled()` method was incorrectly used instead of `.found()` for meson dependency checking. Sriram explains this went unnoticed because Meson silently ignores unknown methods on AIX/Linux during testing. Peter also referenced another relevant patch moving MAXIMUM_ALIGNOF computation into c.h, which would further simplify both configure and meson.build changes. Sriram commits to submitting a complete patch with full outline as requested, acknowledging the need for reviewers to see the complete plan before investing significant review effort.

Participants:
* peter@eisentraut.org

### **[Mystery with REVOKE PRIVILEGE](https://www.postgresql.org/message-id/c8e166a6-173b-4637-8e94-4b447b49adab@garret.ru)**
The discussion focuses on fixing PostgreSQL's REVOKE PRIVILEGE behavior when an explicit GRANTED BY clause is specified. Tom Lane proposes that when GRANTED BY is explicitly provided, the system should use exactly that grantor without applying select_best_grantor logic, which is essential for pg_dump functionality. Nathan Bossart had started work on a similar approach. Konstantin Knizhnik agrees with fixing the explicit grantor case but suggests also addressing the behavior when no grantor is specified - proposing that "REVOKE ALL PRIVILEGES" should remove all grants from multiple grantors, completely revoking access. However, Tom Lane responds that the SQL specification clearly states REVOKE only removes privileges granted directly by the calling user (or specified GRANTED BY role), and reinterpreting it as "revoke all privileges granted by anybody" would be problematic, even if the user had sufficient permissions.

Participants:
* knizhnik@garret.ru
* nathandbossart@gmail.com
* peter@eisentraut.org
* tgl@sss.pgh.pa.us

### **[Likely undefined behavior with some flexible arrays](https://www.postgresql.org/message-id/yjtlufdn6kaoctydjrryzt267xnls2t4lizslnbgqzhtsnohkj@fvvr3dbtvbrc)**
The discussion centers on improving compiler detection of undefined behavior related to flexible arrays in PostgreSQL. Andres Freund suggests teaching the compiler about palloc allocations to generate warnings for use-after-free bugs and access-beyond-allocation errors. Andrey Borodin asks about extending this to short-lived memory contexts. Freund acknowledges that teaching static analysis about memory contexts would likely require a compiler plugin, which is not feasible in the near term. However, he emphasizes that even basic warnings for obvious issues like using variables after pfree or buffer overruns would be valuable. He also mentions that improving sanitizer integration with memory contexts could help, though this approach only catches problems when the problematic code paths are actually executed during testing.

Participants:
* tgl@sss.pgh.pa.us
* x4mmm@yandex-team.ru

### **[Patch: dumping tables data in multiple chunks in pg\_dump](https://www.postgresql.org/message-id/CAMT0RQQ8DX+K7OTw3Lg+Yp2ew8TsZduiqtPszfiBixcpxKbz-A@mail.gmail.com)**
The patch for enabling chunked table dumps in pg_dump has been updated to address previous feedback. Key changes include renaming the flag to --max-table-segment-pages, adding heap table validation through amname checking, and switching to pg_relation_size calculations for page counting. The implementation now uses appropriate COPY SELECT operators (<=, BETWEEN, >=) based on segment position and includes option_parse_uint32 for handling the full range of page numbers. Documentation and tests have been added, including a chunked dump/restore test with hash verification warnings. The patch retains a boolean is_segment indicator, though alternatives using expression-based detection were proposed as potential replacements.

Participants:
* ashutosh.bapat.oss@gmail.com
* dgrowleyml@gmail.com
* nathandbossart@gmail.com
* zsolt.parragi@percona.com

### **[ReadRecentBuffer\(\) doesn't scale well](https://www.postgresql.org/message-id/ZR5P278MB182126C2A7ED081EF69E8644CD96A@ZR5P278MB1821.CHEP278.PROD.OUTLOOK.COM)**
Ian Ilyasov tested Thomas Munro's patch "0002-Use-ReadRecentBuffer-for-btree-root-page.patch" on a 96-core, 1.5TB RAM system using PostgreSQL master branch. The benchmark involved modifying NUM_BUFFER_PARTITIONS to 1024, configuring 2GB shared_buffers with 300 max_connections, and running pgbench with 96 jobs and 300 clients. Using Wilcoxon signed-rank test over 10 runs, Ian found the patch increased TPS by median 17k (+34% improvement) compared to vanilla PostgreSQL. Andres Freund clarified which specific patch was tested, noting that an evolved version of a related patch (0001) was already committed as 819dc118c0f. Andres also explained that performance improvements are typically not backported to stable versions unless they address severe bugs. Ian confirmed testing the btree root page optimization patch and acknowledged the backporting policy.

Participants:
* amitlangote09@gmail.com
* andres@anarazel.de
* ianilyasov@outlook.com
* thomas.munro@gmail.com

### **[Flush some statistics within running transactions](https://www.postgresql.org/message-id/aXHzafdxaklDSWXp@ip-10-97-1-34.eu-west-3.compute.internal)**
The discussion focuses on a patch to flush PostgreSQL statistics within running transactions, addressing inconsistencies in pg_stat_database documentation and behavior. Bertrand Drouvot explains that while some database statistics like xact_commit and relation-based fields are flushed at transaction boundaries, timing-related fields (session_time, active_time, idle_in_transaction_time) are only updated when connections close. The patch introduces anytime statistics flushing but causes unintended side effects. Fujii Masao reports that the patch triggers log_lock_waits messages every second due to unconditional timeout enabling in ProcessInterrupts(), which wakes up WaitLatch() during lock waits. Bertrand acknowledges this issue and commits to fixing it by making timeout enabling more restrictive. Sami Imseih suggests updating documentation to clarify which statistics require transactional consistency versus those that can be updated during transactions, proposing clearer language about timing-related fields being flushed at appropriate intervals rather than continuously.

Participants:
* bertranddrouvot.pg@gmail.com
* masao.fujii@gmail.com
* michael@paquier.xyz
* samimseih@gmail.com
* zsolt.parragi@percona.com

### **[Fix rounding method used to compute huge pages](https://www.postgresql.org/message-id/CAO6_Xqq2vZbva0R9eQSY0p2kfksX2aP4r=+Z_q1HBYNU=m8bBg@mail.gmail.com)**
Anthonin Bonnefoy identified a bug in PostgreSQL's huge page memory computation where the formula (1+size_b/hp_size) incorrectly allocates an extra huge page when size_b is divisible by hp_size. The issue also exists in CreateAnonymousSegment which lacks overflow checking when rounding up allocation sizes. Bonnefoy proposed two patches: one to replicate CreateAnonymousSegment's rounding method in InitializeShmemGUCs (only rounding up when not divisible), and another to add overflow checking using add_size. Ashutosh Bapat suggested a broader solution by introducing a general-purpose ceil_size() function to be placed alongside existing add_size() and mul_size() functions, which could replace similar rounding patterns found in CalculateShmemSize() and other locations throughout the codebase.

Participants:
* anthonin.bonnefoy@datadoghq.com

### **[Inval reliability, especially for inplace updates](https://www.postgresql.org/message-id/CAHgHdKvTv6knvzmtumdzAqF9_PykaUc6b-6c80VpMZEV0UuyZQ@mail.gmail.com)**
The discussion centers on ABI-breaking changes in PostgreSQL's back-patched inval reliability fixes that affect Table Access Method (TAM) modules. Mark Dilger reports that four non-PGXN TAM extensions require forking due to signature changes in CacheInvalidateHeapTupleInplace() (commit 06b030e) and PrepareToInvalidateCacheTuple() (commit 2e58802). While the main fix addresses data loss issues with relhasindex, relfrozenxid, and datfrozenxid updates, Dilger questions whether the code cleanup removing unused parameters was necessary for backpatching, arguing it causes packaging pain without real benefit. Noah Misch acknowledges the concern and suggests encouraging packagers to test builds against stable branches early. He requests source code examples to better understand TAM module usage patterns and suggests PGXN publication to help detect future ABI breaks. The fix prevents data corruption but creates compatibility challenges for external modules.

Participants:
* andres@anarazel.de
* mark.dilger@enterprisedb.com
* nitinmotiani@google.com
* noah@leadboat.com

### **[refactor architecture\-specific popcount code](https://www.postgresql.org/message-id/CANWCAZY7R+iy+r9YM_sySNydHzNqUirx1xk0tB3ej5HO62GdgQ@mail.gmail.com)**
Following the completion of initial refactoring work, John Naylor proposes three additional optimization ideas for PostgreSQL's popcount implementation. First, replacing word-sized function calls in select_best_grantor() and bitmapsets with pg_popcount() calls on byte-sized data, potentially eliminating pointer indirection. Second, simplifying x86 alignment detection logic since 64-bit platforms don't require alignment checks and 32-bit doesn't need complex optimizations, contrasting with simpler aarch64 implementation. Third, consolidating duplicated code for cases under 8 bytes and function tails. Nathan Bossart responds positively to the first suggestion, providing patch 0001 for obvious conversions while noting performance trade-offs in bms_member_index(). He implements alignment simplification in patch 0002 for SSE4.2 functions but retains AVX-512 alignment optimizations due to proven benefits. Regarding code duplication, Nathan acknowledges the possibility of static inline functions but notes the minimal code involved is only about 2 lines.

Participants:
* hlinnaka@iki.fi
* johncnaylorls@gmail.com
* nathandbossart@gmail.com

### **[Speed up COPY FROM text/CSV parsing using SIMD](https://www.postgresql.org/message-id/CA+K2RumUD+aJ3vuD+05aDWj6geek5DCPYD5peXrRU41QjtORFA@mail.gmail.com)**
Manni Wood provided new benchmark results from a Raspberry Pi 5 with Arm Cortex A76 processor, comparing SIMD-accelerated COPY FROM/TO performance across different patch versions (v3, v4.2) against master. For COPY FROM on Arm, v3 shows significant speedups (19.3-34.8%) with minimal regression (<1%) in worst-case scenarios, while v4.2 exhibits slightly higher regressions (2.3-3.8%). COPY TO v4 demonstrates consistent improvements (13.8-44.7%) across all test cases. Ayoub Kazar explains that v4.2's regression in 1/3 specials benchmark stems from overhead in special character counting and branching effects when SIMD is bypassed after sampling, noting v3's assumption of uniform special character distribution makes it generally superior. The discussion centers on whether to discontinue v4.2 COPY FROM testing and proceed with v3, given consistent evidence favoring v3's performance profile.

Participants:
* andrew@dunslane.net
* byavuz81@gmail.com
* manni.wood@enterprisedb.com
* markwkm@gmail.com
* nathandbossart@gmail.com
* shinya11.kato@gmail.com

### **[Race conditions in logical decoding](https://www.postgresql.org/message-id/124728.1769077978@localhost)**
The discussion addresses race conditions in logical decoding's snapshot building mechanism. Andres Freund suggested checking both TransactionIdIsInProgress() and TransactionIdDidCommit() to prevent accessing the commit log for in-progress transactions. However, Antonin Houska reports this approach causes synchronous replication deadlocks, where the subscriber cannot confirm LSN replication because the publisher waits for subscriber confirmation while being unable to finalize commits. Álvaro Herrera analyzes the layering issue, noting that DecodeCommit() can add transactions to SnapBuilder while they're still in the procarray, suggesting the waiting logic should be moved to DecodeCommit() rather than patching SnapBuildBuildSnapshot() after the fact. The core problem involves timing conflicts between WAL processing, CLOG updates, and procarray management.

Participants:
* ah@cybertec.at
* andres@anarazel.de
* mihailnikalayeu@gmail.com

### **[Remove PG\_MMAP\_FLAGS](https://www.postgresql.org/message-id/CAExHW5vTWABxuM5fbQcFkGuTLwaxuZDEE2vtx2WuMUWk6JnF4g@mail.gmail.com)**
Ashutosh Bapat proposes removing the PG_MMAP_FLAGS macro from portability/mem.h, following Peter's observation that it's not actually used for portability purposes despite its placement. The macro was added in commit b0fc0df9364d2d2d17c0162cf3b8b59f6cb09f67 but has never been used as intended for portability. Instead of the macro, Bapat suggests using the flags directly in CreateAnonymousSegment(), which is the only location where PG_MMAP_FLAGS is currently used. However, Tom Lane points out that the attached patch appears to be incorrect, as it doesn't actually touch PG_MMAP_FLAGS. This indicates the wrong patch was submitted, and the discussion remains unresolved pending the correct patch.

Participants:
* ashutosh.bapat.oss@gmail.com
* peter@eisentraut.org

### **[ALTER TABLE: warn when actions do not recurse to partitions](https://www.postgresql.org/message-id/fb70022a-5403-4e16-9efc-28b041f35d9a@uni-muenster.de)**
Jim Jones reviews a patch for ALTER TABLE warning when actions don't recurse to partitions. The patch successfully adds NOTICE messages when ALTER TABLE commands like REPLICA IDENTITY and ALTER COLUMN SET don't affect existing partitions, providing hints that partitions can be modified individually or ONLY can be specified to suppress warnings. Jim approves the code structure, noting that calling EmitPartitionNoRecurseNotice() for all conditions follows existing patterns in tablecmds.c with negligible performance impact. He suggests improving the hint message capitalization per PostgreSQL's Error Message Style Guide, proposing "To update partitions, apply the command to each one individually, or specify ONLY to suppress this message" instead of the current lowercase version. Jim plans to test newly covered subcommands.

Participants:
* david.g.johnston@gmail.com
* htamfids@gmail.com
* li.evan.chao@gmail.com