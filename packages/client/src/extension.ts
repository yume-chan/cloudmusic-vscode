import { AccountManager, ButtonManager } from "./manager";
import { IPC, State } from "./utils";
import {
  initAccount,
  initCache,
  initCommand,
  initIPC,
  initLocal,
  initPlayer,
  initPlaylist,
  initQueue,
  initRadio,
  initStatusBar,
  initViewProvide,
} from "./activate";
import type { ExtensionContext } from "vscode";
import { QueueProvider } from "./treeview";
import { SETTING_DIR } from "./constant";
import { mkdirSync } from "fs";

export async function activate(context: ExtensionContext): Promise<void> {
  process.setUncaughtExceptionCaptureCallback(({ message }) =>
    console.error(message)
  );
  process.on("unhandledRejection", console.error);
  try {
    mkdirSync(SETTING_DIR);
  } catch {}
  AccountManager.context = context;
  ButtonManager.context = context;
  State.context = context;
  State.init();
  initViewProvide(context);
  initQueue(context);
  initCommand(context);
  initStatusBar(context);
  await initIPC(context);
  initPlayer(context);
  initLocal(context);
  initCache(context);
  initPlaylist(context);
  initRadio(context);
  await initAccount(context);
}

export function deactivate(): void {
  if (State.master) IPC.retain(QueueProvider.songs);
  // IPC.disconnect();
}
