# PostgreSQL Daily News#47 2026-02-09







## **Popular Hacker Email Discussions**

### **[Buffer locking is special \(hints, checksums, AIO writes\)](https://www.postgresql.org/message-id/noqusqxfxqonwymp62o7kiecfjkuh6stpn23ditd3vzua2jdxp@cikr2xwov5ci)**
Andres Freund and Heikki Linnakangas are discussing buffer management optimizations related to WAL logging order and checkpoint handling. Heikki confirmed that patch 0004 switching to standard order in MarkBufferDirtyHint() is correct, eliminating the need to delay checkpoint starts. They're debating the "small window" where unnecessary WAL records might be generated when checkpoints start between buffer dirtying and redo pointer checks. Andres raises concerns about a complex scenario involving full page images (FPI) and torn page writes during checkpoints, suggesting the current conservative approach may be necessary to prevent recovery issues. He outlines a seven-step scenario where insufficient FPI generation could lead to unrecoverable torn pages. Both developers acknowledge potential improvements to reduce WAL spikes during checkpoint starts, though the implementation appears more complicated than initially thought.

Participants:
andres@anarazel.de, boekewurm+postgres@gmail.com, hlinnaka@iki.fi, melanieplageman@gmail.com, michael.paquier@gmail.com, noah@leadboat.com, reshkekirill@gmail.com, robertmhaas@gmail.com, thomas.munro@gmail.com

### **[Skipping schema changes in publication](https://www.postgresql.org/message-id/CAA4eK1J9=vfNYU=K=0pfEf=b8iZFB0FGocCOpJL1tdTY-g94uw@mail.gmail.com)**
The discussion centers on v41 patch addressing schema change skipping in publications. shveta malik identified an issue where table-sync and incremental-sync replicate different table sets when subscribers use multiple publications with conflicting EXCEPT clauses and different PUBLISH_VIA_PARTITION_ROOT values. The test case demonstrates problems combining publications like pub1 (ALL TABLES EXCEPT with PUBLISH_VIA_PARTITION_ROOT=true) and pub2 (ALL TABLES EXCEPT with PUBLISH_VIA_PARTITION_ROOT=false). Amit Kapila proposes disallowing such contradictory publication combinations, similar to existing restrictions for column lists, suggesting that combining conflicting publications should result in an ERROR. The team needs to decide the behavior for Approach1 when handling these conflicting publication scenarios.

Participants:
1518981153@qq.com, amit.kapila16@gmail.com, barwick@gmail.com, bharath.rupireddyforpostgres@gmail.com, dilipbalaut@gmail.com, houzj.fnst@fujitsu.com, shlok.kyal.oss@gmail.com, shveta.malik@gmail.com, smithpb2250@gmail.com, vignesh21@gmail.com



