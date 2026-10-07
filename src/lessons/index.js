/* Semua materi Belajar, per id bab */
import { LESSONS as MTK_LESSONS } from "./mtk.jsx";
import { BI_LESSONS } from "./bi.jsx";
import { PP_LESSONS } from "./pp.jsx";
import { EN_LESSONS } from "./en.jsx";

export const LESSONS = { ...MTK_LESSONS, ...BI_LESSONS, ...PP_LESSONS, ...EN_LESSONS };
