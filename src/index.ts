import "@logseq/libs";
import { BlockEntity, PageEntity } from "@logseq/libs/dist/LSPlugin";
const openIconName = "clean-empty-pages";

async function main() {
  /**
   * 清理空白日志
   * @param params
   */
  async function clean_blank_journal() {
    let graph = await logseq.App.getCurrentGraph();
    if (graph) {
      console.info(graph);
      // 获取所有页面,遍历所有页面。
      let current_graph_all_pages = await logseq.Editor.getAllPages(graph.url);
      current_graph_all_pages?.forEach(async (page) => {
        // 筛选出日志类型的页面
        if ("journal?" in page && page["journal?"]) {
          // 排除今天的日志
          if (page.journalDay === get_curr_time()) {
            return;
          }
          // 获取页面中的所有的块。
          let journal_blocks = await logseq.Editor.getPageBlocksTree(page.uuid);
          if (is_empty_journal_blocks(journal_blocks)) {
            logseq.Editor.deletePage(page.name);
            // 刷新后文件依然存在。
            console.info(page.name, page);
          } else {
            return;
          }
        }
      });
    }
    // let t_te = await logseq.Editor.getPage("mar 22nd, 2024")
    // let t = await logseq.Editor.getPageBlocksTree(
    //   "65fcd136-8e2c-4bcd-82e2-c6ba80367853"
    // );
  }

  logseq.beforeunload(
    logseq.App.registerPageMenuItem("清除空日志", () => {
      clean_blank_journal();
    }) as any
  );

  function is_empty_journal_blocks(journal_blocks: BlockEntity[]) {
    // 日志没有任何内容: 一个页面中的每个块children长度为0，并且这些content=""。
    // 判断journal块列表
    for (let i = 0; i < journal_blocks.length; i++) {
      let block = journal_blocks[i];
      if (block.children?.length == 0) {
        if (block.content !== "") {
          return undefined;
        } else {
          return true;
        }
      }
    }
  }

  function get_curr_time() {
    // 获取当前日期和时间
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    // 确保月和日始终是两位数
    const formattedMonth = month < 10 ? "0" + month : month;
    const formattedDay = day < 10 ? "0" + day : day;

    // 格式化日期为YYYYMMDD
    const formattedDate = `${year}${formattedMonth}${formattedDay}`;

    console.log(formattedDate); // 输出格式如： 20230131
    return parseInt(formattedDate);
  }
}

if (typeof logseq !== "undefined") {
  logseq.ready(main).catch(console.error);
}
