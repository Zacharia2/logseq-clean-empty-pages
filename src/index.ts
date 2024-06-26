import "@logseq/libs";
import { BlockEntity, PageEntity } from "@logseq/libs/dist/LSPlugin";
// @ts-expect-error
const css = (t, ...args) => String.raw(t, ...args);
const openIconName = "clean-empty-pages";

// function is_empty_journal_blocks(blocks: BlockEntity[]): boolean {
//   return blocks.every(
//     (block) => block.content === "" && block.children?.length === 0
//   );
// }
// let t_te = await logseq.Editor.getPage("mar 22nd, 2024")
// let t = await logseq.Editor.getPageBlocksTree(
//   "65fcd136-8e2c-4bcd-82e2-c6ba80367853"
// );

/**
 * 获取当前日期
 * @returns 整数类型的 YYYYMMDD 格式化日期
 */
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
  return parseInt(`${year}${formattedMonth}${formattedDay}`);
}

/**
 * 判断日志是否全部是空白日志块
 * @param journal_blocks
 * @returns 若为空白日志返回true，否则返回undefined
 */
function is_empty_journal_blocks(journal_blocks: BlockEntity[]) {
  // 日志没有任何内容: 一个页面中的每个块children长度为0，并且这些content=""。
  // 判断journal块列表
  for (const block of journal_blocks) {
    if (block.children?.length == 0) {
      if (block.content !== "") {
        return undefined;
      } else {
        return true;
      }
    } else {
      return undefined;
    }
  }
}
async function get_current_graph_pages() {
  let graph = await logseq.App.getCurrentGraph();
  if (graph) {
    // 获取所有页面,遍历所有页面。
    let current_graph_all_pages = await logseq.Editor.getAllPages(graph.url);
    if (current_graph_all_pages) {
      return current_graph_all_pages;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
/**
 * 获取空白日志列表
 * @returns PageEntity[]
 */
async function get_current_graph_blank_journals() {
  let empty_journal_list: PageEntity[] = Array();
  let current_graph_all_pages = await get_current_graph_pages();
  if (current_graph_all_pages) {
    for (const page of current_graph_all_pages) {
      // 筛选出日志类型的页面
      if ("journal?" in page && page["journal?"]) {
        // 排除今天的日志
        if (page.journalDay === get_curr_time()) {
          continue;
        }
        // 获取页面中的所有的块。
        let journal_blocks = await logseq.Editor.getPageBlocksTree(page.uuid);
        if (!is_empty_journal_blocks(journal_blocks)) {
          continue;
        } else {
          empty_journal_list.push(page);
        }
      }
    }
    // current_graph_all_pages.forEach(async (page) => {});
  }
  return empty_journal_list;
}

async function main() {
  async function clean_blank_journal() {
    let blank_journals = await get_current_graph_blank_journals();
    if (blank_journals.length > 0) {
      for (const blank_journal of blank_journals) {
        // 只有这个一个删除API
        await logseq.Editor.deletePage(blank_journal.name);
        await logseq.UI.showMsg(
          `空白日志 ${blank_journal.name} 已删除`,
          "success"
        );
        console.info(blank_journal.name, blank_journal);
      }
    } else {
      await logseq.UI.showMsg(`没有空白日志`, "warning");
    }
  }

  logseq.App.registerPageMenuItem("删除空白日志", () => {
    clean_blank_journal();
  });
}

if (typeof logseq !== "undefined") {
  logseq.ready(main).catch(console.error);
}
