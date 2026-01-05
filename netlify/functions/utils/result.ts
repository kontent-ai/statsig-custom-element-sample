export type SyncResult<R> = Readonly<
  { success: true; result: R } | { success: false; error: string }
>;

export type Result<R> = Promise<SyncResult<R>>;
