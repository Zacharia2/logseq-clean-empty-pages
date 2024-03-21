import "@logseq/libs";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin";

async function main() {

    /**
     * 清理空白日志
     * @param params 
     */
    async function clean_blank_journal(params: string) {
        // deletePage: ((pageName: string) => Promise<void>)
        // getAllPages: ((repo?: string) => Promise<PageEntity[]>)
        // getPagesFromNamespace: ((namespace: string) => Promise<PageEntity[]>)
        // 查找空白日志
        // 验证是否为空白日志

    }

    logseq.beforeunload(
        logseq.App.registerPageMenuItem('clean empty pages', async ({ page }) => {

            // `logseq.Editor.getPage(page, { includeChildren: true });`
            // will return a null children

            const blocks = await logseq.Editor.getPageBlocksTree(page);
            if (blocks.length) {
                for (const block of blocks) {
                    // if (await walk(block)) {
                    //     await logseq.Editor.removeBlock(block.uuid);
                    // }
                }
            }
        }) as any
    );
}

if (typeof logseq !== 'undefined') {
    logseq.ready(main).catch(console.error);
}
