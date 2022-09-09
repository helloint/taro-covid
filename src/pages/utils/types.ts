interface CovidDaily {
  readonly total: number;
  readonly confirm: number;
  readonly wzz: number;
  readonly zhuangui: number;
  readonly confirm_bihuan: number;
  readonly wzz_bihuan: number;
  readonly death: number;
  readonly confirm_shaicha: number;
  readonly wzz_shaicha: number;
  readonly bihuan: number;
  readonly shaicha: number;
  readonly cured: number;
  readonly curr_confirm: number;
  readonly total_cured: number;
  readonly curr_heavy: number;
  readonly curr_cri: number;
  readonly url?: string;
}

interface CovidDailyExt extends CovidDaily {
  total_confirm: number;
  total_wzz: number;
  total_wzz_correct: number;
  total_zhuangui: number;
  total_death: number;
  history_total_cured: number;
  'confirm-wzz_percent': string;
  'wzz-zhuangui_percent': string;
}

interface CovidRegion {
  readonly region: string;
  readonly total: number;
  readonly confirm: number;
  readonly wzz: number;
  readonly zhuangui: number;
  readonly confirm_bihuan: number;
  readonly wzz_bihuan: number;
  readonly confirm_shaicha: number;
  readonly wzz_shaicha: number;
  readonly bihuan: number;
  readonly shaicha: number;
}

interface CovidTotal {
  readonly confirm: number;
  readonly wzz: number;
  readonly death: number;
}

interface CovidDailySource {
  daily: CovidDaily;
  regions: CovidRegion[];
  date: string;
  total: CovidTotal;
}

interface CovidDailyType {
  daily: CovidDailyExt;
  regions: CovidRegion[];
  date: string;
  total: CovidTotal;
}

interface CovidDailyTotalSource {
  total: CovidTotal;
  daily: { [key: string]: CovidDaily };
  regions: { [key: string]: CovidRegion };
}

interface CovidDailyTotalType {
  total: CovidTotal;
  daily: { [key: string]: CovidDailyExt };
  regions: { [key: string]: CovidRegion };
}

interface CovidTableType {
  total: CovidTotal;
  daily: { [key: string]: CovidDailyExt };
  recentDaily: { [key: string]: CovidDailyExt };
}

export {
  CovidDaily,
  CovidDailyExt,
  CovidRegion,
  CovidDailySource,
  CovidDailyType,
  CovidDailyTotalSource,
  CovidDailyTotalType,
  CovidTableType,
};
