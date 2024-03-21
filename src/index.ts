import "@logseq/libs";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin";
import { LSPluginUserEvents } from "@logseq/libs/dist/LSPlugin.user";
// @ts-expect-error
const css = (t, ...args) => String.raw(t, ...args);

async function main() {
  /**
   * 清理空白日志
   * @param params
   */
  async function clean_blank_journal(params: string) {
    let a = await logseq.Editor.getAllPages();
    // deletePage: ((pageName: string) => Promise<void>)
    // getAllPages: ((repo?: string) => Promise<PageEntity[]>)
    // getPagesFromNamespace: ((namespace: string) => Promise<PageEntity[]>)
    // 查找空白日志
    // 验证是否为空白日志
    // {:block/uuid #uuid "65fc118b-8f27-4269-9a88-9b48d5f99230",
    // :block/journal? true,
    // :block/updated-at 1711018379197,
    // :block/created-at 1711018379197,
    // :block/journal-day 20240321,
    // :block/format :markdown,
    // :db/id 1468,
    // :block/name "mar 21st, 2024",
    // :block/file {:db/id 1474},
    // :block/original-name "Mar 21st, 2024"}
  }

  const openIconName = "clean-empty-pages";

  logseq.provideStyle(css`
    .${openIconName} {
      opacity: 0.55;
      font-size: 20px;
      margin-top: 4px;
    }

    .${openIconName}:hover {
      opacity: 0.9;
    }
  `);

  logseq.App.registerUIItem("toolbar", {
    key: openIconName,
    template: `
        <div data-on-click="show" class="${openIconName}">⚙️</div>
    `,
  });
}

if (typeof logseq !== "undefined") {
  logseq.ready(main).catch(console.error);
}

function subscribeLogseqEvent<T extends LSPluginUserEvents>(
  eventName: T,
  handler: (...args: any) => void
) {
  logseq.on(eventName, handler);
  return () => {
    logseq.off(eventName, handler);
  };
}

const subscribeToUIVisible = (onChange: () => void) =>
  subscribeLogseqEvent("ui:visible:changed", ({ visible }) => {
    // _visible = visible;
    onChange();
  });
