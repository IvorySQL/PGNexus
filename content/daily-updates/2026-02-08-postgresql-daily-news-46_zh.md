# PostgreSQL 每日更新#46 2026-02-08







## **热门 Hacker 邮件讨论精选**

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/68e89de8-5f6c-4eaf-a800-e16a5e487667@iki.fi)**
Heikki Linnakangas对Andres Freund的缓冲区锁定补丁系列(v12版本)提供了详细的审查反馈。他批准了总体方法，但提出了几项改进建议。对于涉及heap_inplace_update_and_unlock()的补丁0001，他指出代码看起来正确，但建议通过更好地解释临时缓冲区复制机制来澄清注释中孤立的"memcpy"引用。对于关于MarkBufferDirtyHint() WAL日志记录顺序更改的补丁0004，他确认方法是合理的，并讨论了"小窗口"优化，指出这是更广泛保守策略的一部分。其他小的改进建议包括质疑在_bt_killitems()中移除提示相关注释，要求为BufferSetHintBits16()函数参数提供更好的文档，澄清缓冲区头锁释放引用，移除关于LSN安全性的冗余注释，以及使SharedBufferBeginSetHintBits()返回值语义更加明确。总体评估仍然是积极的，需要进行这些改进。

参与者:
andres@anarazel.de, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, melanieplageman@gmail.com, michael.paquier@gmail.com, noah@leadboat.com, reshkekirill@gmail.com, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[Changing shared\_buffers without restart](https://www.postgresql.org/message-id/9ac6082a-2e30-4462-a260-1507452aa962@iki.fi)**
Heikki Linnakangas 审查了用于在不重启情况下更改 shared_buffers 的补丁 v20260128，重点关注内存和地址空间管理组件。该补丁引入了"segment id"概念，允许为共享内存结构指定不同的段，并通过 ShmemResizeStructInSegment() 支持可调整大小的段。然而，Heikki 质疑在同一段内使用多个结构的实际用法以及在这种情况下调整大小如何工作。他怀疑存在一个隐含假设，即可调整大小的结构必须是其段中唯一的结构。为了简化 API，他建议对调用者隐藏段 ID，改用 ShmemInitStructExt() 中的 resizeable 标志，由 shmem.c 内部管理可调整大小结构的独立段。他请求一个独立的测试模块来演示可调整大小的共享内存段接口。

参与者:
9erthalion6@gmail.com, andres@anarazel.de, ashutosh.bapat.oss@gmail.com, chaturvedipalak1911@gmail.com, hlinnaka@iki.fi, peter@eisentraut.org, robertmhaas@gmail.com, thomas.munro@gmail.com, tomas@vondra.me

### **[pg\_plan\_advice](https://www.postgresql.org/message-id/CA+TgmoYbzXRuj5NgQH9gE1tksz3suK0RaES3QKQ=SKqyPi8TPA@mail.gmail.com)**
Robert Haas发布了pg_plan_advice补丁集的第14版，实现了一个全面的测试框架，将回归测试查询规划两次——首先生成建议，然后使用该建议重新规划。这揭示了多个需要修复的问题。补丁集现在包括修复PGS_CONSIDER_NONPARTIAL与Materialize节点的交互问题，为planner_setup_hook添加cursorOptions参数，以及解决debug_parallel_query交互问题。关键改进包括让pg_plan_advice只清除pgs_mask位而不是设置它们，以便与enable_SOMETHING=false设置叠加工作，为IndexOptInfo添加disabled标志以避免完全隐藏索引，以及修复add_partial_path未能考虑启动成本的问题。该测试方法成功识别了规划器问题而没有破坏大量功能，展示了该方法的稳健性，同时揭示了需要关注的特定领域。

参与者:
alexandra.wang.oss@gmail.com, david.g.johnston@gmail.com, di@nmfay.com, guofenglinux@gmail.com, jacob.champion@enterprisedb.com, jakub.wartak@enterprisedb.com, lukas@fittl.com, matheusssilv97@gmail.com, robertmhaas@gmail.com, tgl@sss.pgh.pa.us



