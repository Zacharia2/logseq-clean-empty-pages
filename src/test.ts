import "@logseq/libs";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin";
import { LSPluginUserEvents } from "@logseq/libs/dist/LSPlugin.user";
// @ts-expect-error
const css = (t, ...args) => String.raw(t, ...args);

async function main() {
  /**
   * Returns true if the block tree is empty,
   * won't remove itself
   */
  async function walk(block: BlockEntity) {
    if (!block.children) {
      // not loaded
      return false;
    }

    const blocks: Array<{
      block: BlockEntity;
      result: boolean;
    }> = [];

    for (const subBlock of block.children) {
      blocks.push({
        block: <BlockEntity>subBlock,
        result: await walk(<BlockEntity>subBlock),
      });
    }

    if (blocks.every((x) => x.result) && block.content === "") {
      return true; // need caller to remove
    } else {
      for (const subBlock of blocks
        .filter((x) => x.result)
        .map((x) => x.block)) {
        await logseq.Editor.removeBlock(subBlock.uuid);
      }
      return false;
    }
  }

  logseq.beforeunload(
    logseq.Editor.registerBlockContextMenuItem(
      "clean empty pages",
      async (e) => {
        const block = await logseq.Editor.getBlock(e.uuid, {
          includeChildren: true,
        });
        if (block) {
          await walk(block);
        }
      }
    ) as any
  );
}

if (typeof logseq !== "undefined") {
  logseq.ready(main).catch(console.error);
}

function subscribeLogseqEvent<T extends LSPluginUserEvents>(
  eventName: T,
  handler: (...args: any) => void
) {
  logseq.on(eventName, handler);
  console.info(eventName);
  return () => {
    logseq.off(eventName, handler);
  };
}

const subscribeToUIVisible = (onChange: () => void) =>
  subscribeLogseqEvent("ui:visible:changed", ({ visible }) => {
    // _visible = visible;
    onChange();
  });

//   logseq.provideStyle(css`
//   .${openIconName} {
//     opacity: 0.55;
//     font-size: 20px;
//     margin-top: 4px;
//   }

//   .${openIconName}:hover {
//     opacity: 0.9;
//   }
// `);

// logseq.App.registerUIItem("toolbar", {
//   key: openIconName,
//   template: `
//       <div data-on-click="show" class="${openIconName}">⚙️</div>
//   `,
// });
