interface Channel {
  id: string; // 通道编号
  state: string; // 通道状态
  recordNumber: string; // 培养记录号
  timeRemaining: number; // 培养倒计时时间
  initialValue: number; // 培养初始值
  realValue: number; // 培养实时值
  type: string; // 灭菌器种类
  number: string; // 灭菌器编号
  sterilizationLog: string; // 灭菌记录号
  batchNumber: string; // 灭菌批次号
  testNumber: string; // 指示剂编号
  name: string; // 操作员
  incupropertiesr: string; // 指示剂性质
}
